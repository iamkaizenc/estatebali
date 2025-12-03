// Authentication utility with role-based access (admin and user)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthUser, UserRole } from "@/types";
import { createClient } from '@supabase/supabase-js';

// Get JWT secret from environment variable
// In production, this should be a strong, random secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRATION = '7d'; // Token expires in 7 days

// JWT token creation with proper encryption
function createToken(user: AuthUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
  };

  // Sign JWT token with expiration
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    algorithm: 'HS256',
  });
}

// JWT token verification with proper validation
function verifyToken(token: string): AuthUser | null {
  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      phone?: string;
      avatar?: string;
    };

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      phone: decoded.phone,
      avatar: decoded.avatar,
    };
  } catch (error) {
    // Token is invalid or expired
    if (process.env.NODE_ENV === 'development') {
      console.error('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

// Login function for both admin and regular users
export async function loginUser(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // ALWAYS create Supabase client at runtime (don't rely on module-level import)
    // This ensures environment variables are loaded
    const runtimeSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const runtimeSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
      || process.env.SUPABASE_SERVICE_KEY 
      || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Login] Runtime Env Check:', {
        hasUrl: !!runtimeSupabaseUrl,
        hasServiceKey: !!runtimeSupabaseServiceKey,
      });
    }
    
    // Create admin client at runtime
    // NOTE: This function should only be called from server-side (API routes)
    if (!runtimeSupabaseUrl || !runtimeSupabaseServiceKey) {
      const missingVars: string[] = [];
      if (!runtimeSupabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!runtimeSupabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
      
      console.error("[Login] Missing environment variables:", missingVars.join(', '));
      
      return { 
        success: false, 
        error: "Authentication service is temporarily unavailable. Please try again later."
      };
    }
    
    // Create Supabase admin client at runtime
    const adminClient = createClient(runtimeSupabaseUrl, runtimeSupabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // First, try to find in admin_users table
    const { data: adminUser, error: adminError } = await adminClient
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("active", true)
      .single();

    if (adminUser && !adminError) {
      // Verify password - password_hash is required
      if (!adminUser.password_hash) {
        return { 
          success: false, 
          error: "Account configuration error. Please contact administrator." 
        };
      }

      const passwordMatch = await bcrypt.compare(password, adminUser.password_hash);
      
      if (!passwordMatch) {
        return { success: false, error: "Invalid email or password" };
      }

      // Update last login
      await adminClient
        .from("admin_users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", adminUser.id);

      const user: AuthUser = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role as UserRole,
      };
      
      const token = createToken(user);
      return { success: true, token };
    }

    // If not found in admin_users, try users table
    const { data: regularUser, error: userError } = await adminClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (regularUser && !userError) {
      // For regular users, we need to check if they have a password_hash
      // If not, we'll need to add password authentication to users table
      // For now, we'll use a simple check
      if (regularUser.password_hash) {
        const passwordMatch = await bcrypt.compare(password, regularUser.password_hash);
        if (!passwordMatch) {
          return { success: false, error: "Invalid email or password" };
        }
      } else {
        // If no password_hash, check if it's a test user
        // In production, all users should have password_hash
        return { success: false, error: "Password not set. Please contact administrator." };
      }

      const user: AuthUser = {
        id: regularUser.id,
        email: regularUser.email,
        name: regularUser.name,
        role: regularUser.role === "customer" ? "user" : (regularUser.role as UserRole),
        phone: regularUser.phone,
        avatar: regularUser.avatar,
      };
      
      const token = createToken(user);
      return { success: true, token };
    }

    return { success: false, error: "Invalid email or password" };
  } catch (error: any) {
    // Always log errors
    // eslint-disable-next-line no-console
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

// Legacy function for backward compatibility
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const result = await loginUser(email, password);
  if (result.success && result.token) {
    const user = getUser(result.token);
    if (user && (user.role === "admin" || user.role === "super_admin")) {
      return result;
    }
    return { success: false, error: "Admin access required" };
  }
  return result;
}

export function getUser(token: string | null): AuthUser | null {
  if (!token) return null;
  return verifyToken(token);
}

// Legacy function for backward compatibility
export function getAdminUser(token: string | null): AuthUser | null {
  const user = getUser(token);
  if (user && (user.role === "admin" || user.role === "super_admin")) {
    return user;
  }
  return null;
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'super_admin';
}

export function isUser(user: AuthUser | null): boolean {
  return user?.role === 'user' || user?.role === 'owner' || user?.role === 'agent' || user?.role === 'customer';
}

// Legacy functions for backward compatibility
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
  if (!token) return false;
  
  const user = getUser(token);
  return !!user && (user.role === 'admin' || user.role === 'super_admin');
}

export function getAdminEmail(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
  if (!token) return null;
  
  const user = getUser(token);
  return user?.email || null;
}

export function logout(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("admin_token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("admin_authenticated");
  localStorage.removeItem("admin_email");
  localStorage.removeItem("admin_login_time");
  
  // Clear cookie
  if (typeof document !== 'undefined') {
    document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  }
  
  window.location.href = "/login";
}

// Re-export verifyAuth functions for backward compatibility
// Some API routes import from @/lib/auth instead of @/lib/api-auth
export { verifyAuth, verifyAdminAuth, verifyUserAuth } from './api-auth';
