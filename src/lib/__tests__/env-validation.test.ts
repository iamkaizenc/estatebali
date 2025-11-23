/**
 * Environment Validation Tests
 * Tests for environment variable validation logic
 */

import {
  validateEnvironment,
  getEnvironmentHealth,
  isFeatureAvailable,
  getMissingEnvForFeature,
  EnvValidationResult,
} from '../env-validation';

describe('Environment Validation', () => {
  // Store original env
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should pass with all required variables set', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNjI2NzY5NiwiZXhwIjoxOTIxODQzNjk2fQ.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjA2MjY3Njk2LCJleHAiOjE5MjE4NDM2OTZ9.test';
      process.env.JWT_SECRET = 'a'.repeat(32); // 32 character minimum
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'development';

      const result = validateEnvironment();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.missing.required).toHaveLength(0);
    });

    it('should fail without required Supabase URL', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

      const result = validateEnvironment();

      expect(result.isValid).toBe(false);
      expect(result.missing.required).toContain('NEXT_PUBLIC_SUPABASE_URL');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail with invalid Supabase URL format', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://invalid-url.com';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

      const result = validateEnvironment();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('NEXT_PUBLIC_SUPABASE_URL'))).toBe(true);
    });

    it('should fail with short JWT_SECRET', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'too-short'; // Less than 32 characters
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

      const result = validateEnvironment();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('JWT_SECRET'))).toBe(true);
    });

    it('should warn about missing optional email configuration in development', () => {
      process.env.NODE_ENV = 'development';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      delete process.env.RESEND_API_KEY;
      delete process.env.FROM_EMAIL;

      const result = validateEnvironment();

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.missing.optional.length).toBeGreaterThan(0);
    });

    it('should require email service in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
      delete process.env.RESEND_API_KEY;
      delete process.env.SENDGRID_API_KEY;
      delete process.env.FROM_EMAIL;

      const result = validateEnvironment();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Email service'))).toBe(true);
    });

    it('should pass in production with email service configured', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
      process.env.RESEND_API_KEY = 're_test123456789';
      process.env.FROM_EMAIL = 'noreply@example.com';

      const result = validateEnvironment();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn about incomplete Redis configuration', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      const result = validateEnvironment();

      expect(result.warnings.some(w => w.includes('Redis'))).toBe(true);
    });
  });

  describe('getEnvironmentHealth', () => {
    it('should return healthy status with all services configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.RESEND_API_KEY = 're_test';
      process.env.FROM_EMAIL = 'test@example.com';
      process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
      process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';

      const health = getEnvironmentHealth();

      expect(health.healthy).toBe(true);
      expect(health.services.database).toBe(true);
      expect(health.services.authentication).toBe(true);
      expect(health.services.email).toBe(true);
      expect(health.services.redis).toBe(true);
      expect(health.services.analytics).toBe(true);
      expect(health.services.errorTracking).toBe(true);
    });

    it('should return unhealthy when required services missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.JWT_SECRET;

      const health = getEnvironmentHealth();

      expect(health.healthy).toBe(false);
      expect(health.services.database).toBe(false);
      expect(health.services.authentication).toBe(false);
    });
  });

  describe('isFeatureAvailable', () => {
    it('should return true when email feature is configured', () => {
      process.env.RESEND_API_KEY = 're_test';
      process.env.FROM_EMAIL = 'test@example.com';

      expect(isFeatureAvailable('email')).toBe(true);
    });

    it('should return false when email feature is not configured', () => {
      delete process.env.RESEND_API_KEY;
      delete process.env.SENDGRID_API_KEY;

      expect(isFeatureAvailable('email')).toBe(false);
    });

    it('should return true when redis feature is configured', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      expect(isFeatureAvailable('redis')).toBe(true);
    });

    it('should return false when redis is partially configured', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      expect(isFeatureAvailable('redis')).toBe(false);
    });
  });

  describe('getMissingEnvForFeature', () => {
    it('should return missing email variables', () => {
      delete process.env.RESEND_API_KEY;
      delete process.env.SENDGRID_API_KEY;
      delete process.env.FROM_EMAIL;

      const missing = getMissingEnvForFeature('email');

      expect(missing).toContain('RESEND_API_KEY or SENDGRID_API_KEY');
      expect(missing).toContain('FROM_EMAIL');
    });

    it('should return empty array when email is fully configured', () => {
      process.env.RESEND_API_KEY = 're_test';
      process.env.FROM_EMAIL = 'test@example.com';

      const missing = getMissingEnvForFeature('email');

      expect(missing).toHaveLength(0);
    });

    it('should return missing redis variables', () => {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      const missing = getMissingEnvForFeature('redis');

      expect(missing).toContain('UPSTASH_REDIS_REST_URL');
      expect(missing).toContain('UPSTASH_REDIS_REST_TOKEN');
    });
  });

  describe('Invalid email formats', () => {
    it('should fail with invalid FROM_EMAIL format', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.FROM_EMAIL = 'invalid-email';

      const result = validateEnvironment();

      expect(result.warnings.some(w => w.includes('FROM_EMAIL'))).toBe(true);
    });

    it('should fail with invalid RESEND_API_KEY format', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test';
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.RESEND_API_KEY = 'invalid_key';

      const result = validateEnvironment();

      expect(result.warnings.some(w => w.includes('RESEND_API_KEY'))).toBe(true);
    });
  });
});
