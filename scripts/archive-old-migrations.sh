#!/bin/bash

# Migration Archive Script
# This script moves old/redundant migrations to an archive folder
# Run this from the project root: bash scripts/archive-old-migrations.sh

set -e  # Exit on error

echo "🗂️  Migration Archive Script"
echo "================================"
echo ""

# Create archive directories
echo "📁 Creating archive directories..."
mkdir -p supabase/migrations_archive/diagnostic
mkdir -p supabase/migrations_archive/incremental_fixes
mkdir -p supabase/migrations_archive/superseded
echo "✅ Archive directories created"
echo ""

# Function to move file if it exists
move_if_exists() {
  if [ -f "$1" ]; then
    mv "$1" "$2"
    echo "  ✅ Moved: $(basename "$1")"
  else
    echo "  ⏭️  Skipped (not found): $(basename "$1")"
  fi
}

# Move diagnostic files
echo "📋 Moving diagnostic files..."
move_if_exists "supabase/migrations/check_users_table.sql" "supabase/migrations_archive/diagnostic/"
move_if_exists "supabase/migrations/diagnose_users_table.sql" "supabase/migrations_archive/diagnostic/"
move_if_exists "supabase/migrations/verify_users_table.sql" "supabase/migrations_archive/diagnostic/"
echo ""

# Move incremental fixes
echo "🔧 Moving incremental fix files..."
move_if_exists "supabase/migrations/add_password_hash_to_users.sql" "supabase/migrations_archive/incremental_fixes/"
move_if_exists "supabase/migrations/ensure_users_id_column.sql" "supabase/migrations_archive/incremental_fixes/"
move_if_exists "supabase/migrations/fix_id_default.sql" "supabase/migrations_archive/incremental_fixes/"
move_if_exists "supabase/migrations/set_id_default_simple.sql" "supabase/migrations_archive/incremental_fixes/"
move_if_exists "supabase/migrations/fix_users_table.sql" "supabase/migrations_archive/incremental_fixes/"
move_if_exists "supabase/migrations/fix_users_table_columns.sql" "supabase/migrations_archive/incremental_fixes/"
move_if_exists "supabase/migrations/fix_role_constraint_immediate.sql" "supabase/migrations_archive/incremental_fixes/"
move_if_exists "supabase/migrations/fix_user_type_to_role.sql" "supabase/migrations_archive/incremental_fixes/"
echo ""

# Move superseded comprehensive fixes
echo "📦 Moving superseded comprehensive fixes..."
move_if_exists "supabase/migrations/fix_users_fk_error_final.sql" "supabase/migrations_archive/superseded/"
move_if_exists "supabase/migrations/complete_users_table.sql" "supabase/migrations_archive/superseded/"
echo ""

# Show remaining files
echo "✨ Remaining core migrations:"
ls -1 supabase/migrations/*.sql 2>/dev/null | sed 's/.*\//  ✅ /' || echo "  (no migrations found)"
echo ""

# Show archive summary
echo "📊 Archive Summary:"
echo "  Diagnostic:       $(ls -1 supabase/migrations_archive/diagnostic/*.sql 2>/dev/null | wc -l) files"
echo "  Incremental Fixes: $(ls -1 supabase/migrations_archive/incremental_fixes/*.sql 2>/dev/null | wc -l) files"
echo "  Superseded:        $(ls -1 supabase/migrations_archive/superseded/*.sql 2>/dev/null | wc -l) files"
echo "  Total Archived:    $(find supabase/migrations_archive -name '*.sql' 2>/dev/null | wc -l) files"
echo ""

echo "✅ Migration archive complete!"
echo ""
echo "ℹ️  Core migrations remaining:"
echo "  1. fix_users_table_complete.sql"
echo "  2. add_missing_columns.sql"
echo "  3. create_password_reset_tokens.sql"
echo "  4. add_user_id_to_properties.sql (optional - RLS only)"
echo "  5. combined_migrations.sql (optional - may overlap)"
echo ""
echo "📖 See MIGRATIONS.md for detailed documentation"
