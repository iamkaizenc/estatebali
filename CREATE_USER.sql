-- Create Admin User for flaneur@gmail.com
-- Run this in Supabase SQL Editor

-- First, check if user exists
SELECT email, name, role, active FROM admin_users WHERE email = 'flaneur@gmail.com';
SELECT email, name, role FROM users WHERE email = 'flaneur@gmail.com';

-- Create admin user with password
-- Password: (you need to provide the actual password)
-- Replace 'YOUR_PASSWORD_HERE' with your actual password

-- Step 1: Generate password hash
-- Use this command in terminal:
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_PASSWORD_HERE', 10));"
-- Or use online: https://bcrypt-generator.com/

-- Step 2: Insert admin user (replace PASSWORD_HASH with the hash from step 1)
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'flaneur@gmail.com',
  'Flaneur User',
  'PASSWORD_HASH_HERE', -- Replace with actual bcrypt hash
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true;

-- Or create as regular user:
INSERT INTO users (email, name, password_hash, role, verified)
VALUES (
  'flaneur@gmail.com',
  'Flaneur User',
  'PASSWORD_HASH_HERE', -- Replace with actual bcrypt hash
  'customer',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  verified = true;

