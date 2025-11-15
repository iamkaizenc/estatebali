-- Migration: Add user_id to properties table
-- Run this in Supabase SQL Editor after initial schema

-- Add user_id column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);

-- Update RLS policy to allow users to see their own properties
-- (This is already covered by existing policies, but we can add a specific one)
CREATE POLICY IF NOT EXISTS "Users can view their own properties"
  ON properties FOR SELECT
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Update insert policy to allow users to create their own properties
CREATE POLICY IF NOT EXISTS "Users can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Update update policy to allow users to update their own properties
CREATE POLICY IF NOT EXISTS "Users can update their own properties"
  ON properties FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Update delete policy to allow users to delete their own properties
CREATE POLICY IF NOT EXISTS "Users can delete their own properties"
  ON properties FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

