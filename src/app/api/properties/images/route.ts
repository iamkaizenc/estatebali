import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { verifyAuth } from "@/lib/api-auth";

// POST /api/properties/images - Upload image to storage
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin or agent
    if (!auth.user || (auth.user.role !== 'admin' && auth.user.role !== 'super_admin' && auth.user.role !== 'agent')) {
      return NextResponse.json(
        { success: false, error: "Only admins and agents can upload images" },
        { status: 403 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = (formData.get('bucket') as string) || 'property-images';

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("[API Properties Images] Upload error:", uploadError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to upload image",
          details: uploadError.message 
        },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      data: {
        url: urlData.publicUrl,
        path: filePath,
        name: file.name,
        size: file.size,
        type: file.type
      }
    });
  } catch (error: any) {
    console.error("[API Properties Images] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/images - Delete image from storage
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin or agent
    if (!auth.user || (auth.user.role !== 'admin' && auth.user.role !== 'super_admin' && auth.user.role !== 'agent')) {
      return NextResponse.json(
        { success: false, error: "Only admins and agents can delete images" },
        { status: 403 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const bucketName = searchParams.get('bucket') || 'property-images';

    if (!path) {
      return NextResponse.json(
        { success: false, error: "Image path is required" },
        { status: 400 }
      );
    }

    // Delete from Supabase Storage using admin client (bypasses RLS)
    const { error: deleteError } = await supabaseAdmin.storage
      .from(bucketName)
      .remove([path]);

    if (deleteError) {
      console.error("[API Properties Images] Delete error:", deleteError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to delete image",
          details: deleteError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error: any) {
    console.error("[API Properties Images] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}

