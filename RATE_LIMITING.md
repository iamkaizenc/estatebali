# Rate Limiting Configuration

## Overview

This application uses a **hybrid rate limiting system** that automatically adapts to your environment:

- **Production (with Redis)**: Distributed rate limiting across multiple instances/serverless functions
- **Development (without Redis)**: In-memory rate limiting (single instance only)

## Why Redis for Production?

In-memory rate limiting works fine for development and single-server deployments, but **fails in distributed/serverless environments** because:

1. **Each instance has its own memory** - Rate limits are not shared across servers
2. **Serverless functions are stateless** - Memory is not persisted between invocations
3. **Auto-scaling breaks limits** - Each new instance starts with a fresh counter

### Example Problem:
```
Without Redis (5 requests per 15 min limit):
├─ Server 1: User makes 5 requests ✅ (allowed)
├─ Server 2: User makes 5 requests ✅ (allowed)  ❌ Should be blocked!
└─ Server 3: User makes 5 requests ✅ (allowed)  ❌ Should be blocked!

With Redis (5 requests per 15 min limit):
├─ All Servers share same counter
└─ User makes 5 requests ✅, then blocked ✅ (works correctly)
```

## Setup Instructions

### For Development (Optional)

No setup required! The system will automatically use in-memory rate limiting.

If you want to test Redis locally:

1. Create a free Redis instance at [Upstash](https://console.upstash.com/)
2. Copy the REST URL and token to your `.env.local`:

```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### For Production (Recommended)

1. **Create Upstash Redis Instance**:
   - Go to https://console.upstash.com/
   - Click "Create Database"
   - Choose your region (closest to your app)
   - Select "Free" plan (25MB, 10k requests/day)

2. **Get Connection Details**:
   - Click on your database
   - Go to "REST API" tab
   - Copy "UPSTASH_REDIS_REST_URL"
   - Copy "UPSTASH_REDIS_REST_TOKEN"

3. **Add to Environment Variables**:

   **Vercel**:
   ```bash
   vercel env add UPSTASH_REDIS_REST_URL production
   vercel env add UPSTASH_REDIS_REST_TOKEN production
   ```

   **AWS/Other**:
   Add to your deployment configuration or `.env.production`

## Rate Limit Rules

Current rate limits configured in the application:

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `POST /api/auth/login` | 5 requests | 15 minutes | Email |
| `POST /api/auth/forgot-password` | 3 requests | 60 minutes | Email |
| General API | 10 requests | 60 seconds | IP Address |

## How It Works

### Architecture

```typescript
┌─────────────────────────────────────────────┐
│ Request comes in                             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Rate Limit Check                             │
│  • Try Redis first                           │
│  • Fall back to in-memory if unavailable    │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Redis        │  │ In-Memory    │
│ (Production) │  │ (Fallback)   │
│              │  │              │
│ ✓ Distributed│  │ ⚠ Single     │
│ ✓ Persistent │  │   Instance   │
│ ✓ Serverless │  │              │
└──────────────┘  └──────────────┘
```

### Code Example

```typescript
import { rateLimitByEmail } from '@/lib/rate-limit';

// Automatically uses Redis if configured, otherwise in-memory
const rateLimit = await rateLimitByEmail(email, {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 5,             // 5 attempts
});

if (!rateLimit.success) {
  return NextResponse.json(
    { error: rateLimit.error },
    { status: 429 }
  );
}
```

## Testing

### Test Redis Connection

```bash
# Set environment variables
export UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
export UPSTASH_REDIS_REST_TOKEN=your_token

# Run dev server
npm run dev

# Make requests and check console
# You should see: "Using Redis for rate limiting"
```

### Test Rate Limiting

```bash
# Test login rate limit (5 attempts per 15 minutes)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

# Repeat 6 times - the 6th should return 429 Too Many Requests
```

## Monitoring

### Redis Usage

Check your Upstash dashboard to monitor:
- Request count
- Memory usage
- Error rate

### Logs

The application logs rate limit events in development:

```
[Rate Limit] Using Redis for rate limiting
[Rate Limit] Using in-memory fallback for key: email:test@example.com
[Rate Limit] Rate limit exceeded for: email:test@example.com
```

## Troubleshooting

### Issue: Rate limiting not working in production

**Symptoms**: Users can bypass rate limits

**Solution**:
1. Check environment variables are set correctly
2. Verify Redis connection in logs
3. Ensure using async functions (not deprecated sync versions)

### Issue: "Redis not available" warning

**Symptoms**: Warning in console: `[Rate Limit] Redis not configured. Using in-memory fallback.`

**Solution**:
- For development: This is normal, no action needed
- For production: Add Redis environment variables

### Issue: Getting 429 errors unexpectedly

**Symptoms**: Users blocked even with few requests

**Possible causes**:
1. Shared IP addresses (corporate proxy, VPN)
2. Multiple users behind NAT
3. Rate limit window not expired

**Solutions**:
- Increase rate limits
- Use user-based limiting instead of IP
- Reduce window duration

## Migration from In-Memory

If you're currently using in-memory rate limiting:

1. ✅ **No code changes needed** - The system is already hybrid
2. Add Redis environment variables
3. Deploy
4. Verify Redis is being used (check logs)

Old sync functions are deprecated but still work (will use in-memory):
```typescript
// ❌ Deprecated (in-memory only)
const rateLimit = rateLimitByEmail(email);

// ✅ Recommended (Redis-compatible)
const rateLimit = await rateLimitByEmail(email);
```

## Cost

**Upstash Free Tier**:
- ✅ 10,000 requests/day
- ✅ 25MB storage
- ✅ Perfect for small-medium apps

**Pricing for larger apps**:
- $0.20 per 100,000 requests
- Much cheaper than DDoS damage

## Security Considerations

1. **Don't expose Redis credentials** - Use environment variables
2. **Use TLS** - Upstash uses HTTPS by default
3. **Monitor for abuse** - Set up alerts in Upstash dashboard
4. **Rate limit keys** - Use appropriate keys (email, IP, user ID)

## Alternative Solutions

If you can't use Redis:

1. **Database-backed** - Store counts in PostgreSQL/MySQL
   - ❌ Slower than Redis
   - ❌ More database load
   - ✅ Works with existing infrastructure

2. **Edge Rate Limiting** - Cloudflare, Fastly
   - ✅ Fast
   - ✅ DDoS protection
   - ❌ Less granular control

3. **API Gateway** - AWS API Gateway, Google Cloud Endpoints
   - ✅ Built-in rate limiting
   - ❌ Vendor lock-in
   - ❌ Additional costs

## References

- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Sliding Window Rate Limiting Algorithm](https://en.wikipedia.org/wiki/Rate_limiting#Sliding_window)
- [@upstash/redis NPM Package](https://www.npmjs.com/package/@upstash/redis)

---

**Questions?** Check the code in:
- `/src/lib/rate-limit-redis.ts` - Redis implementation
- `/src/lib/rate-limit.ts` - Hybrid wrapper
- `/src/app/api/auth/login/route.ts` - Usage example
