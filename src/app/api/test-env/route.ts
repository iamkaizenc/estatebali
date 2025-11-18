import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/test-env - Test environment variables (for debugging)
export async function GET(request: NextRequest) {
  // Allow in all environments for debugging

  // Get all environment variables that contain SUPABASE
  const allSupabaseEnvVars = Object.keys(process.env)
    .filter(key => key.includes('SUPABASE'))
    .reduce((acc, key) => {
      acc[key] = {
        exists: !!process.env[key],
        length: process.env[key]?.length || 0,
        preview: process.env[key] ? `${process.env[key]!.substring(0, 30)}...` : 'MISSING',
      };
      return acc;
    }, {} as Record<string, { exists: boolean; length: number; preview: string }>);

  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
      process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + "..." : "MISSING",
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    serviceKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
      `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 30)}...` : "MISSING",
    isSupabaseConfigured,
    hasSupabaseAdmin: !!supabaseAdmin,
    nodeEnv: process.env.NODE_ENV,
    allSupabaseEnvVars, // Show all SUPABASE-related env vars
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

