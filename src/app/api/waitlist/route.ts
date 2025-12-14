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
