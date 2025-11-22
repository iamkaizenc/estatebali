-- Ensure Users Table Has ID Column
-- This migration GUARANTEES the id column exists
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if id column exists, if not add it
DO $$ 
BEGIN
  -- Check if users table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    -- Check if id column exists
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'users' 
      AND column_name = 'id'
    ) THEN
      -- Add id column
      ALTER TABLE users ADD COLUMN id UUID;
      
      -- Generate UUIDs for existing rows
      UPDATE users SET id = uuid_generate_v4() WHERE id IS NULL;
      
      -- Make it NOT NULL and set as PRIMARY KEY
      ALTER TABLE users 
        ALTER COLUMN id SET NOT NULL,
        ALTER COLUMN id SET DEFAULT uuid_generate_v4();
      
      -- Drop existing primary key if exists
      DO $$
      DECLARE
        pk_constraint_name TEXT;
      BEGIN
        SELECT constraint_name INTO pk_constraint_name
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND constraint_type = 'PRIMARY KEY'
        LIMIT 1;
        
        IF pk_constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', pk_constraint_name);
        END IF;
      END $$;
      
      -- Add primary key constraint
      ALTER TABLE users ADD PRIMARY KEY (id);
      
      RAISE NOTICE 'Added id column and set as PRIMARY KEY';
    ELSE
      RAISE NOTICE 'id column already exists';
    END IF;
  ELSE
    RAISE EXCEPTION 'Users table does not exist. Please create it first.';
  END IF;
END $$;

-- Verify id column exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'id'
    ) THEN '✅ id column EXISTS'
    ELSE '❌ id column MISSING'
  END as id_column_status;

-- Show table structure
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

