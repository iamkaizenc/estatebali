import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property } from '@/types';

// Supabase client for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are set
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Supabase client for server-side operations (with service role key)
// IMPORTANT: SUPABASE_SERVICE_ROLE_KEY does NOT have NEXT_PUBLIC_ prefix (server-side only)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Always log to help debug (will show in Vercel Function Logs)
// eslint-disable-next-line no-console
console.log('[Supabase Init] Environment Check:', {
  hasUrl: !!supabaseUrl,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 40)}...` : 'MISSING',
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyPreview: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 40)}...` : 'MISSING',
  serviceKeyLength: supabaseServiceKey?.length || 0,
  nodeEnv: process.env.NODE_ENV,
});

// Create admin client with detailed error handling
export const supabaseAdmin: SupabaseClient | null = (() => {
  if (!supabaseUrl) {
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] ❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is missing or empty');
    return null;
  }
  
  if (!supabaseServiceKey) {
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] ❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing or empty');
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] Available env vars with SUPABASE:', 
      Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    return null;
  }
  
  try {
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // eslint-disable-next-line no-console
    console.log('[Supabase Admin] ✅ Client created successfully');
    return client;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] ❌ ERROR creating client:', error?.message || error);
    return null;
  }
})();

// Check if Supabase is configured
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && !!supabaseServiceKey;

// Database Types
export interface DatabaseProperty {
  id: string;
  title: string;
  description: string | null;
  type: string;
  listing_type: string;
  source: string;
  price: number;
  price_per_month: number | null;
  price_per_sqm: number | null;
  address: string | null;
  area: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number;
  floors: number | null;
  year_built: number | null;
  furnished: boolean | null;
  features: any; // JSONB
  images: string[] | null;
  videos: string[] | null;
  virtual_tour: string | null;
  short_term_booking: any | null; // JSONB
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  user_id: string | null; // Added for user ownership
  created_at: string;
  updated_at: string;
  views: number;
  favorites: number;
  featured: boolean;
  verified: boolean;
  available: boolean;
}

// Convert database property to app property
export function dbPropertyToProperty(dbProp: DatabaseProperty): Property {
  return {
    id: dbProp.id,
    title: dbProp.title,
    description: dbProp.description || '',
    type: dbProp.type as any,
    listingType: dbProp.listing_type as any,
    source: dbProp.source as any,
    price: dbProp.price,
    pricePerMonth: dbProp.price_per_month || undefined,
    pricePerSqm: dbProp.price_per_sqm || undefined,
    location: {
      address: dbProp.address || '',
      area: dbProp.area || '',
      city: dbProp.city || '',
      coordinates: dbProp.latitude && dbProp.longitude ? {
        lat: Number(dbProp.latitude),
        lng: Number(dbProp.longitude),
      } : undefined,
    },
    details: {
      bedrooms: dbProp.bedrooms || undefined,
      bathrooms: dbProp.bathrooms || undefined,
      area: dbProp.area_sqm,
      floors: dbProp.floors || undefined,
      yearBuilt: dbProp.year_built || undefined,
      furnished: dbProp.furnished || undefined,
    },
    features: dbProp.features || {},
    images: dbProp.images || [],
    videos: dbProp.videos || undefined,
    virtualTour: dbProp.virtual_tour || undefined,
    shortTermBooking: dbProp.short_term_booking || undefined,
    contact: {
      name: dbProp.contact_name || '',
      phone: dbProp.contact_phone || '',
      email: dbProp.contact_email || '',
      whatsapp: dbProp.contact_whatsapp || undefined,
    },
    createdAt: new Date(dbProp.created_at),
    updatedAt: new Date(dbProp.updated_at),
    views: dbProp.views,
    favorites: dbProp.favorites,
    featured: dbProp.featured,
    verified: dbProp.verified,
    available: dbProp.available,
  };
}

// Convert app property to database property
export function propertyToDbProperty(prop: Partial<Property>): Partial<DatabaseProperty> {
  return {
    title: prop.title,
    description: prop.description || null,
    type: prop.type,
    listing_type: prop.listingType,
    source: prop.source,
    price: prop.price,
    price_per_month: prop.pricePerMonth || null,
    price_per_sqm: prop.pricePerSqm || null,
    address: prop.location?.address || null,
    area: prop.location?.area || null,
    city: prop.location?.city || null,
    latitude: prop.location?.coordinates?.lat || null,
    longitude: prop.location?.coordinates?.lng || null,
    bedrooms: prop.details?.bedrooms || null,
    bathrooms: prop.details?.bathrooms || null,
    area_sqm: prop.details?.area || 0,
    floors: prop.details?.floors || null,
    year_built: prop.details?.yearBuilt || null,
    furnished: prop.details?.furnished || null,
    features: prop.features || {},
    images: prop.images || null,
    videos: prop.videos || null,
    virtual_tour: prop.virtualTour || null,
    short_term_booking: prop.shortTermBooking || null,
    contact_name: prop.contact?.name || null,
    contact_phone: prop.contact?.phone || null,
    contact_email: prop.contact?.email || null,
    contact_whatsapp: prop.contact?.whatsapp || null,
    views: prop.views || 0,
    favorites: prop.favorites || 0,
    featured: prop.featured || false,
    verified: prop.verified || false,
    available: prop.available !== undefined ? prop.available : true,
  };
}

