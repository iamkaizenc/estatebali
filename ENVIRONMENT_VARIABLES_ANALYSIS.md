# Environment Variables Analysis Report

**Generated:** 2025-12-14  
**Repository:** EstateBali Next.js Application  
**Framework:** Next.js 14.2.3 (App Router)  
**Backend:** Supabase  
**Mobile:** None (No Expo/React Native detected)

---

## Executive Summary

This repository uses **Next.js 14.2.3** (App Router) with **Supabase** backend. No Expo/React Native detected. All environment variables follow Next.js conventions:
- `NEXT_PUBLIC_*` for client-side accessible variables
- Server-only variables (no prefix) for sensitive data

**Total Variables Found:** 13 unique environment variables  
**Critical Issues:** 1 security risk  
**Warnings:** 2 inconsistencies

---

## 📊 Complete Environment Variables Table

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | WHERE_TO_DEFINE |
|----------|--------------|--------------|--------|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase.ts`<br>`src/lib/supabaseAdmin.ts`<br>`src/lib/auth.ts`<br>`src/app/api/auth/login/route.ts`<br>`src/app/api/waitlist/route.ts` | ✅ All | ✅ OK | Client + Server | `.env.local`, Vercel (All) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `src/lib/supabase.ts` | ✅ All | ✅ OK | Client + Server | `.env.local`, Vercel (All) |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/lib/supabaseAdmin.ts`<br>`src/lib/auth.ts`<br>`src/app/api/auth/login/route.ts`<br>`src/app/api/waitlist/route.ts` | ✅ All | ✅ OK | **Server-only** | `.env.local`, Vercel (All) |
| `JWT_SECRET` | `src/lib/auth.ts` | ✅ All | ✅ OK | **Server-only** | `.env.local`, Vercel (All) |
| `NEXT_PUBLIC_APP_URL` | `src/lib/email.ts`<br>`src/app/api/auth/forgot-password/route.ts` | ✅ All | ✅ OK | Client + Server | `.env.local`, Vercel (All) |
| `RESEND_API_KEY` | `src/lib/email.ts` | ⚠️ Production | ✅ OK | **Server-only** | `.env.local`, Vercel (Production) |
| `SENDGRID_API_KEY` | `src/lib/email.ts` | ⚠️ Production | ✅ OK | **Server-only** | `.env.local`, Vercel (Production) |
| `FROM_EMAIL` | `src/lib/email.ts` | ⚠️ Production | ✅ OK | **Server-only** | `.env.local`, Vercel (Production) |
| `UPSTASH_REDIS_REST_URL` | `src/lib/rate-limit-redis.ts` | ❌ Optional | ✅ OK | **Server-only** | `.env.local`, Vercel (Production) |
| `UPSTASH_REDIS_REST_TOKEN` | `src/lib/rate-limit-redis.ts` | ❌ Optional | ✅ OK | **Server-only** | `.env.local`, Vercel (Production) |
| `NEXT_PUBLIC_GA_ID` | `src/app/[locale]/layout.tsx` | ❌ Optional | ✅ OK | Client + Server | `.env.local`, Vercel (Production) |
| `NEXT_PUBLIC_SENTRY_DSN` | `src/lib/env-validation.ts`<br>`src/components/ErrorBoundary.tsx` | ❌ Optional | ⚠️ **NOT USED** | Client + Server | `.env.local`, Vercel (Production) |
| `NODE_ENV` | Multiple files | ❌ Auto-set | ✅ OK | Server | Auto-set by Next.js/Vercel |

---

## Environment Variables Inventory

### 1. Supabase Configuration (Required)

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | NOTES |
|----------|--------------|--------------|--------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase.ts`<br>`src/lib/supabaseAdmin.ts`<br>`src/lib/auth.ts`<br>`src/app/api/auth/login/route.ts` | ✅ All | ✅ OK | Client + Server | Must start with `https://` and include `supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `src/lib/supabase.ts` | ✅ All | ✅ OK | Client + Server | JWT token, length > 100 chars |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/lib/supabaseAdmin.ts`<br>`src/lib/auth.ts`<br>`src/app/api/auth/login/route.ts`<br>`src/app/api/waitlist/route.ts` | ✅ All | ✅ OK | **Server-only** | ⚠️ **CRITICAL:** Must NOT have `NEXT_PUBLIC_` prefix |

