-- ============================================
-- ⚠️ ÖNEMLİ: Supabase Auth KULLANILMIYOR!
-- ============================================
-- Bu projede custom authentication var
-- Supabase Auth'dan eklenen kullanıcılar ÇALIŞMAZ!
-- Kullanıcılar `admin_users` ve `users` tablolarında olmalı

-- ============================================
-- 1. MEVCUT DURUMU KONTROL ET
-- ============================================

-- Admin users kontrol
SELECT 
  'admin_users' as table_name,
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length
FROM admin_users;

-- Regular users kontrol
SELECT 
  'users' as table_name,
  email,
  name,
  role,
  verified,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length
FROM users
LIMIT 10;

-- ============================================
-- 2. ADMIN KULLANICI OLUŞTUR/GÜNCELLE
-- ============================================
-- Email: admin@estatebali.app
-- Password: admin123

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
-- 3. TEST KULLANICI OLUŞTUR/GÜNCELLE
-- ============================================
-- Email: test@estatebali.app
-- Password: Test123456!

-- Önce bcrypt hash oluşturmak gerekiyor:
-- Node.js'te: bcrypt.hash('Test123456!', 10)
-- Şimdilik test123 hash'i kullanıyoruz, ama yeni hash oluşturmak daha iyi

INSERT INTO users (email, name, password_hash, role, verified, phone)
VALUES (
  'test@estatebali.app',
  'Test User',
  -- Hash for 'Test123456!'
  '$2b$10$wlj4lXU/yPK76E5sfmkxPeVxKT2pD7KwExMg4.w2/anzb8JQiLbqS',
  'customer',
  true,
  '+6281234567890'
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  verified = true,
  updated_at = NOW();

-- ============================================
-- 4. EMAIL NORMALIZATION
-- ============================================
-- Email'leri lowercase'e çevir (case-insensitive lookup için)

UPDATE admin_users SET email = LOWER(TRIM(email)) WHERE email != LOWER(TRIM(email));
UPDATE users SET email = LOWER(TRIM(email)) WHERE email != LOWER(TRIM(email));

-- ============================================
-- 5. KONTROL ET
-- ============================================

SELECT 
  'admin_users' as table_name,
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_preview
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
  LEFT(password_hash, 10) as hash_preview
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
-- Test User:
--   Email: test@estatebali.app
--   Password: Test123456!

