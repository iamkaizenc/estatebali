import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { dbPropertyToProperty, propertyToDbProperty } from "@/lib/supabase";
import { verifyAdminAuth, verifyAuth } from "@/lib/api-auth";
import { propertySchema, validateData } from "@/lib/validation";
import { rateLimitByIP } from "@/lib/rate-limit";
import { sanitizeString, sanitizeHTML } from "@/lib/sanitization";
// Mock data import removed - production should not use mock data

// GET /api/properties - Get all properties
export async function GET(request: NextRequest) {
  try {
    // CORS headers for mobile app access
    const origin = request.headers.get('origin');
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: corsHeaders });
    }

    // If Supabase is not configured, return error (no mock data in production)
    if (!isSupabaseConfigured || !supabaseAdmin) {
      console.error('[Properties API] Supabase not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Database service is temporarily unavailable. Please try again later.',
        },
        { status: 503, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const listingType = searchParams.get("listingType");
    const featured = searchParams.get("featured");
    const area = searchParams.get("area");
    const type = searchParams.get("type");
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const search = searchParams.get("search") || searchParams.get("query"); // Search query
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const sortBy = searchParams.get("sortBy"); // 'views', 'created_at', 'price'
    const includeHidden = searchParams.get("includeHidden"); // Admin flag to include hidden properties
    const showOnRentMotorbike = searchParams.get("showOnRentMotorbike"); // For rent-motorbike page only

    let query = supabaseAdmin
      .from("properties")
      .select("*");

    // Default sorting or custom sorting
    if (sortBy === "views") {
      query = query.order("views", { ascending: false, nullsFirst: false });
    } else if (sortBy === "price") {
      query = query.order("price", { ascending: true });
    } else {
      // Default: newest first
      query = query.order("created_at", { ascending: false });
    }

    // CRITICAL: Filter by available FIRST - before any other filters
    // This ensures hidden properties are ALWAYS excluded from public listings
    if (!userId && includeHidden !== "true") {
      // For public listings (not user's own), ONLY show available properties
      // Admin can pass includeHidden=true to see all properties
      query = query.eq("available", true);
    }

    // Filter show_on_rent_motorbike flag
    // If showOnRentMotorbike=true: Only show bikes marked for rent-motorbike page
    // If showOnRentMotorbike=false or not set: Exclude bikes marked for rent-motorbike page
    if (showOnRentMotorbike === "true") {
      // Rent-motorbike page: Only show bikes marked for this page
      query = query.eq("show_on_rent_motorbike", true);
    } else if (!userId && includeHidden !== "true") {
      // Other public pages: Exclude bikes marked for rent-motorbike page
      query = query.or("show_on_rent_motorbike.is.null,show_on_rent_motorbike.eq.false");
    }

    // Filter by user_id (for user's own properties)
    // Users can see their own properties even if hidden
    if (userId) {
      query = query.eq("user_id", userId);
    }

    // Filter by listing type (use type field as it stores listing type in current schema)
    if (listingType) {
      // Try both listing_type and type fields for backward compatibility
      query = query.or(`listing_type.eq.${listingType},type.eq.${listingType}`);
    }

    // Filter by featured
    if (featured === "true") {
      query = query.eq("featured", true);
      // Featured properties must also be available (double-check for public listings)
      if (!userId && includeHidden !== "true") {
        query = query.eq("available", true);
      }
    }

    // Filter by area
    if (area) {
      query = query.ilike("area", `%${area}%`);
    }

    // Filter by category (property type: villa, apartment, house, land, motorcycle)
    // The 'type' parameter is used for category filtering
    if (type) {
      const categoryValues = ['villa', 'apartment', 'house', 'land', 'motorcycle', 'motorbike', 'scooter'];
      const normalizedType = type.toLowerCase();
      if (categoryValues.includes(normalizedType)) {
        // Filter by category field - use case-insensitive ilike for better matching
        query = query.ilike("category", normalizedType);
      } else {
        // If not a category value, might be a listing type - handle separately
        // This should already be handled by listingType parameter above
      }
    }

    // Search query (title or description)
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,area.ilike.%${search}%`);
    }

    // Price filters
    if (priceMin) {
      query = query.gte("price", parseInt(priceMin));
    }
    if (priceMax) {
      query = query.lte("price", parseInt(priceMax));
    }

    // Bedrooms filter
    if (bedrooms) {
      query = query.gte("bedrooms", parseInt(bedrooms));
    }

    // Bathrooms filter
    if (bathrooms) {
      query = query.gte("bathrooms", parseInt(bathrooms));
    }

    // Pagination
    // If sorting by views and no limit specified, limit to top results
    if (sortBy === "views" && !limit) {
      query = query.limit(20); // Get top 20 most viewed
    } else if (limit) {
      query = query.limit(parseInt(limit));
    }
    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + (parseInt(limit || "10") - 1));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Convert database properties to app properties
    const properties = (data || []).map(dbPropertyToProperty);

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    const origin = request.headers.get('origin');
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch properties" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/properties - Create a new property (Authenticated users)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 10 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many requests" },
        { status: 429 }
      );
    }

    // Verify authentication (both admin and regular users can create properties)
    const auth = verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // If Supabase is not configured, return error
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured. Please set up environment variables." },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Input validation
    const validation = validateData(propertySchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Sanitize input to prevent XSS attacks
    const sanitizedData = {
      ...validation.data,
      title: sanitizeString(validation.data.title),
      description: sanitizeHTML(validation.data.description || ''),
      location: {
        ...validation.data.location,
        address: sanitizeString(validation.data.location.address || ''),
        area: sanitizeString(validation.data.location.area || ''),
        city: sanitizeString(validation.data.location.city || ''),
      },
      contact: validation.data.contact ? {
        ...validation.data.contact,
        name: sanitizeString(validation.data.contact.name || ''),
        email: sanitizeString(validation.data.contact.email || ''),
        phone: sanitizeString(validation.data.contact.phone || ''),
      } : undefined,
    };

        // Convert app property to database property
        const dbProperty = propertyToDbProperty(sanitizedData);
    
    // Set ownership for property creation
    // For non-admin users, set owner_id and user_id to their user_id
    if (auth.user) {
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", auth.user.email)
        .single();
      
      if (userData) {
        // For non-admin users, always set ownership
        if (auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
          (dbProperty as any).user_id = userData.id;
          (dbProperty as any).owner_id = userData.id;
        } else {
          // For admin users, set ownership only if not already set
          if (!dbProperty.user_id) {
            (dbProperty as any).user_id = userData.id;
          }
          if (!dbProperty.owner_id) {
            (dbProperty as any).owner_id = userData.id;
          }
        }
      } else {
        return NextResponse.json(
          { success: false, error: "User not found. Cannot create property." },
          { status: 404 }
        );
      }
    }
    
    // Insert into database
    // NOTE: This uses supabaseAdmin (service role) to bypass RLS policies
    // RLS Policy required: INSERT policy on properties table
    // Example for users: CREATE POLICY "Users can insert their own properties" ON properties
    //                    FOR INSERT WITH CHECK (auth.uid() = user_id);
    // Example for service role: Service role bypasses RLS by default
    const { data, error } = await supabaseAdmin
      .from("properties")
      .insert(dbProperty)
      .select()
      .single();

        if (error) {
          // eslint-disable-next-line no-console
          console.error("Supabase error:", error);
          
          // Check if this is an RLS (Row Level Security) issue
          if (error.code === "42501" || 
              error.message?.includes("row-level security") || 
              error.message?.includes("policy") ||
              error.message?.includes("violates row-level security")) {
            // eslint-disable-next-line no-console
            console.error("RLS Policy Error: properties table needs INSERT policy");
            return NextResponse.json(
              { 
                success: false, 
                error: "Database permission error. Please check Row Level Security (RLS) policies for the properties table.",
                details: error.message,
                hint: "RLS policies might be blocking the insert. Since we're using supabaseAdmin (service role), RLS should be bypassed. If you still see this error, check: 1) Service role key is correct, 2) RLS is properly configured on properties table"
              },
              { status: 500 }
            );
          }
          
          throw error;
        }

        // Convert back to app property
        const property = dbPropertyToProperty(data);

        return NextResponse.json({
          success: true,
          data: property,
        }, { status: 201 });
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error("Error creating property:", error);
        return NextResponse.json(
          { success: false, error: error.message || "Failed to create property" },
          { status: 500 }
        );
      }
    }
