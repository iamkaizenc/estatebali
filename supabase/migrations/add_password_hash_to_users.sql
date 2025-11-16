-- Add password_hash column to users table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Check if column exists, if not add it
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

