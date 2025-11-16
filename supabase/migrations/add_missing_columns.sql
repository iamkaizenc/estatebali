-- Migration: Add missing columns to properties table
-- This migration adds columns that may be missing from the properties table
-- Run this in Supabase SQL Editor

-- 1. Add featured column if it doesn't exist
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
    COMMENT ON COLUMN properties.featured IS 'Whether the property is featured';
  END IF;
END $$;

-- 2. Add user_id column if it doesn't exist
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
    COMMENT ON COLUMN properties.user_id IS 'Owner of the property (from users table)';
  END IF;
END $$;

-- 3. Add verified column if it doesn't exist
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
    COMMENT ON COLUMN properties.verified IS 'Whether the property is verified by admin';
  END IF;
END $$;

-- 4. Add available column if it doesn't exist
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
    COMMENT ON COLUMN properties.available IS 'Whether the property is currently available';
  END IF;
END $$;

-- 5. Add views column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'views'
  ) THEN
    ALTER TABLE properties ADD COLUMN views INTEGER DEFAULT 0;
    COMMENT ON COLUMN properties.views IS 'Number of times the property has been viewed';
  END IF;
END $$;

-- 6. Add favorites column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'favorites'
  ) THEN
    ALTER TABLE properties ADD COLUMN favorites INTEGER DEFAULT 0;
    COMMENT ON COLUMN properties.favorites IS 'Number of times the property has been favorited';
  END IF;
END $$;

-- 7. Add images column if it doesn't exist (as TEXT array)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'images'
  ) THEN
    ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
    COMMENT ON COLUMN properties.images IS 'Array of image URLs';
  END IF;
END $$;

-- 8. Add videos column if it doesn't exist (as TEXT array)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'videos'
  ) THEN
    ALTER TABLE properties ADD COLUMN videos TEXT[] DEFAULT ARRAY[]::TEXT[];
    COMMENT ON COLUMN properties.videos IS 'Array of video URLs';
  END IF;
END $$;

-- 9. Add short_term_booking column if it doesn't exist (as JSONB)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'short_term_booking'
  ) THEN
    ALTER TABLE properties ADD COLUMN short_term_booking JSONB;
    COMMENT ON COLUMN properties.short_term_booking IS 'Short-term booking information (price per night, availability)';
  END IF;
END $$;

-- 10. Add virtual_tour column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'virtual_tour'
  ) THEN
    ALTER TABLE properties ADD COLUMN virtual_tour TEXT;
    COMMENT ON COLUMN properties.virtual_tour IS 'URL to virtual tour';
  END IF;
END $$;

-- 11. Add features column if it doesn't exist (as JSONB)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'features'
  ) THEN
    ALTER TABLE properties ADD COLUMN features JSONB DEFAULT '{}';
    COMMENT ON COLUMN properties.features IS 'Property features as JSON object';
  END IF;
END $$;

-- 12. Add price_per_month column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'price_per_month'
  ) THEN
    ALTER TABLE properties ADD COLUMN price_per_month BIGINT;
    COMMENT ON COLUMN properties.price_per_month IS 'Monthly rental price';
  END IF;
END $$;

-- 13. Add price_per_sqm column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'price_per_sqm'
  ) THEN
    ALTER TABLE properties ADD COLUMN price_per_sqm BIGINT;
    COMMENT ON COLUMN properties.price_per_sqm IS 'Price per square meter';
  END IF;
END $$;

-- 14. Add latitude and longitude columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'latitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN latitude DECIMAL(10, 8);
    COMMENT ON COLUMN properties.latitude IS 'Property latitude coordinate';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'longitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN longitude DECIMAL(11, 8);
    COMMENT ON COLUMN properties.longitude IS 'Property longitude coordinate';
  END IF;
END $$;

-- 15. Add year_built column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'year_built'
  ) THEN
    ALTER TABLE properties ADD COLUMN year_built INTEGER;
    COMMENT ON COLUMN properties.year_built IS 'Year the property was built';
  END IF;
END $$;

-- 16. Add floors column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'floors'
  ) THEN
    ALTER TABLE properties ADD COLUMN floors INTEGER;
    COMMENT ON COLUMN properties.floors IS 'Number of floors';
  END IF;
END $$;

-- 17. Add contact_whatsapp column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'contact_whatsapp'
  ) THEN
    ALTER TABLE properties ADD COLUMN contact_whatsapp VARCHAR(20);
    COMMENT ON COLUMN properties.contact_whatsapp IS 'WhatsApp contact number';
  END IF;
END $$;

-- 18. Add listing_type column if it doesn't exist
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
    
    -- Add check constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'check_listing_type'
    ) THEN
      ALTER TABLE properties ADD CONSTRAINT check_listing_type 
        CHECK (listing_type IN ('sale', 'rent'));
    END IF;
    
    CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
    COMMENT ON COLUMN properties.listing_type IS 'Property listing type: sale or rent';
  END IF;
END $$;

-- Verify all columns exist
DO $$
DECLARE
  missing_columns TEXT[];
  required_columns TEXT[] := ARRAY[
    'featured', 'user_id', 'verified', 'available', 'views', 'favorites',
    'images', 'videos', 'short_term_booking', 'virtual_tour', 'features',
    'price_per_month', 'price_per_sqm', 'latitude', 'longitude',
    'year_built', 'floors', 'contact_whatsapp'
  ];
  col TEXT;
BEGIN
  FOREACH col IN ARRAY required_columns
  LOOP
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      AND column_name = col
    ) THEN
      missing_columns := array_append(missing_columns, col);
    END IF;
  END LOOP;
  
  IF array_length(missing_columns, 1) > 0 THEN
    RAISE NOTICE 'Warning: Some columns could not be added: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE 'Success: All required columns exist in properties table';
  END IF;
END $$;

