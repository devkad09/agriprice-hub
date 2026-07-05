const { pool } = require("../config/db");

exports.getAllCommodities = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM commodities ORDER BY category, name");
    const list = result.rows;

    if (req.query.grouped === "true") {
      const grouped = list.reduce((acc, c) => {
        const cat = c.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(c);
        return acc;
      }, {});
      return res.json(grouped);
    }

    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getCommodityById = async (req, res) => {
  try {
    const { id } = req.params;

    const cRes = await pool.query("SELECT * FROM commodities WHERE id = $1", [id]);
    if (cRes.rows.length === 0) {
      return res.status(404).json({ error: "Commodity not found" });
    }
    const commodity = cRes.rows[0];

    // Fetch latest prices across all markets for this commodity
    const pRes = await pool.query(
      `
      SELECT DISTINCT ON (market_id) 
             p.id, p.price_ghs, p.date_recorded, m.name as market_name, m.region
      FROM prices p
      JOIN markets m ON p.market_id = m.id
      WHERE p.commodity_id = $1
      ORDER BY p.market_id, p.date_recorded DESC, p.created_at DESC
    `,
      [id],
    );
    const prices = pRes.rows;

    return res.json({
      ...commodity,
      latest_prices: prices,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
