-- Fix RLS for SAH Mini App
-- Run this in Supabase SQL Editor

-- Drop old policies (if exist)
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can read own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can insert own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can read own boosters" ON boosters;
DROP POLICY IF EXISTS "Users can insert/update own boosters" ON boosters;
DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert/update own tasks" ON tasks;

-- New policies: Allow all operations (Telegram users identified by their Telegram ID)
CREATE POLICY "public_read_users" ON users FOR SELECT USING (true);
CREATE POLICY "public_insert_users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_users" ON users FOR UPDATE USING (true);

CREATE POLICY "public_read_inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "public_insert_inventory" ON inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_inventory" ON inventory FOR UPDATE USING (true);
CREATE POLICY "public_delete_inventory" ON inventory FOR DELETE USING (true);

CREATE POLICY "public_read_boosters" ON boosters FOR SELECT USING (true);
CREATE POLICY "public_insert_boosters" ON boosters FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_boosters" ON boosters FOR UPDATE USING (true);
CREATE POLICY "public_delete_boosters" ON boosters FOR DELETE USING (true);

CREATE POLICY "public_read_tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "public_insert_tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "public_delete_tasks" ON tasks FOR DELETE USING (true);

-- Video tasks and promo codes already have public read
-- Promo usage
DROP POLICY IF EXISTS "Users can insert promo usage" ON promo_usage;
CREATE POLICY "public_read_promo_usage" ON promo_usage FOR SELECT USING (true);
CREATE POLICY "public_insert_promo_usage" ON promo_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "public_delete_promo_usage" ON promo_usage FOR DELETE USING (true);

-- Confirm
SELECT 'RLS Fixed!' as status;