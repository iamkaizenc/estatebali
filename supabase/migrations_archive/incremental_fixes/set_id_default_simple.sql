-- Set ID Column Default Value - Simple Version
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Simply set the DEFAULT value for id column
ALTER TABLE users 
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Verify it worked
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
SELECT 'id column DEFAULT value set to uuid_generate_v4()' AS status;

