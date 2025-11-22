-- Fix Users Table - Add Missing Columns
-- This migration adds password_hash, verified, and handles user_type/role
-- Run this in Supabase SQL Editor

-- 1. Add password_hash column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users' 
    AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
    RAISE NOTICE 'Added password_hash column';
  END IF;
END $$;

-- 2. Add verified column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users' 
    AND column_name = 'verified'
  ) THEN
    ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added verified column';
  END IF;
END $$;

-- 3. Handle role/user_type column
DO $$ 
BEGIN
  -- Check if user_type exists but role doesn't
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users' 
    AND column_name = 'user_type'
  ) AND NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    -- Rename user_type to role
    ALTER TABLE users RENAME COLUMN user_type TO role;
    RAISE NOTICE 'Renamed user_type to role';
  END IF;
  
  -- If role doesn't exist at all, add it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer';
    RAISE NOTICE 'Added role column';
  END IF;
END $$;

-- 4. Ensure email index exists
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. Verify all required columns exist
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Success message
SELECT 'Users table migration completed successfully!' AS status;

