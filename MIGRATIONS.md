# Database Migrations Guide

**Estate Bali - Supabase Migration Management**

This document provides a comprehensive guide to managing database migrations for the Estate Bali project.

## Table of Contents

1. [Current State](#current-state)
2. [Migration Consolidation Strategy](#migration-consolidation-strategy)
3. [Recommended Migration Order](#recommended-migration-order)
4. [How to Apply Migrations](#how-to-apply-migrations)
5. [Migration File Reference](#migration-file-reference)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Current State

### Migration Files Analysis

**Total Files:** 19 migration files (~2,760 lines)
**Status:** Significant duplication and overlap
**Issue:** Multiple incremental fixes for the same problems

### File Categories

| Category | Count | Size | Status |
|----------|-------|------|--------|
| Diagnostic/Verification | 3 | ~6.3K | ❌ Not actual migrations (read-only queries) |
| Incremental User Table Fixes | 8 | ~26K | ⚠️ Superseded by comprehensive fixes |
| Comprehensive User Table Fixes | 3 | ~31K | ✅ Keep 1 (fix_users_table_complete.sql) |
| Feature Additions | 2 | ~12.5K | ✅ Keep both (password reset + combined) |
| Properties Table | 2 | ~11K | ✅ Keep add_missing_columns.sql |

---

## Migration Consolidation Strategy

### Goals

1. **Reduce complexity**: 19 files → 6 core migrations
2. **Eliminate duplication**: Remove superseded incremental fixes
3. **Improve maintainability**: Clear, documented migration order
4. **Preserve safety**: Keep idempotent, non-destructive migrations

### Files to Keep (Core Migrations)

These 6 files represent the essential migrations needed for the database:

```
supabase/migrations/
├── fix_users_table_complete.sql         # ✅ KEEP - Comprehensive users table fix
├── add_missing_columns.sql               # ✅ KEEP - Properties table enhancements
├── create_password_reset_tokens.sql      # ✅ KEEP - Password reset feature
├── combined_migrations.sql               # ⚠️ OPTIONAL - All-in-one (can split)
├── add_user_id_to_properties.sql         # ⚠️ OPTIONAL - RLS policies (if not in add_missing_columns)
└── complete_users_table.sql              # ⚠️ BACKUP ONLY - Destructive (drops table)
```

### Files to Archive

These 13 files can be safely archived as they're superseded or diagnostic:

**Diagnostic Files (3):**
```
migrations_archive/diagnostic/
├── check_users_table.sql
├── diagnose_users_table.sql
└── verify_users_table.sql
```

**Incremental Fixes (8):**
```
migrations_archive/incremental_fixes/
├── add_password_hash_to_users.sql
├── ensure_users_id_column.sql
├── fix_id_default.sql
├── set_id_default_simple.sql
├── fix_users_table.sql
├── fix_users_table_columns.sql
├── fix_role_constraint_immediate.sql
└── fix_user_type_to_role.sql
```

**Superseded Comprehensive (2):**
```
migrations_archive/superseded/
├── fix_users_fk_error_final.sql         # Superseded by fix_users_table_complete.sql
└── complete_users_table.sql             # Destructive - backup only
```

---

## Recommended Migration Order

### For Fresh Database Setup

If setting up a new Supabase project from scratch:

```sql
-- 1. Users Table (Comprehensive Fix)
-- File: fix_users_table_complete.sql
-- Creates/fixes users table with all columns, constraints, and FKs
-- Duration: ~2-5 seconds
-- Dependencies: None

-- 2. Properties Table Enhancements
-- File: add_missing_columns.sql
-- Adds 18+ columns to properties table (featured, user_id, verified, etc.)
-- Duration: ~1-3 seconds
-- Dependencies: Users table must exist (for user_id FK)

-- 3. Password Reset Feature
-- File: create_password_reset_tokens.sql
-- Creates password_reset_tokens table with RLS policies
-- Duration: ~1 second
-- Dependencies: Users table must exist (for user_id FK)

-- 4. (Optional) Combined Features
-- File: combined_migrations.sql
-- All-in-one migration (password_hash, password_reset, storage)
-- Duration: ~3-5 seconds
-- Dependencies: Users table must exist
-- Note: May overlap with files 2-3, check before running
```

### For Existing Database

If you already have a database with some migrations applied:

1. **Check Current State:**
   ```sql
   -- Run in Supabase SQL Editor

   -- Check users table structure
   SELECT column_name, data_type, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_name = 'users'
   ORDER BY ordinal_position;

   -- Check properties table columns
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'properties'
   ORDER BY ordinal_position;

   -- Check if password_reset_tokens exists
   SELECT EXISTS (
     SELECT 1 FROM information_schema.tables
     WHERE table_name = 'password_reset_tokens'
   );
   ```

2. **Apply Missing Migrations:**
   - If users table is incomplete → Run `fix_users_table_complete.sql`
   - If properties table lacks columns → Run `add_missing_columns.sql`
   - If password reset not set up → Run `create_password_reset_tokens.sql`

---

## How to Apply Migrations

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard:**
   - Navigate to your project: https://supabase.com/dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Load Migration File:**
   - Click "+ New query"
   - Copy the contents of the migration file
   - Paste into the SQL editor

3. **Review the Migration:**
   - Read the comments to understand what it does
   - Check for any warnings or prerequisites

4. **Execute:**
   - Click "Run" button
   - Wait for completion
   - Check for success messages or errors

5. **Verify:**
   - Run verification queries (see Troubleshooting section)
   - Check that tables/columns were created

### Method 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Or apply specific migration
supabase db execute -f supabase/migrations/fix_users_table_complete.sql
```

### Method 3: Direct PostgreSQL Connection

```bash
# Get connection string from Supabase Dashboard > Settings > Database
# Connection string format:
# postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Apply migration
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" \
  -f supabase/migrations/fix_users_table_complete.sql
```

---

## Migration File Reference

### 1. fix_users_table_complete.sql

**Purpose:** Comprehensive fix for users table with all required columns

**What it does:**
- Creates users table if it doesn't exist
- Adds/fixes id column (UUID primary key with default)
- Adds/fixes password_hash column
- Adds/fixes verified column (BOOLEAN)
- Adds/fixes role column with CHECK constraint
- Migrates user_type → role if needed
- Fixes foreign key constraints on related tables
- Non-destructive (preserves existing data)

**Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'customer' NOT NULL,  -- CHECK: customer, agent, admin, super_admin
  password_hash VARCHAR(255),
  verified BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Duration:** ~2-5 seconds
**Safety:** ✅ Idempotent, non-destructive
**Dependencies:** None

---

### 2. add_missing_columns.sql

**Purpose:** Add missing columns to properties table for rich property data

**What it does:**
- Adds featured BOOLEAN (for highlighting properties)
- Adds user_id UUID (owner reference with FK to users)
- Adds verified BOOLEAN (admin verification)
- Adds available BOOLEAN (availability status)
- Adds views INTEGER (view counter)
- Adds favorites INTEGER (favorite counter)
- Adds images TEXT[] (array of image URLs)
- Adds videos TEXT[] (array of video URLs)
- Adds short_term_booking BOOLEAN
- Adds virtual_tour TEXT (360° tour URL)
- Adds features TEXT[] (property features)
- Adds price_per_month DECIMAL (rental price)
- Adds price_per_sqm DECIMAL (price per square meter)
- Adds latitude DECIMAL, longitude DECIMAL (geolocation)
- Adds year_built INTEGER
- Adds floors INTEGER
- Adds contact_whatsapp VARCHAR (WhatsApp contact)
- Adds listing_type VARCHAR (sale, rent, both)
- Creates indexes for performance

**Duration:** ~1-3 seconds
**Safety:** ✅ Idempotent, non-destructive
**Dependencies:** Users table must exist (for user_id FK)

---

### 3. create_password_reset_tokens.sql

**Purpose:** Password reset functionality with security best practices

**What it does:**
- Creates password_reset_tokens table
- Adds foreign key constraint to users(id)
- Creates indexes for performance (token, user_id, expires_at)
- Enables Row Level Security (RLS)
- Adds RLS policies:
  - Service role can insert/select/update/delete tokens
  - Authenticated users and anon CANNOT access tokens directly
- Ensures all access goes through API endpoints

**Schema:**
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Security Features:**
- ✅ Service role only access (no direct user access)
- ✅ Token expiration tracking
- ✅ Used flag to prevent reuse
- ✅ Cascade delete when user is deleted
- ✅ Unique token constraint

**Duration:** ~1 second
**Safety:** ✅ Idempotent, secure
**Dependencies:** Users table must exist

---

### 4. combined_migrations.sql (Optional)

**Purpose:** All-in-one migration combining password reset + storage

**What it does:**
- Adds password_hash and verified to users table
- Creates password_reset_tokens table
- Creates Supabase Storage bucket for property images
- Adds multiple property columns (similar to add_missing_columns.sql)

**Note:** This file may overlap with files 2 and 3. Check what's already applied before running.

**Duration:** ~3-5 seconds
**Safety:** ⚠️ May duplicate some changes
**Dependencies:** Users table must exist

---

## Best Practices

### 1. Always Backup Before Migrations

```sql
-- Create backup of critical tables
CREATE TABLE users_backup AS SELECT * FROM users;
CREATE TABLE properties_backup AS SELECT * FROM properties;

-- Verify backup
SELECT COUNT(*) FROM users_backup;
SELECT COUNT(*) FROM properties_backup;
```

### 2. Test in Development First

- Never run migrations directly on production first
- Test on a development/staging database
- Verify all functionality works after migration
- Check API endpoints that depend on database schema

### 3. Use Idempotent Migrations

All recommended migrations use `IF NOT EXISTS` checks:

```sql
-- ✅ Good - Idempotent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'verified'
  ) THEN
    ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ❌ Bad - Will fail if column exists
ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
```

### 4. Monitor Migration Execution

```sql
-- Check for errors during migration
-- Look for "NOTICE" messages in Supabase SQL Editor output

-- Example successful output:
-- NOTICE: ✅ Created users table
-- NOTICE: ✅ Added id column
-- NOTICE: ✅ Updated existing rows with UUIDs
```

### 5. Verify After Migration

Always verify the migration succeeded:

```sql
-- Verify users table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Expected columns: id, email, name, phone, avatar, role, password_hash, verified, created_at, updated_at

-- Verify constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users';

-- Expected: PRIMARY KEY on id, UNIQUE on email, CHECK on role, FOREIGN KEY constraints
```

### 6. Version Control Migrations

- ✅ Keep all migrations in git
- ✅ Use descriptive file names
- ✅ Add comments explaining what each migration does
- ✅ Document dependencies between migrations
- ❌ Don't modify migrations after they've been applied to production
- ❌ Don't delete old migrations (archive instead)

---

## Troubleshooting

### Issue 1: Foreign Key Constraint Errors

**Error:**
```
ERROR: insert or update on table "properties" violates foreign key constraint "properties_user_id_fkey"
DETAIL: Key (user_id)=(xxx) is not present in table "users".
```

**Solution:**
```sql
-- Check if users table exists
SELECT * FROM users LIMIT 1;

-- If users table doesn't exist, run fix_users_table_complete.sql first
-- If it exists but has no id column, same fix

-- Temporary fix: Remove FK constraint
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_user_id_fkey;

-- Then run fix_users_table_complete.sql
-- Then re-add FK constraint
ALTER TABLE properties
ADD CONSTRAINT properties_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
```

### Issue 2: Column Already Exists

**Error:**
```
ERROR: column "password_hash" of relation "users" already exists
```

**Solution:**
This is normal if running a migration twice. The recommended migrations use `IF NOT EXISTS` checks, so this shouldn't happen. If it does:

```sql
-- Check if column already has the correct type
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'password_hash';

-- If column exists with correct type, migration is already applied
-- No action needed
```

### Issue 3: Migration Takes Too Long

**Symptoms:**
- Migration running for >30 seconds
- Browser/connection timeout

**Causes:**
- Large amount of existing data
- Complex FK constraint checks

**Solution:**
```sql
-- Run migrations in smaller batches
-- Instead of running entire migration, break into steps:

-- Step 1: Add column without FK
ALTER TABLE properties ADD COLUMN IF NOT EXISTS user_id UUID;

-- Step 2: Update data (if needed)
-- UPDATE properties SET user_id = ... WHERE ...;

-- Step 3: Add FK constraint
ALTER TABLE properties
ADD CONSTRAINT properties_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id);
```

### Issue 4: Role Check Constraint Fails

**Error:**
```
ERROR: new row for relation "users" violates check constraint "users_role_check"
DETAIL: Failing row contains (..., role=some_value, ...)
```

**Solution:**
```sql
-- Check existing role values
SELECT DISTINCT role FROM users;

-- If invalid roles exist (like 'user_type' or old values), fix them:
UPDATE users SET role = 'customer' WHERE role NOT IN ('customer', 'agent', 'admin', 'super_admin');

-- Then run the migration
```

### Issue 5: Duplicate Migrations Applied

**Symptoms:**
- Indexes created multiple times
- Policies created multiple times

**Solution:**
Most migrations are idempotent and handle duplicates. But to clean up:

```sql
-- Check for duplicate indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename = 'properties' AND indexname LIKE 'idx_properties_%';

-- Drop duplicate indexes if found
DROP INDEX IF EXISTS idx_properties_user_id_1;  -- Keep idx_properties_user_id

-- Check for duplicate policies
SELECT policyname FROM pg_policies WHERE tablename = 'password_reset_tokens';

-- Drop duplicate policies
DROP POLICY IF EXISTS "duplicate_policy_name" ON password_reset_tokens;
```

---

## Migration Workflow

### Recommended Approach

```bash
# 1. Archive old migrations (one-time cleanup)
mkdir -p supabase/migrations_archive/{diagnostic,incremental_fixes,superseded}

# 2. Move diagnostic files
mv supabase/migrations/check_users_table.sql supabase/migrations_archive/diagnostic/
mv supabase/migrations/diagnose_users_table.sql supabase/migrations_archive/diagnostic/
mv supabase/migrations/verify_users_table.sql supabase/migrations_archive/diagnostic/

# 3. Move incremental fixes
mv supabase/migrations/add_password_hash_to_users.sql supabase/migrations_archive/incremental_fixes/
mv supabase/migrations/ensure_users_id_column.sql supabase/migrations_archive/incremental_fixes/
mv supabase/migrations/fix_id_default.sql supabase/migrations_archive/incremental_fixes/
mv supabase/migrations/set_id_default_simple.sql supabase/migrations_archive/incremental_fixes/
mv supabase/migrations/fix_users_table.sql supabase/migrations_archive/incremental_fixes/
mv supabase/migrations/fix_users_table_columns.sql supabase/migrations_archive/incremental_fixes/
mv supabase/migrations/fix_role_constraint_immediate.sql supabase/migrations_archive/incremental_fixes/
mv supabase/migrations/fix_user_type_to_role.sql supabase/migrations_archive/incremental_fixes/

# 4. Move superseded comprehensive fixes
mv supabase/migrations/fix_users_fk_error_final.sql supabase/migrations_archive/superseded/
mv supabase/migrations/complete_users_table.sql supabase/migrations_archive/superseded/

# 5. Keep only core migrations
# supabase/migrations/
# ├── fix_users_table_complete.sql
# ├── add_missing_columns.sql
# ├── add_user_id_to_properties.sql
# ├── create_password_reset_tokens.sql
# └── combined_migrations.sql
```

### Future Migrations

When adding new features:

```sql
-- Use timestamp-based naming
-- Format: YYYYMMDDHHMMSS_description.sql
-- Example: 20241122150000_add_booking_system.sql

-- Template:
-- ============================================================================
-- Migration: [Description]
-- Created: [Date]
-- Purpose: [What this migration does]
-- Dependencies: [List of required tables/columns]
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main migration logic with IF NOT EXISTS checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'new_table'
  ) THEN
    CREATE TABLE new_table (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      -- other columns
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    RAISE NOTICE '✅ Created new_table';
  ELSE
    RAISE NOTICE '✅ Table new_table already exists';
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_new_table_column ON new_table(column);

-- Add constraints
-- ...

-- Add RLS policies
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
-- ...
```

---

## Summary

### Current Recommended Structure

**Keep these 5-6 files:**
1. ✅ `fix_users_table_complete.sql` - Users table (comprehensive)
2. ✅ `add_missing_columns.sql` - Properties enhancements
3. ✅ `create_password_reset_tokens.sql` - Password reset
4. ⚠️ `add_user_id_to_properties.sql` - Optional (RLS policies)
5. ⚠️ `combined_migrations.sql` - Optional (may overlap with 2-3)

**Archive these 14 files:**
- 3 diagnostic files (read-only queries)
- 8 incremental fixes (superseded)
- 2 comprehensive fixes (redundant)
- 1 destructive migration (backup only)

**Result:**
- ✅ Reduced from 19 → 5 core migrations
- ✅ No duplication
- ✅ Clear migration order
- ✅ Well-documented
- ✅ Idempotent and safe
- ✅ Production-ready

For questions or issues, refer to the Troubleshooting section or check Supabase logs in Dashboard > Database > Logs.
