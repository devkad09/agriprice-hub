const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "agrifarm-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Helper: normalize column names to Phase1 schema
const USER_FIELDS = [
  "user_id",
  "name",
  "email",
  "password_hash",
  "role",
  "phone",
  "region",
  "created_at",
];

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, region, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
        error: "Missing required fields",
      });
    }

    if (!pool) {
      return res.status(500).json({ success: false, message: "Database not configured", error: null });
    }

    const existing = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already registered", error: "duplicate_email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = ["farmer", "data_officer", "admin"].includes(role) ? role : "farmer";

    const insert = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, phone, region) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${USER_FIELDS.join(", ")}`,
      [name, email, passwordHash, userRole, phone || null, region || null],
    );

    const newUser = insert.rows[0];

    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return res.status(201).json({ success: true, message: "User registered", data: { user: newUser, token } });
  } catch (err) {
    console.error("[Auth] register error:", err);
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already exists", error: err.detail });
    }
    return res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required", error: "missing_credentials" });
    }

    if (!pool) {
      return res.status(500).json({ success: false, message: "Database not configured", error: null });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials", error: "invalid_email_or_password" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials", error: "invalid_email_or_password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // remove password_hash before returning
    delete user.password_hash;

    return res.json({ success: true, message: "Login successful", data: { user, token } });
  } catch (err) {
    console.error("[Auth] login error:", err);
    return res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user.user_id || req.user.userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized", error: "no_user" });
    }

    if (!pool) {
      return res.status(500).json({ success: false, message: "Database not configured", error: null });
    }

    const result = await pool.query("SELECT user_id, name, email, role, phone, region, created_at FROM users WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found", error: "not_found" });
    }

    return res.json({ success: true, message: "Profile retrieved", data: result.rows[0] });
  } catch (err) {
    console.error("[Auth] profile error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch profile", error: err.message });
  }
};
