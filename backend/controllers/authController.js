const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "agrifarm-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phone, region, role } = req.body;
    if (!email || !password || !fullName || !phone || !region) {
      return res.status(400).json({
        error: "All fields (email, password, fullName, phone, region) are required",
      });
    }

    if (!pool) {
      return res.status(500).json({ error: "Database is not configured for registration" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const existingUser = await client.query("SELECT id FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
        [email, passwordHash],
      );

      const user = userResult.rows[0];
      const userRole = ["farmer", "data_officer", "admin"].includes(role) ? role : "farmer";

      await client.query(
        "INSERT INTO profiles (id, full_name, phone, region) VALUES ($1, $2, $3, $4)",
        [user.id, fullName, phone, region],
      );

      await client.query(
        "INSERT INTO user_roles (user_id, role) VALUES ($1, $2)",
        [user.id, userRole],
      );

      await client.query("COMMIT");

      const token = jwt.sign(
        { userId: user.id, email: user.email, roles: [userRole] },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: fullName,
          phone,
          region,
          roles: [userRole],
          created_at: user.created_at,
        },
        expires_in: JWT_EXPIRES_IN,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!pool) {
      return res.status(500).json({ error: "Database is not configured for login" });
    }

    const result = await pool.query(
      `SELECT u.id,
              u.email,
              u.password_hash,
              p.full_name,
              p.phone,
              p.region,
              COALESCE(json_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), '[]') AS roles
       FROM users u
       LEFT JOIN profiles p ON p.id = u.id
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       WHERE u.email = $1
       GROUP BY u.id, p.full_name, p.phone, p.region`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const roles = Array.isArray(user.roles) ? user.roles : JSON.parse(user.roles || "[]");
    const token = jwt.sign({ userId: user.id, email: user.email, roles }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        region: user.region,
        roles,
      },
      expires_in: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
