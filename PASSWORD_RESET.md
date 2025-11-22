# Password Reset Flow Documentation

Complete guide for the Estate Bali password reset functionality.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Email Configuration](#email-configuration)
- [Testing](#testing)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Overview

The password reset flow allows users to securely reset their passwords via email verification. The implementation follows security best practices including:

- ✅ Secure token generation with crypto.randomBytes(32)
- ✅ Time-limited tokens (1 hour expiration)
- ✅ Single-use tokens (marked as used after reset)
- ✅ Rate limiting (3 requests per hour per email)
- ✅ No user enumeration (same response for existing/non-existing users)
- ✅ Beautiful HTML email templates
- ✅ Support for both regular users and admin users

## Architecture

### Flow Diagram

```
User requests reset → Forgot Password API → Generate Token → Send Email
                                                ↓
User clicks link → Reset Password Page → Validate Token → Update Password
```

### Components

1. **Database**: `password_reset_tokens` table with RLS policies
2. **API Endpoints**:
   - `POST /api/auth/forgot-password` - Request password reset
   - `POST /api/auth/reset-password` - Reset password with token
3. **Frontend**: `/reset-password` page with password strength meter
4. **Email Service**: Multi-provider support (Resend, SendGrid, Mock)

## Setup

### 1. Database Migration

Run the migration to create the `password_reset_tokens` table:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/create_password_reset_tokens.sql
```

The migration creates:
- `password_reset_tokens` table with proper schema
- Foreign key constraint to `users` table
- Indexes for performance
- RLS policies for security

### 2. Environment Variables

Required variables in `.env`:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App URL (Required for email links)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Email Service (Choose one)
# Option 1: Resend (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Option 2: SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx

# From Email (Required)
FROM_EMAIL=noreply@yourdomain.com

# Redis Rate Limiting (Optional but Recommended)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### 3. Email Service Setup

#### Option A: Resend (Recommended)

1. Sign up at https://resend.com
2. Verify your domain
3. Create an API key
4. Add to `.env`: `RESEND_API_KEY=re_xxxxx`

#### Option B: SendGrid

1. Sign up at https://sendgrid.com
2. Verify your domain
3. Create an API key
4. Add to `.env`: `SENDGRID_API_KEY=SG.xxxxx`

#### Development Mode

In development, emails are mocked and the reset URL is logged to console.

## API Endpoints

### POST /api/auth/forgot-password

Request a password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

**Development Response (includes reset URL if email fails):**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent.",
  "devResetUrl": "http://localhost:3000/reset-password?token=abc123..."
}
```

**Rate Limit (429):**
```json
{
  "success": false,
  "error": "Too many password reset requests. Please try again later."
}
```

**Features:**
- Rate limiting: 3 requests per hour per email
- Supports both `users` and `admin_users` tables
- Doesn't reveal if user exists (security best practice)
- Token expires in 1 hour
- In development, logs reset URL to console if email fails

### POST /api/auth/reset-password

Reset password using a valid token.

**Request:**
```json
{
  "token": "abc123...",
  "password": "NewSecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

**Invalid/Expired Token (400):**
```json
{
  "success": false,
  "error": "Invalid or expired reset token"
}
```

**Token Already Used (400):**
```json
{
  "success": false,
  "error": "This reset token has already been used"
}
```

**Features:**
- Validates token existence and expiration
- Checks if token was already used
- Updates password in `users` or `admin_users` table
- Hashes password with bcrypt (10 rounds)
- Marks token as used after successful reset

## Frontend Usage

### Reset Password Page

The reset password page is available at `/reset-password?token=xxx`.

**Features:**
- ✅ Token extracted from URL query parameter
- ✅ Password strength meter (5 levels: Very Weak → Very Strong)
- ✅ Password confirmation matching
- ✅ Production vs Development requirements:
  - **Production**: Minimum 8 characters, uppercase, lowercase, number, special char
  - **Development**: Minimum 6 characters
- ✅ Real-time validation feedback
- ✅ Loading states during submission
- ✅ Error handling with user-friendly messages
- ✅ Automatic redirect to login after success

**Password Strength Levels:**
1. **Very Weak** (< 6 chars) - Red
2. **Weak** (< 8 chars) - Orange
3. **Fair** (8+ chars, no mixed case/numbers) - Yellow
4. **Good** (8+ chars, mixed case or numbers) - Light Green
5. **Strong** (8+ chars, mixed case + numbers) - Dark Green

### Example User Flow

1. User goes to login page, clicks "Forgot Password?"
2. User enters email address
3. User receives email with reset link
4. User clicks link → `/reset-password?token=xxx`
5. User enters new password (sees strength meter)
6. User confirms password
7. User clicks "Reset Password"
8. User is redirected to login with success message

## Email Configuration

### Email Template

The password reset email includes:

**HTML Version:**
- Beautiful branded design
- Clear call-to-action button
- Reset link expires in 1 hour notice
- Fallback text link if button doesn't work
- Security notice about ignoring if not requested
- Responsive design

**Plain Text Version:**
- Same information in text format
- Full reset URL included
- Clear expiration notice

### Email Content

**Subject:** Reset Your Password

**Body (abbreviated):**
```
Hi {name},

We received a request to reset your password for Estate Bali.

Click the button below to reset your password:
[Reset Password Button]

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.
```

### Customizing Templates

Email templates are defined in `src/lib/email.ts`:

```typescript
emailTemplates.passwordReset(resetUrl, userName)
```

To customize, edit the template in `src/lib/email.ts:246-323`.

## Testing

### Manual Testing

#### 1. Test Forgot Password Flow

```bash
# Request password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# In development, check console for reset URL
# In production, check email inbox
```

#### 2. Test Reset Password

```bash
# Reset password with token
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"your-token-from-email",
    "password":"NewPassword123!"
  }'
```

#### 3. Test Rate Limiting

```bash
# Send 4 requests quickly (should fail on 4th)
for i in {1..4}; do
  curl -X POST http://localhost:3000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  echo ""
done
```

### Development Tips

**1. Check Logs:**
```bash
# Console output shows:
# - Email sending status
# - Reset URLs (if email fails)
# - RLS policy errors
# - Rate limiting results
```

**2. Database Inspection:**
```sql
-- Check password_reset_tokens table
SELECT * FROM password_reset_tokens WHERE user_id = 'your-user-id';

-- Clean up expired tokens
DELETE FROM password_reset_tokens WHERE expires_at < NOW();

-- Clean up used tokens
DELETE FROM password_reset_tokens WHERE used = true;
```

**3. Test Email Templates:**

In development mode, emails are logged to console with full HTML content. Copy the HTML to a file and open in browser to preview.

### Common Test Scenarios

| Scenario | Expected Result |
|----------|----------------|
| Valid email, user exists | Email sent, token created |
| Valid email, user doesn't exist | Same response (no user enumeration) |
| Invalid email format | 400 error |
| 4 requests in 1 hour | 4th request gets 429 rate limit |
| Token used once | Success |
| Token used twice | Error: already used |
| Expired token (> 1 hour) | Error: expired |
| Invalid token | Error: invalid |
| Password too weak | Frontend validation prevents submission |

## Security

### Security Features

1. **No User Enumeration**
   - Same response whether user exists or not
   - Prevents attackers from discovering valid email addresses

2. **Token Security**
   - Generated with `crypto.randomBytes(32)` (256-bit entropy)
   - Stored as plain text (tokens are random, not derived from passwords)
   - One-time use only (marked as used after reset)
   - Time-limited (1 hour expiration)

3. **Rate Limiting**
   - Email-based: 3 requests per hour
   - Redis-backed for distributed systems
   - Falls back to in-memory for development

4. **Password Hashing**
   - Bcrypt with 10 rounds
   - Automatic salt generation
   - Industry-standard security

5. **RLS Policies**
   - Service role-only access to password_reset_tokens
   - Users cannot read/modify tokens directly
   - All access through API endpoints

6. **HTTPS Enforcement**
   - Reset links use NEXT_PUBLIC_APP_URL
   - Should always use HTTPS in production

### Security Best Practices

✅ **DO:**
- Use HTTPS in production (`NEXT_PUBLIC_APP_URL=https://...`)
- Set up Redis for production rate limiting
- Monitor failed reset attempts
- Periodically clean up expired tokens
- Use strong FROM_EMAIL domain (verified SPF/DKIM)

❌ **DON'T:**
- Don't reveal if user exists in error messages
- Don't reuse tokens after successful reset
- Don't extend token expiration beyond 1 hour
- Don't log tokens in production
- Don't send reset links over unencrypted channels

### Token Lifecycle

```
1. CREATED    → Token generated, expires_at set, used = false
2. SENT       → Email sent to user
3. VALIDATED  → User clicks link, token checked
4. USED       → Password updated, token marked used = true
5. EXPIRED    → After 1 hour OR after use (whichever comes first)
```

### RLS Policies

The `password_reset_tokens` table has the following RLS policies:

- ✅ Service role can INSERT (create tokens)
- ✅ Service role can SELECT (validate tokens)
- ✅ Service role can UPDATE (mark as used)
- ✅ Service role can DELETE (cleanup)
- ❌ Regular users CANNOT access (all denied)

This ensures all token operations go through API endpoints using the service role, preventing direct user access.

## Troubleshooting

### Email Not Sending

**Symptom:** Password reset email doesn't arrive

**Solutions:**

1. **Check API Key:**
   ```bash
   # Verify environment variable is set
   echo $RESEND_API_KEY
   # or
   echo $SENDGRID_API_KEY
   ```

2. **Check Logs:**
   ```bash
   # Look for email errors in console
   # Development mode will show:
   # "Password reset link (DEV ONLY): http://localhost:3000/reset-password?token=xxx"
   ```

3. **Verify Domain:**
   - Ensure FROM_EMAIL domain is verified in Resend/SendGrid
   - Check SPF/DKIM records

4. **Check Spam Folder:**
   - Reset emails might be filtered as spam
   - Add domain to safe senders

### Token Validation Fails

**Symptom:** "Invalid or expired reset token" error

**Solutions:**

1. **Check Token Expiration:**
   ```sql
   SELECT token, expires_at, used, NOW()
   FROM password_reset_tokens
   WHERE token = 'your-token';
   ```

2. **Check Token Usage:**
   - Tokens can only be used once
   - Check `used` column in database

3. **Check Database:**
   ```sql
   -- Verify table exists
   SELECT * FROM password_reset_tokens LIMIT 1;
   ```

### RLS Policy Errors

**Symptom:** Console shows RLS policy errors when creating tokens

**Solutions:**

1. **Run Migration:**
   ```bash
   # Ensure migration was run
   # supabase/migrations/create_password_reset_tokens.sql
   ```

2. **Check Service Role Key:**
   ```bash
   # Verify SUPABASE_SERVICE_ROLE_KEY is set
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Manual Policy Creation:**
   ```sql
   -- If migration didn't run, manually create policies
   -- See create_password_reset_tokens.sql for policy definitions
   ```

### Rate Limiting Issues

**Symptom:** Getting rate limited unexpectedly

**Solutions:**

1. **Check Redis:**
   ```bash
   # Verify Redis is configured
   echo $UPSTASH_REDIS_REST_URL
   ```

2. **Clear Rate Limit:**
   ```bash
   # If using Redis, flush specific key
   # redis-cli DEL ratelimit:email:user@example.com
   ```

3. **Adjust Limits:**
   ```typescript
   // In forgot-password/route.ts:33
   rateLimitByEmail(email, {
     windowMs: 60 * 60 * 1000,  // 1 hour
     maxRequests: 3              // 3 requests
   })
   ```

### Development Mode Issues

**Symptom:** Reset URLs not showing in development

**Solutions:**

1. **Check NODE_ENV:**
   ```bash
   echo $NODE_ENV
   # Should be "development"
   ```

2. **Check Console:**
   - Reset URLs are logged to console when email fails
   - Look for: `Password reset link (DEV ONLY):`

3. **Force Mock Email:**
   ```typescript
   // Temporarily comment out RESEND_API_KEY in .env
   // This forces mock email provider
   ```

## Advanced Topics

### Custom Email Templates

To customize the email template, edit `src/lib/email.ts`:

```typescript
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string = 'there') => ({
    subject: 'Reset Your Password',
    html: `
      <!-- Your custom HTML here -->
      <a href="${resetUrl}">Reset Password</a>
    `,
    text: `
      Reset your password: ${resetUrl}
    `,
  }),
};
```

### Scheduled Token Cleanup

Set up a cron job to clean up expired tokens:

```sql
-- Run daily
DELETE FROM password_reset_tokens
WHERE expires_at < NOW() OR used = true;
```

**Options:**

1. **Supabase Functions** (Recommended):
   ```sql
   CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
   RETURNS void AS $$
   BEGIN
     DELETE FROM password_reset_tokens
     WHERE expires_at < NOW() OR used = true;
   END;
   $$ LANGUAGE plpgsql;

   -- Schedule with pg_cron extension
   ```

2. **External Cron**:
   ```bash
   # Add to crontab
   0 0 * * * curl -X POST https://yourdomain.com/api/admin/cleanup-tokens
   ```

### Multi-Language Support

To add i18n support for email templates:

```typescript
// In src/lib/email.ts
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string, locale: string = 'en') => {
    const translations = {
      en: { subject: 'Reset Your Password', ... },
      id: { subject: 'Reset Kata Sandi Anda', ... },
    };

    const t = translations[locale] || translations.en;
    return {
      subject: t.subject,
      html: `...`,
      text: `...`,
    };
  },
};
```

## Files Reference

- **API Routes:**
  - `src/app/api/auth/forgot-password/route.ts`
  - `src/app/api/auth/reset-password/route.ts`

- **Frontend:**
  - `src/app/reset-password/page.tsx`

- **Libraries:**
  - `src/lib/email.ts` - Email service and templates
  - `src/lib/rate-limit.ts` - Rate limiting
  - `src/lib/validation.ts` - Input validation schemas

- **Database:**
  - `supabase/migrations/create_password_reset_tokens.sql`

## Related Documentation

- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting setup and architecture
- [TESTING.md](./TESTING.md) - Test infrastructure and examples
- [README.md](./README.md) - General project documentation

## Support

For issues or questions:
1. Check this documentation
2. Check console logs for errors
3. Verify environment variables
4. Test in development mode first
5. Check Supabase logs for database errors

---

Last updated: 2025-11-22
