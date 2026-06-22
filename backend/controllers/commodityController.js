const { pool, supabase } = require("../db");

exports.getAllCommodities = async (req, res) => {
  try {
    let list = [];
    if (pool) {
      const result = await pool.query("SELECT * FROM commodities ORDER BY category, name");
      list = result.rows;
    } else {
      const { data, error } = await supabase
        .from("commodities")
        .select("*")
        .order("category")
        .order("name");
      if (error) throw error;
      list = data;
    }

    // Optional grouping by category as requested in Phase 3
    const grouped = list.reduce((acc, c) => {
      const cat = c.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(c);
      return acc;
    }, {});

    return res.json(grouped);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getCommodityById = async (req, res) => {
  try {
    const { id } = req.params;

    let commodity;
    if (pool) {
      const cRes = await pool.query("SELECT * FROM commodities WHERE id = $1", [id]);
      if (cRes.rows.length === 0) {
        return res.status(404).json({ error: "Commodity not found" });
      }
      commodity = cRes.rows[0];
    } else {
      const { data, error } = await supabase.from("commodities").select("*").eq("id", id).single();
      if (error) {
        return res.status(404).json({ error: "Commodity not found" });
      }
      commodity = data;
    }

    // Fetch latest prices across all markets for this commodity
    let prices = [];
    if (pool) {
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
      prices = pRes.rows;
    } else {
      const { data, error } = await supabase
        .from("prices")
        .select("id, price_ghs, date_recorded, market_id, market:markets(name,region)")
        .eq("commodity_id", id)
        .order("date_recorded", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;

      const seen = new Set();
      for (const r of data) {
        if (seen.has(r.market_id)) continue;
        seen.add(r.market_id);
        prices.push({
          id: r.id,
          price_ghs: Number(r.price_ghs),
          date_recorded: r.date_recorded,
          market_name: r.market ? r.market.name : "Unknown",
          region: r.market ? r.market.region : "Unknown",
        });
      }
    }

    return res.json({
      ...commodity,
      latest_prices: prices,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
