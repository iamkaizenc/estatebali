import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, normalizeEmail } from '@/lib/validators';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { logger } from '@/lib/logger';

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
      logger.debug('[Beta Waitlist] Email submitted (dev mode)', normalizedEmail);
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

      logger.error('[Beta Waitlist] Supabase error', error instanceof Error ? error : new Error(String(error)));
      return NextResponse.json(
        { status: 'error', message: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    // Send notification to all admin users
    if (data && supabaseAdmin) {
      try {
        // Get all admin users
        const { data: adminUsers, error: adminError } = await supabaseAdmin
          .from('admin_users')
          .select('id')
          .eq('active', true);

        if (!adminError && adminUsers && adminUsers.length > 0) {
          // Create notifications for each admin
          const notifications = adminUsers.map(admin => ({
            user_id: admin.id,
            type: 'system',
            title: 'New Beta Waitlist Signup',
            message: `New email joined the iOS beta waitlist: ${normalizedEmail}`,
            data: {
              email: normalizedEmail,
              waitlist_id: data.id,
              source: 'beta_waitlist'
            },
            read: false
          }));

          // Insert notifications (using service role to bypass RLS)
          await supabaseAdmin
            .from('notifications')
            .insert(notifications);

          logger.debug(`[Beta Waitlist] Sent notifications to ${adminUsers.length} admin(s) for email`, normalizedEmail);
        }
      } catch (notifError) {
        // Don't fail the waitlist signup if notification fails
        logger.error('[Beta Waitlist] Failed to send admin notifications', notifError instanceof Error ? notifError : new Error(String(notifError)));
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    logger.error('[Beta Waitlist] Unexpected error', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { status: 'error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
