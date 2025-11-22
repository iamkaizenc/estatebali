-- Add password_hash and verified columns to users table if they don't exist
-- Run this in Supabase SQL Editor

-- Check if password_hash column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  END IF;
END $$;

-- Check if verified column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'verified'
  ) THEN
    ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
  END IF;
END $$;

