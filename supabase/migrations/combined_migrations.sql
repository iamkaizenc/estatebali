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

-- Add verified column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'verified'
  ) THEN
    ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
    COMMENT ON COLUMN users.verified IS 'Whether the user account is verified';
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

-- 5. Add missing columns to properties table
-- Add featured column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'featured'
  ) THEN
    ALTER TABLE properties ADD COLUMN featured BOOLEAN DEFAULT false;
    CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
  END IF;
END $$;

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE properties 
    ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
  END IF;
END $$;

-- Add verified column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'verified'
  ) THEN
    ALTER TABLE properties ADD COLUMN verified BOOLEAN DEFAULT false;
    CREATE INDEX IF NOT EXISTS idx_properties_verified ON properties(verified);
  END IF;
END $$;

-- Add available column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'available'
  ) THEN
    ALTER TABLE properties ADD COLUMN available BOOLEAN DEFAULT true;
    CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(available);
  END IF;
END $$;

-- Add views column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'views'
  ) THEN
    ALTER TABLE properties ADD COLUMN views INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add favorites column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'favorites'
  ) THEN
    ALTER TABLE properties ADD COLUMN favorites INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add images column if it doesn't exist (as TEXT array)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'images'
  ) THEN
    ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

-- Add videos column if it doesn't exist (as TEXT array)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'videos'
  ) THEN
    ALTER TABLE properties ADD COLUMN videos TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

-- Add short_term_booking column if it doesn't exist (as JSONB)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'short_term_booking'
  ) THEN
    ALTER TABLE properties ADD COLUMN short_term_booking JSONB;
  END IF;
END $$;

-- Add virtual_tour column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'virtual_tour'
  ) THEN
    ALTER TABLE properties ADD COLUMN virtual_tour TEXT;
  END IF;
END $$;

-- Add features column if it doesn't exist (as JSONB)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'features'
  ) THEN
    ALTER TABLE properties ADD COLUMN features JSONB DEFAULT '{}';
  END IF;
END $$;

-- Add price_per_month column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'price_per_month'
  ) THEN
    ALTER TABLE properties ADD COLUMN price_per_month BIGINT;
  END IF;
END $$;

-- Add price_per_sqm column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'price_per_sqm'
  ) THEN
    ALTER TABLE properties ADD COLUMN price_per_sqm BIGINT;
  END IF;
END $$;

-- Add latitude and longitude columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'latitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'longitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Add year_built column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'year_built'
  ) THEN
    ALTER TABLE properties ADD COLUMN year_built INTEGER;
  END IF;
END $$;

-- Add floors column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'floors'
  ) THEN
    ALTER TABLE properties ADD COLUMN floors INTEGER;
  END IF;
END $$;

-- Add contact_whatsapp column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'contact_whatsapp'
  ) THEN
    ALTER TABLE properties ADD COLUMN contact_whatsapp VARCHAR(20);
  END IF;
END $$;

-- Add listing_type column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'listing_type'
  ) THEN
    -- First add column as nullable
    ALTER TABLE properties ADD COLUMN listing_type VARCHAR(20);
    
    -- Update existing rows to have default value
    UPDATE properties SET listing_type = 'sale' WHERE listing_type IS NULL;
    
    -- Now make it NOT NULL with default
    ALTER TABLE properties 
      ALTER COLUMN listing_type SET DEFAULT 'sale',
      ALTER COLUMN listing_type SET NOT NULL;
    
    -- Add check constraint
    ALTER TABLE properties ADD CONSTRAINT check_listing_type 
      CHECK (listing_type IN ('sale', 'rent'));
    
    CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
  END IF;
END $$;

