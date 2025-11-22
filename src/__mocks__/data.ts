/**
 * Mock data for testing
 */

export const mockProperty = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Beautiful Villa in Seminyak',
  description: 'A stunning 3-bedroom villa with pool',
  type: 'villa' as const,
  listing_type: 'sale' as const,
  price: 500000000,
  location: {
    address: 'Jl. Sunset Road No. 123',
    area: 'Seminyak',
    city: 'Bali',
    latitude: -8.6857,
    longitude: 115.1606,
  },
  details: {
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 250,
    furnished: true,
  },
  features: {
    pool: true,
    garden: true,
    parking: true,
    security: true,
  },
  images: ['https://example.com/image1.jpg'],
  contact: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+628123456789',
  },
  user_id: '123e4567-e89b-12d3-a456-426614174001',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  views: 100,
  favorites: 5,
  featured: true,
  verified: true,
  available: true,
}

export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  email: 'user@example.com',
  name: 'Test User',
  role: 'user' as const,
  avatar: 'https://example.com/avatar.jpg',
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockAdmin = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockBooking = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  property_id: mockProperty.id,
  user_id: mockUser.id,
  check_in: '2024-06-01',
  check_out: '2024-06-07',
  guests: 4,
  total_price: 10000000,
  booking_status: 'confirmed' as const,
  payment_status: 'paid' as const,
  guest_name: 'Test Guest',
  guest_email: 'guest@example.com',
  guest_phone: '+628123456789',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockNotification = {
  id: '123e4567-e89b-12d3-a456-426614174004',
  user_id: mockUser.id,
  title: 'New Property Match',
  message: 'A new property matching your saved search is available',
  type: 'new_listing' as const,
  read: false,
  created_at: new Date().toISOString(),
}
