import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property } from '@/types';

// Supabase client for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are set
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase client is configured (client-side only)
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Database Types - Based on actual Supabase schema
export interface DatabaseProperty {
  id: string;
  listing_id: string | null;
  system_code: string | null;
  title: string;
  description: string | null;
  type: string; // Listing type: 'sale' | 'rent'
  listing_type?: string; // Listing type (duplicate, may not exist)
  category: string; // Property category: 'villa' | 'apartment' | 'house' | 'land' | 'motorcycle'
  listing_source?: string; // source field alternative
  price: number;
  price_per_month: number | null;
  price_per_day: number | null;
  price_per_sqm: number | null;
  short_term_rental: boolean | null;
  location: string; // ⚠️ ACTUAL COLUMN NAME (not address!)
  area: string;
  bedrooms: number | null;
  bathrooms: number | null;
  wc: number | null;
  kitchens: number | null;
  living_rooms: number | null;
  size: number; // area_sqm equivalent
  plot_size: number | null;
  levels: number | null; // floors equivalent
  floor: number | null;
  year_built: number | null;
  new_development: boolean | null;
  coordinates: any | null; // JSONB for lat/lng
  amenities: string[] | null; // features equivalent
  images: string[] | null;
  owner_id: string | null;
  user_id?: string | null; // May not exist, using owner_id
  created_at?: string;
  updated_at?: string;
  views?: number;
  favorites?: number;
  featured?: boolean;
  verified?: boolean;
  available?: boolean;
}

// Convert database property to app property
// Database schema: type = listing type (sale/rent), category = property type (villa/apartment/house/land/motorcycle)
export function dbPropertyToProperty(dbProp: DatabaseProperty): Property {
  // Parse coordinates from JSONB
  let coordinates: { lat: number; lng: number } | undefined;
  if (dbProp.coordinates) {
    if (typeof dbProp.coordinates === 'object' && 'lat' in dbProp.coordinates && 'lng' in dbProp.coordinates) {
      coordinates = {
        lat: Number(dbProp.coordinates.lat),
        lng: Number(dbProp.coordinates.lng),
      };
    } else if (typeof dbProp.coordinates === 'object' && 'latitude' in dbProp.coordinates && 'longitude' in dbProp.coordinates) {
      coordinates = {
        lat: Number(dbProp.coordinates.latitude),
        lng: Number(dbProp.coordinates.longitude),
      };
    }
  }

  // Parse location (format may vary - could be full address or just area)
  const locationText = dbProp.location || '';
  const areaText = dbProp.area || '';

  return {
    id: dbProp.id,
    title: dbProp.title,
    description: dbProp.description || '',
    // category field contains property type (villa, apartment, etc.)
    type: (dbProp.category || dbProp.type) as any,
    // type field contains listing type (sale/rent)
    listingType: (dbProp.type || dbProp.listing_type) as any,
    source: (dbProp.listing_source || 'manual') as any,
    price: dbProp.price,
    pricePerMonth: dbProp.price_per_month || undefined,
    pricePerSqm: dbProp.price_per_sqm || undefined,
    location: {
      address: locationText, // ⚠️ location column contains full address
      area: areaText,
      city: areaText, // Use area as city fallback
      coordinates: coordinates,
    },
    details: {
      bedrooms: dbProp.bedrooms || undefined,
      bathrooms: dbProp.bathrooms || undefined,
      area: dbProp.size || 0, // ⚠️ size column = area_sqm
      floors: dbProp.levels || undefined, // ⚠️ levels = floors
      yearBuilt: dbProp.year_built || undefined,
      furnished: undefined, // Not in schema
    },
    features: dbProp.amenities ? (Array.isArray(dbProp.amenities) ? {} : dbProp.amenities) : {}, // ⚠️ amenities = features
    images: dbProp.images || [],
    videos: undefined, // Not in schema
    virtualTour: undefined, // Not in schema
    shortTermBooking: dbProp.short_term_rental ? {
      available: dbProp.short_term_rental,
      pricePerNight: dbProp.price_per_day || 0,
      minimumStay: 1, // Default value - adjust if you have this in database
      maximumGuests: 4, // Default value - adjust if you have this in database
    } : undefined,
    contact: {
      name: '',
      phone: '',
      email: '',
      whatsapp: undefined,
    },
    createdAt: dbProp.created_at ? new Date(dbProp.created_at) : new Date(),
    updatedAt: dbProp.updated_at ? new Date(dbProp.updated_at) : new Date(),
    views: dbProp.views || 0,
    favorites: dbProp.favorites || 0,
    featured: dbProp.featured || false,
    verified: dbProp.verified || false,
    available: dbProp.available !== undefined ? dbProp.available : true,
  };
}

