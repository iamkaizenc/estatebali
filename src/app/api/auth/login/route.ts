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
    // Uses Redis in production, falls back to in-memory in development
    const rateLimit = await rateLimitByEmail(email, { windowMs: 15 * 60 * 1000, maxRequests: 5 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Get Supabase configuration from environment
    // SECURITY: Only use server-side SUPABASE_SERVICE_ROLE_KEY, never NEXT_PUBLIC_ variant
    const runtimeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // If environment variables are NOT available, return error
    if (!runtimeUrl || !runtimeServiceKey) {
      const missing = [];
      if (!runtimeUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!runtimeServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

      console.error('[Login API] Missing environment variables:', missing.join(', '));

      return NextResponse.json(
        {
          success: false,
          error: "Authentication service is temporarily unavailable. Please try again later."
        },
        { status: 500 }
      );
    }

    // Attempt login
    console.log('[Login API] Attempting login for email:', email);
    const result = await loginUser(email, password);
    console.log('[Login API] Login result:', {
      success: result.success,
      hasToken: !!result.token,
      error: result.error || null,
    });

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

