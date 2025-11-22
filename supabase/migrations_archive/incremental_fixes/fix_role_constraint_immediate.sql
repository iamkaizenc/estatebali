-- IMMEDIATE FIX: Drop and recreate role constraint
-- Run this FIRST if you're getting "users_role_check" constraint errors
-- Copy and paste this ENTIRE content into Supabase SQL Editor

-- Step 1: Drop existing constraint
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

-- Step 2: Fix all invalid role values
DO $$
DECLARE
  fixed_count INTEGER;
BEGIN
  -- Fix NULL values
  UPDATE users SET role = 'customer' WHERE role IS NULL;
  GET DIAGNOSTICS fixed_count = ROW_COUNT;
  IF fixed_count > 0 THEN
    RAISE NOTICE '✅ Fixed % NULL roles to customer', fixed_count;
  END IF;
  
  -- Fix invalid values (anything not in owner, agent, customer)
  UPDATE users 
  SET role = 'customer' 
  WHERE role IS NOT NULL 
    AND role NOT IN ('owner', 'agent', 'customer');
  GET DIAGNOSTICS fixed_count = ROW_COUNT;
  IF fixed_count > 0 THEN
    RAISE NOTICE '✅ Fixed % invalid roles to customer', fixed_count;
  END IF;
  
  -- Ensure default
  ALTER TABLE users ALTER COLUMN role SET DEFAULT 'customer';
  
  -- Ensure NOT NULL
  ALTER TABLE users ALTER COLUMN role SET NOT NULL;
  
  RAISE NOTICE '✅ All role values are now valid';
END $$;

-- Step 3: Add constraint back
DO $$
BEGIN
  -- Double check: drop if still exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_role_check' AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
  END IF;
  
  -- Verify no invalid data exists
  IF EXISTS (
    SELECT 1 FROM users
    WHERE role IS NULL OR role NOT IN ('owner', 'agent', 'customer')
  ) THEN
    RAISE EXCEPTION 'ERROR: Invalid role values still exist. Cannot add constraint.';
  END IF;
  
  -- Add constraint
  ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('owner', 'agent', 'customer'));
  
  RAISE NOTICE '✅ Successfully added users_role_check constraint';
END $$;

-- Verify
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name = 'role';

-- Show constraint
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass
AND conname = 'users_role_check';

SELECT '✅ Role constraint fixed successfully!' AS status;

