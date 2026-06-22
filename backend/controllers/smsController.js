const { pool, supabase } = require("../db");
const { broadcastPriceAlerts } = require("../services/smsService");

exports.subscribe = async (req, res) => {
  try {
    const { phone, commodity_id, frequency } = req.body;
    const userId = req.user.id;
    const freq = frequency || "daily";

    if (!phone || !commodity_id) {
      return res.status(400).json({ error: "phone and commodity_id are required" });
    }

    // 1. Update the user's profile phone number
    if (pool) {
      await pool.query("UPDATE profiles SET phone = $1, updated_at = now() WHERE id = $2", [
        phone,
        userId,
      ]);

      // 2. Insert or update the subscription to active
      await pool.query(
        `
        INSERT INTO sms_subscriptions (user_id, commodity_id, frequency, active)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (user_id, commodity_id) 
        DO UPDATE SET frequency = EXCLUDED.frequency, active = true, created_at = now()
      `,
        [userId, commodity_id, freq],
      );
    } else {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ phone, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (profileErr) throw profileErr;

      // Check if subscription already exists
      const { data: existing } = await supabase
        .from("sms_subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("commodity_id", commodity_id)
        .maybeSingle();

      if (existing) {
        const { error: subErr } = await supabase
          .from("sms_subscriptions")
          .update({ frequency: freq, active: true, created_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (subErr) throw subErr;
      } else {
        const { error: subErr } = await supabase
          .from("sms_subscriptions")
          .insert({ user_id: userId, commodity_id, frequency: freq, active: true });
        if (subErr) throw subErr;
      }
    }

    return res.status(200).json({ message: "Successfully subscribed to price alerts" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { commodity_id } = req.body;
    const userId = req.user.id;

    if (!commodity_id) {
      return res.status(400).json({ error: "commodity_id is required" });
    }

    if (pool) {
      const result = await pool.query(
        "UPDATE sms_subscriptions SET active = false WHERE user_id = $1 AND commodity_id = $2 RETURNING *",
        [userId, commodity_id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Subscription not found" });
      }
    } else {
      const { data, error } = await supabase
        .from("sms_subscriptions")
        .update({ active: false })
        .eq("user_id", userId)
        .eq("commodity_id", commodity_id)
        .select("*");
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Subscription not found" });
      }
    }

    return res.status(200).json({ message: "Successfully unsubscribed from price alerts" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.triggerAlerts = async (req, res) => {
  try {
    const result = await broadcastPriceAlerts();
    return res.status(200).json({
      message: "SMS alerts broadcast completed successfully",
      ...result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
