const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "agrifarm-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already registered", error: "duplicate_email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = ["farmer", "data_officer", "admin"].includes(role) ? role : "farmer";

    const insertUser = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, passwordHash],
    );

    const newUser = insertUser.rows[0];
    const userId = newUser.id;

    await pool.query(
      "INSERT INTO profiles (id, full_name, phone, region) VALUES ($1, $2, $3, $4)",
      [userId, name, phone || null, region || null],
    );

    await pool.query(
      "INSERT INTO user_roles (user_id, role) VALUES ($1, $2)",
      [userId, userRole],
    );

    // Auto-subscribe the user to all commodities for SMS alerts
    try {
      const commoditiesRes = await pool.query("SELECT id FROM commodities");
      for (const commodity of commoditiesRes.rows) {
        await pool.query(
          `INSERT INTO sms_subscriptions (user_id, commodity_id, frequency, active)
           VALUES ($1, $2, 'daily', true)
           ON CONFLICT (user_id, commodity_id) DO NOTHING`,
          [userId, commodity.id]
        );
      }
    } catch (subErr) {
      console.error("[Auth] Auto-subscribe error:", subErr);
    }


    const token = jwt.sign(
      { user_id: userId, email: newUser.email, role: userRole, name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return res.status(201).json({
      success: true,
      message: "User registered",
      data: {
        user: {
          user_id: userId,
          email: newUser.email,
          role: userRole,
          name,
          phone: phone || null,
          region: region || null,
          created_at: newUser.created_at,
        },
        token,
      },
    });
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

    const result = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.created_at,
        ur.role,
        p.full_name AS name,
        p.phone,
        p.region
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN profiles p ON p.id = u.id
      WHERE u.email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials", error: "invalid_email_or_password" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials", error: "invalid_email_or_password" });
    }

    const tokenPayload = {
      user_id: user.id,
      email: user.email,
      role: user.role || "farmer",
      name: user.name || null,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const userPayload = {
      user_id: user.id,
      email: user.email,
      role: user.role || "farmer",
      name: user.name || null,
      phone: user.phone || null,
      region: user.region || null,
      created_at: user.created_at,
    };

    return res.json({ success: true, message: "Login successful", data: { user: userPayload, token } });
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

    const result = await pool.query(
      `SELECT u.id AS user_id, u.email, u.created_at,
        ur.role,
        p.full_name AS name,
        p.phone,
        p.region
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN profiles p ON p.id = u.id
      WHERE u.id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found", error: "not_found" });
    }

    return res.json({ success: true, message: "Profile retrieved", data: result.rows[0] });
  } catch (err) {
    console.error("[Auth] profile error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch profile", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user.user_id || req.user.userId);
    const { name, phone, region } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized", error: "no_user" });
    }

    if (!pool) {
      return res.status(500).json({ success: false, message: "Database not configured", error: null });
    }

    let sql = "UPDATE profiles SET ";
    const params = [];
    let idx = 1;

    if (name !== undefined) {
      sql += `full_name = $${idx++}, `;
      params.push(name);
    }
    if (phone !== undefined) {
      sql += `phone = $${idx++}, `;
      params.push(phone);
    }
    if (region !== undefined) {
      sql += `region = $${idx++}, `;
      params.push(region);
    }

    if (params.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    sql = sql.slice(0, -2);
    sql += `, updated_at = now() WHERE id = $${idx++} RETURNING *`;
    params.push(userId);

    const result = await pool.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.json({ success: true, message: "Profile updated successfully", data: result.rows[0] });
  } catch (err) {
    console.error("[Auth] updateProfile error:", err);
    return res.status(500).json({ success: false, message: "Failed to update profile", error: err.message });
  }
};

exports.seedPricesTemp = async (req, res) => {
  const commodities = [
    { id: 1, base: 12.0 },
    { id: 2, base: 8.0 },
    { id: 3, base: 15.0 },
    { id: 4, base: 6.0 },
    { id: 5, base: 5.0 },
    { id: 6, base: 25.0 },
    { id: 7, base: 4.0 },
    { id: 8, base: 7.0 },
    { id: 9, base: 8.0 },
    { id: 10, base: 10.0 },
    { id: 11, base: 6.5 },
    { id: 12, base: 18.0 },
    { id: 13, base: 9.0 },
    { id: 14, base: 8.5 },
    { id: 15, base: 14.0 },
    { id: 16, base: 12.0 },
    { id: 17, base: 11.0 },
    { id: 18, base: 15.0 },
    { id: 19, base: 5.5 },
    { id: 20, base: 7.5 },
  ];

  const markets = [1, 2, 3, 4, 5];

  try {
    await pool.query("DELETE FROM prices");

    const insertValues = [];
    const now = new Date();

    for (let d = 90; d >= 0; d--) {
      const date = new Date(now);
      date.setDate(now.getDate() - d);
      const dateStr = date.toISOString().slice(0, 10);

      for (const commodity of commodities) {
        for (const marketId of markets) {
          const marketModifier = 0.9 + marketId * 0.05;
          const timeModifier = Math.sin(d / 10) * 0.15;
          const randomNoise = (Math.random() - 0.5) * 0.05;

          let price = commodity.base * marketModifier * (1 + timeModifier + randomNoise);
          price = Math.max(0.5, parseFloat(price.toFixed(2)));

          insertValues.push(`(${commodity.id}, ${marketId}, ${price}, '${dateStr}', 1)`);
        }
      }
    }

    const batchSize = 1000;
    for (let i = 0; i < insertValues.length; i += batchSize) {
      const batch = insertValues.slice(i, i + batchSize);
      const queryStr = `
        INSERT INTO prices (commodity_id, market_id, price_ghs, date_recorded, recorded_by)
        VALUES ${batch.join(", ")}
      `;
      await pool.query(queryStr);
    }

    return res.json({
      success: true,
      message: `Seeded ${insertValues.length} price records successfully!`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};




