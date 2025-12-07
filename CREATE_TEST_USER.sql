-- ============================================
-- TEST KULLANICI OLUŞTURMA SCRIPTİ
-- ============================================
-- Bu script hem admin hem de regular user oluşturur
-- Password: test123 (her ikisi için de aynı)

-- ============================================
-- 1. ADMIN USER OLUŞTUR
-- ============================================
-- Email: admin@estatebali.app
-- Password: admin123
-- Hash: $2b$10$BL/WfWT7VDFO4zbCPfBbhOT5a41MnnXUHfU72uoG2yB7fgYmUlwi2

INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  '$2b$10$BL/WfWT7VDFO4zbCPfBbhOT5a41MnnXUHfU72uoG2yB7fgYmUlwi2',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true,
  role = EXCLUDED.role,
  updated_at = NOW();

-- ============================================
-- 2. REGULAR USER OLUŞTUR
-- ============================================
-- Email: test@estatebali.app
-- Password: test123
-- Hash: $2b$10$8pO87mvbuRtQCW2hORRVy.QBEYJC8vw3ch1n26GrFtKezBOL7yN5.

INSERT INTO users (email, name, password_hash, role, verified, phone)
VALUES (
  'test@estatebali.app',
  'Test User',
  '$2b$10$8pO87mvbuRtQCW2hORRVy.QBEYJC8vw3ch1n26GrFtKezBOL7yN5.',
  'customer',
  true,
  '+6281234567890'
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  verified = true,
  updated_at = NOW();

-- ============================================
-- 3. KONTROL ET
-- ============================================
-- Oluşturulan kullanıcıları göster

SELECT 
  'admin_users' as table_name,
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_preview,
  created_at
FROM admin_users
WHERE email IN ('admin@estatebali.app')
UNION ALL
SELECT 
  'users' as table_name,
  email,
  name,
  role,
  verified as active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_preview,
  created_at
FROM users
WHERE email IN ('test@estatebali.app')
ORDER BY table_name, email;

-- ============================================
-- TEST CREDENTIALS
-- ============================================
-- Admin:
--   Email: admin@estatebali.app
--   Password: admin123
--
-- Regular User:
--   Email: test@estatebali.app
--   Password: test123

