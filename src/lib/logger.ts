/**
 * Logger utility for production-safe logging
 * Only logs errors in production, all logs in development
 * Integrates with Sentry for error tracking
 */

const isDevelopment = process.env.NODE_ENV === 'development';

// Lazy load Sentry to avoid issues if not configured
let Sentry: typeof import('@sentry/nextjs') | null = null;
try {
  if (typeof window === 'undefined') {
    // Server-side
    Sentry = require('@sentry/nextjs');
  } else {
    // Client-side
    Sentry = require('@sentry/nextjs');
  }
} catch {
  // Sentry not installed or not configured
  Sentry = null;
}

interface LogContext {
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

export const logger = {
  log: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[LOG] ${message}`, ...args);
    }
  },
  
  error: (message: string, error?: Error | any, context?: LogContext) => {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, error || '', context || '');
    
    // Send to Sentry if configured
    if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          level: 'error',
          tags: context,
          extra: {
            message,
            ...context,
          },
        });
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          tags: context,
          extra: {
            error,
            ...context,
          },
        });
      }
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
    
    // Send warnings to Sentry in production
    if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN && !isDevelopment) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: { args },
      });
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};
