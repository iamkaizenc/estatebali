"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "admin" || user.role === "super_admin") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Get user from token after login
      const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token));
          const userRole = payload.role;
          
          // Auto-redirect based on role
          if (userRole === "admin" || userRole === "super_admin") {
            router.push("/admin");
          } else {
            router.push("/user");
          }
        } catch {
          // If token parsing fails, wait for context to update
          setTimeout(() => {
            if (user) {
              if (user.role === "admin" || user.role === "super_admin") {
                router.push("/admin");
              } else {
                router.push("/user");
              }
            }
          }, 100);
        }
      }
    } else {
      setError(result.error || "Invalid email or password");
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
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
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
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
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

          <div className="mt-6 pt-6 border-t border-dark-300">
            <p className="text-xs text-gray-500 text-center mb-2">
              Test Credentials:
            </p>
            <div className="text-xs text-gray-500 text-center space-y-1">
              <div>Admin: admin@estatebali.app / admin123</div>
              <div>User: user@estatebali.app / user123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

