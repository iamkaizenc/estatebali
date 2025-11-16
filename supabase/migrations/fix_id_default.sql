-- Fix ID Column Default Value
-- The id column exists but DEFAULT value is not working
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fix id column: Ensure it has DEFAULT value
DO $$ 
BEGIN
  -- Check if id column exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'users' 
    AND column_name = 'id'
  ) THEN
    -- Check current default
    SELECT column_default INTO current_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'id';
    
    -- If default is not set or incorrect, fix it
    IF current_default IS NULL OR current_default NOT LIKE '%uuid_generate_v4%' THEN
      -- Set default value
      ALTER TABLE users 
        ALTER COLUMN id SET DEFAULT uuid_generate_v4();
      
      RAISE NOTICE 'Set DEFAULT uuid_generate_v4() for id column';
    ELSE
      RAISE NOTICE 'id column already has correct DEFAULT value';
    END IF;
    
    -- Ensure it's NOT NULL (should already be, but just in case)
    ALTER TABLE users 
      ALTER COLUMN id SET NOT NULL;
      
  ELSE
    RAISE EXCEPTION 'id column does not exist. Run ensure_users_id_column.sql first.';
  END IF;
END $$;

-- Verify the fix
SELECT 
  column_name,
  column_default,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name = 'id';

-- Success message
SELECT 'id column DEFAULT value fixed successfully!' AS status;

