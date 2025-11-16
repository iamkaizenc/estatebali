/**
 * Rate limiting utility
 * Simple in-memory rate limiter (for production, use Redis or similar)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
}

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now();
  const entry = store[key];

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    };
  }

  // If limit exceeded
  if (entry.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      error: `Rate limit exceeded. Try again after ${Math.ceil((entry.resetTime - now) / 1000)} seconds.`,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try various headers (for proxies, load balancers, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (won't work in serverless, but useful for development)
  return 'unknown';
}

/**
 * Rate limit by IP
 */
export function rateLimitByIP(
  request: Request,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): RateLimitResult {
  const ip = getClientIP(request);
  return checkRateLimit(`ip:${ip}`, options);
}

/**
 * Rate limit by user ID
 */
export function rateLimitByUser(
  userId: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): RateLimitResult {
  return checkRateLimit(`user:${userId}`, options);
}

/**
 * Rate limit by email (for login attempts)
 */
export function rateLimitByEmail(
  email: string,
  options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxRequests: 5 } // 5 attempts per 15 minutes
): RateLimitResult {
  return checkRateLimit(`email:${email.toLowerCase()}`, options);
}

