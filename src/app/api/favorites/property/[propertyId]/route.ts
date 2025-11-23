import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { verifyAuth } from "@/lib/api-auth";
import { rateLimitByIP } from "@/lib/rate-limit";

// DELETE /api/favorites/property/[propertyId] - Remove favorite by property ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 20 });
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

    // Delete favorite by property_id and user_id
    const { error } = await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("property_id", params.propertyId)
      .eq("user_id", userData.id);

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

