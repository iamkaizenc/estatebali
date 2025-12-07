// Authentication utility with role-based access (admin and user)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthUser, UserRole } from "@/types";
import { createClient } from '@supabase/supabase-js';

// Get JWT secret from environment variable
// CRITICAL: No fallback - must be set in environment
// NOTE: Only accessed in server-side functions (createToken, verifyToken)
const getJWTSecret = (): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    const errorMsg = 'CRITICAL: JWT_SECRET environment variable is not set. This is required for authentication security.';
    if (process.env.NODE_ENV === 'production') {
      console.error(errorMsg);
      throw new Error(errorMsg);
    } else {
      console.warn('⚠️  WARNING:', errorMsg);
      // In development, throw to prevent silent failures
      throw new Error(errorMsg);
    }
  }

  // Additional security check: JWT_SECRET must be strong enough
  if (JWT_SECRET.length < 32) {
    const errorMsg = `CRITICAL: JWT_SECRET must be at least 32 characters long for security. Current length: ${JWT_SECRET.length}`;
    if (process.env.NODE_ENV === 'production') {
      console.error(errorMsg);
      throw new Error(errorMsg);
    } else {
      console.warn('⚠️  WARNING:', errorMsg);
      throw new Error(errorMsg);
    }
  }
  
  return JWT_SECRET;
};

const JWT_EXPIRATION = '7d'; // Token expires in 7 days

// JWT token creation with proper encryption
// NOTE: Server-side only - requires JWT_SECRET
function createToken(user: AuthUser): string {
  const JWT_SECRET = getJWTSecret();

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
// NOTE: Server-side only - requires JWT_SECRET for verification
function verifyToken(token: string): AuthUser | null {
  // Only verify on server-side
  if (typeof window !== 'undefined') {
      // Client-side: Just decode token without verification (for display purposes)
      // Real verification happens on server-side API calls
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        // Decode base64 payload (works in browser without Buffer)
        const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson) as {
          id: string;
          email: string;
          name: string;
          role: UserRole;
          phone?: string;
          avatar?: string;
          exp?: number;
        };
        
        // Check expiration (basic check, not cryptographic verification)
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          return null; // Token expired
        }
        
        return {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          phone: payload.phone,
          avatar: payload.avatar,
        };
      } catch (error) {
        return null;
      }
  }

  // Server-side: Full cryptographic verification
  try {
    const JWT_SECRET = getJWTSecret();
    
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
    // SECURITY: Only use server-side service role key, never NEXT_PUBLIC_ variant
    const runtimeSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      || process.env.SUPABASE_SERVICE_KEY;
    
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

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Login] Admin user check:', {
        email,
        found: !!adminUser,
        error: adminError?.message,
        hasPasswordHash: !!adminUser?.password_hash
      });
    }

    if (adminUser && !adminError) {
      // Verify password - password_hash is required
      if (!adminUser.password_hash) {
        return { 
          success: false, 
          error: "Account configuration error. Please contact administrator." 
        };
      }

      const passwordMatch = await bcrypt.compare(password, adminUser.password_hash);
      
      // Debug logging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Login] Password check:', {
          email,
          passwordMatch,
          hasPasswordHash: !!adminUser.password_hash
        });
      }
      
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
    // Use maybeSingle() instead of single() to avoid error when user doesn't exist
    const { data: regularUser, error: userError } = await adminClient
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    // Debug logging (always log for troubleshooting)
    console.log('[Login] Regular user check:', {
      email,
      found: !!regularUser,
      error: userError?.message || null,
      errorCode: userError?.code || null,
      hasPasswordHash: !!regularUser?.password_hash,
      passwordHashLength: regularUser?.password_hash?.length || 0,
      role: regularUser?.role || null,
    });

    // Handle error cases
    if (userError && userError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine - user just doesn't exist
      // Other errors are real problems
      console.error('[Login] Error fetching user:', {
        email,
        error: userError.message,
        code: userError.code,
        details: userError.details,
        hint: userError.hint,
      });
      return { 
        success: false, 
        error: "Login failed. Please try again later." 
      };
    }

    // User found - verify password
    if (regularUser) {
      // Check if user has password_hash
      if (!regularUser.password_hash) {
        console.error('[Login] User found but no password_hash:', {
          email,
          userId: regularUser.id,
        });
        return { 
          success: false, 
          error: "Account configuration error. Please contact administrator or reset your password." 
        };
      }

      // Verify password
      try {
        const passwordMatch = await bcrypt.compare(password, regularUser.password_hash);
        
        console.log('[Login] Password verification:', {
          email,
          passwordMatch,
          hashStartsWith: regularUser.password_hash.substring(0, 7),
        });

        if (!passwordMatch) {
          return { 
            success: false, 
            error: "Invalid email or password" 
          };
        }
      } catch (bcryptError: any) {
        console.error('[Login] bcrypt.compare error:', {
          email,
          error: bcryptError.message,
          hashLength: regularUser.password_hash.length,
        });
        return { 
          success: false, 
          error: "Password verification failed. Please try again." 
        };
      }

      // Password verified - create token
      const user: AuthUser = {
        id: regularUser.id,
        email: regularUser.email,
        name: regularUser.name,
        role: regularUser.role === "customer" ? "user" : (regularUser.role as UserRole),
        phone: regularUser.phone,
        avatar: regularUser.avatar,
      };
      
      const token = createToken(user);
      console.log('[Login] Success:', {
        email,
        userId: user.id,
        role: user.role,
      });
      
      return { success: true, token };
    }

    // User not found in either table
    console.log('[Login] User not found:', { email });
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
