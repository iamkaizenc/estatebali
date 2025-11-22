-- Fix Users Table - Ensure all required columns exist
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
    COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password for user authentication';
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
    COMMENT ON COLUMN users.verified IS 'Whether the user account is verified';
  END IF;
END $$;

-- 3. Ensure role column exists
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
    
    -- Add check constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'users_role_check'
    ) THEN
      ALTER TABLE users ADD CONSTRAINT users_role_check 
        CHECK (role IN ('owner', 'agent', 'customer'));
    END IF;
  END IF;
END $$;

-- 4. Ensure email index exists
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. Verify columns exist (this will show an error if something is wrong)
DO $$
DECLARE
  column_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO column_count
  FROM information_schema.columns
  WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name IN ('id', 'email', 'name', 'phone', 'avatar', 'role', 'password_hash', 'verified', 'created_at', 'updated_at');
  
  IF column_count < 10 THEN
    RAISE EXCEPTION 'Users table is missing required columns. Expected 10 columns, found %', column_count;
  END IF;
END $$;

-- Success message
SELECT 'Users table migration completed successfully' AS status;

