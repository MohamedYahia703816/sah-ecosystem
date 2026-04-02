-- SAH Music Studio - Promo Codes for Trial
-- Run this in Supabase SQL Editor to create 8 promo codes

INSERT INTO promo_codes (code, type, reward_value, max_uses, is_active, expires_at) VALUES
  ('TETOS5000', 'fixed_reward', 5000, 100, true, NOW() + INTERVAL '30 days'),
  ('MOOOKA5000', 'fixed_reward', 5000, 100, true, NOW() + INTERVAL '30 days'),
  ('TETOS3000', 'fixed_reward', 3000, 100, true, NOW() + INTERVAL '30 days'),
  ('MOOOKA3000', 'fixed_reward', 3000, 100, true, NOW() + INTERVAL '30 days'),
  ('TETOS2000', 'fixed_reward', 2000, 100, true, NOW() + INTERVAL '30 days'),
  ('MOOOKA2000', 'fixed_reward', 2000, 100, true, NOW() + INTERVAL '30 days'),
  ('TETOS1000', 'fixed_reward', 1000, 100, true, NOW() + INTERVAL '30 days'),
  ('MOOOKA1000', 'fixed_reward', 1000, 100, true, NOW() + INTERVAL '30 days')
ON CONFLICT (code) DO UPDATE SET
  reward_value = EXCLUDED.reward_value,
  max_uses = EXCLUDED.max_uses,
  is_active = EXCLUDED.is_active,
  expires_at = EXCLUDED.expires_at;
