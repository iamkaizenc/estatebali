# ✅ CURSOR MASTER PROMPT - iOS Beta Waitlist

**Copy-paste this entire prompt into Cursor Chat/Command/Agent**

---

You are working inside the existing EstateBali Next.js repository.

## GOAL
Add a clean, premium iOS TestFlight beta waitlist page at `/beta` and wire it to Supabase using Supabase MCP for database setup.
Match the existing EstateBali brand: minimal, white space, no marketing noise.

---

## STEP 0 — REPO & TOOLING CHECK (DO NOT SKIP)

### 1) Check package.json:
- ✅ Confirm Next.js App Router is used (already confirmed: Next.js 14.2.3)
- ✅ Confirm TailwindCSS is installed (already confirmed: tailwindcss ^3.3.0)
- ✅ Confirm React 18+ (already confirmed: react ^18.3.1)
- ✅ Confirm Supabase is installed (already confirmed: @supabase/supabase-js ^2.81.1)

### 2) Verify existing structure:
- ✅ `tailwind.config.ts` exists and is configured
- ✅ `src/app/globals.css` exists with `@tailwind` directives
- ✅ `src/app/layout.tsx` imports `globals.css`
- ✅ `tsconfig.json` has path alias: `"@/*": ["./src/*"]` (already configured)

### 3) Repository structure:
- App directory: `src/app/` (NOT `app/`)
- Lib directory: `src/lib/` (NOT `lib/`)
- All imports should use `@/` prefix (e.g., `@/lib/validators`)

**Do NOT add new dependencies unless something is missing.**
**Do NOT modify package.json unless absolutely required.**

---

## STEP 1 — CREATE FILES (EXACT IMPLEMENTATION)

### CREATE: `src/lib/validators.ts`

```typescript
/**
 * Email validation utilities for Estate Bali beta waitlist
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  return EMAIL_REGEX.test(trimmed) && trimmed.length <= 254;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
```

---

### CREATE: `src/app/api/waitlist/route.ts`

