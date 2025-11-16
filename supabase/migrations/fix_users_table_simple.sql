-- Fix Users Table - Simple Version
-- Copy and paste this ENTIRE content into Supabase SQL Editor

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. Ensure users table exists with id column (primary key)
DO $$ 
BEGIN
  -- Check if users table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    -- Create users table if it doesn't exist
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      avatar TEXT,
      role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('owner', 'agent', 'customer')),
      verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Table exists, check if id column exists
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'users' 
      AND column_name = 'id'
    ) THEN
      -- Add id column as primary key (this might fail if there's data, but we'll try)
      ALTER TABLE users ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4();
    END IF;
  END IF;
END $$;

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
  END IF;
END $$;

-- 2. Ensure verified column exists
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
  END IF;
END $$;

-- 3. Ensure role column exists (usually already exists, but just in case)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer';
  END IF;
END $$;

-- 4. Ensure email index exists
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Success message
SELECT 'Users table migration completed successfully' AS status;

