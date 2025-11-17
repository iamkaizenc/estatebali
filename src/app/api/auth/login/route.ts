import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { loginSchema, validateData } from "@/lib/validation";
import { rateLimitByEmail } from "@/lib/rate-limit";
import { createClient } from '@supabase/supabase-js';

// POST /api/auth/login - Login endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Input validation
    const validation = validateData(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Rate limiting by email (5 attempts per 15 minutes)
    const rateLimit = rateLimitByEmail(email, { windowMs: 15 * 60 * 1000, maxRequests: 5 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Debug: Log ALL environment variables (to see what's actually available)
    // eslint-disable-next-line no-console
    console.log('[Login API] ALL Environment Variables:', {
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('VERCEL')),
      hasNextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasNextPublicSupabaseServiceRoleKey: !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
    });

    // Try multiple possible environment variable names
    const runtimeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
      || process.env.SUPABASE_SERVICE_KEY 
      || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    
    // eslint-disable-next-line no-console
    console.log('[Login API] Runtime Env Check:', {
      hasUrl: !!runtimeUrl,
      urlValue: runtimeUrl ? `${runtimeUrl.substring(0, 30)}...` : 'MISSING',
      hasServiceKey: !!runtimeServiceKey,
      serviceKeyLength: runtimeServiceKey?.length || 0,
      serviceKeyPreview: runtimeServiceKey ? `${runtimeServiceKey.substring(0, 30)}...` : 'MISSING',
    });

    // If environment variables are NOT available, return detailed error
    if (!runtimeUrl || !runtimeServiceKey) {
      const missing = [];
      if (!runtimeUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!runtimeServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      
      // eslint-disable-next-line no-console
      console.error('[Login API] ❌ Missing environment variables:', {
        missing,
        availableSupabaseKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Supabase configuration error: Missing environment variables: ${missing.join(', ')}. Please check Vercel environment variables. Available SUPABASE keys: ${Object.keys(process.env).filter(k => k.includes('SUPABASE')).join(', ') || 'NONE'}` 
        },
        { status: 500 }
      );
    }

    // Attempt login
    const result = await loginUser(email, password);

    if (result.success && result.token) {
      // Set cookie
      const response = NextResponse.json({
        success: true,
        token: result.token,
        message: "Login successful",
      });

      // Set httpOnly cookie for better security
      response.cookies.set('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: result.error || "Invalid email or password" },
      { status: 401 }
    );
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}

