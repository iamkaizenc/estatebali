/**
 * Environment variables validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = {
  // Supabase (required in production)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Optional but recommended
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

const optionalEnvVars = {
  // Email service (optional, but recommended for production)
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  
  // Analytics (optional)
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  
  // Error tracking (optional)
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

export function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing: string[] = [];
  
  // Check required vars (only in production)
  if (isProduction) {
    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      if (!value) {
        missing.push(key);
      }
    });
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set these in your .env.local file or deployment platform.`
    );
  }
  
  // Warn about optional but recommended vars
  if (isProduction) {
    const missingOptional: string[] = [];
    
    if (!optionalEnvVars.RESEND_API_KEY && !optionalEnvVars.SENDGRID_API_KEY) {
      missingOptional.push('Email service (RESEND_API_KEY or SENDGRID_API_KEY)');
    }
    
    if (!optionalEnvVars.NEXT_PUBLIC_GA_ID) {
      missingOptional.push('Google Analytics (NEXT_PUBLIC_GA_ID)');
    }
    
    if (!optionalEnvVars.NEXT_PUBLIC_SENTRY_DSN) {
      missingOptional.push('Error tracking (NEXT_PUBLIC_SENTRY_DSN)');
    }
    
    if (missingOptional.length > 0) {
      console.warn(
        `⚠️  Recommended environment variables not set:\n` +
        missingOptional.map(v => `  - ${v}`).join('\n') +
        `\nThese are optional but recommended for production.`
      );
    }
  }
  
  return true;
}

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnvironment();
  } catch (error) {
    // Don't throw in development
    if (process.env.NODE_ENV === 'production') {
      console.error('Environment validation failed:', error);
    }
  }
}

