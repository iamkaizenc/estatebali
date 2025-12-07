-- Create Admin Users Table Migration
-- This migration creates the admin_users table for admin authentication
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not exists
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Create index on active status
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(active);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Only service role can read admin users
-- This ensures admin users are only accessible server-side
CREATE POLICY "Service role can read admin users"
  ON admin_users
  FOR SELECT
  USING (true);

-- Create RLS policy: Only service role can insert admin users
CREATE POLICY "Service role can insert admin users"
  ON admin_users
  FOR INSERT
  WITH CHECK (true);

-- Create RLS policy: Only service role can update admin users
CREATE POLICY "Service role can update admin users"
  ON admin_users
  FOR UPDATE
  USING (true);

-- Create RLS policy: Only service role can delete admin users
CREATE POLICY "Service role can delete admin users"
  ON admin_users
  FOR DELETE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Note: Default admin user should be created manually with a proper password hash
-- Example (REPLACE WITH YOUR OWN PASSWORD HASH):
-- INSERT INTO admin_users (email, password_hash, name, role, active)
-- VALUES (
--   'admin@estatebali.app',
--   '$2a$10$YOUR_BCRYPT_HASH_HERE', -- Generate using: https://bcrypt-generator.com/
--   'Admin User',
--   'admin',
--   true
-- ) ON CONFLICT (email) DO NOTHING;

