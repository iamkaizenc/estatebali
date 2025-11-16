import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dbPropertyToProperty, propertyToDbProperty } from "@/lib/supabase";
import { verifyAdminAuth, verifyAuth } from "@/lib/api-auth";
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

// PUT /api/properties/[id] - Update a property (Admin or property owner)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication (both admin and property owner can update)
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

    // Check if user is admin or property owner
    const { data: existingProperty } = await supabaseAdmin
      .from("properties")
      .select("user_id")
      .eq("id", params.id)
      .single();

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // If user is not admin, check if they own the property
    if (auth.user && auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
      // Get user_id from users table
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", auth.user.email)
        .single();

      if (!userData || existingProperty.user_id !== userData.id) {
        return NextResponse.json(
          { success: false, error: "You can only update your own properties" },
          { status: 403 }
        );
      }
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

// DELETE /api/properties/[id] - Delete a property (Admin or property owner)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication (both admin and property owner can delete)
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

    // Check if user is admin or property owner
    const { data: existingProperty } = await supabaseAdmin
      .from("properties")
      .select("user_id")
      .eq("id", params.id)
      .single();

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // If user is not admin, check if they own the property
    if (auth.user && auth.user.role !== 'admin' && auth.user.role !== 'super_admin') {
      // Get user_id from users table
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", auth.user.email)
        .single();

      if (!userData || existingProperty.user_id !== userData.id) {
        return NextResponse.json(
          { success: false, error: "You can only delete your own properties" },
          { status: 403 }
        );
      }
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
