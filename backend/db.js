const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { createClient } = require("@supabase/supabase-js");
const { pool, query } = require("./config/db");

const supabase = createClient(
  process.env.SUPABASE_URL || "https://fbrcnxwypiccqazgyxbz.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "",
);

module.exports = {
  pool,
  supabase,
  query,
};
