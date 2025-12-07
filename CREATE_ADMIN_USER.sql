-- ============================================
-- Admin Kullanıcı Oluşturma Script
-- ============================================
-- Bu script'i Supabase SQL Editor'de çalıştırın
-- Şifre: admin123

-- 1. ÖNCE TABLOYU OLUŞTUR (eğer yoksa)
-- supabase/migrations/create_admin_users_table.sql dosyasını çalıştırın

-- 2. ADMIN KULLANICI OLUŞTUR
-- Şifre: admin123
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
  role = EXCLUDED.role;

-- 3. KONTROL ET
SELECT 
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_format,
  created_at
FROM admin_users
WHERE email = 'admin@estatebali.app';

-- Beklenen Sonuç:
-- email: admin@estatebali.app
-- has_password: true
-- hash_length: 60
-- hash_format: $2b$10$BL/

