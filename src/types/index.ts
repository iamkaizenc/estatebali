// Property Types
export type PropertyType = "villa" | "apartment" | "house" | "land";
export type ListingType = "sale" | "rent";
export type ListingSource = "owner" | "agent";

// Property Interface
export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  listingType: ListingType;
  source: ListingSource;
  price: number;
  pricePerMonth?: number;
  pricePerSqm?: number;
  
  // Location
  location: {
    address: string;
    area: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Property Details
  details: {
    bedrooms?: number;
    bathrooms?: number;
    area: number; // in m²
    floors?: number;
    yearBuilt?: number;
    furnished?: boolean;
  };
  
  // Features
  features: {
    pool?: boolean;
    garden?: boolean;
    parking?: boolean;
    security?: boolean;
    airConditioning?: boolean;
    balcony?: boolean;
    terrace?: boolean;
    oceanView?: boolean;
    elevator?: boolean;
    gym?: boolean;
    petFriendly?: boolean;
    wifi?: boolean;
  };
  
  // Images & Media
  images: string[];
  videos?: string[];
  virtualTour?: string;
  
  // Short-term booking
  shortTermBooking?: {
    available: boolean;
    pricePerNight: number;
    minimumStay: number;
    maximumGuests: number;
  };
  
  // Contact
  contact: {
    name: string;
    phone: string;
    email: string;
    whatsapp?: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  views: number;
  favorites: number;
  featured?: boolean;
  verified?: boolean;
  available: boolean;
}

// Search Filters
export interface SearchFilters {
  listingType?: ListingType;
  propertyType?: PropertyType[];
  source?: ListingSource;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  features?: string[];
  shortTermAvailable?: boolean;
}

// User Types
export type UserRole = "admin" | "super_admin" | "owner" | "agent" | "customer" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  verified?: boolean;
  createdAt: Date;
}

// Auth User (for authentication context)
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

// Message Interface
export interface Message {
  id: string;
  propertyId: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}
