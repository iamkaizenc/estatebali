# Redis Setup Guide - Upstash

Complete guide for setting up Upstash Redis for distributed rate limiting in Estate Bali.

## Why Redis?

**Current:** In-memory rate limiting (single instance only)
**With Redis:** Distributed rate limiting (works across multiple servers)

**Benefits:**
- ✅ Works in serverless/distributed environments (Vercel, Railway, etc.)
- ✅ Survives server restarts
- ✅ Consistent rate limiting across all instances
- ✅ Production-ready

---

## Quick Start (5 Minutes)

### Step 1: Create Upstash Account

1. Go to: https://upstash.com
2. Click "Get Started Free"
3. Sign up with:
   - GitHub (recommended - 1 click)
   - Google
   - Email

**Free tier includes:**
- ✅ 10,000 commands/day
- ✅ 256 MB storage
- ✅ Global edge network
- ✅ No credit card required

### Step 2: Create Redis Database

1. Login to: https://console.upstash.com
2. Click "Create Database"
3. Configure:

```
Name: estate-bali-redis
Type: Regional (faster, free tier)
Region: Choose closest to your users
  - Europe: eu-west-1 (Ireland)
  - US East: us-east-1 (Virginia)
  - US West: us-west-1 (California)
  - Asia: ap-southeast-1 (Singapore)

Primary Region: [Select one]
Read Regions: None (not needed for rate limiting)
TLS: Enabled ✅
Eviction: No eviction (default)
```

4. Click "Create"

### Step 3: Get Credentials

After database is created:

1. Go to database details page
2. Click "REST API" tab
3. Copy credentials:

```
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxxxxxxx...
```

### Step 4: Add to .env

Open `/home/user/estatebali/.env` and add:

```bash
# Redis - Distributed Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

**Example:**
```bash
UPSTASH_REDIS_REST_URL=https://united-marlin-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYasxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Test

```bash
# Restart dev server
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health | jq '.services.redis'
# Should return: true ✅

# Test rate limiting
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  echo ""
done

# After 3 requests, should get:
# {"success": false, "error": "Too many password reset requests..."}
```

**Done!** ✅ Redis rate limiting is now active.

---

## Detailed Setup

### Upstash Dashboard

**Main Dashboard:** https://console.upstash.com

**Sections:**
- **Databases:** List of your Redis databases
- **Data Browser:** View/edit Redis keys
- **Metrics:** Usage statistics
- **Settings:** Database configuration

### Database Configuration

#### Region Selection

Choose based on your primary users:

| Users Location | Region | Endpoint |
|----------------|--------|----------|
| Europe | `eu-west-1` | Ireland |
| US East Coast | `us-east-1` | Virginia |
| US West Coast | `us-west-1` | California |
| Asia Pacific | `ap-southeast-1` | Singapore |
| Middle East | `eu-central-1` | Frankfurt |

**Tip:** Choose region closest to your Vercel deployment region.

#### Database Types

**Regional (Recommended for Free Tier):**
- ✅ Single region
- ✅ Fast performance
- ✅ Free tier available
- ✅ Perfect for rate limiting

**Global:**
- Multiple read regions
- Lower latency worldwide
- Paid plan required
- Overkill for rate limiting

### REST API vs Redis Protocol

**We use REST API** for compatibility:

| Feature | REST API | Redis Protocol |
|---------|----------|----------------|
| Edge Runtime | ✅ Works | ❌ Doesn't work |
| Vercel | ✅ Compatible | ⚠️ Limited |
| Setup | ✅ Easy (HTTP) | ⚠️ Needs Redis client |
| Performance | ✅ Fast enough | Slightly faster |

**Our code uses REST API** (`@upstash/redis` package with REST).

---

## Testing Redis

### Test 1: Connection

```bash
# Start dev server
npm run dev

# Check health
curl http://localhost:3000/api/health | jq
```

**Expected output:**
```json
{
  "services": {
    "database": true,
    "authentication": true,
    "email": true,
    "redis": true  ← Should be true
  }
}
```

### Test 2: Rate Limiting

```bash
# Test forgot password (rate limit: 3/hour)
for i in {1..5}; do
  echo "Request $i:"
  curl -s -X POST http://localhost:3000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}' | jq '.success'
  sleep 1
done
```

