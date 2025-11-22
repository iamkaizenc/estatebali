-- Create password_reset_tokens table for password reset functionality
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint
ALTER TABLE password_reset_tokens
ADD CONSTRAINT fk_password_reset_tokens_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow service role to insert reset tokens
-- This is used by the forgot-password API endpoint
CREATE POLICY "Service role can insert reset tokens"
ON password_reset_tokens
FOR INSERT
TO service_role
WITH CHECK (true);

-- RLS Policy: Allow service role to select tokens for validation
-- This is used by the reset-password API endpoint to validate tokens
CREATE POLICY "Service role can select reset tokens"
ON password_reset_tokens
FOR SELECT
TO service_role
USING (true);

-- RLS Policy: Allow service role to update tokens (mark as used)
-- This is used by the reset-password API endpoint after successful password reset
CREATE POLICY "Service role can update reset tokens"
ON password_reset_tokens
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policy: Allow service role to delete expired tokens
-- This is used for cleanup operations
CREATE POLICY "Service role can delete reset tokens"
ON password_reset_tokens
FOR DELETE
TO service_role
USING (true);

-- RLS Policy: Deny all access to regular authenticated and anonymous users
-- This ensures users cannot access password reset tokens directly
-- All access must go through API endpoints using service role
CREATE POLICY "Deny direct user access to reset tokens"
ON password_reset_tokens
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Clean up expired tokens (run periodically)
-- You can set up a cron job or scheduled function to run this:
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW();

