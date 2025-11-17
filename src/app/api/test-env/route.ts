import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";

// GET /api/test-env - Test environment variables (for debugging)
export async function GET(request: NextRequest) {
  // Allow in all environments for debugging

  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
      process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + "..." : "MISSING",
    isSupabaseConfigured,
    hasSupabaseAdmin: !!supabaseAdmin,
    nodeEnv: process.env.NODE_ENV,
  };

  // Try to test Supabase connection
  let connectionTest = null;
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("count")
        .limit(1);
      
      connectionTest = {
        success: !error,
        error: error?.message || null,
      };
    } catch (err: any) {
      connectionTest = {
        success: false,
        error: err.message,
      };
    }
  }

  return NextResponse.json({
    environment: envCheck,
    connectionTest,
    message: "Environment variables check",
  });
}

