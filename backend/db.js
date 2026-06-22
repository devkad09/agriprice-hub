const { Pool } = require("pg");
const { createClient } = require("@supabase/supabase-js");

let pool = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_URL.includes("localhost") ||
        process.env.DATABASE_URL.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
    });
    console.log("[AgriBackend] PostgreSQL database pool initialized successfully.");
  } catch (err) {
    console.error("[AgriBackend] Error initializing PostgreSQL pool:", err);
  }
} else {
  console.log(
    "[AgriBackend] DATABASE_URL missing. Operating in Supabase HTTP Client fallback mode.",
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL || "https://fbrcnxwypiccqazgyxbz.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "",
);

module.exports = {
  pool,
  supabase,
  query: async (text, params) => {
    if (pool) {
      return pool.query(text, params);
    }
    throw new Error("Database pool not initialized. Falling back to client API.");
  },
};
