/**
 * Environment Variable Validation
 * Validates required environment variables at startup with fail-fast mechanism
 * Provides detailed error messages and health check functionality
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missing: {
    required: string[];
    optional: string[];
  };
}

export interface EnvVariable {
  key: string;
  description: string;
  required: boolean;
  validator?: (value: string) => boolean;
  example?: string;
}

/**
 * Environment variable definitions with validation rules
 */
export const ENV_VARIABLES: EnvVariable[] = [
  // Supabase (Critical - Required for app to function)
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    required: true,
    validator: (value) => value.startsWith('https://') && value.includes('supabase.co'),
    example: 'https://your-project-id.supabase.co',
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous/public key',
    required: true,
    validator: (value) => value.length > 100, // JWT tokens are long
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key (server-side only)',
    required: true,
    validator: (value) => value.length > 100,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },

  // JWT Authentication (Critical)
  {
    key: 'JWT_SECRET',
    description: 'Secret key for JWT token signing',
    required: true,
    validator: (value) => value.length >= 32, // Minimum 32 characters for security
    example: 'Generate with: openssl rand -base64 32',
  },

  // App Configuration (Required)
  {
    key: 'NEXT_PUBLIC_APP_URL',
    description: 'Application base URL',
    required: true,
    validator: (value) => value.startsWith('http://') || value.startsWith('https://'),
    example: 'http://localhost:3000 or https://yourdomain.com',
  },

  // Email Service (Required in production for password reset functionality)
  {
    key: 'RESEND_API_KEY',
    description: 'Resend API key for email service',
    required: false, // Validated separately - need either this or SendGrid
    validator: (value) => value.startsWith('re_'),
    example: 're_xxxxxxxxxxxxxxxxxxxxx',
  },
  {
    key: 'SENDGRID_API_KEY',
    description: 'SendGrid API key (alternative to Resend)',
    required: false, // Validated separately - need either this or Resend
    validator: (value) => value.startsWith('SG.'),
    example: 'SG.xxxxxxxxxxxxxxxxxxxxx',
  },
  {
    key: 'FROM_EMAIL',
    description: 'From email address for outgoing emails',
    required: false, // Validated separately in production
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    example: 'noreply@yourdomain.com',
  },

  // Redis (Optional but recommended for production)
  {
    key: 'UPSTASH_REDIS_REST_URL',
    description: 'Upstash Redis REST URL for distributed rate limiting',
    required: false,
    validator: (value) => value.startsWith('https://'),
    example: 'https://your-redis-instance.upstash.io',
  },
  {
    key: 'UPSTASH_REDIS_REST_TOKEN',
    description: 'Upstash Redis REST token',
    required: false,
    example: 'your_redis_token_here',
  },

  // Analytics & Monitoring (Optional)
  {
    key: 'NEXT_PUBLIC_GA_ID',
    description: 'Google Analytics measurement ID',
    required: false,
    validator: (value) => value.startsWith('G-'),
    example: 'G-XXXXXXXXXX',
  },
  // Note: Sentry DSN removed from validation as it's not currently used in the codebase
  // If Sentry integration is added later, add it back with NEXT_PUBLIC_SENTRY_DSN

  // Node Environment
  {
    key: 'NODE_ENV',
    description: 'Node environment',
    required: false, // Defaults to development
    validator: (value) => ['development', 'production', 'test'].includes(value),
    example: 'development',
  },
];

/**
 * Validate all environment variables
 */
export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing = {
    required: [] as string[],
    optional: [] as string[],
  };

  for (const envVar of ENV_VARIABLES) {
    const value = process.env[envVar.key];

    if (!value || value.trim() === '') {
      // Missing variable
      if (envVar.required) {
        missing.required.push(envVar.key);
        errors.push(
          `❌ REQUIRED: ${envVar.key} - ${envVar.description}${
            envVar.example ? `\n   Example: ${envVar.example}` : ''
          }`
        );
      } else {
        missing.optional.push(envVar.key);
        warnings.push(
          `⚠️  OPTIONAL: ${envVar.key} - ${envVar.description}${
            envVar.example ? `\n   Example: ${envVar.example}` : ''
          }`
        );
      }
    } else if (envVar.validator && !envVar.validator(value)) {
      // Invalid format
      if (envVar.required) {
        errors.push(
          `❌ INVALID: ${envVar.key} - ${envVar.description}\n   Current value doesn't match expected format${
            envVar.example ? `\n   Example: ${envVar.example}` : ''
          }`
        );
      } else {
        warnings.push(
          `⚠️  INVALID: ${envVar.key} - Value doesn't match expected format${
            envVar.example ? `\n   Example: ${envVar.example}` : ''
          }`
        );
      }
    }
  }

  // Special validation: Email service required in production
  const hasFromEmail = process.env.FROM_EMAIL && process.env.FROM_EMAIL.trim() !== '';
  const hasResend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '';
  const hasSendGrid = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.trim() !== '';
  const hasEmailService = hasResend || hasSendGrid;

  // PRODUCTION: Email service is REQUIRED for password reset functionality
  if (process.env.NODE_ENV === 'production') {
    if (!hasEmailService || !hasFromEmail) {
      const missingItems: string[] = [];
      if (!hasEmailService) missingItems.push('RESEND_API_KEY or SENDGRID_API_KEY');
      if (!hasFromEmail) missingItems.push('FROM_EMAIL');

      errors.push(
        `❌ REQUIRED IN PRODUCTION: Email service configuration missing\n` +
        `   Missing: ${missingItems.join(', ')}\n` +
        `   Password reset and transactional emails will not work without this.\n` +
        `   Example: Set RESEND_API_KEY and FROM_EMAIL in your environment`
      );
      missing.required.push(...missingItems);
    }
  } else {
    // DEVELOPMENT: Just warnings
    if (hasFromEmail && !hasEmailService) {
      warnings.push(
        '⚠️  FROM_EMAIL is set but no email service (RESEND_API_KEY or SENDGRID_API_KEY) is configured.\n   Password reset emails will not be sent.'
      );
    }

    if (hasEmailService && !hasFromEmail) {
      warnings.push(
        '⚠️  Email service is configured but FROM_EMAIL is missing.\n   Password reset emails will not be sent.'
      );
    }
  }

  // Special validation: Redis configuration (both or neither)
  const hasRedisUrl = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_URL.trim() !== '';
  const hasRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN && process.env.UPSTASH_REDIS_REST_TOKEN.trim() !== '';

  if (hasRedisUrl && !hasRedisToken) {
    warnings.push(
      '⚠️  UPSTASH_REDIS_REST_URL is set but UPSTASH_REDIS_REST_TOKEN is missing.\n   Redis rate limiting will not work. Will fall back to in-memory.'
    );
  }

  if (hasRedisToken && !hasRedisUrl) {
    warnings.push(
      '⚠️  UPSTASH_REDIS_REST_TOKEN is set but UPSTASH_REDIS_REST_URL is missing.\n   Redis rate limiting will not work. Will fall back to in-memory.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missing,
  };
}

