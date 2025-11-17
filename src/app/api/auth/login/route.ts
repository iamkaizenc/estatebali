import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { loginSchema, validateData } from "@/lib/validation";
import { rateLimitByEmail } from "@/lib/rate-limit";

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

    // Debug: Log environment variables in API route (runtime check)
    // eslint-disable-next-line no-console
    console.log('[Login API] Runtime Env Check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      allSupabaseKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
    });

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

