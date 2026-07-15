const { pool } = require("../config/db");
const { broadcastPriceAlerts } = require("../services/smsService");
const csv = require("csv-parser");
const stream = require("stream");

exports.getAllUsers = async (req, res) => {
  try {
    const sql = `
      SELECT p.id, u.email, p.full_name, p.phone, p.region, p.created_at,
             COALESCE(json_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), '[]'::json) as roles
      FROM profiles p
      JOIN users u ON u.id = p.id
      LEFT JOIN user_roles ur ON p.id = ur.user_id
      GROUP BY p.id, u.email, p.full_name, p.phone, p.region, p.created_at
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(sql);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getAuditLog = async (req, res) => {
  try {
    const sql = `
      SELECT al.*, p.full_name as user_name
      FROM audit_log al
      LEFT JOIN profiles p ON al.user_id = p.id
      ORDER BY al.created_at DESC
      LIMIT 100
    `;
    const result = await pool.query(sql);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.bulkImportPrices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
    }

    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const userId = req.user.id;
        const imported = [];
        const errors = [];

        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          const marketId = row.market_id || row.marketId;
          const commodityId = row.commodity_id || row.commodityId;
          const priceStr = row.price_ghc || row.price_ghs || row.price;
          const dateRecorded =
            row.date_recorded || row.dateRecorded || new Date().toISOString().slice(0, 10);

          if (!marketId || !commodityId || !priceStr) {
            errors.push({
              index: i,
              row,
              error:
                "Missing required fields (market_id, commodity_id, price_ghs or price_ghc). Please include these columns.",
            });
            continue;
          }

          const price = parseFloat(priceStr);
          if (isNaN(price) || price <= 0) {
            errors.push({ index: i, row, error: "Price must be a positive number" });
            continue;
          }

          try {
            const resInsert = await pool.query(
              `INSERT INTO prices (commodity_id, market_id, price_ghs, date_recorded, recorded_by) 
               VALUES ($1, $2, $3, $4, $5) RETURNING id`,
              [commodityId, marketId, price, dateRecorded, userId],
            );
            const recordId = resInsert.rows[0].id;
            imported.push(recordId);

            // Log to audit log
            await pool.query(
              `INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES ($1, $2, $3, $4, $5)`,
              [
                userId,
                "create",
                "prices",
                recordId,
                JSON.stringify({
                  commodity_id: commodityId,
                  market_id: marketId,
                  price_ghs: price,
                  date_recorded: dateRecorded,
                  bulk: true,
                }),
              ],
            );
          } catch (err) {
            errors.push({ index: i, row, error: err.message });
          }
        }

        if (imported.length > 0) {
          try {
            await broadcastPriceAlerts();
          } catch (err) {
            console.error("[SMS Broadcast] Bulk auto-broadcast error:", err);
          }
        }

        return res.json({
          message: `Bulk import completed. Successfully imported ${imported.length} rows. Errors: ${errors.length}`,
          successCount: imported.length,
          errorCount: errors.length,
          errors,
        });
      })
      .on("error", (csvErr) => {
        console.error(csvErr);
        return res.status(400).json({ error: "Failed to parse CSV file: " + csvErr.message });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Admin route to manage user roles
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ error: "userId and role are required" });
    }

    const validRoles = ["farmer", "data_officer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Delete existing roles and insert the new one
    await pool.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);
    await pool.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2)", [userId, role]);

    // Audit log
    await pool.query(
      `INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, "update_role", "user_roles", userId, JSON.stringify({ role })],
    );

    return res.json({ message: "User role updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Admin route to retrieve dashboard stats
exports.getStats = async (req, res) => {
  try {
    const marketsRes = await pool.query("SELECT COUNT(*) FROM markets");
    const commoditiesRes = await pool.query("SELECT COUNT(*) FROM commodities");
    const pricesRes = await pool.query("SELECT COUNT(*) FROM prices");
    const subsRes = await pool.query("SELECT COUNT(*) FROM sms_subscriptions WHERE active = true");
    return res.json({
      markets: parseInt(marketsRes.rows[0].count, 10),
      commodities: parseInt(commoditiesRes.rows[0].count, 10),
      prices: parseInt(pricesRes.rows[0].count, 10),
      subscriptions: parseInt(subsRes.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

