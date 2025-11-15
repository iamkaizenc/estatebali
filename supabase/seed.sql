-- Seed data for Estate Bali
-- Run this after creating the schema

-- Insert sample properties
INSERT INTO properties (
  title, description, type, listing_type, source, price,
  address, area, city, latitude, longitude,
  bedrooms, bathrooms, area_sqm, floors, year_built, furnished,
  features, images, contact_name, contact_phone, contact_email,
  featured, verified, available
) VALUES
(
  'Luxury Villa with Ocean View',
  'Experience the epitome of luxury living in this stunning ocean-view villa. Featuring modern architecture, infinity pool, and breathtaking sunset views.',
  'villa',
  'sale',
  'agent',
  8500000000,
  'Jalan Pantai Berawa',
  'Uluwatu, Pecatu',
  'Badung',
  -8.8064,
  115.0922,
  4,
  5,
  450,
  2,
  2023,
  true,
  '{"pool": true, "garden": true, "parking": true, "security": true, "airConditioning": true, "terrace": true, "oceanView": true, "gym": true, "wifi": true}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
  ],
  'Sarah Johnson',
  '+62 812 3456 7890',
  'sarah@estatebali.com',
  true,
  true,
  true
),
(
  'Modern 2BR Apartment in Seminyak',
  'Stylish 2-bedroom apartment in the heart of Seminyak. Walking distance to beaches, restaurants, and nightlife.',
  'apartment',
  'rent',
  'agent',
  18000000,
  'Jalan Kayu Aya',
  'Seminyak',
  'Badung',
  -8.6844,
  115.1700,
  2,
  2,
  80,
  1,
  2022,
  true,
  '{"parking": true, "security": true, "airConditioning": true, "wifi": true, "elevator": true}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  ],
  'John Smith',
  '+62 817 7788 9900',
  'john@estatebali.com',
  false,
  true,
  true
),
(
  'Charming 1BR Villa in Ubud',
  'Peaceful 1-bedroom villa surrounded by rice fields. Perfect for those seeking tranquility and authentic Balinese experience.',
  'villa',
  'rent',
  'owner',
  15000000,
  'Jalan Raya Ubud',
  'Ubud',
  'Gianyar',
  -8.5069,
  115.2625,
  1,
  1,
  120,
  1,
  2021,
  true,
  '{"garden": true, "parking": true, "wifi": true, "petFriendly": true}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
  ],
  'Ketut Dharma',
  '+62 811 2233 4455',
  'ketut@estatebali.com',
  false,
  true,
  true
),
(
  'Prime Land in Canggu',
  'Prime development land in the heart of Canggu. Perfect for building your dream villa or commercial property.',
  'land',
  'sale',
  'agent',
  450000000,
  'Jalan Pantai Batu Bolong',
  'Canggu',
  'Badung',
  -8.6444,
  115.1389,
  NULL,
  NULL,
  500,
  NULL,
  NULL,
  NULL,
  '{}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
  ],
  'Sarah Johnson',
  '+62 812 3456 7890',
  'sarah@estatebali.com',
  false,
  false,
  true
),
(
  'Beachfront Villa in Sanur',
  'Stunning beachfront villa with direct access to the beach. Features 6 bedrooms, private pool, and panoramic ocean views.',
  'villa',
  'sale',
  'agent',
  15000000000,
  'Jalan Danau Tamblingan',
  'Sanur',
  'Denpasar',
  -8.6900,
  115.2622,
  6,
  7,
  600,
  2,
  2020,
  true,
  '{"pool": true, "garden": true, "parking": true, "security": true, "airConditioning": true, "terrace": true, "oceanView": true, "gym": true, "wifi": true}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb431?w=800'
  ],
  'Sarah Johnson',
  '+62 812 3456 7890',
  'sarah@estatebali.com',
  true,
  true,
  true
),
(
  'Modern House in Denpasar',
  'Contemporary 3-bedroom house in a quiet neighborhood. Close to schools, shopping centers, and city center.',
  'house',
  'sale',
  'owner',
  2500000000,
  'Jalan Gatot Subroto',
  'Renon',
  'Denpasar',
  -8.6705,
  115.2126,
  3,
  3,
  200,
  2,
  2019,
  true,
  '{"parking": true, "security": true, "airConditioning": true, "wifi": true}'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
  ],
  'Made Surya',
  '+62 812 9988 7766',
  'made@estatebali.com',
  false,
  false,
  true
);

-- Update admin user password hash
-- Generate bcrypt hash for 'admin123' and replace below
-- You can use: https://bcrypt-generator.com/ or Node.js: bcrypt.hashSync('admin123', 10)
UPDATE admin_users 
SET password_hash = '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
WHERE email = 'admin@estatebali.app';

