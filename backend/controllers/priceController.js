const { pool } = require("../config/db");

exports.getAllPrices = async (req, res) => {
  try {
    const { market_id, commodity_id, date, limit } = req.query;
    let sql = `
      SELECT p.*, 
             json_build_object('id', c.id, 'name', c.name, 'category', c.category, 'unit_of_measure', c.unit_of_measure) as commodity,
             json_build_object('id', m.id, 'name', m.name, 'region', m.region) as market
      FROM prices p
      JOIN commodities c ON p.commodity_id = c.id
      JOIN markets m ON p.market_id = m.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (market_id) {
      sql += ` AND p.market_id = $${paramIndex++}`;
      params.push(market_id);
    }
    if (commodity_id) {
      sql += ` AND p.commodity_id = $${paramIndex++}`;
      params.push(commodity_id);
    }
    if (date) {
      sql += ` AND p.date_recorded = $${paramIndex++}`;
      params.push(date);
    }
    if (req.query.recorded_by) {
      sql += ` AND p.recorded_by = $${paramIndex++}`;
      params.push(req.query.recorded_by);
    }

    sql += ` ORDER BY p.date_recorded DESC, p.created_at DESC`;

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        sql += ` LIMIT $${paramIndex++}`;
        params.push(parsedLimit);
      }
    }

    const result = await pool.query(sql, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getPriceTrends = async (req, res) => {
  try {
    const { commodity_id, days } = req.query;
    if (!commodity_id) {
      return res.status(400).json({ error: "commodity_id is required" });
    }
    const dayCount = parseInt(days) || 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - dayCount);
    const sinceStr = sinceDate.toISOString().slice(0, 10);

    const sql = `
      SELECT p.price_ghs, p.date_recorded, p.market_id, m.name as market_name
      FROM prices p
      JOIN markets m ON p.market_id = m.id
      WHERE p.commodity_id = $1 AND p.date_recorded >= $2
      ORDER BY p.date_recorded ASC
    `;
    const result = await pool.query(sql, [commodity_id, sinceStr]);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.compareMarkets = async (req, res) => {
  try {
    const { commodity_id } = req.query;
    if (!commodity_id) {
      return res.status(400).json({ error: "commodity_id is required" });
    }

    const sql = `
      SELECT DISTINCT ON (market_id) 
             p.price_ghs, p.date_recorded, p.market_id, m.name as market_name, m.region
      FROM prices p
      JOIN markets m ON p.market_id = m.id
      WHERE p.commodity_id = $1
      ORDER BY p.market_id, p.date_recorded DESC, p.created_at DESC
    `;
    const result = await pool.query(sql, [commodity_id]);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.addPrice = async (req, res) => {
  try {
    const { commodity_id, market_id, price_ghs, date_recorded } = req.body;
    const userId = req.user.id;
    const dateStr = date_recorded || new Date().toISOString().slice(0, 10);

    if (!commodity_id || !market_id || !price_ghs) {
      return res.status(400).json({ error: "commodity_id, market_id, and price_ghs are required" });
    }

    const sql = `
      INSERT INTO prices (commodity_id, market_id, price_ghs, date_recorded, recorded_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(sql, [commodity_id, market_id, price_ghs, dateStr, userId]);
    const addedRow = result.rows[0];
    const recordId = addedRow.id;

    // Insert into audit_log
    const details = { commodity_id, market_id, price_ghs, date_recorded: dateStr };
    await pool.query(
      `INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES ($1, $2, $3, $4, $5)`,
      [userId, "create", "prices", recordId, JSON.stringify(details)],
    );

    return res.status(201).json(addedRow);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price_ghs, date_recorded } = req.body;
    const userId = req.user.id;

    let sql = `UPDATE prices SET `;
    const params = [];
    let paramIndex = 1;

    if (price_ghs !== undefined) {
      sql += `price_ghs = $${paramIndex++}, `;
      params.push(price_ghs);
    }
    if (date_recorded !== undefined) {
      sql += `date_recorded = $${paramIndex++}, `;
      params.push(date_recorded);
    }

    if (params.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    sql = sql.slice(0, -2);
    sql += ` WHERE id = $${paramIndex++} RETURNING *`;
    params.push(id);

    const result = await pool.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Price record not found" });
    }

    const updatedRow = result.rows[0];

    // Audit Log
    await pool.query(
      `INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES ($1, $2, $3, $4, $5)`,
      [userId, "update", "prices", id, JSON.stringify({ price_ghs, date_recorded })],
    );

    return res.json(updatedRow);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(`DELETE FROM prices WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Price record not found" });
    }

    // Audit Log
    await pool.query(
      `INSERT INTO audit_log (user_id, action, table_name, record_id) VALUES ($1, $2, $3, $4)`,
      [userId, "delete", "prices", id],
    );

    return res.json({ message: "Price record deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

