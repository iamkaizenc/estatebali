-- DIAGNOSTIC: Check current state of users table
-- Run this FIRST to see what's wrong

-- 1. Check users table structure
SELECT 
  '=== USERS TABLE COLUMNS ===' AS info;

SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Check constraints on users table
SELECT 
  '=== CONSTRAINTS ON USERS TABLE ===' AS info;

SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  CASE 
    WHEN tc.constraint_type = 'FOREIGN KEY' THEN
      (SELECT ccu.table_name || '.' || ccu.column_name
       FROM information_schema.constraint_column_usage AS ccu
       WHERE ccu.constraint_name = tc.constraint_name)
    ELSE NULL
  END AS references
FROM information_schema.table_constraints AS tc
LEFT JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
AND tc.table_name = 'users'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 3. Check foreign keys that reference users(id)
SELECT 
  '=== FOREIGN KEYS REFERENCING USERS ===' AS info;

SELECT 
  tc.table_name AS referencing_table,
  tc.constraint_name,
  kcu.column_name AS referencing_column,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'users'
  AND ccu.column_name = 'id'
  AND tc.table_schema = 'public';

-- 4. Check if there's a foreign key ON users.id itself (this would be wrong!)
SELECT 
  '=== CHECKING FOR WRONG FK ON USERS.ID ===' AS info;

SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'users'
  AND kcu.column_name = 'id'
  AND tc.table_schema = 'public';

-- 5. Check primary key
SELECT 
  '=== PRIMARY KEY CHECK ===' AS info;

SELECT 
  tc.constraint_name,
  kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_name = 'users'
  AND tc.table_schema = 'public';

