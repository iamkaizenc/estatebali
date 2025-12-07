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
    // Check if user is logged in on mount (client-side only)
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

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
    // Safety check: ensure we're in browser environment
    if (typeof window === 'undefined') {
      return { success: false, error: 'Login is only available in the browser' };
    }

    console.log('[Login] Attempting login for:', email);
    
    try {
      console.log('[Login] Sending request to /api/auth/login');
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('[Login] Response status:', response.status, response.statusText);
      const result = await response.json();
      console.log('[Login] Response data:', { success: result.success, hasToken: !!result.token, error: result.error });

      if (result.success && result.token) {
        // Store token (client-side only)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', result.token);
        }
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
    // Clear storage (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_token');
    }
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
    // These are safe defaults that won't cause errors
    // The actual context will be available after client-side hydration
    return {
      user: null,
      loading: true, // Set to true initially to prevent flash of content
      login: async (): Promise<{ success: boolean; error?: string }> => {
        // During SSR or before hydration, return a safe response
        // This function should only be called in response to user actions (client-side)
        // If context isn't available, it means we're still hydrating or in SSR
        // Return a safe response that won't cause errors
        return { success: false, error: 'Authentication not available during SSR' };
      },
      logout: () => {
        // Safe logout that works even if context isn't available
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('admin_token');
          } catch (e) {
            // Silently fail
          }
        }
        if (typeof document !== 'undefined') {
          try {
            document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
            document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Lax';
          } catch (e) {
            // Silently fail
          }
        }
        // Try to redirect if we're in the browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },
      isAuthenticated: false,
      isAdmin: false,
      isRegularUser: false,
    };
  }
  return context;
}
