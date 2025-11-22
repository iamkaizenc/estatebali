-- Verify Users Table Structure
-- Run this to check if all required columns exist

SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name = 'id' THEN '✅ PRIMARY KEY'
    WHEN column_name IN ('email', 'name') THEN '✅ REQUIRED'
    WHEN column_name IN ('password_hash', 'verified', 'role') THEN '✅ NEEDED'
    ELSE 'ℹ️ OPTIONAL'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check for primary key constraint
SELECT 
  tc.constraint_name,
  kcu.column_name,
  tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'users'
AND tc.constraint_type = 'PRIMARY KEY';

-- Expected columns checklist
SELECT 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'id'
  ) THEN '✅ id column exists' ELSE '❌ id column MISSING' END as id_check,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'password_hash'
  ) THEN '✅ password_hash column exists' ELSE '❌ password_hash column MISSING' END as password_hash_check,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'verified'
  ) THEN '✅ verified column exists' ELSE '❌ verified column MISSING' END as verified_check,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN '✅ role column exists' ELSE '❌ role column MISSING' END as role_check;

