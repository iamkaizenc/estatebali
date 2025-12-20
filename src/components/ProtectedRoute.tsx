"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { getUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/login"
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuthSafe();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only check auth and redirect once after mount and loading complete
  useEffect(() => {
    if (!mounted || loading || hasRedirected) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const currentPath = window.location.pathname;
    
    // Check token directly as fallback
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    const tokenUser = token ? getUser(token) : null;
    const hasAuth = isAuthenticated || !!tokenUser;
    const currentUser = user || tokenUser;

    if (!hasAuth) {
      // No authentication found, redirect to login
      if (currentPath !== redirectTo) {
        setHasRedirected(true);
        window.location.replace(redirectTo);
      }
      return;
    }

    if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
      // User doesn't have required role, redirect to appropriate dashboard
      const targetPath = currentUser.role === "admin" || currentUser.role === "super_admin" ? "/admin" : "/user";
      if (currentPath !== targetPath) {
        setHasRedirected(true);
        window.location.replace(targetPath);
      }
      return;
    }
  }, [mounted, loading, isAuthenticated, user, allowedRoles, redirectTo, hasRedirected]);

  // Show loading while checking auth
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Check token directly as fallback
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
    : null;
  const tokenUser = token ? getUser(token) : null;
  const hasAuth = isAuthenticated || !!tokenUser;
  const currentUser = user || tokenUser;

  // Show redirecting only if we're actually redirecting (hasRedirected is true)
  if (hasRedirected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not redirecting yet, show redirecting
  if (!hasAuth) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (currentPath !== redirectTo) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Redirecting...</p>
          </div>
        </div>
      );
    }
  }

  // If user doesn't have required role and not redirecting yet, show redirecting
  if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
    const targetPath = currentUser.role === "admin" || currentUser.role === "super_admin" ? "/admin" : "/user";
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (currentPath !== targetPath) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Redirecting...</p>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

