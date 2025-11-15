import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value || 
                request.cookies.get('admin_token')?.value;

  // Parse user from token if exists
  let user: any = null;
  if (token) {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      user = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
    } catch {
      // Invalid token, ignore
    }
  }

  // Admin routes protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token || !user) {
      return NextResponse.redirect(new URL('/login', request.url));
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
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role === 'admin' || user.role === 'super_admin') {
      // Redirect admin users to admin dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    }
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
