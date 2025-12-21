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

  // Only check role permissions - middleware handles auth
  // This prevents conflicts between middleware (cookie-based) and client-side (localStorage-based) auth
  useEffect(() => {
    // Don't check if still loading, not mounted, or already attempted
    if (!mounted || loading || redirectAttempted.current) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const currentPath = window.location.pathname;
    
    // Get user from context or token
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    const tokenUser = token ? getUser(token) : null;
    const currentUser = user || tokenUser;

    // Only check role permissions - middleware already verified auth
    if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
      redirectAttempted.current = true;
      const targetPath = currentUser.role === "admin" || currentUser.role === "super_admin" ? "/admin" : "/user";
      if (currentPath !== targetPath) {
        window.location.replace(targetPath);
      }
      return;
    }

    // Auth and role are valid - allow access
    redirectAttempted.current = false;
  }, [mounted, loading, isAuthenticated, user, allowedRoles]);

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

  // Get user for role check
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
    : null;
  const tokenUser = token ? getUser(token) : null;
  const currentUser = user || tokenUser;

  // If user doesn't have required role, show loading (redirect should happen in useEffect)
  // Middleware already verified auth, so we only check roles here
  if (allowedRoles.length > 0) {
    if (!currentUser) {
      // User not loaded yet, show loading
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }
    
    if (!allowedRoles.includes(currentUser.role)) {
      // Wrong role - redirecting (handled in useEffect)
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render children
  // Middleware already verified auth, so we trust it
  return <>{children}</>;
}

