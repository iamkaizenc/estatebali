-- Estate Bali Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('villa', 'apartment', 'house', 'land')),
  listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  source VARCHAR(20) NOT NULL CHECK (source IN ('owner', 'agent')),
  price BIGINT NOT NULL,
  price_per_month BIGINT,
  price_per_sqm BIGINT,
  address TEXT,
  area VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm INTEGER NOT NULL DEFAULT 0,
  floors INTEGER,
  year_built INTEGER,
  furnished BOOLEAN,
  features JSONB DEFAULT '{}',
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  virtual_tour TEXT,
  short_term_booking JSONB,
  contact_name VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  contact_whatsapp VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_verified ON properties(verified);
CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(available);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
-- Password hash is bcrypt hash of 'admin123'
-- You can generate a new hash using: https://bcrypt-generator.com/
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES (
  'admin@estatebali.app',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- Replace with actual bcrypt hash
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Users table (for future customer/agent features)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('owner', 'agent', 'customer')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table (for user favorites)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Properties: Public read access, admin write access
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Properties are insertable by authenticated admins" ON properties
    FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Properties are updatable by authenticated admins" ON properties
    FOR UPDATE USING (auth.role() = 'admin');

CREATE POLICY "Properties are deletable by authenticated admins" ON properties
    FOR DELETE USING (auth.role() = 'admin');

-- Admin users: Only admins can view
CREATE POLICY "Admin users are viewable by admins" ON admin_users
    FOR SELECT USING (auth.role() = 'admin');

-- Users: Public read for verified users, users can update their own
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert themselves" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update themselves" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Favorites: Users can manage their own favorites
CREATE POLICY "Favorites are viewable by owner" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);
