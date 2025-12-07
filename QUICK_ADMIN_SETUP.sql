-- ============================================
-- HIZLI ADMIN KURULUMU - TÜM ADIMLAR TEK SEFERDE
-- ============================================
-- Bu dosyayı Supabase SQL Editor'de çalıştırın
-- Adım 1: Tablo oluştur
-- Adım 2: Admin kullanıcı oluştur
-- Adım 3: Kontrol et

-- ============================================
-- ADIM 1: admin_users TABLOSUNU OLUŞTUR
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(active);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (Service role can access)
CREATE POLICY "Service role can read admin users"
  ON admin_users FOR SELECT USING (true);

CREATE POLICY "Service role can insert admin users"
  ON admin_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update admin users"
  ON admin_users FOR UPDATE USING (true);

CREATE POLICY "Service role can delete admin users"
  ON admin_users FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- ============================================
-- ADIM 2: ADMIN KULLANICI OLUŞTUR
-- ============================================
-- Email: admin@estatebali.app
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

-- ============================================
-- ADIM 3: KONTROL ET
-- ============================================

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
-- name: Admin User
-- role: admin
-- active: true
-- has_password: true
-- hash_length: 60
-- hash_format: $2b$10$BL/

-- ============================================
-- TAMAMLANDI! ✅
-- ============================================
-- Şimdi /admin/login sayfasına gidip giriş yapabilirsiniz:
-- Email: admin@estatebali.app
-- Password: admin123