**Server-side only API route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, normalizeEmail } from '@/lib/validators';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type WaitlistResponse = {
  status: 'success' | 'duplicate' | 'error';
  message?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse<WaitlistResponse>> {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      // Fallback mode: log to console if Supabase not configured
      console.log('[Beta Waitlist] Email submitted (dev mode):', normalizedEmail);
      return NextResponse.json({ status: 'success' });
    }

    // Insert into Supabase using admin client
    const { data, error } = await supabaseAdmin
      .from('beta_waitlist')
      .insert({ email: normalizedEmail })
      .select()
      .single();

    // Handle duplicate (unique constraint violation)
    if (error) {
      // Check for unique violation (PostgreSQL error code 23505)
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return NextResponse.json({ status: 'duplicate' });
      }

      console.error('[Beta Waitlist] Supabase error:', error);
      return NextResponse.json(
        { status: 'error', message: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('[Beta Waitlist] Unexpected error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

---

### CREATE: `src/app/beta/page.tsx`

**Client component with minimal Apple-like UI**

```typescript
'use client';

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { isValidEmail } from '@/lib/validators';

type SubmitState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function BetaPage() {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isEmailValid = isValidEmail(email);
  const canSubmit = isEmailValid && submitState !== 'loading';

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (submitState !== 'idle' && submitState !== 'loading') {
      setSubmitState('idle');
      setErrorMessage('');
    }
  }, [submitState]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSubmitState('success');
      } else if (data.status === 'duplicate') {
        setSubmitState('duplicate');
      } else {
        setSubmitState('error');
        setErrorMessage(data.message || 'Something went wrong');
      }
    } catch {
      setSubmitState('error');
      setErrorMessage('Unable to connect. Please try again.');
    }
  }, [email, canSubmit]);

  const showForm = submitState !== 'success' && submitState !== 'duplicate';

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-5">
        <span className="text-[15px] font-medium tracking-tight text-neutral-800">
          Estate Bali
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-[560px]">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <p className="text-[13px] font-medium tracking-wide text-[#3D7A5A] uppercase mb-3">
              Estate Bali
            </p>
            <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-neutral-900 leading-tight mb-3">
              iOS Beta on TestFlight
            </h1>
            <p className="text-[17px] text-neutral-600 mb-2">
              Early access for selected users.
            </p>
            <p className="text-[14px] text-neutral-400">
              Help us shape the future of buying and renting in Bali.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-6 sm:p-8">
            {showForm ? (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                  <label 
                    htmlFor="email" 
                    className="block text-[13px] font-medium text-neutral-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    disabled={submitState === 'loading'}
                    className="w-full h-12 px-4 text-[15px] text-neutral-900 placeholder:text-neutral-400 
                             bg-neutral-50 border border-neutral-200 rounded-lg
                             transition-all duration-150
                             hover:border-neutral-300
                             focus:outline-none focus:ring-2 focus:ring-[#3D7A5A]/20 focus:border-[#3D7A5A]
                             disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-12 px-6 text-[15px] font-medium text-white
                           bg-neutral-900 rounded-lg
                           transition-all duration-150
                           hover:bg-neutral-800
                           focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:ring-offset-2
                           disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  {submitState === 'loading' ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Request beta access'
                  )}
                </button>

                <p className="mt-4 text-[13px] text-neutral-400 text-center">
                  We'll email you an invite if you're selected.
                </p>

                <div aria-live="polite" aria-atomic="true" className="min-h-[24px] mt-3">
                  {submitState === 'error' && errorMessage && (
                    <p className="text-[13px] text-red-600 text-center">{errorMessage}</p>
                  )}
                </div>
              </form>
            ) : (
              <div className="py-4 text-center" role="status" aria-live="polite">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#3D7A5A]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#3D7A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="text-[17px] font-medium text-neutral-900 mb-1">
                  {submitState === 'success' ? "You're on the waitlist." : "You're already on the list."}
                </p>
                <p className="text-[14px] text-neutral-500">
                  {submitState === 'success' ? "We'll be in touch soon." : "We'll reach out when it's your turn."}
                </p>
              </div>
            )}
          </div>

          {/* App Icon */}
          <div className="mt-8 flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3D7A5A] to-[#2D5A4A] shadow-sm flex items-center justify-center">
              <span className="text-white text-[20px] font-semibold">E</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 text-center">
        <p className="text-[13px] text-neutral-400">
          Bali, Indonesia • info@estatebali.app
        </p>
      </footer>
    </div>
  );
}
```

---

## STEP 2 — SUPABASE MCP (DATABASE SETUP)

**Use Supabase MCP to connect to the correct project and:**

### 1. List available Supabase resources:
- Use MCP to discover the Supabase project
- Identify the correct project ID/URL

### 2. Run SQL via Supabase MCP:

```sql
-- Create beta_waitlist table
CREATE TABLE IF NOT EXISTS beta_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beta_waitlist_email ON beta_waitlist (email);
CREATE INDEX IF NOT EXISTS idx_beta_waitlist_created_at ON beta_waitlist (created_at DESC);

-- Enable Row Level Security
ALTER TABLE beta_waitlist ENABLE ROW LEVEL SECURITY;
```

### 3. IMPORTANT RLS Policies:

**Do NOT add public SELECT policies.**
**Service role bypasses RLS already.**
**Keep table private - only service role can access.**

The existing `supabaseAdmin` client uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS automatically.

### 4. Verify via Supabase MCP:

- Insert a test email: `test@example.com`
- Attempt duplicate insert with same email
- Confirm unique constraint works (should return error)
- Query all entries to verify data

---

## STEP 3 — ENVIRONMENT CHECK

Ensure the following env vars exist (DO NOT expose to client):

- ✅ `NEXT_PUBLIC_SUPABASE_URL` (should already exist)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (should already exist)

**If missing, warn me but do not hard-fail.**
**The API route has fallback mode (console logging) if Supabase is not configured.**

---

## STEP 4 — FINAL VERIFICATION

### Manual Testing:
1. ✅ Visit `/beta` in browser
2. ✅ Confirm page renders with correct styling (white background, minimal design)
3. ✅ Submit valid email → should show success message
4. ✅ Submit same email again → should show duplicate message
5. ✅ Check browser console → no errors
6. ✅ Check server logs → no errors

### Database Verification:
1. ✅ Use Supabase MCP to query `beta_waitlist` table
2. ✅ Confirm test emails are stored correctly
3. ✅ Verify `created_at` timestamps are set
4. ✅ Confirm unique constraint prevents duplicates

---

## OUTPUT TO ME:

After completing all steps, provide:

1. ✅ **Confirmation each step completed**
2. ✅ **Any fixes applied to Tailwind or tsconfig** (if any)
3. ✅ **Final schema of beta_waitlist table** (from Supabase MCP)
4. ✅ **Whether RLS is enabled** (should be: YES)
5. ✅ **Test results** (email submission, duplicate handling)
6. ✅ **Any warnings or issues** encountered

---

## NOTES:

- **Repository structure**: Use `src/app/` and `src/lib/` (NOT `app/` or `lib/`)
- **Path aliases**: All imports use `@/` prefix (e.g., `@/lib/validators`)
- **Supabase client**: Use existing `supabaseAdmin` from `@/lib/supabaseAdmin`
- **No new dependencies**: Everything needed is already installed
- **Fallback mode**: API works even if Supabase env vars are missing (logs to console)

---

**END OF PROMPT**
