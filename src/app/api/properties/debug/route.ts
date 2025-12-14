import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

// GET /api/properties/debug - Debug endpoint for iOS app
export async function GET(request: NextRequest) {
  try {
    // CORS headers for mobile app access
    const origin = request.headers.get('origin');
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: corsHeaders });
    }

    // Check Supabase configuration
    const supabaseConfigured = isSupabaseConfigured && !!supabaseAdmin;

    if (!supabaseConfigured) {
      return NextResponse.json({
        success: false,
        error: "Supabase not configured",
        debug: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        }
      }, { headers: corsHeaders });
    }

    // Get properties count
    const { count, error: countError } = await supabaseAdmin
      .from("properties")
      .select("*", { count: 'exact', head: true });

    // Get available properties count
    const { count: availableCount, error: availableError } = await supabaseAdmin
      .from("properties")
      .select("*", { count: 'exact', head: true })
      .eq("available", true);

    // Get sample properties
    const { data: sampleProperties, error: sampleError } = await supabaseAdmin
      .from("properties")
      .select("id, title, available, listing_type, category")
      .eq("available", true)
      .limit(5);

    return NextResponse.json({
      success: true,
      debug: {
        supabaseConfigured,
        totalProperties: count || 0,
        availableProperties: availableCount || 0,
        sampleProperties: sampleProperties || [],
        errors: {
          count: countError?.message,
          available: availableError?.message,
          sample: sampleError?.message,
        }
      }
    }, { headers: corsHeaders });
  } catch (error: any) {
    const origin = request.headers.get('origin');
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    return NextResponse.json(
      { success: false, error: error.message || "Debug endpoint error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