// Convert app property to database property
// Property.type (frontend) → category (database)
// Property.listingType (frontend) → type (database)
export function propertyToDbProperty(prop: Partial<Property>): Partial<DatabaseProperty> {
  // Build coordinates JSONB
  const coordinates = prop.location?.coordinates ? {
    lat: prop.location.coordinates.lat,
    lng: prop.location.coordinates.lng,
  } : null;

  // Build location string (full address)
  const location = prop.location?.address || prop.location?.area || '';

  // Convert features/amenities
  // Features is an object with boolean values, convert to array of enabled feature names
  const amenities = prop.features && typeof prop.features === 'object' 
    ? Object.keys(prop.features).filter(key => {
        const value = (prop.features as Record<string, any>)[key];
        return value === true;
      })
    : null;

  // Build short_term_rental from shortTermBooking
  const short_term_rental = prop.shortTermBooking 
    ? (typeof prop.shortTermBooking === 'object' ? prop.shortTermBooking.available : true)
    : null;
  const price_per_day = prop.shortTermBooking && typeof prop.shortTermBooking === 'object'
    ? prop.shortTermBooking.pricePerNight || null
    : null;

  // Map frontend property types to database category values
  // Frontend can have: motorbike, scooter, motorcycle, car, suv, villa, apartment, house, land
  // Database accepts: motorcycle, car, villa, apartment, house, land
  const mapCategoryToDatabase = (frontendType: string | undefined): string | undefined => {
    if (!frontendType) return undefined;
    const normalized = frontendType.toLowerCase();
    // Map motorbike/scooter to motorcycle
    if (['motorbike', 'scooter', 'motorcycle'].includes(normalized)) {
      return 'motorcycle';
    }
    // Map suv to car (or keep as is if constraint allows suv)
    if (normalized === 'suv') {
      return 'car';
    }
    // Other types pass through (villa, apartment, house, land, car)
    return normalized;
  };

  const result: Partial<DatabaseProperty> = {
    title: prop.title,
    description: prop.description || null,
    // listingType from frontend goes to type field in database
    type: prop.listingType,
    // type from frontend goes to category field in database
    // Map frontend types (motorbike/scooter) to database category (motorcycle)
    category: mapCategoryToDatabase(prop.type),
    listing_source: prop.source || 'manual',
    price: prop.price,
    price_per_month: prop.pricePerMonth || null,
    price_per_day: price_per_day,
    price_per_sqm: prop.pricePerSqm || null,
    short_term_rental: short_term_rental,
    // ⚠️ CRITICAL FIX: Use 'location' not 'address'
    location: location,
    area: prop.location?.area || '',
    coordinates: coordinates,
    bedrooms: prop.details?.bedrooms || null,
    bathrooms: prop.details?.bathrooms || null,
    size: prop.details?.area || 0, // ⚠️ size column = area_sqm
    levels: prop.details?.floors || null, // ⚠️ levels = floors
    floor: null, // Not mapped from frontend
    year_built: prop.details?.yearBuilt || null,
    new_development: null,
    amenities: amenities as string[] | null,
    images: prop.images || null,
    views: prop.views,
    favorites: prop.favorites,
    featured: prop.featured,
    verified: prop.verified,
    available: prop.available !== undefined ? prop.available : true,
  };

  // Remove undefined values to avoid sending them
  Object.keys(result).forEach(key => {
    if (result[key as keyof DatabaseProperty] === undefined) {
      delete result[key as keyof DatabaseProperty];
    }
  });

  return result;
}

