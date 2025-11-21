/**
 * Application constants
 */

// Default placeholder images for properties
export const DEFAULT_PROPERTY_IMAGE = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80";

export const PROPERTY_TYPE_IMAGES = {
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  house: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
};

// Helper function to get property image with fallback
export function getPropertyImage(property: { images?: string[]; type?: string }): string {
  // If property has images, return the first one
  if (property.images && property.images.length > 0) {
    return property.images[0];
  }

  // If property has a type, return type-specific image
  if (property.type && property.type in PROPERTY_TYPE_IMAGES) {
    return PROPERTY_TYPE_IMAGES[property.type as keyof typeof PROPERTY_TYPE_IMAGES];
  }

  // Return default image
  return DEFAULT_PROPERTY_IMAGE;
}

// Contact information
export const DEFAULT_CONTACT = {
  phone: "+30 698 927 3327",
  whatsapp: "306989273327",
  email: "info@estatebali.com",
};

// Pagination
export const DEFAULT_ITEMS_PER_PAGE = 12;
export const MAX_ITEMS_PER_PAGE = 50;

// Rate limiting
export const RATE_LIMITS = {
  // Authentication
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  register: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 attempts per minute
  forgotPassword: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 attempts per hour

  // API endpoints
  propertiesCreate: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute
  propertiesUpdate: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute
  propertiesDelete: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 per minute
  favoritesAdd: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 per minute
  favoritesRemove: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 per minute

  // General
  default: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 per minute
};

// File upload limits
export const UPLOAD_LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  maxImages: 10,
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

// Property search limits
export const SEARCH_LIMITS = {
  minPrice: 0,
  maxPrice: 100000000000, // 100 billion
  minArea: 0,
  maxArea: 100000, // 100,000 sqm
  minBedrooms: 0,
  maxBedrooms: 20,
  minBathrooms: 0,
  maxBathrooms: 20,
};
