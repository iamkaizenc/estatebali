# Environment Variable Validation

Comprehensive environment variable validation with fail-fast mechanism for Estate Bali application.

## Overview

The environment validation system ensures all required configuration is present before the application starts. It implements a **fail-fast mechanism** that prevents the application from running with incomplete or invalid configuration.

## Features

✅ **Fail-Fast Mechanism**
- Production: Crashes immediately if required vars are missing
- Development: Shows warnings but allows startup

✅ **Comprehensive Validation**
- Required vs optional variable distinction
- Format validation (URLs, email addresses, keys)
- Length validation for secrets
- Cross-dependency checks (e.g., email service + FROM_EMAIL)

✅ **Health Check API**
- `/api/health` endpoint for monitoring
- Service-by-service status
- Integration with load balancers and monitoring tools

✅ **Detailed Error Messages**
- Clear descriptions of what's missing
- Examples for each variable
- Helpful tips for resolution

## Required Environment Variables

These variables **must** be set for the application to function:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1Ni...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1Ni...` |
| `JWT_SECRET` | JWT token signing secret (min 32 chars) | Generate with: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |

## Optional Environment Variables

These variables are optional but recommended for full functionality:

### Email Service (Required for Password Reset)

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend API key | `re_xxxxxxxxxxxxx` |
| `SENDGRID_API_KEY` | SendGrid API key (alternative) | `SG.xxxxxxxxxxxxx` |
| `FROM_EMAIL` | Sender email address | `noreply@yourdomain.com` |

**Note:** You need either `RESEND_API_KEY` or `SENDGRID_API_KEY` + `FROM_EMAIL` for password reset emails.

### Rate Limiting (Recommended for Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `UPSTASH_REDIS_REST_URL` | Redis URL for distributed rate limiting | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Redis authentication token | `AXXXxxx...` |

**Note:** Without Redis, rate limiting uses in-memory storage (single instance only).

### Analytics & Monitoring

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN | `https://xxx@sentry.io/xxx` |

## Setup Instructions

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Fill in Required Variables

Edit `.env` and add your credentials:

```bash
# Supabase (Get from https://app.supabase.com/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Secret (Generate new)
JWT_SECRET=$(openssl rand -base64 32)

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service (Optional - for password reset)
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

### 3. Verify Configuration

Start the development server:

```bash
npm run dev
```

**Expected Output (Development):**

If all required variables are set:
```
✅ Environment validation successful
⚠️  Optional configuration warnings:
- UPSTASH_REDIS_REST_URL: Redis not configured (will use in-memory)
- Email service not configured (password reset will use mock)
```

If required variables are missing:
```
⚠️  DEVELOPMENT MODE: Environment validation issues detected

❌ REQUIRED: JWT_SECRET - Secret key for JWT token signing
   Example: Generate with: openssl rand -base64 32

💡 Some features may not work without proper configuration
```

### 4. Test Health Endpoint

```bash
curl http://localhost:3000/api/health | jq
```

**Expected Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-11-22T09:30:00.000Z",
  "environment": "development",
  "services": {
    "database": true,
    "authentication": true,
    "email": false,
    "redis": false,
    "analytics": false,
    "errorTracking": false
  },
  "validation": {
    "valid": true,
    "errors": 0,
    "warnings": 5,
    "missingRequired": 0,
    "missingOptional": 5
  }
}
```

## Validation Behavior

### Development Mode

- ⚠️  Shows warnings for missing required variables
- ✅ Allows application to start
- 📝 Logs optional variable suggestions
- 🔍 Includes detailed error info in `/api/health`

**Why?** Enables development without full configuration setup.

### Production Mode

- ❌ **Fails immediately** if required variables are missing
- 🚫 Application will not start
- 📋 Logs all errors before exiting
- 💥 `process.exit(1)` called

**Why?** Prevents deployments with incomplete configuration.

### Test Mode

- 🧪 Silent validation (no console output)
- ✅ Allows flexible test environment setup

## Validation Functions

### `validateEnvironment()`

Returns detailed validation results without throwing errors.

```typescript
import { validateEnvironment } from '@/lib/env-validation';

const result = validateEnvironment();

console.log(result.isValid);        // boolean
console.log(result.errors);         // string[]
console.log(result.warnings);       // string[]
console.log(result.missing);        // { required: string[], optional: string[] }
```

### `checkEnvironmentOrFail()`

Validates and throws error if invalid (fail-fast).

```typescript
import { checkEnvironmentOrFail } from '@/lib/env-validation';

// This will throw if environment is invalid
checkEnvironmentOrFail();
```

### `getEnvironmentHealth()`

Returns service-level health status.

```typescript
import { getEnvironmentHealth } from '@/lib/env-validation';

const health = getEnvironmentHealth();

console.log(health.healthy);        // Overall health boolean
console.log(health.services);       // Service-by-service status
console.log(health.missing);        // List of missing variables
```

### `isFeatureAvailable()`

Check if specific feature is configured.

```typescript
import { isFeatureAvailable } from '@/lib/env-validation';

if (isFeatureAvailable('email')) {
  // Send password reset email
} else {
  // Log reset URL to console (development)
}

if (isFeatureAvailable('redis')) {
  // Use Redis rate limiting
} else {
  // Fall back to in-memory
}
```

## Integration with API Endpoints

Environment validation is checked when endpoints start:

