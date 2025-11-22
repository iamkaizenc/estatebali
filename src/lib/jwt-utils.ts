/**
 * Client-side JWT utilities
 * These functions decode JWT tokens without verification (verification happens server-side)
 */

/**
 * Decode JWT token payload
 * Note: This does NOT verify the signature. Use only for reading claims.
 * Token verification must be done server-side.
 *
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): any {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    // JWT uses base64url encoding, not standard base64
    const payload = parts[1];

    // Convert base64url to base64
    // base64url uses - instead of + and _ instead of /
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Decode and parse
    // In browser, use atob; in Node.js, use Buffer
    const decoded = typeof window !== 'undefined'
      ? JSON.parse(atob(base64))
      : JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

    return decoded;
  } catch (error) {
    // Invalid JWT format
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

/**
 * Get token expiration time
 * @param token - JWT token string
 * @returns Expiration date or null
 */
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  return new Date(decoded.exp * 1000);
}

/**
 * Get user role from token
 * @param token - JWT token string
 * @returns User role or null
 */
export function getUserRoleFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  return decoded?.role || null;
}

/**
 * Get user ID from token
 * @param token - JWT token string
 * @returns User ID or null
 */
export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  return decoded?.id || null;
}
