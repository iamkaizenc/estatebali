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
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check token directly from localStorage as fallback
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (token) {
        const tokenUser = getUser(token);
        if (tokenUser) {
          // Token exists and is valid, but context might not be updated yet
          // Give context a moment to update before redirecting
          const timeout = setTimeout(() => {
            setCheckingAuth(false);
          }, 100);
          return () => clearTimeout(timeout);
        }
      }
      setCheckingAuth(false);
    } else if (mounted) {
      setCheckingAuth(false);
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && !loading && !checkingAuth) {
      // Check token directly as fallback
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
        : null;
      const tokenUser = token ? getUser(token) : null;
      const hasAuth = isAuthenticated || !!tokenUser;
      const currentUser = user || tokenUser;

      if (!hasAuth) {
        // No authentication found, redirect to login
        // Use a one-time redirect flag to prevent loops
        if (typeof window !== 'undefined') {
          const redirectKey = `redirected_${redirectTo}_${Date.now()}`;
          if (!sessionStorage.getItem(redirectKey)) {
            sessionStorage.setItem(redirectKey, 'true');
            window.location.href = redirectTo;
          }
        }
        return;
      }

      if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
        // User doesn't have required role, redirect to appropriate dashboard
        const targetPath = currentUser.role === "admin" || currentUser.role === "super_admin" ? "/admin" : "/user";
        if (typeof window !== 'undefined') {
          // Use a one-time redirect flag to prevent loops
          const redirectKey = `redirected_${targetPath}_${Date.now()}`;
          if (!sessionStorage.getItem(redirectKey)) {
            sessionStorage.setItem(redirectKey, 'true');
            window.location.href = targetPath;
          }
        }
        return;
      }
    }
  }, [mounted, loading, checkingAuth, isAuthenticated, user, allowedRoles, redirectTo]);

  if (!mounted || loading || checkingAuth) {
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

  if (!hasAuth) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

