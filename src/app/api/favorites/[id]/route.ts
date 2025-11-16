import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { verifyAuth } from "@/lib/api-auth";

// DELETE /api/favorites/[id] - Remove a favorite
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if favorite belongs to user
    const { data: favorite } = await supabaseAdmin
      .from("favorites")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userData.id)
      .single();

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: "Favorite not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete favorite
    const { error } = await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting favorite:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Favorite removed successfully",
    });
  } catch (error: any) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete favorite" },
      { status: 500 }
    );
  }
}

