"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Link from "next/link";
import { Lock, User, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { decodeJWT } from "@/lib/jwt-utils";
import { logger } from "@/lib/logger";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, loading: authLoading } = useAuthSafe();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get reset success status from URL
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reset') === 'true') {
        setShowResetSuccess(true);
        // Clean up URL
        window.history.replaceState({}, '', '/login');
      }
    }
  }, []);

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

          {showResetSuccess && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Password reset successful! You can now login with your new password.</span>
            </div>
          )}

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


          <div className="mt-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Show success message if coming from password reset */}
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('reset') === 'true' && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Password reset successful! You can now login with your new password.</span>
            </div>
          )}

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

