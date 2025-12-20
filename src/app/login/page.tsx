"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Link from "next/link";
import { Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { decodeJWT } from "@/lib/jwt-utils";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, loading: authLoading } = useAuthSafe();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated (but not if coming from logout)
  useEffect(() => {
    // Don't do anything while still loading
    if (authLoading || loading) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    // Check if this is a logout redirect
    const isLogoutRedirect = new URLSearchParams(window.location.search).get('logout') === 'true';
    
    // If logout redirect, clean up URL immediately and don't redirect
    if (isLogoutRedirect) {
      window.history.replaceState({}, '', '/login');
      return; // Don't redirect if coming from logout
    }
    
    // Only redirect if authenticated AND not a logout redirect AND we have a valid user
    // AND we're not already on the target page
    if (isAuthenticated && user && user.id && user.email && !isLogoutRedirect) {
      const targetPath = user.role === "admin" || user.role === "super_admin" ? "/admin" : "/user";
      const currentPath = window.location.pathname;
      
      // Only redirect if we're not already on the target page
      if (currentPath !== targetPath) {
        // Use replace to avoid adding to history
        window.location.replace(targetPath);
      }
    }
  }, [authLoading, loading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.debug('[Login Page] Form submitted', { email });
    setError("");
    setLoading(true);

    // Safety check: ensure we're in browser environment
    if (typeof window === 'undefined') {
      setError("Please wait for the page to load completely");
      setLoading(false);
      return;
    }

    try {
      logger.debug('[Login Page] Calling login function');
      const result = await login(email, password);
      logger.debug('[Login Page] Login result', { success: result.success, hasError: !!result.error });

      if (result.success) {
        // Wait a moment for AuthContext to update
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Get user from token after login
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
          : null;
        
        if (token) {
          // Decode JWT token to get user role
          const payload = decodeJWT(token);
          if (payload && payload.role) {
            const userRole = payload.role;
            const targetPath = userRole === "admin" || userRole === "super_admin" ? "/admin" : "/user";
            
            // Use window.location for reliable redirect
            if (typeof window !== 'undefined') {
              window.location.href = targetPath;
            }
            return;
          }
        }
        
        // Fallback: wait for context update then redirect
        setTimeout(() => {
          const currentUser = user;
          if (currentUser) {
            const targetPath = currentUser.role === "admin" || currentUser.role === "super_admin" ? "/admin" : "/user";
            if (typeof window !== 'undefined') {
              window.location.href = targetPath;
            }
          } else {
            // Last resort: redirect to user dashboard
            if (typeof window !== 'undefined') {
              window.location.href = "/user";
            }
          }
        }, 300);
      } else {
        // Show error message
        const errorMessage = result.error;
        if (errorMessage && !errorMessage.includes("SSR") && !errorMessage.includes("Not available")) {
          setError(errorMessage);
        } else {
          setError("Invalid email or password");
        }
        setLoading(false);
      }
    } catch (err: any) {
      logger.error('Login page error', err instanceof Error ? err : new Error(String(err)));
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-gray-400">Estate Bali - Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="login-email"
                  name="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="login-password"
                  name="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          {/* OAuth Providers */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-100 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={async () => {
                  if (!supabase) {
                    setError("OAuth is not configured");
                    return;
                  }
                  setLoading(true);
                  setError("");
                  try {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      }
                    });
                    if (error) throw error;
                  } catch (err: any) {
                    logger.error('Google OAuth error', err instanceof Error ? err : new Error(String(err)));
                    setError(err.message || "Failed to sign in with Google");
                    setLoading(false);
                  }
                }}
                disabled={loading || !supabase}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-200 hover:bg-dark-300 rounded-xl border border-dark-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>

              {/* Apple Sign In */}
              <button
                type="button"
                onClick={async () => {
                  if (!supabase) {
                    setError("OAuth is not configured");
                    return;
                  }
                  setLoading(true);
                  setError("");
                  try {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'apple',
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      }
                    });
                    if (error) throw error;
                  } catch (err: any) {
                    logger.error('Apple OAuth error', err instanceof Error ? err : new Error(String(err)));
                    setError(err.message || "Failed to sign in with Apple");
                    setLoading(false);
                  }
                }}
                disabled={loading || !supabase}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-200 hover:bg-dark-300 rounded-xl border border-dark-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