**⚠️ Security Issue Found:**
- `src/app/api/auth/login/route.ts:37` checks for `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` as fallback
- **FIX:** Remove this fallback - it's a security risk if accidentally set

---

### 2. Authentication (Required)

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | NOTES |
|----------|--------------|--------------|--------|-------|-------|
| `JWT_SECRET` | `src/lib/auth.ts` | ✅ All | ✅ OK | **Server-only** | Minimum 32 characters. Used for token signing/verification |

**Validation:**
- ✅ Checked at module load in `src/lib/auth.ts`
- ✅ Minimum length validation (32 chars)
- ✅ Fail-fast in production

---

### 3. Application Configuration (Required)

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | NOTES |
|----------|--------------|--------------|--------|-------|-------|
| `NEXT_PUBLIC_APP_URL` | `src/lib/email.ts`<br>`src/app/api/auth/forgot-password/route.ts` | ✅ All | ✅ OK | Client + Server | Used for password reset links, email templates. Defaults to `http://localhost:3000` in dev |

---

### 4. Email Service (Required in Production)

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | NOTES |
|----------|--------------|--------------|--------|-------|-------|
| `RESEND_API_KEY` | `src/lib/email.ts` | ⚠️ Production | ✅ OK | **Server-only** | Must start with `re_`. Alternative to SendGrid |
| `SENDGRID_API_KEY` | `src/lib/email.ts` | ⚠️ Production | ✅ OK | **Server-only** | Must start with `SG.`. Alternative to Resend |
| `FROM_EMAIL` | `src/lib/email.ts` | ⚠️ Production | ✅ OK | **Server-only** | Valid email format. Used as sender address |

**Validation Logic:**
- ✅ At least one email service (Resend OR SendGrid) required in production
- ✅ `FROM_EMAIL` required in production
- ⚠️ Development: Optional (warnings only)

---

### 5. Redis / Rate Limiting (Optional)

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | NOTES |
|----------|--------------|--------------|--------|-------|-------|
| `UPSTASH_REDIS_REST_URL` | `src/lib/rate-limit-redis.ts` | ❌ Optional | ✅ OK | **Server-only** | Must start with `https://`. Falls back to in-memory if missing |
| `UPSTASH_REDIS_REST_TOKEN` | `src/lib/rate-limit-redis.ts` | ❌ Optional | ✅ OK | **Server-only** | Required if `UPSTASH_REDIS_REST_URL` is set |

**Validation:**
- ⚠️ Both must be set together (warnings if only one is set)
- ✅ Falls back to in-memory rate limiting if not configured

---

### 6. Analytics & Monitoring (Optional)

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | NOTES |
|----------|--------------|--------------|--------|-------|-------|
| `NEXT_PUBLIC_GA_ID` | `src/app/[locale]/layout.tsx` | ❌ Optional | ✅ OK | Client + Server | Google Analytics ID. Must start with `G-` |
| `NEXT_PUBLIC_SENTRY_DSN` | Referenced in `src/lib/env-validation.ts`<br>`src/components/ErrorBoundary.tsx` | ❌ Optional | ⚠️ **NOT USED** | Client + Server | Defined but not actively used in codebase |

---

### 7. Node Environment (Auto-set)

| ENV_NAME | USED_IN_FILE | REQUIRED_ENV | STATUS | SCOPE | NOTES |
|----------|--------------|--------------|--------|-------|-------|
| `NODE_ENV` | Multiple files | ❌ Auto-set | ✅ OK | Server | Values: `development`, `production`, `test`. Used for conditional logic |

---

## Issues Found

### 🔴 Critical Issues

1. **Security Risk - Service Role Key Fallback**
   - **File:** `src/app/api/auth/login/route.ts:37`
   - **Issue:** Checks for `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` as fallback
   - **Risk:** If accidentally set with `NEXT_PUBLIC_` prefix, service role key would be exposed to client
   - **Fix:** Remove this fallback check

