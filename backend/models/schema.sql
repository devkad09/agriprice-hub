CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'data_officer', 'admin')),
  phone VARCHAR(30),
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS markets (
  market_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  location_lat DECIMAL(9, 6),
  location_lng DECIMAL(9, 6),
  description TEXT
);

CREATE TABLE IF NOT EXISTS commodities (
  commodity_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit_of_measure VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS prices (
  price_id SERIAL PRIMARY KEY,
  commodity_id INT NOT NULL REFERENCES commodities(commodity_id) ON DELETE CASCADE,
  market_id INT NOT NULL REFERENCES markets(market_id) ON DELETE CASCADE,
  price_ghc DECIMAL(12, 2) NOT NULL,
  date_recorded DATE NOT NULL,
  recorded_by INT REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sms_subscriptions (
  sub_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  commodity_id INT NOT NULL REFERENCES commodities(commodity_id) ON DELETE CASCADE,
  frequency VARCHAR(20) NOT NULL DEFAULT 'daily',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  log_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id INT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
