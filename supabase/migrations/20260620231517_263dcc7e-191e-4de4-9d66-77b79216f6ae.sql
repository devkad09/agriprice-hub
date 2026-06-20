
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('farmer', 'data_officer', 'admin');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ AUTO-CREATE PROFILE + DEFAULT ROLE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, region)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'region'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'farmer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ MARKETS ============
CREATE TABLE public.markets (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  location_lat NUMERIC,
  location_lng NUMERIC,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.markets TO anon, authenticated;
GRANT ALL ON public.markets TO service_role;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read markets" ON public.markets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage markets" ON public.markets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ COMMODITIES ============
CREATE TABLE public.commodities (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  unit_of_measure TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.commodities TO anon, authenticated;
GRANT ALL ON public.commodities TO service_role;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read commodities" ON public.commodities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage commodities" ON public.commodities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PRICES ============
CREATE TABLE public.prices (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  price_ghs NUMERIC(10,2) NOT NULL CHECK (price_ghs >= 0),
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX prices_commodity_idx ON public.prices(commodity_id);
CREATE INDEX prices_market_idx ON public.prices(market_id);
CREATE INDEX prices_date_idx ON public.prices(date_recorded DESC);
GRANT SELECT ON public.prices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.prices TO authenticated;
GRANT ALL ON public.prices TO service_role;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read prices" ON public.prices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Officers insert prices" ON public.prices FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'data_officer') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Officers update prices" ON public.prices FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'data_officer') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Officers delete prices" ON public.prices FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'data_officer') OR public.has_role(auth.uid(), 'admin'));

-- ============ SMS SUBSCRIPTIONS ============
CREATE TABLE public.sms_subscriptions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily','weekly')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, commodity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_subscriptions TO authenticated;
GRANT ALL ON public.sms_subscriptions TO service_role;
ALTER TABLE public.sms_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subs" ON public.sms_subscriptions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all subs" ON public.sms_subscriptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ AUDIT LOG ============
CREATE TABLE public.audit_log (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit log" ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ SEED MARKETS ============
INSERT INTO public.markets (name, region, description) VALUES
  ('Makola Market', 'Greater Accra', 'Largest open-air market in Accra'),
  ('Kumasi Central Market', 'Ashanti', 'Central trading hub in Kumasi'),
  ('Kejetia Market', 'Ashanti', 'One of the largest markets in West Africa'),
  ('Techiman Market', 'Bono East', 'Major agricultural produce market in central Ghana'),
  ('Tamale Market', 'Northern', 'Principal market serving northern Ghana');

-- ============ SEED COMMODITIES ============
INSERT INTO public.commodities (name, category, unit_of_measure) VALUES
  ('Tomatoes', 'Vegetable', 'crate'),
  ('Onions', 'Vegetable', 'bag (100kg)'),
  ('Pepper', 'Vegetable', 'bag (50kg)'),
  ('Garden Eggs', 'Vegetable', 'crate'),
  ('Okra', 'Vegetable', 'bag (50kg)'),
  ('Yam', 'Tuber', 'tuber'),
  ('Cassava', 'Tuber', 'bag (100kg)'),
  ('Cocoyam', 'Tuber', 'bag (50kg)'),
  ('Sweet Potato', 'Tuber', 'bag (50kg)'),
  ('Plantain', 'Fruit', 'bunch'),
  ('Maize', 'Cereal', 'bag (100kg)'),
  ('Rice', 'Cereal', 'bag (50kg)'),
  ('Millet', 'Cereal', 'bag (100kg)'),
  ('Sorghum', 'Cereal', 'bag (100kg)'),
  ('Groundnuts', 'Legume', 'bag (100kg)'),
  ('Cowpea', 'Legume', 'bag (100kg)'),
  ('Soybeans', 'Legume', 'bag (100kg)'),
  ('Watermelon', 'Fruit', 'piece'),
  ('Orange', 'Fruit', 'bag (50kg)'),
  ('Pineapple', 'Fruit', 'piece');