### 🟡 Warnings

1. **Unused Variable**
   - `NEXT_PUBLIC_SENTRY_DSN` is defined in validation but not actively used
   - **Recommendation:** Either implement Sentry or remove from validation

2. **Inconsistent Fallback Names**
   - `src/lib/auth.ts:145` checks `SUPABASE_SERVICE_KEY` as fallback
   - `src/app/api/auth/login/route.ts:36` checks `SUPABASE_SERVICE_KEY` as fallback
   - **Recommendation:** Standardize on `SUPABASE_SERVICE_ROLE_KEY` only

---

## Environment-Specific Requirements

### Local Development (`.env.local`)

**Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-32-character-minimum-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Optional:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Preview (Vercel Preview Deployments)

**Same as Production** - All required variables must be set.

### Production (Vercel Production)

**Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-32-character-minimum-secret-key
NEXT_PUBLIC_APP_URL=https://estatebali.app
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@estatebali.app
```

**Recommended:**
```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Variable Naming Consistency

### ✅ Correct Usage

| Variable | Scope | Status |
|----------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | ✅ Correct |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | ✅ Correct |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | ✅ Correct (no prefix) |
| `JWT_SECRET` | Server-only | ✅ Correct (no prefix) |
| `RESEND_API_KEY` | Server-only | ✅ Correct (no prefix) |
| `SENDGRID_API_KEY` | Server-only | ✅ Correct (no prefix) |
| `FROM_EMAIL` | Server-only | ✅ Correct (no prefix) |
| `UPSTASH_REDIS_REST_URL` | Server-only | ✅ Correct (no prefix) |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only | ✅ Correct (no prefix) |
| `NEXT_PUBLIC_APP_URL` | Client + Server | ✅ Correct |
| `NEXT_PUBLIC_GA_ID` | Client + Server | ✅ Correct |
| `NEXT_PUBLIC_SENTRY_DSN` | Client + Server | ✅ Correct (but unused) |

### ❌ Incorrect Usage (Found in Code)

| Variable | File | Issue | Fix |
|----------|------|-------|-----|
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | `src/app/api/auth/login/route.ts:37` | Security risk - should never exist | Remove fallback check |
| `SUPABASE_SERVICE_KEY` | `src/lib/auth.ts:145`<br>`src/app/api/auth/login/route.ts:36` | Inconsistent naming | Use `SUPABASE_SERVICE_ROLE_KEY` only |

---

## Recommended Fixes

### 1. Remove Security Risk in Login Route

**File:** `src/app/api/auth/login/route.ts`

**Current (Line 35-37):**
```typescript
const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY; // ⚠️ DANGEROUS
```

**Fix:**
```typescript
const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY; // Keep for backward compatibility only
// Remove NEXT_PUBLIC_ fallback - it's a security risk
```

### 2. Standardize Service Key Name

**Files:** `src/lib/auth.ts`, `src/app/api/auth/login/route.ts`

**Recommendation:** Remove `SUPABASE_SERVICE_KEY` fallback after confirming all environments use `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Remove or Implement Sentry

**Option A:** Remove from validation if not using
- Remove `NEXT_PUBLIC_SENTRY_DSN` from `src/lib/env-validation.ts`

**Option B:** Implement Sentry
- Add Sentry initialization in `src/app/layout.tsx` or `src/app/[locale]/layout.tsx`
- Use `NEXT_PUBLIC_SENTRY_DSN` in ErrorBoundary

---

## Vercel Configuration

### Where to Set Variables

1. **Vercel Dashboard:**
   - Project → Settings → Environment Variables
   - Set for: Production, Preview, Development

2. **Required Variables (All Environments):**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   JWT_SECRET
   NEXT_PUBLIC_APP_URL
   ```

3. **Production-Only Required:**
   ```
   RESEND_API_KEY (or SENDGRID_API_KEY)
   FROM_EMAIL
   ```

4. **Recommended (Production):**
   ```
   UPSTASH_REDIS_REST_URL
   UPSTASH_REDIS_REST_TOKEN
   NEXT_PUBLIC_GA_ID
   ```

---

## Local Development Setup

