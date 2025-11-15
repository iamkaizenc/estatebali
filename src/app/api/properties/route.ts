import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dbPropertyToProperty, propertyToDbProperty } from "@/lib/supabase";
import { verifyAdminAuth } from "@/lib/api-auth";
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
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    let query = supabaseAdmin
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

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

// POST /api/properties - Create a new property (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
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
    
    // Convert app property to database property
    const dbProperty = propertyToDbProperty(body);
    
    // Insert into database
    const { data, error } = await supabaseAdmin
      .from("properties")
      .insert(dbProperty)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Convert back to app property
    const property = dbPropertyToProperty(data);

    return NextResponse.json({
      success: true,
      data: property,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create property" },
      { status: 500 }
    );
  }
}
