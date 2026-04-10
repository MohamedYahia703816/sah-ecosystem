-- SAH Music Studio Database Schema
-- Project: Sonic Architect Hub (SAH)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  balance BIGINT DEFAULT 0,
  profit_per_hour BIGINT DEFAULT 0,
  boost_multiplier FLOAT DEFAULT 1.0,
  selected_genre TEXT,
  owned_genres TEXT[] DEFAULT '{}',
  last_claim TIMESTAMPTZ DEFAULT NOW(),
  last_daily_bonus TIMESTAMPTZ,
  active_boost_type TEXT,
  active_boost_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory table (owned instruments per genre)
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  genre TEXT NOT NULL,
  level INT NOT NULL CHECK (level BETWEEN 1 AND 5),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, genre, level)
);

-- Boosters table
CREATE TABLE IF NOT EXISTS boosters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  booster_type TEXT NOT NULL,
  level INT NOT NULL DEFAULT 0,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, booster_type)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, task_type)
);

-- Video tasks (configurable 2x daily)
CREATE TABLE IF NOT EXISTS video_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('AM', 'PM')),
  reward INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed_reward', 'boost', 'unique')),
  reward_value INT DEFAULT 0,
  boost_duration_hours INT,
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo code usage tracking
CREATE TABLE IF NOT EXISTS promo_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id)
);

-- Leaderboard cache (updated periodically)
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  username TEXT,
  total_earned BIGINT DEFAULT 0,
  profit_per_hour BIGINT DEFAULT 0,
  rank_type TEXT NOT NULL DEFAULT 'total',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_balance ON users(balance DESC);
CREATE INDEX idx_users_profit ON users(profit_per_hour DESC);
CREATE INDEX idx_inventory_user ON inventory(user_id);
CREATE INDEX idx_boosters_user ON boosters(user_id);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank_type, total_earned DESC);

-- RLS Policies - Allow public access for Telegram Mini App
-- Since we use Telegram user IDs directly without Supabase Auth

-- Users: Allow all operations (Telegram users are identified by their Telegram ID)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);

-- Inventory: Allow all operations
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can insert inventory" ON inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update inventory" ON inventory FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete inventory" ON inventory FOR DELETE USING (true);

-- Boosters: Allow all operations
ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read boosters" ON boosters FOR SELECT USING (true);
CREATE POLICY "Anyone can insert boosters" ON boosters FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update boosters" ON boosters FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete boosters" ON boosters FOR DELETE USING (true);

-- Tasks: Allow all operations
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tasks" ON tasks FOR DELETE USING (true);

-- Video tasks - public read (keep existing)
ALTER TABLE video_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read video tasks" ON video_tasks FOR SELECT USING (true);

-- Promo codes - public read (keep existing)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read promo codes" ON promo_codes FOR SELECT USING (is_active = true);

-- Promo usage: Allow all operations
ALTER TABLE promo_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read promo usage" ON promo_usage FOR SELECT USING (true);
CREATE POLICY "Anyone can insert promo usage" ON promo_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete promo usage" ON promo_usage FOR DELETE USING (true);

-- Leaderboard - public read (keep existing)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read leaderboard" ON leaderboard FOR SELECT USING (true);

-- Promo usage policies
CREATE POLICY "Users can insert promo usage" ON promo_usage
  FOR INSERT WITH CHECK (true);

-- Leaderboard - public read
CREATE POLICY "Anyone can read leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Function to upsert user (called on login)
CREATE OR REPLACE FUNCTION upsert_user(
  p_id TEXT,
  p_username TEXT,
  p_first_name TEXT,
  p_last_name TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO users (id, username, first_name, last_name)
  VALUES (p_id, p_username, p_first_name, p_last_name)
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update promo code usage count
CREATE OR REPLACE FUNCTION update_promo_usage(
  p_code_id UUID
) RETURNS VOID AS $$
BEGIN
  UPDATE promo_codes
  SET used_count = used_count + 1
  WHERE id = p_code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user balance
CREATE OR REPLACE FUNCTION update_user_balance(
  p_user_id TEXT,
  p_amount BIGINT
) RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET balance = balance + p_amount, updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate passive earnings
CREATE OR REPLACE FUNCTION calculate_passive_earnings(
  p_user_id TEXT,
  p_last_claim TIMESTAMPTZ
) RETURNS BIGINT AS $$
DECLARE
  v_user RECORD;
  v_hours FLOAT;
  v_earnings BIGINT;
BEGIN
  SELECT * INTO v_user FROM users WHERE id = p_user_id;
  
  IF v_user IS NULL THEN
    RETURN 0;
  END IF;
  
  v_hours := EXTRACT(EPOCH FROM (NOW() - p_last_claim)) / 3600;
  v_hours := LEAST(v_hours, 24); -- Cap at 24 hours
  
  v_earnings := (v_user.profit_per_hour * v_hours * v_user.boost_multiplier)::BIGINT;
  
  RETURN v_earnings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default video tasks
INSERT INTO video_tasks (title, url, period, reward, is_active) VALUES
  ('Morning Session - Watch & Earn', 'https://youtube.com/watch?v=PLACEHOLDER_AM', 'AM', 50, true),
  ('Evening Session - Watch & Earn', 'https://youtube.com/watch?v=PLACEHOLDER_PM', 'PM', 50, true);

-- Insert sample promo code (for testing)
INSERT INTO promo_codes (code, type, reward_value, max_uses, is_active) VALUES
  ('SAH2026', 'fixed_reward', 500, 100, true);
