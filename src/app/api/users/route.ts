import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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

    // ✅ Fix: Her durum için ayrı sorgu yap, doğru şekilde zincirle
    let data, error;

    if (id) {
      const result = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      data = result.data;
      error = result.error;
    } else if (email) {
      const result = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
      data = result.data;
      error = result.error;
    } else {
      return NextResponse.json(
        { success: false, error: "email or id parameter required" },
        { status: 400 }
      );
    }

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

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update a user by id
export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to update user" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete a user by id
export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to delete user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}

