-- Complete RLS fix for SAH Mini App
-- Run this in Supabase SQL Editor

-- 1. Drop ALL existing policies on users table
DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN SELECT polname FROM pg_policy WHERE polrelid = 'users'::regclass LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || pol_name || ' ON users';
    END LOOP;
END $$;

DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN SELECT polname FROM pg_policy WHERE polrelid = 'inventory'::regclass LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || pol_name || ' ON inventory';
    END LOOP;
END $$;

DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN SELECT polname FROM pg_policy WHERE polrelid = 'boosters'::regclass LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || pol_name || ' ON boosters';
    END LOOP;
END $$;

DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN SELECT polname FROM pg_policy WHERE polrelid = 'tasks'::regclass LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || pol_name || ' ON tasks';
    END LOOP;
END $$;

DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN SELECT polname FROM pg_policy WHERE polrelid = 'promo_usage'::regclass LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || pol_name || ' ON promo_usage';
    END LOOP;
END $$;

-- 2. Create permissive policies
CREATE POLICY "allow_all_users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_boosters" ON boosters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_promo_usage" ON promo_usage FOR ALL USING (true) WITH CHECK (true);

-- 3. Grant execute on functions to anon role
GRANT EXECUTE ON FUNCTION upsert_user(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_promo_usage(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_user_balance(TEXT, BIGINT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_passive_earnings(TEXT, TIMESTAMPTZ) TO anon, authenticated;

-- 4. Grant table permissions
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON inventory TO anon, authenticated;
GRANT ALL ON boosters TO anon, authenticated;
GRANT ALL ON tasks TO anon, authenticated;
GRANT ALL ON video_tasks TO anon, authenticated;
GRANT ALL ON promo_codes TO anon, authenticated;
GRANT ALL ON promo_usage TO anon, authenticated;
GRANT ALL ON leaderboard TO anon, authenticated;

-- 5. Test: Check if policies exist
SELECT 'Policies created!' as status, 
       (SELECT count(*) FROM pg_policies WHERE schemaname = 'public') as policy_count;