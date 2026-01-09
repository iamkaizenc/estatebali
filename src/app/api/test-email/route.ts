import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

// Test email endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject = "Test Email from EstateBali", message = "This is a test email." } = body;

    if (!to) {
      return NextResponse.json(
        { success: false, error: "Email address is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address format" },
        { status: 400 }
      );
    }

    logger.debug('[Test Email] Sending test email', { to, subject });

    const result = await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #00FF66;">EstateBali Test Email</h1>
          <p>${message}</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is a test email sent from EstateBali platform.
          </p>
        </div>
      `,
      text: `EstateBali Test Email\n\n${message}\n\nThis is a test email sent from EstateBali platform.`,
    });

    if (result.success) {
      logger.debug('[Test Email] Email sent successfully', { to });
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
      });
    } else {
      logger.error('[Test Email] Failed to send email', new Error(result.error || 'Unknown error'));
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to send email",
          details: "Check RESEND_API_KEY and FROM_EMAIL environment variables",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error('[Test Email] Error', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send test email",
      },
      { status: 500 }
    );
  }
}
