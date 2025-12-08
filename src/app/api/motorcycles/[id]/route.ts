import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { verifyAuth } from "@/lib/api-auth";

// GET /api/motorcycles/[id] - Get single motorcycle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const { data: motorcycle, error } = await supabaseAdmin
      .from('motorcycles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: "Motorcycle not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching motorcycle:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch motorcycle" },
        { status: 500 }
      );
    }

    // Increment views
    await supabaseAdmin
      .from('motorcycles')
      .update({ views: (motorcycle.views || 0) + 1 })
      .eq('id', params.id);

    return NextResponse.json({
      success: true,
      data: motorcycle,
    });
  } catch (error: any) {
    console.error("Error fetching motorcycle:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch motorcycle" },
      { status: 500 }
    );
  }
}

// PUT /api/motorcycles/[id] - Update motorcycle (admin only)
export async function PUT(
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

    const body = await request.json();

    // Partial update - only update provided fields
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data: motorcycle, error } = await supabaseAdmin
      .from('motorcycles')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating motorcycle:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to update motorcycle" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: motorcycle,
    });
  } catch (error: any) {
    console.error("Error updating motorcycle:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update motorcycle" },
      { status: 500 }
    );
  }
}

// DELETE /api/motorcycles/[id] - Delete motorcycle (admin only)
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

    const { error } = await supabaseAdmin
      .from('motorcycles')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error("Error deleting motorcycle:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to delete motorcycle" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Error deleting motorcycle:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete motorcycle" },
      { status: 500 }
    );
  }
}
