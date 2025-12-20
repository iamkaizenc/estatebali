import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { verifyAdminAuth } from '@/lib/api-auth';

/**
 * POST /api/test-email - Test email sending (admin only)
 * 
 * This endpoint allows admins to test email configuration.
 * Requires admin authentication.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { to, testType } = body;

    // Validate email
    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address required' },
        { status: 400 }
      );
    }

    let emailResult;

    switch (testType) {
      case 'welcome':
        emailResult = await sendEmail({
          to,
          ...emailTemplates.welcomeEmail('Test User'),
        });
        break;

      case 'password-reset':
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://estatebali.app'}/reset-password?token=test-token-123`;
        emailResult = await sendEmail({
          to,
          ...emailTemplates.passwordReset(resetUrl, 'Test User'),
        });
        break;

      case 'custom':
        emailResult = await sendEmail({
          to,
          subject: body.subject || 'Test Email from EstateBali',
          html: body.html || '<h1>Test Email</h1><p>This is a test email from EstateBali.</p>',
          text: body.text || 'Test Email\n\nThis is a test email from EstateBali.',
        });
        break;

      default:
        // Simple test email
        emailResult = await sendEmail({
          to,
          subject: 'Test Email from EstateBali',
          html: `
            <h1>Email Service Test</h1>
            <p>This is a test email to verify that the email service is configured correctly.</p>
            <p>If you received this email, your email service is working! ✅</p>
            <p><strong>Service:</strong> ${process.env.RESEND_API_KEY ? 'Resend' : process.env.SENDGRID_API_KEY ? 'SendGrid' : 'Not configured'}</p>
            <p><strong>From:</strong> ${process.env.FROM_EMAIL || 'Not configured'}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          `,
          text: 'Email Service Test\n\nThis is a test email to verify that the email service is configured correctly.\n\nIf you received this email, your email service is working!',
        });
    }

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        details: {
          to,
          testType: testType || 'simple',
          service: process.env.RESEND_API_KEY ? 'Resend' : process.env.SENDGRID_API_KEY ? 'SendGrid' : 'Not configured',
          fromEmail: process.env.FROM_EMAIL || 'Not configured',
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to send email',
          details: {
            to,
            service: process.env.RESEND_API_KEY ? 'Resend' : process.env.SENDGRID_API_KEY ? 'SendGrid' : 'Not configured',
            fromEmail: process.env.FROM_EMAIL || 'Not configured',
          },
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send test email',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/test-email - Check email service configuration
 */
export async function GET() {
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasSendGrid = !!process.env.SENDGRID_API_KEY;
  const hasFromEmail = !!process.env.FROM_EMAIL;

  return NextResponse.json({
    configured: hasResend || hasSendGrid,
    service: hasResend ? 'Resend' : hasSendGrid ? 'SendGrid' : 'None',
    hasFromEmail,
    fromEmail: process.env.FROM_EMAIL || 'Not configured',
    resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
    sendgridKeyLength: process.env.SENDGRID_API_KEY?.length || 0,
    // Don't expose full keys, just show if they exist
    resendKeyPreview: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : 'Not set',
    sendgridKeyPreview: process.env.SENDGRID_API_KEY ? `${process.env.SENDGRID_API_KEY.substring(0, 10)}...` : 'Not set',
  });
}