```typescript
// src/app/api/some-endpoint/route.ts
import { isFeatureAvailable, getMissingEnvForFeature } from '@/lib/env-validation';

export async function POST(request: Request) {
  // Check if email service is available
  if (!isFeatureAvailable('email')) {
    const missing = getMissingEnvForFeature('email');
    return NextResponse.json(
      {
        error: 'Email service not configured',
        missing
      },
      { status: 503 }
    );
  }

  // Proceed with email sending...
}
```

## Health Check API

### Endpoint

```
GET /api/health
```

### Response Format

```typescript
{
  status: 'healthy' | 'degraded' | 'error',
  timestamp: string,              // ISO 8601 timestamp
  environment: string,             // 'development' | 'production' | 'test'
  services: {
    database: boolean,             // Supabase configured
    authentication: boolean,       // JWT_SECRET set
    email: boolean,                // Email service configured
    redis: boolean,                // Redis configured
    analytics: boolean,            // Google Analytics configured
    errorTracking: boolean         // Sentry configured
  },
  validation: {
    valid: boolean,                // Overall validation status
    errors: number,                // Count of errors
    warnings: number,              // Count of warnings
    missingRequired: number,       // Count of missing required vars
    missingOptional: number        // Count of missing optional vars
  },
  // Only in development:
  details?: {
    errors: string[],              // Detailed error messages
    warnings: string[],            // Detailed warning messages
    missing: {
      required: string[],          // List of missing required vars
      optional: string[]           // List of missing optional vars
    }
  }
}
```

### Status Codes

- `200 OK` - All required services healthy
- `503 Service Unavailable` - Required services not configured
- `500 Internal Server Error` - Validation check failed

### Usage Examples

#### Monitor Application Health

```bash
# Check health
curl http://localhost:3000/api/health

# Monitor continuously
watch -n 5 'curl -s http://localhost:3000/api/health | jq .status'
```

#### Load Balancer Health Check

Configure your load balancer to use `/api/health`:

```yaml
# Example: AWS ALB Target Group
healthCheck:
  path: /api/health
  interval: 30
  timeout: 5
  healthyThreshold: 2
  unhealthyThreshold: 3
  matcher:
    httpCode: '200'
```

#### CI/CD Deployment Verification

```bash
# After deployment, verify health
HEALTH=$(curl -s https://your-app.com/api/health)
STATUS=$(echo $HEALTH | jq -r .status)

if [ "$STATUS" != "healthy" ]; then
  echo "❌ Deployment health check failed"
  echo $HEALTH | jq .
  exit 1
fi

echo "✅ Deployment healthy"
```

## Troubleshooting

### "Missing required environment variables" Error

**Problem:** Application crashes on startup with environment validation errors.

**Solution:**

1. Check which variables are missing:
   ```bash
   npm run dev 2>&1 | grep "REQUIRED:"
   ```

2. Add missing variables to `.env`:
   ```bash
   # Edit .env
   vim .env
   ```

3. Restart the application:
   ```bash
   npm run dev
   ```

### "Invalid format" Errors

**Problem:** Variable is set but validation fails.

**Solutions:**

| Error | Fix |
|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` invalid | Must start with `https://` and include `supabase.co` |
| `JWT_SECRET` too short | Must be at least 32 characters |
| `FROM_EMAIL` invalid | Must be valid email format |
| `RESEND_API_KEY` invalid | Must start with `re_` |
| `SENDGRID_API_KEY` invalid | Must start with `SG.` |

### Warning: "FROM_EMAIL set but no email service"

**Problem:** `FROM_EMAIL` is configured but no email provider.

**Solution:** Add either `RESEND_API_KEY` or `SENDGRID_API_KEY`:

```bash
# Option 1: Resend (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Option 2: SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Warning: "Redis URL set but token missing"

**Problem:** Partial Redis configuration.

**Solution:** Add both Redis variables:

```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

## Security Best Practices

### ✅ DO

- ✅ Use `.env` for local development (in `.gitignore`)
- ✅ Use deployment platform env vars for production (Vercel, Railway, etc.)
- ✅ Generate strong `JWT_SECRET` (min 32 chars)
- ✅ Rotate secrets regularly
- ✅ Use different secrets for dev/staging/production
- ✅ Monitor `/api/health` in production

### ❌ DON'T

- ❌ Don't commit `.env` files to git
- ❌ Don't share production secrets
- ❌ Don't use weak JWT secrets
- ❌ Don't disable validation in production
- ❌ Don't expose health endpoint details in production

## Deployment

### Vercel

Environment variables are configured in the Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Select environment (Production/Preview/Development)
4. Deploy

### Railway

```bash
# Set variables via CLI
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://..."
railway variables set JWT_SECRET="$(openssl rand -base64 32)"

# Or via railway.json
{
  "variables": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://...",
    "JWT_SECRET": "..."
  }
}
```

### Docker

```dockerfile
# Pass env vars at runtime
docker run -e NEXT_PUBLIC_SUPABASE_URL="..." \
           -e JWT_SECRET="..." \
           your-app:latest

# Or use env file
docker run --env-file .env.production your-app:latest
```

## Files

- `src/lib/env-validation.ts` - Validation logic
- `src/app/api/health/route.ts` - Health check endpoint
- `.env.example` - Environment template
- `.env` - Local environment (not in git)

## Related Documentation

- [PASSWORD_RESET.md](./PASSWORD_RESET.md) - Password reset flow (requires email config)
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting (Redis config)
- [README.md](./README.md) - General setup

---

Last updated: 2025-11-22
