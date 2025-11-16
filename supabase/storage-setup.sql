-- Supabase Storage Setup for Property Images
-- Run this in Supabase SQL Editor

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for property-images bucket
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

