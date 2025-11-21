import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { verifyAuth } from "@/lib/api-auth";
import { rateLimitByIP } from "@/lib/rate-limit";

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
    // NOTE: Removed 'city' from select as it doesn't exist in the actual database schema
    // The city information can be derived from 'area' or 'address' fields if needed
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
          address,
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
    // Rate limiting
    const rateLimit = rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 20 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many requests" },
        { status: 429 }
      );
    }

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
    // NOTE: This uses supabaseAdmin (service role) to bypass RLS policies
    // RLS Policy required: INSERT policy on favorites table
    // Example: CREATE POLICY "Users can insert their own favorites" ON favorites
    //          FOR INSERT WITH CHECK (auth.uid() = user_id);
    // Service role bypasses RLS by default
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
      
      // Check if this is an RLS (Row Level Security) issue
      if (error.code === "42501" || 
          error.message?.includes("row-level security") || 
          error.message?.includes("policy") ||
          error.message?.includes("violates row-level security")) {
        console.error("RLS Policy Error: favorites table needs INSERT policy");
        return NextResponse.json(
          { 
            success: false, 
            error: "Database permission error. Please check Row Level Security (RLS) policies for the favorites table.",
            details: error.message,
            hint: "RLS policies might be blocking the insert. Since we're using supabaseAdmin (service role), RLS should be bypassed. If you still see this error, check: 1) Service role key is correct, 2) RLS is properly configured on favorites table"
          },
          { status: 500 }
        );
      }
      
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

