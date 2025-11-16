-- Check Users Table Structure
-- Run this to see the current state of the users table

-- Check if table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    ) THEN '✅ users table EXISTS'
    ELSE '❌ users table DOES NOT EXIST'
  END as table_status;

-- Check all columns
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name = 'id' THEN '🔑 PRIMARY KEY?'
    ELSE ''
  END as notes
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check primary key
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

-- Check if id column specifically exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'id'
    ) THEN '✅ id column EXISTS'
    ELSE '❌ id column MISSING - Run ensure_users_id_column.sql'
  END as id_column_check;

