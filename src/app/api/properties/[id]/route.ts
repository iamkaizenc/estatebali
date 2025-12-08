import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { dbPropertyToProperty, propertyToDbProperty } from "@/lib/supabase";
import { verifyAdminAuth, verifyAuth } from "@/lib/api-auth";
import { rateLimitByIP } from "@/lib/rate-limit";
import { mockProperties } from "@/data/mockData";

// GET /api/properties/[id] - Get a single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured || !supabaseAdmin) {
      const property = mockProperties.find(p => p.id === params.id);
      if (!property) {
        return NextResponse.json(
          { success: false, error: "Property not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: property,
        usingMockData: true,
      });
    }

    // Check if request includes admin token (to allow viewing hidden properties)
    const authHeader = request.headers.get("authorization");
    const isAdminRequest = authHeader?.startsWith("Bearer ");
    
    let query = supabaseAdmin
      .from("properties")
      .select("*")
      .eq("id", params.id);
    
    // For public requests (no admin token), only show available properties
    if (!isAdminRequest) {
      query = query.eq("available", true);
    }
    
    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    const property = dbPropertyToProperty(data);

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update a property (Admin or property owner)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 10 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many requests" },
        { status: 429 }
      );
    }

    // Verify authentication - RLS will handle authorization
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
    
    // Check if this is a partial update (e.g., just updating 'available' field)
    const isPartialUpdate = Object.keys(body).length === 1 && body.hasOwnProperty('available');
    
    let dbProperty: Partial<any>;
    
    if (isPartialUpdate) {
      // For partial updates (like just toggling available), only update that field
      // Don't use propertyToDbProperty as it might add unwanted fields
      dbProperty = {
        available: body.available
      };
    } else {
      // For full updates, convert app property to database property
      dbProperty = propertyToDbProperty(body);
      
      // Get user_id for ownership check (if not admin)
      // For admin users, we'll set owner_id/user_id if needed
      if (auth.user && auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
        // Get user_id from users table to set ownership
        const { data: userData } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", auth.user.email)
          .single();
        
        if (userData) {
          // Ensure ownership is maintained for non-admin users
          (dbProperty as any).user_id = userData.id;
          if (!dbProperty.owner_id) {
            (dbProperty as any).owner_id = userData.id;
          }
        }
      }
    }
    
    // Get existing property to preserve listing_source if not being updated
    if (!isPartialUpdate && !body.source && !dbProperty.listing_source) {
      const { data: existing } = await supabaseAdmin
        .from("properties")
        .select("listing_source")
        .eq("id", params.id)
        .single();
      
      if (existing?.listing_source) {
        // Preserve existing listing_source if not being updated
        (dbProperty as any).listing_source = existing.listing_source;
      }
    }
    
    // Update in database - RLS will enforce ownership/admin rules
    // Using supabaseAdmin bypasses RLS, but we still need to check auth
    // For proper RLS, we should use regular supabase client, but service role
    // allows admin operations without RLS interference
    const { data, error } = await supabaseAdmin
      .from("properties")
      .update(dbProperty)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: "Property not found" },
          { status: 404 }
        );
      }
      // Check for RLS violations (shouldn't happen with service role, but just in case)
      if (error.code === '42501' || error.message?.includes("row-level security")) {
        return NextResponse.json(
          { success: false, error: "Permission denied. You can only update your own properties." },
          { status: 403 }
        );
      }
      throw error;
    }

    const property = dbPropertyToProperty(data);

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete a property (Admin or property owner)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 5 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many requests" },
        { status: 429 }
      );
    }

    // Verify authentication - RLS will handle authorization
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

    // Check if property exists first
    const { data: existingProperty } = await supabaseAdmin
      .from("properties")
      .select("id, owner_id, user_id")
      .eq("id", params.id)
      .single();

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // For non-admin users, verify ownership (RLS would do this, but we check explicitly for better error messages)
    if (auth.user && auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", auth.user.email)
        .single();

      if (!userData || (existingProperty.owner_id !== userData.id && existingProperty.user_id !== userData.id)) {
        return NextResponse.json(
          { success: false, error: "You can only delete your own properties" },
          { status: 403 }
        );
      }
    }

    // Delete property - RLS would enforce this, but service role bypasses
    const { error } = await supabaseAdmin
      .from("properties")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete property" },
      { status: 500 }
    );
  }
}