**Expected:**
```
Request 1: true  ✅
Request 2: true  ✅
Request 3: true  ✅
Request 4: false ❌ (rate limited)
Request 5: false ❌ (rate limited)
```

### Test 3: View Redis Data

1. Go to: https://console.upstash.com
2. Click your database
3. Click "Data Browser" tab
4. Search for: `ratelimit:*`

**You'll see keys like:**
```
ratelimit:email:test@example.com
```

Click on a key to see:
- **Value:** List of request timestamps
- **TTL:** Time to live (auto-expires)

### Test 4: Manual Redis Commands

In Upstash Data Browser, run commands:

```redis
# List all rate limit keys
KEYS ratelimit:*

# Check specific email's rate limit
ZRANGE ratelimit:email:test@example.com 0 -1 WITHSCORES

# Count requests in last hour
ZCOUNT ratelimit:email:test@example.com 1732268400000 1732272000000

# Delete a rate limit key (reset)
DEL ratelimit:email:test@example.com
```

---

## How It Works

### Rate Limiting Algorithm

**Sliding Window with Sorted Sets:**

```typescript
// When request comes in:
1. Remove expired entries (older than 1 hour)
   ZREMRANGEBYSCORE ratelimit:email:user@example.com 0 (now - 1 hour)

2. Count remaining requests
   ZCARD ratelimit:email:user@example.com

3. If count >= 3: REJECT (rate limited)

4. If count < 3: ACCEPT and add new entry
   ZADD ratelimit:email:user@example.com (timestamp) (unique-id)

5. Set expiration
   EXPIRE ratelimit:email:user@example.com 3660 (1 hour + buffer)
```

**Why Sorted Sets?**
- ✅ Efficient range queries (remove old entries)
- ✅ Automatic sorting by timestamp
- ✅ O(log N) operations (fast)
- ✅ Perfect for sliding window

### Code Implementation

**File:** `src/lib/rate-limit-redis.ts`

```typescript
export async function checkRateLimitRedis(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const redisKey = `ratelimit:${key}`;

  // Clean up old entries
  await redis.zremrangebyscore(redisKey, 0, windowStart);

  // Count current requests
  const count = await redis.zcard(redisKey);

  if (count >= options.maxRequests) {
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      reset: new Date(now + options.windowMs),
    };
  }

  // Add new request
  await redis.zadd(redisKey, {
    score: now,
    member: `${now}-${Math.random()}`,
  });

  // Set expiration
  await redis.expire(redisKey, Math.ceil(options.windowMs / 1000) + 10);

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - count - 1,
    reset: new Date(now + options.windowMs),
  };
}
```

---

## Monitoring & Management

### Upstash Metrics

**Access:** Console → Database → Metrics

**Available Metrics:**
- 📊 Commands per second
- 💾 Data size
- 🔢 Total commands
- ⏱️ Response time
- 📈 Bandwidth usage

**Time ranges:**
- Last hour
- Last 24 hours
- Last 7 days
- Last 30 days

### Usage Limits

**Free Tier:**
```
Daily Commands: 10,000
Storage: 256 MB
Concurrent Connections: 100
Bandwidth: 100 MB/day
```

**Our Usage (estimated):**
```
Password reset: 3 Redis commands per request
  - ZREMRANGEBYSCORE (1)
  - ZCARD (1)
  - ZADD + EXPIRE (2)

100 password resets/day = 300 commands
Well within free tier! ✅
```

### Check Usage

```bash
# Upstash dashboard
https://console.upstash.com/redis/<database-id>

# Metrics tab shows:
- Commands today: 245 / 10,000
- Storage: 1.2 MB / 256 MB
- Bandwidth: 5 MB / 100 MB
```

---

## Troubleshooting

### Issue 1: "Redis connection failed"

**Symptoms:** Health check shows `redis: false`

**Check:**
```bash
# 1. Verify .env variables
cat .env | grep REDIS

# Expected:
# UPSTASH_REDIS_REST_URL=https://...
# UPSTASH_REDIS_REST_TOKEN=AXXXxxx...
```

**Solutions:**
1. ✅ Check URL/token are correct
2. ✅ No trailing spaces in .env
3. ✅ Restart dev server
4. ✅ Check Upstash dashboard (database active?)

### Issue 2: "Rate limit not working"

