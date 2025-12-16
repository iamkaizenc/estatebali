import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// OAuth callback handler
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/user';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_error', requestUrl.origin));
  }

  try {
    // Create Supabase client for OAuth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL('/login?error=oauth_config', requestUrl.origin));
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Exchange code for session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !session) {
      console.error('[OAuth Callback] Error:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_failed', requestUrl.origin));
    }

    const user = session.user;
    const email = user.email;
    const provider = user.app_metadata?.provider || 'oauth';

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=no_email', requestUrl.origin));
    }

    // Check if user exists in users table
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role')
      .eq('email', email)
      .single();

    let userId: string;
    let userRole = 'customer';

    if (existingUser) {
      // User exists, use existing user
      userId = existingUser.id;
      userRole = existingUser.role || 'customer';
    } else {
      // Create new user in users table
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0],
          role: 'customer',
          verified: true, // OAuth users are pre-verified
        })
        .select()
        .single();

      if (createError || !newUser) {
        console.error('[OAuth Callback] Failed to create user:', createError);
        return NextResponse.redirect(new URL('/login?error=user_creation_failed', requestUrl.origin));
      }

      userId = newUser.id;
    }

    // Create JWT token for our auth system
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error('[OAuth Callback] JWT_SECRET not configured');
      return NextResponse.redirect(new URL('/login?error=config_error', requestUrl.origin));
    }

    const token = jwt.sign(
      {
        id: userId,
        email: email,
        name: existingUser?.name || user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0],
        role: userRole,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie and redirect
    const response = NextResponse.redirect(new URL(next, requestUrl.origin));
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[OAuth Callback] Unexpected error:', error);
    return NextResponse.redirect(new URL('/login?error=unexpected', requestUrl.origin));
  }
}
