-- SAH Music Studio - Admin Tables Migration
-- Run this in Supabase SQL Editor

-- Admin settings table (stores admin code)
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert admin code
INSERT INTO admin_settings (key, value) 
VALUES ('admin_code', '36x36x36')
ON CONFLICT (key) DO NOTHING;

-- Admin tasks table (configurable tasks)
CREATE TABLE IF NOT EXISTS admin_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  reward INT NOT NULL DEFAULT 50,
  verify_seconds INT NOT NULL DEFAULT 30,
  period TEXT NOT NULL DEFAULT 'daily',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default video tasks
INSERT INTO admin_tasks (task_type, title, url, reward, verify_seconds, period, sort_order) VALUES
  ('video', 'Morning Session - Watch & Earn', 'https://youtube.com/watch?v=PLACEHOLDER_AM', 50, 30, 'AM', 1),
  ('video', 'Evening Session - Watch & Earn', 'https://youtube.com/watch?v=PLACEHOLDER_PM', 50, 30, 'PM', 2)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;

-- Admin settings: public read (code is checked in app)
CREATE POLICY "open_admin_settings_read" ON admin_settings FOR SELECT USING (true);

-- Admin tasks: public read, all operations allowed
CREATE POLICY "open_admin_tasks_all" ON admin_tasks FOR ALL USING (true) WITH CHECK (true);

-- Index
CREATE INDEX idx_admin_tasks_active ON admin_tasks(is_active, sort_order);
