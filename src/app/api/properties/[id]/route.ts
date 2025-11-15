import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dbPropertyToProperty, propertyToDbProperty } from "@/lib/supabase";
import { verifyAdminAuth } from "@/lib/api-auth";
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

    const { data, error } = await supabaseAdmin
      .from("properties")
      .select("*")
      .eq("id", params.id)
      .single();

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

// PUT /api/properties/[id] - Update a property (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Update in database
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

// DELETE /api/properties/[id] - Delete a property (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
