-- SAH Music Studio - User Admin Features
-- Run this in Supabase SQL Editor

-- 1. Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ;

-- 2. Fix admin_tasks policy (for task creation)
DROP POLICY IF EXISTS "open_admin_tasks_all" ON admin_tasks;
CREATE POLICY "open_admin_tasks_all" ON admin_tasks 
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Fix promo_codes policy (for promo creation)
DROP POLICY IF EXISTS "open_promo_codes_read" ON promo_codes;
DROP POLICY IF EXISTS "open_promo_codes_all" ON promo_codes;
CREATE POLICY "open_promo_codes_all" ON promo_codes 
  FOR ALL USING (true) WITH CHECK (true);
