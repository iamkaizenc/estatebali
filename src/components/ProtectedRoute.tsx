"use client";

import { useEffect, useState, useRef } from "react";
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
  const [mounted, setMounted] = useState(false);
  const redirectAttempted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only redirect once, and only after everything is loaded
  useEffect(() => {
    // Don't redirect if still loading, not mounted, or already attempted
    if (!mounted || loading || redirectAttempted.current) {
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

    // Mark redirect as attempted to prevent loops
    redirectAttempted.current = true;

    if (!hasAuth) {
      // No authentication found - middleware should have handled this, but redirect just in case
      if (currentPath !== redirectTo) {
        window.location.replace(redirectTo);
      }
      return;
    }

    // Check role permissions
    if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
      const targetPath = currentUser.role === "admin" || currentUser.role === "super_admin" ? "/admin" : "/user";
      if (currentPath !== targetPath) {
        window.location.replace(targetPath);
      }
      return;
    }

    // If we get here, auth is valid and role is correct - allow access
    // Reset redirectAttempted so component can re-check if needed
    redirectAttempted.current = false;
  }, [mounted, loading, isAuthenticated, user, allowedRoles, redirectTo]);

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

  // Check auth status
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
    : null;
  const tokenUser = token ? getUser(token) : null;
  const hasAuth = isAuthenticated || !!tokenUser;
  const currentUser = user || tokenUser;

  // If not authenticated, middleware should have redirected, but show loading just in case
  if (!hasAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have required role, show loading (redirect should happen in useEffect)
  if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

