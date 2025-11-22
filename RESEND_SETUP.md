# Resend Email Service Setup Guide

Complete guide for setting up Resend email service for Estate Bali password reset functionality.

## Current Status

✅ **Code Integration:** COMPLETE
✅ **API Key:** Configured (`re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX`)
⚠️  **Domain Verification:** REQUIRED
⚠️  **Testing:** PENDING

---

## Step 1: Resend Dashboard Setup

### 1.1 Login to Resend

1. Go to: https://resend.com/login
2. Login with your account
3. You should see the Resend Dashboard

### 1.2 Verify Your API Key

**Your API Key:** `re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX`

1. Go to: https://resend.com/api-keys
2. Check if this API key exists
3. If not listed, create a new one:
   - Click "Create API Key"
   - Name: "Estate Bali Production"
   - Permission: "Sending access"
   - Click "Add"
   - Copy the key to `.env` file

---

## Step 2: Domain Verification (CRITICAL)

### 2.1 Add Your Domain

1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain: **`estatebali.com`** (or your actual domain)
4. Click "Add"

### 2.2 Verify DNS Records

Resend will show you DNS records to add. You need to add these to your domain registrar:

**Example DNS Records:**

| Type | Name | Value |
|------|------|-------|
| TXT | `@` or `estatebali.com` | `resend-verification=xxxxx` |
| MX | `@` or `estatebali.com` | `feedback-smtp.resend.com` (Priority: 10) |
| TXT | `_resend._domainkey` | `p=MIGfMA0GCS...` (DKIM key) |

### 2.3 Add DNS Records

**Where to add DNS records depends on your domain registrar:**

#### Option A: Namecheap
1. Login to Namecheap
2. Go to Domain List → Manage
3. Click "Advanced DNS"
4. Add the records shown by Resend

#### Option B: GoDaddy
1. Login to GoDaddy
2. Go to My Products → DNS
3. Add the records shown by Resend

#### Option C: Cloudflare
1. Login to Cloudflare
2. Select your domain
3. Go to DNS → Records
4. Add the records shown by Resend

#### Option D: Other Registrars
- Find DNS settings in your domain control panel
- Add the TXT, MX, and DKIM records

### 2.4 Verify Domain

1. After adding DNS records, go back to Resend Dashboard
2. Click "Verify" next to your domain
3. Wait for verification (can take 5-60 minutes)
4. Status should change to ✅ "Verified"

---

## Step 3: Development Testing (Without Domain)

If you don't have a domain yet or want to test immediately:

### 3.1 Use Resend's Test Domain

Resend provides a test domain: `onboarding@resend.dev`

**Update `.env` for testing:**

```bash
# For testing only - use Resend's test domain
FROM_EMAIL=onboarding@resend.dev
```

**Limitations:**
- ⚠️ Can only send to YOUR verified email
- ⚠️ Limited to test purposes
- ❌ Not for production

### 3.2 Verify Your Personal Email

1. Go to: https://resend.com/settings/emails
2. Add your email address
3. Check your inbox for verification email
4. Click verification link

Now you can test password reset sending emails to your verified email!

---

## Step 4: Test Password Reset Email

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test with cURL

```bash
# Request password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"your-verified-email@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

### 4.3 Check Your Email

1. Check inbox for email from `noreply@estatebali.com` (or test domain)
2. Subject: "Reset Your Password"
3. Email should have:
   - Beautiful HTML design
   - "Reset Password" button
   - Reset link (valid for 1 hour)
   - Security notice

### 4.4 Test Reset Link

1. Click the "Reset Password" button in email
2. Should open: `http://localhost:3000/reset-password?token=xxxxx`
3. Enter new password
4. Password strength meter should show
5. Click "Reset Password"
6. Should redirect to login page

---

## Step 5: Check Email in Resend Dashboard

### 5.1 View Sent Emails

1. Go to: https://resend.com/emails
2. You should see your password reset email
3. Click on it to see details:
   - Status: Delivered / Bounced / Opened
   - Timestamps
   - Recipient
   - Subject

### 5.2 Check Email Logs

1. Go to: https://resend.com/logs
2. See all email activity:
   - API requests
   - Delivery status
   - Error messages (if any)

---

## Step 6: Production Setup

### 6.1 Update Environment Variables

Once domain is verified, update `.env`:

```bash
# Use your verified domain
FROM_EMAIL=noreply@estatebali.com

# Or alternative email addresses:
# FROM_EMAIL=support@estatebali.com
# FROM_EMAIL=hello@estatebali.com
```

### 6.2 Test Production Email

