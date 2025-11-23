#!/usr/bin/env ts-node
/**
 * Pre-Deployment Environment Validation Script
 *
 * This script validates all environment variables before deployment
 * Run this before deploying to production to catch configuration issues early
 *
 * Usage:
 *   npm run validate-env
 *   NODE_ENV=production ts-node scripts/validate-env.ts
 */

import { validateEnvironment, getEnvironmentHealth } from '../src/lib/env-validation';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function printHeader(text: string) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}═══════════════════════════════════════════════════════════════${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}  ${text}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}═══════════════════════════════════════════════════════════════${COLORS.reset}\n`);
}

function printSuccess(text: string) {
  console.log(`${COLORS.green}✓${COLORS.reset} ${text}`);
}

function printError(text: string) {
  console.log(`${COLORS.red}✗${COLORS.reset} ${text}`);
}

function printWarning(text: string) {
  console.log(`${COLORS.yellow}⚠${COLORS.reset} ${text}`);
}

function printInfo(text: string) {
  console.log(`${COLORS.blue}ℹ${COLORS.reset} ${text}`);
}

function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  const environment = process.env.NODE_ENV || 'development';

  printHeader(`Environment Validation - ${environment.toUpperCase()}`);

  // Print current environment
  printInfo(`Environment: ${COLORS.bright}${environment}${COLORS.reset}`);
  printInfo(`Validation Mode: ${isProduction ? COLORS.red + 'STRICT (Production)' : COLORS.yellow + 'RELAXED (Development)'}${COLORS.reset}`);
  console.log('');

  // Run validation
  const result = validateEnvironment();
  const health = getEnvironmentHealth();

  // Print service health
  printHeader('Service Health Check');

  const services = [
    { name: 'Database (Supabase)', status: health.services.database, required: true },
    { name: 'Authentication (JWT)', status: health.services.authentication, required: true },
    { name: 'Email Service', status: health.services.email, required: isProduction },
    { name: 'Redis (Rate Limiting)', status: health.services.redis, required: false },
    { name: 'Analytics (Google Analytics)', status: health.services.analytics, required: false },
    { name: 'Error Tracking (Sentry)', status: health.services.errorTracking, required: false },
  ];

  services.forEach(service => {
    if (service.status) {
      printSuccess(`${service.name}: ${COLORS.green}CONFIGURED${COLORS.reset}`);
    } else if (service.required) {
      printError(`${service.name}: ${COLORS.red}MISSING (REQUIRED)${COLORS.reset}`);
    } else {
      printWarning(`${service.name}: ${COLORS.yellow}NOT CONFIGURED (OPTIONAL)${COLORS.reset}`);
    }
  });

  // Print errors
  if (result.errors.length > 0) {
    printHeader('❌ VALIDATION ERRORS');
    result.errors.forEach(error => {
      console.log(`${COLORS.red}${error}${COLORS.reset}\n`);
    });
  }

  // Print warnings
  if (result.warnings.length > 0) {
    printHeader('⚠️  WARNINGS');
    result.warnings.forEach(warning => {
      console.log(`${COLORS.yellow}${warning}${COLORS.reset}\n`);
    });
  }

  // Print summary
  printHeader('Validation Summary');

  if (result.isValid) {
    printSuccess(`${COLORS.bright}${COLORS.green}All required environment variables are configured!${COLORS.reset}`);

    if (result.missing.optional.length > 0) {
      console.log('');
      printInfo(`Optional variables missing: ${result.missing.optional.length}`);
      if (!isProduction) {
        printInfo('Some features may not be available without optional configuration.');
      }
    }

    console.log('');
    printSuccess(`${COLORS.bright}Ready for ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} deployment! 🚀${COLORS.reset}`);
    console.log('');

    process.exit(0);
  } else {
    printError(`${COLORS.bright}${COLORS.red}Validation FAILED! Cannot proceed with deployment.${COLORS.reset}`);
    console.log('');
    printError(`Missing required variables: ${result.missing.required.length}`);
    printWarning(`Missing optional variables: ${result.missing.optional.length}`);
    console.log('');
    printInfo('💡 To fix:');
    printInfo('   1. Copy .env.example to .env: cp .env.example .env');
    printInfo('   2. Fill in all required environment variables');
    printInfo('   3. Re-run this validation script');
    console.log('');
    printInfo('📖 For more information, see docs/ENV_VALIDATION.md');
    console.log('');

    process.exit(1);
  }
}

// Handle errors
try {
  main();
} catch (error) {
  console.error(`\n${COLORS.red}${COLORS.bright}FATAL ERROR:${COLORS.reset}`);
  console.error(error);
  console.log('');
  process.exit(1);
}
