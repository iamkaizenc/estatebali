import { NextResponse } from 'next/server';
import { getEnvironmentHealth, validateEnvironment } from '@/lib/env-validation';

/**
 * GET /api/health - Health check endpoint
 * Returns environment validation status and service availability
 * Useful for monitoring, load balancers, and deployment verification
 */
export async function GET() {
  try {
    const health = getEnvironmentHealth();
    const validation = validateEnvironment();

    // Determine overall health status
    const isHealthy = health.healthy && health.services.database && health.services.authentication;

    return NextResponse.json(
      {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        services: health.services,
        validation: {
          valid: validation.isValid,
          errors: validation.errors.length,
          warnings: validation.warnings.length,
          missingRequired: validation.missing.required.length,
          missingOptional: validation.missing.optional.length,
        },
        // Only include details in development
        ...(process.env.NODE_ENV === 'development' && {
          details: {
            errors: validation.errors,
            warnings: validation.warnings,
            missing: validation.missing,
          },
        }),
      },
      {
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message || 'Health check failed',
      },
      { status: 500 }
    );
  }
}
