import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

// GET /api/users - Get user by email or id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    let query = supabaseAdmin.from("users").select("*");

    if (id) {
      query = query.eq("id", id).single();
    } else if (email) {
      query = query.eq("email", email).single();
    } else {
      return NextResponse.json(
        { success: false, error: "email or id parameter required" },
        { status: 400 }
      );
    }

    const { data, error } = await query;

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        role: data.role,
        verified: data.verified,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

