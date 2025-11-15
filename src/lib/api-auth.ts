import { NextRequest } from "next/server";
import { getUser, isAdmin } from "./auth";
import { AuthUser } from "@/types";

export function verifyAuth(request: NextRequest): { success: boolean; user?: AuthUser; error?: string } {
  // Get token from Authorization header or cookie
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || 
                request.cookies.get("auth_token")?.value ||
                request.cookies.get("admin_token")?.value ||
                request.headers.get("x-auth-token") ||
                request.headers.get("x-admin-token");

  if (!token) {
    return { success: false, error: "No authentication token provided" };
  }

  const user = getUser(token);
  if (!user) {
    return { success: false, error: "Invalid or expired token" };
  }

  return { success: true, user };
}

export function verifyAdminAuth(request: NextRequest): { success: boolean; user?: AuthUser; error?: string } {
  const auth = verifyAuth(request);
  if (!auth.success) {
    return auth;
  }

  if (!isAdmin(auth.user || null)) {
    return { success: false, error: "Admin access required" };
  }

  return { success: true, user: auth.user };
}

export function verifyUserAuth(request: NextRequest): { success: boolean; user?: AuthUser; error?: string } {
  const auth = verifyAuth(request);
  if (!auth.success) {
    return auth;
  }

  // Regular users (not admin)
  if (isAdmin(auth.user || null)) {
    return { success: false, error: "User access required (admin not allowed)" };
  }

  return { success: true, user: auth.user };
}
