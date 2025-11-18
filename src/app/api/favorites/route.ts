import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { verifyAuth } from "@/lib/api-auth";

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    // Get user_id from users table
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", auth.user!.email)
      .single();

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get favorites with property details
    const { data: favorites, error } = await supabaseAdmin
      .from("favorites")
      .select(`
        id,
        property_id,
        created_at,
        properties (
          id,
          title,
          type,
          listing_type,
          price,
          area,
          city,
          images,
          featured,
          verified
        )
      `)
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: favorites || [],
    });
  } catch (error: any) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Get user_id from users table
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", auth.user!.email)
      .single();

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if favorite already exists
    const { data: existing } = await supabaseAdmin
      .from("favorites")
      .select("id")
      .eq("user_id", userData.id)
      .eq("property_id", propertyId)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Property is already in favorites" },
        { status: 409 }
      );
    }

    // Add favorite
    const { data, error } = await supabaseAdmin
      .from("favorites")
      .insert({
        user_id: userData.id,
        property_id: propertyId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add favorite" },
      { status: 500 }
    );
  }
}

