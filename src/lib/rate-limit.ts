/**
 * Hybrid rate limiting utility
 * - Production (with Redis): Distributed rate limiting across instances
 * - Development (no Redis): In-memory rate limiting (single instance only)
 *
 * For production deployment, configure Upstash Redis:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import {
  checkRateLimitRedis,
  rateLimitByIP as rateLimitByIPRedis,
  rateLimitByUser as rateLimitByUserRedis,
  rateLimitByEmail as rateLimitByEmailRedis,
  getClientIP as getClientIPRedis,
  type RateLimitOptions,
  type RateLimitResult,
} from './rate-limit-redis';

// Re-export types
export type { RateLimitOptions, RateLimitResult };

// Re-export getClientIP
export { getClientIPRedis as getClientIP };

// ============================================================================
// In-Memory Fallback (for development/testing without Redis)
// ============================================================================

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

/**
 * In-memory rate limit check (fallback when Redis is not available)
 */
function checkRateLimitMemory(
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

// ============================================================================
// Hybrid Rate Limiting (Auto-detects Redis availability)
// ============================================================================

/**
 * Check rate limit for a given key
 * Automatically uses Redis if available, falls back to in-memory
 */
export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): Promise<RateLimitResult> {
  try {
    // Try Redis first
    return await checkRateLimitRedis(key, options);
  } catch (error) {
    // Redis not available or error - fall back to in-memory
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Rate Limit] Using in-memory fallback for key:', key);
    }
    return checkRateLimitMemory(key, options);
  }
}

/**
 * Rate limit by IP
 */
export async function rateLimitByIP(
  request: Request,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): Promise<RateLimitResult> {
  try {
    return await rateLimitByIPRedis(request, options);
  } catch (error) {
    const ip = getClientIPRedis(request);
    return checkRateLimitMemory(`ip:${ip}`, options);
  }
}

/**
 * Rate limit by user ID
 */
export async function rateLimitByUser(
  userId: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): Promise<RateLimitResult> {
  try {
    return await rateLimitByUserRedis(userId, options);
  } catch (error) {
    return checkRateLimitMemory(`user:${userId}`, options);
  }
}

/**
 * Rate limit by email (for login attempts)
 */
export async function rateLimitByEmail(
  email: string,
  options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxRequests: 5 }
): Promise<RateLimitResult> {
  try {
    return await rateLimitByEmailRedis(email, options);
  } catch (error) {
    return checkRateLimitMemory(`email:${email.toLowerCase()}`, options);
  }
}

// ============================================================================
// Synchronous versions (for backward compatibility)
// Note: These will always use in-memory store
// ============================================================================

/**
 * Synchronous rate limit check (in-memory only)
 * @deprecated Use async checkRateLimit() for Redis support
 */
export function checkRateLimitSync(
  key: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): RateLimitResult {
  return checkRateLimitMemory(key, options);
}

/**
 * Synchronous rate limit by IP (in-memory only)
 * @deprecated Use async rateLimitByIP() for Redis support
 */
export function rateLimitByIPSync(
  request: Request,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): RateLimitResult {
  const ip = getClientIPRedis(request);
  return checkRateLimitMemory(`ip:${ip}`, options);
}
