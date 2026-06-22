const { pool, supabase } = require("../db");

exports.getAllMarkets = async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query("SELECT * FROM markets ORDER BY name");
      return res.json(result.rows);
    } else {
      const { data, error } = await supabase.from("markets").select("*").order("name");
      if (error) throw error;
      return res.json(data);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMarketById = async (req, res) => {
  try {
    const { id } = req.params;

    let market;
    if (pool) {
      const mRes = await pool.query("SELECT * FROM markets WHERE id = $1", [id]);
      if (mRes.rows.length === 0) {
        return res.status(404).json({ error: "Market not found" });
      }
      market = mRes.rows[0];
    } else {
      const { data, error } = await supabase.from("markets").select("*").eq("id", id).single();
      if (error) {
        return res.status(404).json({ error: "Market not found" });
      }
      market = data;
    }

    // Fetch latest prices for all commodities in this market
    let prices = [];
    if (pool) {
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
      prices = pRes.rows;
    } else {
      const { data, error } = await supabase
        .from("prices")
        .select(
          "id, price_ghs, date_recorded, commodity_id, commodity:commodities(name,unit_of_measure,category)",
        )
        .eq("market_id", id)
        .order("date_recorded", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;

      const seen = new Set();
      for (const r of data) {
        if (seen.has(r.commodity_id)) continue;
        seen.add(r.commodity_id);
        prices.push({
          id: r.id,
          price_ghs: Number(r.price_ghs),
          date_recorded: r.date_recorded,
          commodity_name: r.commodity ? r.commodity.name : "Unknown",
          unit_of_measure: r.commodity ? r.commodity.unit_of_measure : "",
          category: r.commodity ? r.commodity.category : "",
        });
      }
    }

    return res.json({
      ...market,
      latest_prices: prices,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
