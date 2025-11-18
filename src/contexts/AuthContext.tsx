"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { AuthUser } from "@/types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isRegularUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    if (token) {
      const authUser = getUser(token);
      if (authUser) {
        setUser(authUser);
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.token) {
        localStorage.setItem('auth_token', result.token);
        // Also set admin_token for backward compatibility
        if (typeof document !== 'undefined') {
          const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
          document.cookie = `auth_token=${result.token}; path=/; max-age=${expiresIn}; SameSite=Lax`;
          document.cookie = `admin_token=${result.token}; path=/; max-age=${expiresIn}; SameSite=Lax`;
        }
        const authUser = getUser(result.token);
        if (authUser) {
          setUser(authUser);
          return { success: true };
        }
      }
      return { success: false, error: result.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    // Clear cookie (if in browser)
    if (typeof document !== 'undefined') {
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Lax';
    }
    setUser(null);
    router.push('/login');
  };
  
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isRegularUser = user?.role === 'user' || user?.role === 'owner' || user?.role === 'agent' || user?.role === 'customer';
  const isAuthenticated = !!user;

  // Auto-redirect after login based on role
  useEffect(() => {
    if (!loading && isAuthenticated && user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Only redirect if on login page
      if (currentPath === '/login' || currentPath === '/admin/login') {
        if (user.role === "admin" || user.role === "super_admin") {
          router.replace("/admin");
        } else {
          router.replace("/user");
        }
      }
    }
  }, [loading, isAuthenticated, user, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        isRegularUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Safe version that doesn't throw during SSR/static generation
// Use this in components that might be rendered during static generation
export function useAuthSafe() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values during SSR/static generation
    return {
      user: null,
      loading: false,
      login: async () => ({ success: false, error: "Not available during SSR" }),
      logout: () => {},
      isAuthenticated: false,
      isAdmin: false,
      isRegularUser: false,
    };
  }
  return context;
}