**Symptoms:** Can send unlimited requests

**Debug:**
```bash
# Check if Redis is being used
curl http://localhost:3000/api/health | jq '.services.redis'

# If false, check logs:
npm run dev
# Look for: "Falling back to in-memory rate limiting"
```

**Solutions:**
1. ✅ Verify Redis credentials in .env
2. ✅ Check console for Redis errors
3. ✅ Test Redis connection manually (Data Browser)

### Issue 3: "Commands limit reached"

**Symptoms:** Redis errors after many requests

**Check usage:**
```
Upstash Console → Database → Metrics
Daily Commands: 9,999 / 10,000 ⚠️
```

**Solutions:**
1. ✅ Upgrade to paid plan ($10/month = 100k commands)
2. ✅ Optimize code (reduce Redis calls)
3. ✅ Wait until tomorrow (resets daily)

### Issue 4: "Keys not expiring"

**Symptoms:** Old rate limit keys still in Redis

**Check:**
```redis
# In Upstash Data Browser
TTL ratelimit:email:test@example.com

# Should show seconds remaining
# -1 means no expiration (problem!)
# -2 means key doesn't exist
```

**Solutions:**
1. ✅ Check EXPIRE command in code
2. ✅ Manually delete old keys:
   ```redis
   DEL ratelimit:email:old@example.com
   ```

### Issue 5: "Connection timeout"

**Symptoms:** Slow requests, timeout errors

**Causes:**
- Wrong region (high latency)
- Network issues
- Upstash outage

**Check:**
```bash
# Test connection speed
curl -w "\nTime: %{time_total}s\n" \
  https://your-redis.upstash.io/ping

# Should be < 0.1s for good region
```

**Solutions:**
1. ✅ Choose closer region
2. ✅ Check Upstash status: https://status.upstash.com
3. ✅ Fall back to in-memory (automatic)

---

## Production Deployment

### Vercel

**Environment Variables:**

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=AXXXxxx...
   ```
3. Enable for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

**Region matching:**
- Vercel Region: `iad1` (US East) → Upstash: `us-east-1`
- Vercel Region: `sfo1` (US West) → Upstash: `us-west-1`
- Vercel Region: `fra1` (Europe) → Upstash: `eu-central-1`

### Railway

```bash
# Set variables via CLI
railway variables set UPSTASH_REDIS_REST_URL="https://..."
railway variables set UPSTASH_REDIS_REST_TOKEN="AXXXxxx..."

# Or via railway.json
{
  "deploy": {
    "restartPolicyType": "ON_FAILURE"
  },
  "environments": {
    "production": {
      "variables": {
        "UPSTASH_REDIS_REST_URL": "https://...",
        "UPSTASH_REDIS_REST_TOKEN": "AXXXxxx..."
      }
    }
  }
}
```

### Docker

```dockerfile
# Pass as environment variables
docker run -e UPSTASH_REDIS_REST_URL="https://..." \
           -e UPSTASH_REDIS_REST_TOKEN="AXXXxxx..." \
           your-app:latest

# Or use env file
docker run --env-file .env.production your-app:latest
```

---

## Advanced Configuration

### Multiple Rate Limits

**Different limits for different endpoints:**

```typescript
// Forgot password: 3 requests/hour
await checkRateLimit(`email:${email}`, {
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
});

