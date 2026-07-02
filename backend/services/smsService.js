const africastalking = require("africastalking");
const { pool, supabase } = require("../db");

const username = process.env.AT_USERNAME || "sandbox";
const apiKey = process.env.AT_API_KEY;

let atClient = null;
let atSMS = null;

if (apiKey) {
  try {
    atClient = africastalking({ username, apiKey });
    atSMS = atClient.SMS;
    console.log(`[AgriBackend] Africa's Talking initialized with username: ${username}`);
  } catch (err) {
    console.error(`[AgriBackend] Failed to initialize Africa's Talking SDK:`, err);
  }
} else {
  console.log(
    `[AgriBackend] AT_API_KEY missing. Africa's Talking SMS runs in Mock Console Log mode.`,
  );
}

async function sendSMS(phoneNumber, message) {
  try {
    if (atSMS) {
      const payload = {
        to: [phoneNumber],
        message: message,
      };

      if (process.env.AT_SENDER_ID) {
        payload.from = process.env.AT_SENDER_ID;
      }

      const response = await atSMS.send(payload);
      console.log(`[AgriBackend] SMS sent to ${phoneNumber}:`, response);
      return response;
    } else {
      console.log(`[MOCK SMS BROADCAST] To: ${phoneNumber} | Msg: "${message}"`);
      return { status: "mock_success", to: phoneNumber, message };
    }
  } catch (error) {
    console.error(`[AgriBackend] Error sending SMS to ${phoneNumber}:`, error);
    throw error;
  }
}

async function broadcastPriceAlerts() {
  try {
    let subscriptions = [];
    let latestPrices = new Map(); // commodity_id -> price record

    if (pool) {
      const subRes = await pool.query(`
        SELECT sub.id, sub.commodity_id, c.name as commodity_name, c.unit_of_measure, p.phone
        FROM sms_subscriptions sub
        JOIN profiles p ON sub.user_id = p.id
        JOIN commodities c ON sub.commodity_id = c.id
        WHERE sub.active = true AND p.phone IS NOT NULL AND p.phone != ''
      `);
      subscriptions = subRes.rows;

      const priceRes = await pool.query(`
        SELECT DISTINCT ON (commodity_id) 
               p.commodity_id, p.price_ghs, p.date_recorded, m.name as market_name, m.region
        FROM prices p
        JOIN markets m ON p.market_id = m.id
        ORDER BY p.commodity_id, p.date_recorded DESC, p.created_at DESC
      `);
      for (const r of priceRes.rows) {
        latestPrices.set(r.commodity_id, r);
      }
    } else {
      const { data: subRows, error: subErr } = await supabase
        .from("sms_subscriptions")
        .select(
          "id, commodity_id, active, commodity:commodities(name,unit_of_measure), profile:profiles(phone)",
        )
        .eq("active", true);
      if (subErr) throw subErr;

      subscriptions = (subRows ?? [])
        .filter((r) => r.profile && r.profile.phone && r.commodity)
        .map((r) => ({
          id: r.id,
          commodity_id: r.commodity_id,
          commodity_name: r.commodity.name,
          unit_of_measure: r.commodity.unit_of_measure,
          phone: r.profile.phone,
        }));

      const { data: priceRows, error: priceErr } = await supabase
        .from("prices")
        .select("price_ghs, date_recorded, commodity_id, market_id, market:markets(name,region)")
        .order("date_recorded", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1000);
      if (priceErr) throw priceErr;

      for (const r of priceRows ?? []) {
        if (!latestPrices.has(r.commodity_id)) {
          latestPrices.set(r.commodity_id, {
            commodity_id: r.commodity_id,
            price_ghs: Number(r.price_ghs),
            date_recorded: r.date_recorded,
            market_name: r.market ? r.market.name : "Unknown",
            region: r.market ? r.market.region : "",
          });
        }
      }
    }

    console.log(
      `[AgriBackend] Starting broadcast for ${subscriptions.length} active subscription(s)...`,
    );
    let count = 0;

    for (const sub of subscriptions) {
      const latest = latestPrices.get(sub.commodity_id);
      if (!latest) {
        console.log(
          `[AgriBackend] No price data found for ${sub.commodity_name}, skipping SMS to ${sub.phone}`,
        );
        continue;
      }

      const msg = `AgriFarm: ${sub.commodity_name} - GHS ${Number(latest.price_ghs).toFixed(2)}/${sub.unit_of_measure} (${latest.market_name}, ${latest.region}). Reply STOP to unsubscribe.`;
      await sendSMS(sub.phone, msg);
      count++;
    }

    return { success: true, broadcastCount: count };
  } catch (err) {
    console.error("[AgriBackend] Error in broadcastPriceAlerts:", err);
    throw err;
  }
}

module.exports = { sendSMS, broadcastPriceAlerts };
