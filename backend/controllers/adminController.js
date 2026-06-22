const { pool, supabase } = require("../db");
const csv = require("csv-parser");
const stream = require("stream");

exports.getAllUsers = async (req, res) => {
  try {
    if (pool) {
      const sql = `
        SELECT p.id, p.full_name, p.phone, p.region, p.created_at,
               COALESCE(json_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), '[]'::json) as roles
        FROM profiles p
        LEFT JOIN user_roles ur ON p.id = ur.user_id
        GROUP BY p.id, p.full_name, p.phone, p.region, p.created_at
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(sql);
      return res.json(result.rows);
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, region, created_at, user_roles(role)")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const formatted = data.map((u) => ({
        id: u.id,
        full_name: u.full_name,
        phone: u.phone,
        region: u.region,
        created_at: u.created_at,
        roles: (u.user_roles ?? []).map((r) => r.role),
      }));
      return res.json(formatted);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getAuditLog = async (req, res) => {
  try {
    if (pool) {
      const sql = `
        SELECT al.*, p.full_name as user_name
        FROM audit_log al
        LEFT JOIN profiles p ON al.user_id = p.id
        ORDER BY al.created_at DESC
        LIMIT 100
      `;
      const result = await pool.query(sql);
      return res.json(result.rows);
    } else {
      const { data, error } = await supabase
        .from("audit_log")
        .select(
          "id, user_id, action, table_name, record_id, details, created_at, profile:profiles(full_name)",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;

      const formatted = data.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        action: r.action,
        table_name: r.table_name,
        record_id: r.record_id,
        details: r.details,
        created_at: r.created_at,
        user_name: r.profile ? r.profile.full_name : "Unknown User",
      }));
      return res.json(formatted);
    }
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
              error: "Missing required columns (market_id, commodity_id, price_ghc)",
            });
            continue;
          }

          const price = parseFloat(priceStr);
          if (isNaN(price) || price <= 0) {
            errors.push({ index: i, row, error: "Price must be a positive number" });
            continue;
          }

          try {
            if (pool) {
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
            } else {
              const { data, error } = await supabase
                .from("prices")
                .insert({
                  commodity_id: commodityId,
                  market_id: marketId,
                  price_ghs: price,
                  date_recorded: dateRecorded,
                  recorded_by: userId,
                })
                .select("id")
                .single();
              if (error) throw error;
              imported.push(data.id);

              await supabase.from("audit_log").insert({
                user_id: userId,
                action: "create",
                table_name: "prices",
                record_id: data.id,
                details: {
                  commodity_id: commodityId,
                  market_id: marketId,
                  price_ghs: price,
                  date_recorded: dateRecorded,
                  bulk: true,
                },
              });
            }
          } catch (err) {
            errors.push({ index: i, row, error: err.message });
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

    if (pool) {
      // Delete existing roles and insert the new one
      await pool.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);
      await pool.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2)", [userId, role]);

      // Audit log
      await pool.query(
        `INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES ($1, $2, $3, $4, $5)`,
        [req.user.id, "update_role", "user_roles", userId, JSON.stringify({ role })],
      );
    } else {
      // For Supabase, delete role rows and insert new one
      const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (delErr) throw delErr;

      const { error: insErr } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (insErr) throw insErr;

      // Audit Log
      await supabase.from("audit_log").insert({
        user_id: req.user.id,
        action: "update_role",
        table_name: "user_roles",
        record_id: userId,
        details: { role },
      });
    }

    return res.json({ message: "User role updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