// Login: 5 requests/15 minutes
await checkRateLimit(`ip:${ip}:login`, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

// API calls: 100 requests/minute
await checkRateLimit(`api:${userId}`, {
  windowMs: 60 * 1000,
  maxRequests: 100,
});
```

### Custom Redis Keys

**Current pattern:**
```
ratelimit:email:user@example.com
ratelimit:ip:192.168.1.1
```

**Add custom prefixes:**
```typescript
// By user ID
`ratelimit:user:${userId}:action`

// By API endpoint
`ratelimit:endpoint:/api/properties:user:${userId}`

// By feature
`ratelimit:feature:password-reset:email:${email}`
```

### Cleanup Old Keys

**Automatic (built-in):**
```typescript
// Keys auto-expire after windowMs + 10 seconds
await redis.expire(redisKey, Math.ceil(windowMs / 1000) + 10);
```

**Manual cleanup (optional cron job):**
```typescript
// Delete all expired rate limit keys
export async function cleanupRateLimits() {
  const redis = getRedisClient();
  const pattern = 'ratelimit:*';

  const keys = await redis.keys(pattern);

  for (const key of keys) {
    const ttl = await redis.ttl(key);
    if (ttl === -1) {
      // Key has no expiration, delete it
      await redis.del(key);
    }
  }
}
```

---

## Pricing

### Free Tier (Current)

```
✅ 10,000 commands/day
✅ 256 MB storage
✅ 100 MB bandwidth/day
✅ 100 concurrent connections
✅ REST API included
✅ TLS encryption
✅ No credit card required
```

**Perfect for:**
- Development
- Small apps (<100 users/day)
- Testing

### Pay As You Go

```
$0.20 per 100,000 commands
Storage: Free up to 256 MB
Bandwidth: Free up to 100 MB/day
```

**Example costs:**
```
1 million commands/month = $2
10 million commands/month = $20
100 million commands/month = $200
```

### Fixed Plans

**Pro: $10/month**
- 100,000 commands/day
- 1 GB storage
- 1 GB bandwidth/day

**Enterprise: Custom**
- Unlimited commands
- Dedicated resources
- SLA guarantees
- Priority support

**Our estimate:**
```
100 password resets/day = 300 commands
= 9,000 commands/month
= FREE! ✅
```

Check pricing: https://upstash.com/pricing

---

## Security Best Practices

### ✅ DO:

- ✅ Use environment variables for credentials
- ✅ Enable TLS (default)
- ✅ Set appropriate TTL on keys
- ✅ Monitor usage in Upstash dashboard
- ✅ Use different databases for dev/prod
- ✅ Implement rate limiting on sensitive endpoints
- ✅ Test failover to in-memory (code already handles this)

### ❌ DON'T:

- ❌ Don't commit credentials to git
- ❌ Don't share Redis tokens
- ❌ Don't use same database for dev/prod
- ❌ Don't store sensitive data in Redis (rate limiting only)
- ❌ Don't disable TLS
- ❌ Don't hardcode Redis credentials

---

## Alternative: Local Redis (Development)

For local development, you can use local Redis:

### Install Redis Locally

```bash
# macOS
brew install redis
redis-server

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from: https://redis.io/download
# Or use Docker:
docker run -p 6379:6379 redis
```

### Update .env for Local

```bash
# Use local Redis
UPSTASH_REDIS_REST_URL=http://localhost:6379
UPSTASH_REDIS_REST_TOKEN=local-dev-token
```

**Note:** Our code uses Upstash REST API, not Redis protocol.
Local Redis won't work without code changes. **Use Upstash free tier instead.**

---

## Summary

### Quick Setup Checklist

- [ ] 1. Create Upstash account (https://upstash.com)
- [ ] 2. Create Redis database (Regional, closest region)
- [ ] 3. Copy REST API credentials
- [ ] 4. Add to `.env`:
  ```bash
  UPSTASH_REDIS_REST_URL=https://...
  UPSTASH_REDIS_REST_TOKEN=AXXXxxx...
  ```
- [ ] 5. Restart dev server: `npm run dev`
- [ ] 6. Test: `curl http://localhost:3000/api/health`
- [ ] 7. Verify `redis: true` in response
- [ ] 8. Test rate limiting (3+ forgot password requests)

### Current Status

```
✅ Code: Integrated (@upstash/redis)
✅ Fallback: In-memory (automatic)
⚠️  Redis: Not configured yet
⚠️  Rate Limiting: Using in-memory (single instance)

After Redis setup:
✅ Distributed rate limiting
✅ Works in serverless
✅ Production-ready
```

### Next Steps

1. **Now:** Use in-memory (works fine for development)
2. **Before deployment:** Setup Upstash Redis
3. **Production:** Use Redis for distributed rate limiting

---

## Support

**Upstash:**
- Docs: https://upstash.com/docs
- Discord: https://upstash.com/discord
- Status: https://status.upstash.com

**Estate Bali:**
- Check: RATE_LIMITING.md
- Check: ENV_VALIDATION.md
- Health check: http://localhost:3000/api/health

---

**Last Updated:** 2025-11-22
**Time to Setup:** 5 minutes
**Cost:** FREE (10k commands/day)
**Status:** Ready to Configure
