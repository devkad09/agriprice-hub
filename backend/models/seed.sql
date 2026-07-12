INSERT INTO markets (name, region, location_lat, location_lng, description) VALUES
  ('Makola Market Accra', 'Greater Accra', 5.5560, -0.2010, 'Largest wholesale market in Accra'),
  ('Kumasi Central Market', 'Ashanti', 6.6885, -1.6244, 'Central hub for food and produce trade in Kumasi'),
  ('Kejetia Market', 'Ashanti', 6.6907, -1.6214, 'Busy market serving northern and southern traders'),
  ('Techiman Market', 'Bono East', 7.5900, -1.9400, 'Major market in the Bono East Region'),
  ('Tamale Market', 'Northern', 9.4075, -0.8533, 'Key market for northern food trade')
ON CONFLICT (name) DO NOTHING;

INSERT INTO commodities (name, category, unit_of_measure, description) VALUES
  ('Tomatoes', 'Vegetable', 'kg', 'Fresh tomatoes'),
  ('Onions', 'Vegetable', 'kg', 'Fresh onions'),
  ('Pepper', 'Vegetable', 'kg', 'Fresh pepper'),
  ('Garden Eggs', 'Vegetable', 'kg', 'Fresh garden eggs'),
  ('Okra', 'Vegetable', 'kg', 'Fresh okra'),
  ('Yam', 'Root Crop', 'kg', 'Fresh yam tubers'),
  ('Cassava', 'Root Crop', 'kg', 'Fresh cassava'),
  ('Cocoyam', 'Root Crop', 'kg', 'Fresh cocoyam'),
  ('Sweet Potato', 'Root Crop', 'kg', 'Fresh sweet potato'),
  ('Plantain', 'Fruit', 'kg', 'Fresh plantain'),
  ('Maize', 'Cereal', 'kg', 'Fresh maize grains'),
  ('Rice', 'Cereal', 'kg', 'Rice grains'),
  ('Millet', 'Cereal', 'kg', 'Millet grains'),
  ('Sorghum', 'Cereal', 'kg', 'Sorghum grains'),
  ('Groundnuts', 'Legume', 'kg', 'Groundnuts in shell'),
  ('Cowpea', 'Legume', 'kg', 'Cowpea beans'),
  ('Soybeans', 'Legume', 'kg', 'Soybean grains'),
  ('Watermelon', 'Fruit', 'kg', 'Fresh watermelon'),
  ('Orange', 'Fruit', 'kg', 'Fresh oranges'),
  ('Pineapple', 'Fruit', 'kg', 'Fresh pineapple')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (email, password_hash) VALUES
  ('admin@agrifarm.com', '$2b$10$7WldYmK.kasTJyUlQAGPD.xHQ.YYQv8RR.TozrcRHJdUCuJ89RVXW')
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (id, full_name, phone, region) VALUES
  (1, 'AgriFarm Admin', '+233000000000', 'Greater Accra')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role) VALUES
  (1, 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
-- seed data complete
