/**
 * Redis-based rate limiting for distributed/serverless environments
 * Uses Upstash Redis for edge-compatible rate limiting
 */

import { Redis } from '@upstash/redis';

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
 * Initialize Redis client (lazy initialization)
 */
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  // Only initialize once
  if (redisClient !== null) {
    return redisClient;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Redis not configured - will fall back to in-memory
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Rate Limit] Redis not configured. Using in-memory fallback.');
    }
    redisClient = null;
    return null;
  }

  try {
    redisClient = new Redis({
      url,
      token,
    });
    return redisClient;
  } catch (error) {
    console.error('[Rate Limit] Failed to initialize Redis:', error);
    redisClient = null;
    return null;
  }
}

/**
 * Check rate limit using Redis
 */
export async function checkRateLimitRedis(
  key: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  if (!redis) {
    // Redis not available - return success to avoid blocking
    // Caller should handle fallback to in-memory rate limiting
    throw new Error('Redis not available');
  }

  const now = Date.now();
  const windowStart = now - options.windowMs;
  const resetTime = now + options.windowMs;

  try {
    // Use sorted set with timestamps as scores
    // This allows us to count requests within a time window
    const redisKey = `ratelimit:${key}`;

    // Remove old entries outside the window
    await redis.zremrangebyscore(redisKey, 0, windowStart);

    // Count current requests in the window
    const count = await redis.zcard(redisKey);

    // Check if limit exceeded
    if (count >= options.maxRequests) {
      // Get the oldest entry to calculate reset time
      const oldest = await redis.zrange(redisKey, 0, 0, { withScores: true }) as Array<{ member: string; score: number }>;
      const oldestTime = oldest.length > 0 ? oldest[0].score : now;
      const actualResetTime = oldestTime + options.windowMs;

      return {
        success: false,
        remaining: 0,
        resetTime: actualResetTime,
        error: `Rate limit exceeded. Try again after ${Math.ceil((actualResetTime - now) / 1000)} seconds.`,
      };
    }

    // Add current request with timestamp as score
    await redis.zadd(redisKey, { score: now, member: `${now}-${Math.random()}` });

    // Set expiration on the key to auto-cleanup
    await redis.expire(redisKey, Math.ceil(options.windowMs / 1000) + 10);

    return {
      success: true,
      remaining: options.maxRequests - count - 1,
      resetTime,
    };
  } catch (error) {
    // Redis error - fail open (allow the request)
    console.error('[Rate Limit] Redis error:', error);
    throw error;
  }
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

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Rate limit by IP
 */
export async function rateLimitByIP(
  request: Request,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): Promise<RateLimitResult> {
  const ip = getClientIP(request);
  return checkRateLimitRedis(`ip:${ip}`, options);
}

/**
 * Rate limit by user ID
 */
export async function rateLimitByUser(
  userId: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 10 }
): Promise<RateLimitResult> {
  return checkRateLimitRedis(`user:${userId}`, options);
}

/**
 * Rate limit by email (for login attempts)
 */
export async function rateLimitByEmail(
  email: string,
  options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxRequests: 5 }
): Promise<RateLimitResult> {
  return checkRateLimitRedis(`email:${email.toLowerCase()}`, options);
}
