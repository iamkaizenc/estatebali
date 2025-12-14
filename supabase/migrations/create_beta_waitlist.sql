-- ============================================================================
-- Migration: Create Beta Waitlist Table
-- Created: 2024-12-XX
-- Purpose: Create table for iOS TestFlight beta waitlist signups
-- Dependencies: None
-- ============================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create beta_waitlist table
CREATE TABLE IF NOT EXISTS beta_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beta_waitlist_email ON beta_waitlist (email);
CREATE INDEX IF NOT EXISTS idx_beta_waitlist_created_at ON beta_waitlist (created_at DESC);

-- Enable Row Level Security
ALTER TABLE beta_waitlist ENABLE ROW LEVEL SECURITY;

-- Note: No public policies needed
-- Service role (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS automatically
-- Table remains private - only accessible via service role

-- Verification query (run after migration to confirm):
-- SELECT * FROM beta_waitlist ORDER BY created_at DESC LIMIT 10;
