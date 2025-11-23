import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { dbPropertyToProperty, propertyToDbProperty } from "@/lib/supabase";
import { verifyAdminAuth, verifyAuth } from "@/lib/api-auth";
import { propertySchema, validateData } from "@/lib/validation";
import { rateLimitByIP } from "@/lib/rate-limit";
import { sanitizeString, sanitizeHTML } from "@/lib/sanitization";
import { mockProperties } from "@/data/mockData";

// GET /api/properties - Get all properties
export async function GET(request: NextRequest) {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured || !supabaseAdmin) {
      const { searchParams } = new URL(request.url);
      const listingType = searchParams.get("listingType");
      const featured = searchParams.get("featured");
      const area = searchParams.get("area");

      let filteredProperties = [...mockProperties];

      if (listingType) {
        filteredProperties = filteredProperties.filter(p => p.listingType === listingType);
      }
      if (featured === "true") {
        filteredProperties = filteredProperties.filter(p => p.featured);
      }
      if (area) {
        filteredProperties = filteredProperties.filter(p =>
          p.location.area.toLowerCase().includes(area.toLowerCase())
        );
      }

      return NextResponse.json({
        success: true,
        data: filteredProperties,
        count: filteredProperties.length,
        usingMockData: true,
      });
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

    let query = supabaseAdmin
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by user_id (for user's own properties)
    if (userId) {
      query = query.eq("user_id", userId);
    }

    // Filter by listing type
    if (listingType) {
      query = query.eq("listing_type", listingType);
    }

    // Filter by featured
    if (featured === "true") {
      query = query.eq("featured", true);
    }

    // Filter by area
    if (area) {
      query = query.ilike("area", `%${area}%`);
    }

    // Filter by type
    if (type) {
      query = query.eq("type", type);
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
    if (limit) {
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
    });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch properties" },
      { status: 500 }
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
      contact: {
        ...validation.data.contact,
        name: sanitizeString(validation.data.contact.name),
        email: sanitizeString(validation.data.contact.email),
        phone: sanitizeString(validation.data.contact.phone),
      },
    };

        // Convert app property to database property
        const dbProperty = propertyToDbProperty(sanitizedData);
    
    // Add user_id if user is not admin (admin can create for others)
    // NOTE: RLS policies may require user_id for INSERT operations
    if (auth.user && auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
      // For regular users, set their user_id
      // Note: We need to get user_id from users table by email
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", auth.user.email)
        .single();
      
      if (userData) {
        (dbProperty as any).user_id = userData.id;
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