### `.env.local` Template

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://hfsdvopvsttqcildsyvi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Authentication (Required)
JWT_SECRET=your-32-character-minimum-secret-key-here

# App Configuration (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service (Optional for dev, Required for prod)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@estatebali.app

# Redis (Optional)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Validation Summary

### ✅ All Required Variables Present
- Supabase configuration: ✅
- Authentication: ✅
- App URL: ✅

### ⚠️ Production Requirements
- Email service: ⚠️ Required in production
- Redis: ⚠️ Recommended for production

### ❌ Issues to Fix
1. Remove `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` fallback check
2. Standardize service key naming
3. Remove or implement Sentry

---

## Files Using Environment Variables

### Client-Side (NEXT_PUBLIC_*)
- `src/lib/supabase.ts` - Supabase client
- `src/app/[locale]/layout.tsx` - Google Analytics

### Server-Side Only
- `src/lib/supabaseAdmin.ts` - Supabase admin client
- `src/lib/auth.ts` - JWT authentication
- `src/lib/email.ts` - Email service
- `src/lib/rate-limit-redis.ts` - Redis rate limiting
- `src/app/api/**/*.ts` - API routes

### Both Client & Server
- `src/lib/env-validation.ts` - Environment validation
- `next.config.js` - Build configuration

---

## No Expo/React Native Detected

This is a **Next.js-only** application. No `eas.json`, `app.config.js`, or `app.json` files found. All environment variables follow Next.js conventions.

---

## 🔧 Exact Fixes Required

### Fix 1: Remove Security Risk in Login Route

**File:** `src/app/api/auth/login/route.ts`  
**Line:** 35-37

**Current Code:**
```typescript
const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY; // ⚠️ SECURITY RISK
```

**Fixed Code:**
```typescript
const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY; // Keep for backward compatibility
// SECURITY: Never use NEXT_PUBLIC_ prefix for service role key
```

**Reason:** If `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` is accidentally set, it would expose the service role key to the client, compromising the entire database.

---

### Fix 2: Standardize Service Key Variable Name

**Files:**
- `src/lib/auth.ts:145`
- `src/app/api/auth/login/route.ts:36`

**Recommendation:** After confirming all environments use `SUPABASE_SERVICE_ROLE_KEY`, remove `SUPABASE_SERVICE_KEY` fallback.

**Action:** Check Vercel dashboard and `.env.local` to ensure all use `SUPABASE_SERVICE_ROLE_KEY`, then remove fallback.

---

### Fix 3: Remove or Implement Sentry

**Option A - Remove (Recommended if not using):**
- Remove `NEXT_PUBLIC_SENTRY_DSN` from `src/lib/env-validation.ts:117-122`
- Remove reference from `src/components/ErrorBoundary.tsx` if present

**Option B - Implement:**
- Install `@sentry/nextjs`
- Initialize in `src/app/layout.tsx` or `src/app/[locale]/layout.tsx`
- Use `NEXT_PUBLIC_SENTRY_DSN` in ErrorBoundary

---

## 📋 Vercel Environment Variables Setup

### Step-by-Step Guide

1. **Go to Vercel Dashboard:**
   - Project → Settings → Environment Variables

2. **Add Required Variables (All Environments):**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://hfsdvopvsttqcildsyvi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET = your-32-character-minimum-secret-key
   NEXT_PUBLIC_APP_URL = https://estatebali.app
   ```

3. **Add Production-Only Variables:**
   ```
   RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL = noreply@estatebali.app
   ```

4. **Add Recommended Variables (Production):**
   ```
   UPSTASH_REDIS_REST_URL = https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN = your_token
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
   ```

5. **Select Environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development (for local testing)

---

## ✅ Verification Checklist

- [ ] All required variables set in Vercel (Production, Preview, Development)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` does NOT have `NEXT_PUBLIC_` prefix
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] Email service configured (Resend OR SendGrid) in production
- [ ] `FROM_EMAIL` set in production
- [ ] `NEXT_PUBLIC_APP_URL` uses HTTPS in production
- [ ] Security fix applied (remove `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` fallback)
- [ ] Service key naming standardized

---

**End of Report**
