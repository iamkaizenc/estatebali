"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === "admin" || user.role === "super_admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
        return;
      }
    }
  }, [mounted, loading, isAuthenticated, user, allowedRoles, router, redirectTo]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="text-center relative z-10">
          {/* Animated spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-2">
            Checking Authentication
          </h2>
          <p className="text-gray-400">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="text-center relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Redirecting to Login
          </h2>
          <p className="text-gray-400">You need to be logged in to access this page...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="text-center relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400">Redirecting to the correct dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

