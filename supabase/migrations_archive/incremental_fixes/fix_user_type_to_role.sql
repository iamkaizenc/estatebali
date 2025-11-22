-- Fix user_type to role migration
-- This migration handles both cases: user_type exists OR role exists
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Drop existing role constraint if it exists (to fix any mismatched constraints)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_role_check' AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
    RAISE NOTICE '✅ Dropped existing users_role_check constraint';
  END IF;
END $$;

-- 2. Check if user_type column exists and role doesn't - rename it
DO $$
BEGIN
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
    -- user_type exists, role doesn't - rename user_type to role
    ALTER TABLE users RENAME COLUMN user_type TO role;
    RAISE NOTICE '✅ Renamed user_type column to role';
    
  ELSIF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'user_type'
  ) AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'role'
  ) THEN
    -- Both exist - drop user_type (keep role)
    ALTER TABLE users DROP COLUMN user_type;
    RAISE NOTICE '✅ Dropped redundant user_type column (role already exists)';
    
  ELSIF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'role'
  ) THEN
    -- Neither exists - add role column
    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer';
    RAISE NOTICE '✅ Added role column';
  ELSE
    RAISE NOTICE '✅ role column already exists';
  END IF;
END $$;

-- 3. Fix any invalid role values BEFORE adding constraint
-- This is critical: we must fix data before adding constraint
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  -- First, temporarily make role nullable if it's NOT NULL (to fix invalid values)
  -- Check if role column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role'
  ) THEN
    -- Drop existing constraint first (if exists) to allow data updates
    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'users_role_check' AND conrelid = 'users'::regclass
    ) THEN
      ALTER TABLE users DROP CONSTRAINT users_role_check;
      RAISE NOTICE '✅ Dropped existing constraint to allow data fixes';
    END IF;
    
    -- Update any NULL roles to 'customer'
    UPDATE users SET role = 'customer' WHERE role IS NULL;
    GET DIAGNOSTICS invalid_count = ROW_COUNT;
    IF invalid_count > 0 THEN
      RAISE NOTICE '✅ Fixed % NULL role values to customer', invalid_count;
    END IF;
    
    -- Check for invalid role values and fix them
    -- First, let's see what invalid values exist
    SELECT COUNT(*) INTO invalid_count
    FROM users
    WHERE role IS NOT NULL 
      AND role NOT IN ('owner', 'agent', 'customer');
    
    IF invalid_count > 0 THEN
      -- Update any invalid role values to 'customer'
      UPDATE users 
      SET role = 'customer' 
      WHERE role IS NOT NULL 
        AND role NOT IN ('owner', 'agent', 'customer');
      RAISE NOTICE '✅ Fixed % invalid role values to customer', invalid_count;
    END IF;
    
    -- Ensure role has a default value for new rows
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'customer';
    
    -- Make sure role is NOT NULL
    ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    
    RAISE NOTICE '✅ All role values are now valid (owner, agent, or customer)';
  END IF;
END $$;

-- 4. Add correct CHECK constraint (after data is fixed)
DO $$
BEGIN
  -- Drop if exists (should already be dropped, but just in case)
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_role_check' AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
    RAISE NOTICE '✅ Dropped existing constraint';
  END IF;
  
  -- Verify all data is valid before adding constraint
  IF EXISTS (
    SELECT 1 FROM users
    WHERE role IS NULL OR role NOT IN ('owner', 'agent', 'customer')
  ) THEN
    RAISE EXCEPTION 'Cannot add constraint: Invalid role values still exist. Please fix data first.';
  END IF;
  
  -- Add correct constraint
  ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('owner', 'agent', 'customer'));
  RAISE NOTICE '✅ Added correct CHECK constraint: role IN (owner, agent, customer)';
END $$;

-- 5. Ensure password_hash column exists
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
    RAISE NOTICE '✅ Added password_hash column';
  ELSE
    RAISE NOTICE '✅ password_hash column already exists';
  END IF;
END $$;

-- 6. Ensure verified column exists with proper default
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'verified'
  ) THEN
    -- Add verified column with default
    ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ Added verified column with DEFAULT false';
  ELSE
    -- Column exists, ensure it has a default value
    ALTER TABLE users ALTER COLUMN verified SET DEFAULT false;
    
    -- Update any NULL values to false
    UPDATE users SET verified = false WHERE verified IS NULL;
    
    -- Make sure it's NOT NULL if it isn't already
    ALTER TABLE users ALTER COLUMN verified SET NOT NULL;
    
    RAISE NOTICE '✅ verified column exists, ensured DEFAULT false and NOT NULL';
  END IF;
END $$;

-- 7. Ensure id column exists with proper default
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'id'
  ) THEN
    -- Add id column
    ALTER TABLE users ADD COLUMN id UUID;
    
    -- Update existing rows
    UPDATE users SET id = uuid_generate_v4() WHERE id IS NULL;
    
    -- Make it NOT NULL with default
    ALTER TABLE users 
      ALTER COLUMN id SET NOT NULL,
      ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    
    -- Add primary key if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conrelid = 'users'::regclass AND contype = 'p'
    ) THEN
      ALTER TABLE users ADD PRIMARY KEY (id);
    END IF;
    
    RAISE NOTICE '✅ Added id column with default';
  ELSE
    -- Ensure default is set
    ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    RAISE NOTICE '✅ id column exists, ensured DEFAULT value';
  END IF;
END $$;

-- 8. Ensure email index exists
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Final verification: Show current columns
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
ORDER BY ordinal_position;

-- Success message
SELECT '✅ Users table migration completed successfully! user_type → role conversion done.' AS status;

