const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function createAdmin(email, password, name = 'Admin') {
  if (!pool) {
    console.error('Database pool not initialized. Check DATABASE_URL in backend/.env');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`User with email ${email} already exists (id=${existing.rows[0].id}).`);
      await client.query('ROLLBACK');
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    const insertUser = await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hash]
    );

    const userId = insertUser.rows[0].id;

    await client.query(
      'INSERT INTO profiles (id, full_name, phone, region) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name',
      [userId, name, null, null]
    );

    const existingRole = await client.query('SELECT id FROM user_roles WHERE user_id = $1', [userId]);
    if (existingRole.rows.length > 0) {
      await client.query('UPDATE user_roles SET role = $1 WHERE user_id = $2', ['admin', userId]);
    } else {
      await client.query('INSERT INTO user_roles (user_id, role) VALUES ($1, $2)', [userId, 'admin']);
    }

    await client.query('COMMIT');
    console.log('Admin user created:', { id: userId, email: insertUser.rows[0].email });
    process.exit(0);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to create admin user:', err.message || err);
    process.exit(1);
  } finally {
    client.release();
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/create_admin.js <email> <password> [name]');
  process.exit(1);
}

createAdmin(args[0], args[1], args[2] || 'Admin');
