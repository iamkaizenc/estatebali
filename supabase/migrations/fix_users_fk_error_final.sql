-- ============================================================================
-- FINAL FIX: users_id_fkey Foreign Key Error
-- ============================================================================
-- Bu hata genellikle şu durumlardan kaynaklanır:
-- 1. users.id kolonunda yanlış bir foreign key constraint var
-- 2. Başka bir tabloda users.id'ye referans var ama insert sırasında sorun oluyor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: Drop ALL foreign key constraints that reference users(id)
-- ============================================================================
DO $$
DECLARE
  fk_record RECORD;
BEGIN
  RAISE NOTICE '=== STEP 1: Dropping foreign keys ===';
  
  -- Find and drop all foreign keys that reference users(id)
  FOR fk_record IN
    SELECT 
      tc.table_name,
      tc.constraint_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_name = 'users'
      AND ccu.column_name = 'id'
      AND tc.table_schema = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I CASCADE', 
      fk_record.table_name, 
      fk_record.constraint_name);
    RAISE NOTICE 'Dropped FK: % on table %', 
      fk_record.constraint_name, 
      fk_record.table_name;
  END LOOP;
  
  -- Also check if users.id itself has a foreign key (WRONG!)
  FOR fk_record IN
    SELECT 
      tc.constraint_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'users'
      AND kcu.column_name = 'id'
      AND tc.table_schema = 'public'
  LOOP
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT IF EXISTS %I CASCADE', 
      fk_record.constraint_name);
    RAISE NOTICE 'Dropped WRONG FK on users.id: %', fk_record.constraint_name;
  END LOOP;
  
  RAISE NOTICE '✅ All problematic foreign keys dropped';
END $$;

-- ============================================================================
-- STEP 2: Ensure users table exists and is correct
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '=== STEP 2: Ensuring users table structure ===';
  
  -- Create table if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      avatar TEXT,
      role VARCHAR(20) DEFAULT 'customer' NOT NULL,
      password_hash VARCHAR(255),
      verified BOOLEAN DEFAULT false NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    RAISE NOTICE '✅ Created users table';
  END IF;
END $$;

-- ============================================================================
-- STEP 3: Fix id column - MUST be PRIMARY KEY, NOT foreign key
-- ============================================================================
DO $$
DECLARE
  pk_name TEXT;
BEGIN
  RAISE NOTICE '=== STEP 3: Fixing id column ===';
  
  -- Ensure id column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'id'
  ) THEN
    ALTER TABLE users ADD COLUMN id UUID;
    UPDATE users SET id = uuid_generate_v4() WHERE id IS NULL;
    ALTER TABLE users 
      ALTER COLUMN id SET NOT NULL,
      ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    RAISE NOTICE '✅ Added id column';
  END IF;
  
  -- Drop any existing primary key
  SELECT constraint_name INTO pk_name
  FROM information_schema.table_constraints
  WHERE table_schema = 'public'
  AND table_name = 'users'
  AND constraint_type = 'PRIMARY KEY';
  
  IF pk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', pk_name);
    RAISE NOTICE '✅ Dropped existing PK: %', pk_name;
  END IF;
  
  -- Ensure id has default
  ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4();
  
  -- Fix NULL values
  UPDATE users SET id = uuid_generate_v4() WHERE id IS NULL;
  
  -- Make NOT NULL
  ALTER TABLE users ALTER COLUMN id SET NOT NULL;
  
  -- Add PRIMARY KEY
  ALTER TABLE users ADD PRIMARY KEY (id);
  RAISE NOTICE '✅ id is now PRIMARY KEY with DEFAULT uuid_generate_v4()';
END $$;

-- ============================================================================
-- STEP 4: Fix role column
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '=== STEP 4: Fixing role column ===';
  
  -- Drop role constraint
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  
  -- Handle user_type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'user_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users RENAME COLUMN user_type TO role;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE users DROP COLUMN user_type;
  END IF;
  
  -- Add role if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer';
  END IF;
  
  -- Fix invalid values
  UPDATE users SET role = 'customer' WHERE role IS NULL;
  UPDATE users SET role = 'customer' 
  WHERE role IS NOT NULL AND role NOT IN ('owner', 'agent', 'customer');
  
  -- Set defaults
  ALTER TABLE users 
    ALTER COLUMN role SET DEFAULT 'customer',
    ALTER COLUMN role SET NOT NULL;
  
  -- Add constraint
  ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('owner', 'agent', 'customer'));
  
  RAISE NOTICE '✅ role column fixed';
END $$;

-- ============================================================================
-- STEP 5: Fix other columns
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '=== STEP 5: Fixing other columns ===';
  
  -- password_hash
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
  END IF;
  
  -- verified
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'verified'
  ) THEN
    ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false NOT NULL;
  ELSE
    ALTER TABLE users 
      ALTER COLUMN verified SET DEFAULT false;
    UPDATE users SET verified = false WHERE verified IS NULL;
    ALTER TABLE users ALTER COLUMN verified SET NOT NULL;
  END IF;
  
  RAISE NOTICE '✅ Other columns fixed';
END $$;

-- ============================================================================
-- STEP 6: Recreate foreign keys (only for other tables referencing users)
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '=== STEP 6: Recreating foreign keys ===';
  
  -- favorites table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'favorites'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'favorites' AND column_name = 'user_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'favorites_user_id_fkey' AND table_schema = 'public'
    ) THEN
      ALTER TABLE favorites
      ADD CONSTRAINT favorites_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      RAISE NOTICE '✅ Recreated favorites_user_id_fkey';
    END IF;
  END IF;
  
  -- password_reset_tokens table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'password_reset_tokens'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'password_reset_tokens' AND column_name = 'user_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'password_reset_tokens_user_id_fkey' AND table_schema = 'public'
    ) THEN
      ALTER TABLE password_reset_tokens
      ADD CONSTRAINT password_reset_tokens_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      RAISE NOTICE '✅ Recreated password_reset_tokens_user_id_fkey';
    END IF;
  END IF;
  
  -- properties table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'properties'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'user_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'properties_user_id_fkey' AND table_schema = 'public'
    ) THEN
      ALTER TABLE properties
      ADD CONSTRAINT properties_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
      RAISE NOTICE '✅ Recreated properties_user_id_fkey';
    END IF;
  END IF;
END $$;

-- ============================================================================
-- STEP 7: Create indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT '=== FINAL VERIFICATION ===' AS info;

-- Show users table structure
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
ORDER BY ordinal_position;

-- Show constraints
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
AND table_name = 'users';

-- Show foreign keys referencing users
SELECT 
  tc.table_name AS referencing_table,
  tc.constraint_name,
  kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'users'
  AND ccu.column_name = 'id'
  AND tc.table_schema = 'public';

SELECT '✅✅✅ MIGRATION COMPLETE! ✅✅✅' AS status;
SELECT 'Try inserting a user now - it should work!' AS message;

