import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Decode JWT token payload without verification
 * Note: This is only used for routing decisions in middleware.
 * Actual token verification happens in API routes using jwt.verify()
 *
 * Edge Runtime doesn't support all Node.js crypto APIs, so we do basic
 * JWT decoding here and rely on API routes for security verification.
 */
function decodeJWT(token: string): any {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    // JWT uses base64url encoding, not standard base64
    const payload = parts[1];

    // Convert base64url to base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    // Decode using atob (Edge Runtime compatible)
    // atob is available in Edge Runtime
    let decoded: any;
    try {
      decoded = JSON.parse(atob(padded));
    } catch (e) {
      // Fallback for environments where atob might not work
      return null;
    }

    // Check expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null; // Token expired
    }

    return decoded;
  } catch (error) {
    // Invalid JWT format
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value ||
                request.cookies.get('admin_token')?.value;

  // Parse user from token if exists
  let user: any = null;
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded) {
      user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      };
    }
  }

  // Admin routes protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token || !user) {
      // Redirect to home page if no session (logout scenario)
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      // Redirect non-admin users to their dashboard
      return NextResponse.redirect(new URL('/user', request.url));
    }
  }
  
  // Redirect /admin/login to unified login page
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // User routes protection
  if (pathname.startsWith('/user')) {
    if (!token || !user) {
      // Redirect to home page if no session (logout scenario)
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow admin users to access user routes too (for testing/managing)
    // Only redirect if explicitly needed
    // if (user.role === 'admin' || user.role === 'super_admin') {
    //   // Redirect admin users to admin dashboard
    //   return NextResponse.redirect(new URL('/admin', request.url));
    // }
  }

  // Redirect /login if already authenticated
  if (pathname === '/login') {
    if (token && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/user', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/login',
    '/admin/login',
  ],
};