/**
 * Check environment and throw error if invalid (fail-fast mechanism)
 * Use this at application startup to ensure all required config is present
 */
export function checkEnvironmentOrFail(): void {
  const result = validateEnvironment();

  if (!result.isValid) {
    console.error('\n🚨 ENVIRONMENT VALIDATION FAILED\n');
    console.error('Missing or invalid required environment variables:\n');
    result.errors.forEach((error) => console.error(error));

    if (result.warnings.length > 0) {
      console.warn('\n⚠️  WARNINGS:\n');
      result.warnings.forEach((warning) => console.warn(warning));
    }

    console.error('\n💡 TIP: Copy .env.example to .env and fill in the values\n');
    console.error('   cp .env.example .env\n');

    throw new Error(
      `Missing required environment variables: ${result.missing.required.join(', ')}`
    );
  }

  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && result.warnings.length > 0) {
    console.warn('\n⚠️  Environment warnings (optional configuration):\n');
    result.warnings.forEach((warning) => console.warn(warning));
    console.warn(''); // Empty line for readability
  }
}

/**
 * Get environment health status (for API endpoints)
 */
export function getEnvironmentHealth(): {
  healthy: boolean;
  services: {
    database: boolean;
    authentication: boolean;
    email: boolean;
    redis: boolean;
    analytics: boolean;
    errorTracking: boolean;
  };
  missing: string[];
} {
  const result = validateEnvironment();

  return {
    healthy: result.isValid,
    services: {
      database:
        !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      authentication: !!process.env.JWT_SECRET,
      email:
        (!!process.env.RESEND_API_KEY || !!process.env.SENDGRID_API_KEY) &&
        !!process.env.FROM_EMAIL,
      redis: !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN,
      analytics: !!process.env.NEXT_PUBLIC_GA_ID,
      errorTracking: false, // Sentry not currently integrated
    },
    missing: [...result.missing.required, ...result.missing.optional],
  };
}

/**
 * Check if specific feature is available
 */
export function isFeatureAvailable(feature: 'email' | 'redis' | 'analytics' | 'errorTracking'): boolean {
  const health = getEnvironmentHealth();
  return health.services[feature];
}

/**
 * Get missing environment variables for a specific feature
 */
export function getMissingEnvForFeature(feature: 'email' | 'redis'): string[] {
  const missing: string[] = [];

  if (feature === 'email') {
    if (!process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY) {
      missing.push('RESEND_API_KEY or SENDGRID_API_KEY');
    }
    if (!process.env.FROM_EMAIL) {
      missing.push('FROM_EMAIL');
    }
  }

  if (feature === 'redis') {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      missing.push('UPSTASH_REDIS_REST_URL');
    }
    if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
      missing.push('UPSTASH_REDIS_REST_TOKEN');
    }
  }

  return missing;
}

// Validate environment on module load (server-side only)
// This implements the fail-fast mechanism
if (typeof window === 'undefined') {
  try {
    // In development, show warnings but don't fail
    // In production, fail fast if required vars are missing
    if (process.env.NODE_ENV === 'production') {
      checkEnvironmentOrFail();
    } else {
      // Development: Validate and show warnings
      const result = validateEnvironment();
      if (!result.isValid) {
        console.warn('\n⚠️  DEVELOPMENT MODE: Environment validation issues detected\n');
        result.errors.forEach((error) => console.warn(error));
        console.warn('\n💡 Some features may not work without proper configuration\n');
      }
      if (result.warnings.length > 0) {
        console.info('\n📝 Optional environment variables:\n');
        result.warnings.forEach((warning) => console.info(warning));
        console.info('');
      }
    }
  } catch (error) {
    // In production, this will crash the app (fail-fast)
    // In development, we already handled it above
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ FATAL: Environment validation failed:', error);
      process.exit(1); // Fail-fast in production
    }
  }
}
