const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl:
        connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
    })
  : null;

async function query(text, params) {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};
