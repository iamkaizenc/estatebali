-- Combined Migration: Add password_hash and password_reset_tokens
-- Run this in Supabase SQL Editor or via MCP

-- 1. Add password_hash column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  END IF;
END $$;

-- 2. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_password_reset_tokens_user_id'
  ) THEN
    ALTER TABLE password_reset_tokens
    ADD CONSTRAINT fk_password_reset_tokens_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- 3. Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up storage policies for property-images bucket
-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete own images" ON storage.objects;

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Allow public to read images
CREATE POLICY "Allow public to read images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Allow authenticated users to update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated users to delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');

