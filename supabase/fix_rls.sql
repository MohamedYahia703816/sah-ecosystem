-- SAH Music Studio - Fix RLS Policies
-- This script drops all old auth.uid() based policies and replaces them with open policies
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- STEP 1: Drop all existing policies
-- ============================================
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can read own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can insert own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can read own boosters" ON boosters;
DROP POLICY IF EXISTS "Users can insert/update own boosters" ON boosters;
DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert/update own tasks" ON tasks;
DROP POLICY IF EXISTS "Anyone can read video tasks" ON video_tasks;
DROP POLICY IF EXISTS "Anyone can read promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Users can insert promo usage" ON promo_usage;
DROP POLICY IF EXISTS "Anyone can read leaderboard" ON leaderboard;

-- ============================================
-- STEP 2: Create new open policies
-- ============================================

-- Users: Allow all operations (Telegram auth handled in app)
CREATE POLICY "open_users_all" ON users FOR ALL USING (true) WITH CHECK (true);

-- Inventory: Allow all operations
CREATE POLICY "open_inventory_all" ON inventory FOR ALL USING (true) WITH CHECK (true);

-- Boosters: Allow all operations
CREATE POLICY "open_boosters_all" ON boosters FOR ALL USING (true) WITH CHECK (true);

-- Tasks: Allow all operations
CREATE POLICY "open_tasks_all" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- Video tasks: Public read
CREATE POLICY "open_video_tasks_read" ON video_tasks FOR SELECT USING (true);

-- Promo codes: Public read
CREATE POLICY "open_promo_codes_read" ON promo_codes FOR SELECT USING (true);

-- Promo usage: Allow all operations
CREATE POLICY "open_promo_usage_all" ON promo_usage FOR ALL USING (true) WITH CHECK (true);

-- Leaderboard: Public read
CREATE POLICY "open_leaderboard_read" ON leaderboard FOR SELECT USING (true);

-- ============================================
-- STEP 3: Verify
-- ============================================
SELECT 'RLS policies fixed successfully!' AS status;
