// Authentication utility with role-based access (admin and user)
import bcrypt from "bcryptjs";
import { AuthUser, UserRole } from "@/types";
import { createClient } from '@supabase/supabase-js';

// Simple token creation (In production, use JWT)
function createToken(user: AuthUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    timestamp: Date.now(),
  };
  // Simple base64 encoding (In production, use proper JWT)
  return btoa(JSON.stringify(payload));
}

// Simple token verification (In production, use proper JWT verification)
function verifyToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token));
    // Check if token is expired (7 days)
    const tokenAge = Date.now() - payload.timestamp;
    const daysOld = tokenAge / (1000 * 60 * 60 * 24);
    
    if (daysOld > 7) {
      return null; // Token expired
    }
    
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
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
    
    // eslint-disable-next-line no-console
    console.log('[Login] Runtime Env Check:', {
      hasUrl: !!runtimeSupabaseUrl,
      hasServiceKey: !!runtimeSupabaseServiceKey,
      serviceKeyLength: runtimeSupabaseServiceKey?.length || 0,
    });
    
    // Create admin client at runtime
    if (!runtimeSupabaseUrl || !runtimeSupabaseServiceKey) {
      const missingVars: string[] = [];
      if (!runtimeSupabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!runtimeSupabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
      
      const errorMsg = `Supabase configuration error: Missing environment variables: ${missingVars.join(', ')}. Please check Vercel environment variables.`;
      
      // eslint-disable-next-line no-console
      console.error("[Login] ❌ Missing env vars:", {
        hasUrl: !!runtimeSupabaseUrl,
        hasServiceKey: !!runtimeSupabaseServiceKey,
        missingVars,
        allSupabaseKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
      });
      
      return { 
        success: false, 
        error: errorMsg
      };
    }
    
    // Create Supabase admin client at runtime
    const adminClient = createClient(runtimeSupabaseUrl, runtimeSupabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // eslint-disable-next-line no-console
    console.log('[Login] ✅ Runtime Supabase admin client created');

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
