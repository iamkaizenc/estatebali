// Property Types
export type PropertyType = "villa" | "apartment" | "house" | "land";
export type ListingType = "sale" | "rent";
export type ListingSource = "owner" | "agent";
export type PropertyStatus = "pending" | "approved" | "rejected";
export type EnergyClass = "A+" | "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type HeatingType = "autonomous" | "central" | "none";
export type HeatingMedium = "oil" | "gas" | "electric" | "solar" | "none";

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
    wc?: number; // Separate toilet count
    kitchens?: number;
    livingRooms?: number;
    area: number; // in m²
    plotSize?: number; // Land/plot size in m²
    floors?: number;
    levels?: number; // Number of floors/levels in building
    floor?: number; // Which floor the property is on
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
    // Interior features
    warehouse?: boolean;
    securityDoor?: boolean;
    alarm?: boolean;
    fireplace?: boolean;
    solarWaterHeater?: boolean;
    // Exterior features
    penthouse?: boolean;
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
  
  // Leasehold (for foreign buyers)
  leaseholdYears?: number;
  leaseholdExtendable?: boolean;

  // Energy & Environmental
  energyClass?: EnergyClass;
  heatingType?: HeatingType;
  heatingMedium?: HeatingMedium;

  // Additional Info
  newDevelopment?: boolean;
  priceReduced?: boolean;
  suitableForStudents?: boolean;
  wheelchairAccessible?: boolean;
  averageMonthlyExpenses?: number;
  distanceFromSea?: string;
  availableFrom?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  views: number;
  favorites: number;
  featured?: boolean;
  verified?: boolean;
  available: boolean;
  status?: PropertyStatus;
}

// Search Filters
export interface SearchFilters {
  query?: string; // General search query
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
  propertyId?: string;
  conversationId?: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  readAt?: Date;
  attachmentUrl?: string;
  createdAt: Date;
}

// Conversation Interface
export interface Conversation {
  id: string;
  propertyId?: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  buyerUnreadCount: number;
  sellerUnreadCount: number;
  status: 'active' | 'archived' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

// Investment Lead Interface
export type InvestmentLeadStatus = 'pending' | 'contacted' | 'converted' | 'closed';

export interface InvestmentLead {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  investmentAmount?: number;
  investmentType?: string;
  preferredLocation?: string;
  message?: string;
  status: InvestmentLeadStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Interface
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'property'
  | 'message'
  | 'booking'
  | 'price_drop'
  | 'new_listing';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

// Booking Interface
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

// Saved Search Interface
export type AlertFrequency = 'instant' | 'daily' | 'weekly';

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  alertEnabled: boolean;
  alertFrequency: AlertFrequency;
  lastAlertSent?: Date;
  createdAt: Date;
  updatedAt: Date;
}
