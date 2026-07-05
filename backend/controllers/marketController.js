const { pool } = require("../config/db");

exports.getAllMarkets = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM markets ORDER BY name");
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMarketById = async (req, res) => {
  try {
    const { id } = req.params;

    const mRes = await pool.query("SELECT * FROM markets WHERE id = $1", [id]);
    if (mRes.rows.length === 0) {
      return res.status(404).json({ error: "Market not found" });
    }
    const market = mRes.rows[0];

    // Fetch latest prices for all commodities in this market
    const pRes = await pool.query(
      `
      SELECT DISTINCT ON (commodity_id) 
             p.id, p.price_ghs, p.date_recorded, c.name as commodity_name, c.unit_of_measure, c.category
      FROM prices p
      JOIN commodities c ON p.commodity_id = c.id
      WHERE p.market_id = $1
      ORDER BY p.commodity_id, p.date_recorded DESC, p.created_at DESC
    `,
      [id],
    );
    const prices = pRes.rows;

    return res.json({
      ...market,
      latest_prices: prices,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

