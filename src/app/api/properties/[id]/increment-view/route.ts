import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// POST /api/properties/[id]/increment-view - Increment property view count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Increment the views count
    const { data, error } = await supabaseAdmin
      .from("properties")
      .update({ views: supabaseAdmin.rpc('increment_views', { property_id: propertyId }) })
      .eq("id", propertyId)
      .select("views")
      .single();

    // If RPC doesn't work, use a simpler approach
    if (error) {
      // Get current views
      const { data: property, error: fetchError } = await supabaseAdmin
        .from("properties")
        .select("views")
        .eq("id", propertyId)
        .single();

      if (fetchError || !property) {
        return NextResponse.json(
          { success: false, error: "Property not found" },
          { status: 404 }
        );
      }

      // Increment and update
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("properties")
        .update({ views: (property.views || 0) + 1 })
        .eq("id", propertyId)
        .select("views")
        .single();

      if (updateError) {
        return NextResponse.json(
          { success: false, error: "Failed to update views" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        views: updated.views,
      });
    }

    return NextResponse.json({
      success: true,
      views: data.views,
    });
  } catch (error: any) {
    console.error("Increment view error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
