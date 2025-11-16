import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { verifyAuth } from "@/lib/api-auth";

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
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
    const { name, phone, avatar } = body;

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

    // Update user profile
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", userData.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