```bash
# Test with real domain email
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 6.3 Verify Deliverability

Check these to ensure good email delivery:

1. **SPF Record:** ✅ Added (via Resend DNS)
2. **DKIM:** ✅ Added (via Resend DNS)
3. **DMARC:** ⚠️ Optional but recommended
4. **Domain Verified:** ✅ Must be verified

---

## Troubleshooting

### Issue 1: "Domain not verified" Error

**Problem:** Email fails to send

**Solution:**
1. Check Resend Dashboard → Domains
2. Ensure status is ✅ Verified
3. If not, check DNS records are correct
4. Wait up to 60 minutes for DNS propagation

### Issue 2: Email Not Received

**Problem:** Password reset email doesn't arrive

**Check:**
1. ✅ Spam/Junk folder
2. ✅ FROM_EMAIL matches verified domain
3. ✅ API key is valid
4. ✅ Resend logs show "Delivered"

**Common causes:**
- Email marked as spam (check spam folder)
- FROM_EMAIL domain not verified
- Recipient email invalid
- API key expired/invalid

### Issue 3: "API Key Invalid" Error

**Problem:** Console shows Resend API error

**Solution:**
1. Check `.env` file: `RESEND_API_KEY=re_...`
2. Verify key in Resend Dashboard → API Keys
3. Create new key if needed
4. Restart dev server: `npm run dev`

### Issue 4: Email Sent to Wrong Address

**Problem:** Test email goes to wrong recipient

**Check:**
1. Database: User exists with that email?
2. Console logs: Check which email is being used
3. API request: Verify email in request body

### Issue 5: Rate Limiting

**Problem:** "Too many requests" error

**Solution:**
```bash
# Resend free tier limits:
# - 100 emails/day
# - 3,000 emails/month

# Check usage:
# https://resend.com/settings/billing
```

---

## Email Template Customization

### Current Template

The password reset email template is in: `src/lib/email.ts`

**Current design:**
- Estate Bali branding
- Professional layout
- Clear call-to-action button
- Security notice
- 1-hour expiration warning

### Customize Template

Edit `src/lib/email.ts` line 246-323:

```typescript
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string = 'there') => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <!-- Your custom HTML here -->
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Reset Your Password</h1>
            <p>Hi ${userName},</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}"
               style="background: #007bff; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This link expires in 1 hour.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Hi ${userName},

      We received a request to reset your password.

      Click the link below to reset your password:
      ${resetUrl}

      This link will expire in 1 hour.

      If you didn't request this, you can safely ignore this email.

      Best regards,
      Estate Bali Team
    `,
  }),
};
```

After editing, restart server: `npm run dev`

---

## Resend Features

### Email Analytics

Track email performance:
- Open rates
- Click rates
- Bounce rates
- Delivery time

Access at: https://resend.com/emails

### Webhooks (Optional)

Get notified of email events:
1. Go to: https://resend.com/webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/resend`
3. Select events: delivered, bounced, opened, clicked

### Email Testing

Test emails before sending:
1. Go to: https://resend.com/emails/test
2. Preview email HTML
3. Send test to yourself

---

## Resend Dashboard Quick Links

| Function | URL |
|----------|-----|
| Dashboard | https://resend.com/overview |
| API Keys | https://resend.com/api-keys |
| Domains | https://resend.com/domains |
| Emails Sent | https://resend.com/emails |
| Logs | https://resend.com/logs |
| Settings | https://resend.com/settings |
| Documentation | https://resend.com/docs |

---

## Pricing

**Free Tier:**
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ All features
- ✅ No credit card required

**Paid Plans:**
- $20/month: 50,000 emails/month
- $80/month: 100,000 emails/month
- Custom: Enterprise volume

Check: https://resend.com/pricing

---

## Alternative: Development Mode (Mock Emails)

If you want to develop without Resend:

### Option 1: Comment out Resend API Key

```bash
# .env
# RESEND_API_KEY=re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX
FROM_EMAIL=noreply@estatebali.com
```

**Result:**
- Email service falls back to MOCK mode
- Reset URL logged to console
- No actual email sent
- Good for development/testing

### Option 2: Check Console Logs

When email fails (no API key or domain not verified):

```bash
# Console output:
Password reset link (DEV ONLY):
http://localhost:3000/reset-password?token=abc123...
```

Copy this URL and use it directly!

---

## Security Best Practices

### ✅ DO:

- ✅ Use verified domain for FROM_EMAIL
- ✅ Keep API key secret (never commit to git)
- ✅ Use HTTPS in production reset URLs
- ✅ Set up SPF/DKIM records
- ✅ Monitor email delivery in Resend dashboard
- ✅ Test password reset flow regularly

### ❌ DON'T:

- ❌ Don't use Resend test domain in production
- ❌ Don't share API keys
- ❌ Don't send from unverified domains
- ❌ Don't ignore bounce/spam reports
- ❌ Don't send emails without rate limiting

---

## Next Steps

1. **Immediate Testing:**
   ```bash
   # Use test domain
   FROM_EMAIL=onboarding@resend.dev
   npm run dev
   # Test forgot password flow
   ```

2. **Domain Verification:**
   - Add your domain to Resend
   - Configure DNS records
   - Wait for verification

3. **Production Setup:**
   - Update FROM_EMAIL to verified domain
   - Test thoroughly
   - Monitor Resend dashboard

4. **Optional Enhancements:**
   - Add webhook for delivery tracking
   - Customize email template
   - Set up email analytics

---

## Support

**Resend Support:**
- Documentation: https://resend.com/docs
- Email: support@resend.com
- Status: https://status.resend.com

**Estate Bali Support:**
- Check: PASSWORD_RESET.md
- Check: ENV_VALIDATION.md
- Check logs: `npm run dev` console output

---

**Last Updated:** 2025-11-22
**Status:** Ready for Testing
