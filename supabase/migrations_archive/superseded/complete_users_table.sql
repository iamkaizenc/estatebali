-- Complete Users Table Migration
-- This migration ensures the users table has ALL required columns
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop and recreate users table with all required columns
-- WARNING: This will delete all existing data in the users table!
-- If you have important data, backup first!

DO $$ 
BEGIN
  -- Check if table exists and has data
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    -- Check if id column exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'id'
    ) THEN
      -- Drop table if id column is missing (table structure is incomplete)
      DROP TABLE IF EXISTS users CASCADE;
      
      -- Recreate table with correct structure
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        avatar TEXT,
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('owner', 'agent', 'customer')),
        password_hash VARCHAR(255),
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      
      RAISE NOTICE 'Users table recreated with all required columns';
    ELSE
      -- Table exists with id, just add missing columns
      -- Add password_hash if missing
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'password_hash'
      ) THEN
        ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
      END IF;
      
      -- Add verified if missing
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'verified'
      ) THEN
        ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
      END IF;
      
      -- Add role if missing
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'role'
      ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer';
      END IF;
      
      -- Ensure email index exists
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      
      RAISE NOTICE 'Users table updated with missing columns';
    END IF;
  ELSE
    -- Table doesn't exist, create it
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      avatar TEXT,
      role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('owner', 'agent', 'customer')),
      password_hash VARCHAR(255),
      verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    
    RAISE NOTICE 'Users table created';
  END IF;
END $$;

-- Verify table structure
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

