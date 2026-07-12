const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { pool } = require("../config/db");

async function runCleanup() {
  if (!pool) {
    console.error("Database pool not initialized. Check DATABASE_URL in backend/.env");
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    console.log("Starting database cleanup and schema enhancement...");
    await client.query("BEGIN");

    // 1. Deduplicate markets
    console.log("Deduplicating markets...");
    const marketsBefore = await client.query("SELECT COUNT(*) FROM markets");
    await client.query("DELETE FROM markets a USING markets b WHERE a.id > b.id AND a.name = b.name");
    const marketsAfter = await client.query("SELECT COUNT(*) FROM markets");
    console.log(`Markets count: ${marketsBefore.rows[0].count} -> ${marketsAfter.rows[0].count}`);

    // 2. Deduplicate commodities
    console.log("Deduplicating commodities...");
    const commoditiesBefore = await client.query("SELECT COUNT(*) FROM commodities");
    await client.query("DELETE FROM commodities a USING commodities b WHERE a.id > b.id AND a.name = b.name");
    const commoditiesAfter = await client.query("SELECT COUNT(*) FROM commodities");
    console.log(`Commodities count: ${commoditiesBefore.rows[0].count} -> ${commoditiesAfter.rows[0].count}`);

    // 3. Deduplicate user roles
    console.log("Deduplicating user roles...");
    const rolesBefore = await client.query("SELECT COUNT(*) FROM user_roles");
    await client.query("DELETE FROM user_roles a USING user_roles b WHERE a.id > b.id AND a.user_id = b.user_id AND a.role = b.role");
    const rolesAfter = await client.query("SELECT COUNT(*) FROM user_roles");
    console.log(`User roles count: ${rolesBefore.rows[0].count} -> ${rolesAfter.rows[0].count}`);

    // 4. Add UNIQUE constraint to markets name
    console.log("Applying UNIQUE constraint to markets.name...");
    await client.query("ALTER TABLE markets DROP CONSTRAINT IF EXISTS unique_market_name");
    await client.query("ALTER TABLE markets ADD CONSTRAINT unique_market_name UNIQUE (name)");

    // 5. Add UNIQUE constraint to commodities name
    console.log("Applying UNIQUE constraint to commodities.name...");
    await client.query("ALTER TABLE commodities DROP CONSTRAINT IF EXISTS unique_commodity_name");
    await client.query("ALTER TABLE commodities ADD CONSTRAINT unique_commodity_name UNIQUE (name)");

    // 6. Add UNIQUE constraint to user_roles (user_id, role)
    console.log("Applying UNIQUE constraint to user_roles (user_id, role)...");
    await client.query("ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS unique_user_role");
    await client.query("ALTER TABLE user_roles ADD CONSTRAINT unique_user_role UNIQUE (user_id, role)");

    await client.query("COMMIT");
    console.log("Cleanup and constraint application completed successfully!");
    process.exit(0);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Cleanup failed. Transaction rolled back:", err.message || err);
    process.exit(1);
  } finally {
    client.release();
  }
}

runCleanup();
