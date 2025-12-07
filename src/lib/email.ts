/**
 * Email service for sending transactional emails
 * Supports multiple providers: Resend (recommended), SendGrid
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailProvider {
  send: (options: EmailOptions) => Promise<{ success: boolean; error?: string }>;
}

/**
 * Resend email provider
 */
class ResendProvider implements EmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      // Determine FROM address with fallback logic
      let fromAddress: string;
      
      // Priority 1: Use FROM_EMAIL environment variable if set
      if (process.env.FROM_EMAIL) {
        // Check if it's just an email or includes name
        if (process.env.FROM_EMAIL.includes('<')) {
          fromAddress = process.env.FROM_EMAIL;
        } else {
          fromAddress = `EstateBali <${process.env.FROM_EMAIL}>`;
        }
      } 
      // Priority 2: Production - try verified domain
      else if (process.env.NODE_ENV === 'production') {
        fromAddress = 'EstateBali <noreply@estatebali.com>';
      }
      // Priority 3: Development/fallback - use Resend's onboarding domain (always works)
      else {
        fromAddress = 'EstateBali <onboarding@resend.dev>';
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          // Use text as is
        }

        console.error('Resend API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
        });

        // If domain not verified error, try with onboarding domain as fallback
        if (response.status === 403 && errorMessage?.includes('domain is not verified')) {
          console.log('⚠️  Domain not verified, falling back to onboarding@resend.dev');
          
          // Retry with onboarding domain (always works)
          const fallbackResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              from: 'EstateBali <onboarding@resend.dev>',
              to: options.to,
              subject: options.subject,
              html: options.html,
              text: options.text,
            }),
          });

          if (fallbackResponse.ok) {
            const result = await fallbackResponse.json();
            console.log('✅ Email sent successfully via Resend (with fallback domain):', result.id);
            return { success: true };
          }
        }

        return { success: false, error: `Resend API error (${response.status}): ${errorMessage}` };
      }

      const result = await response.json();
      console.log('✅ Email sent successfully via Resend:', result.id);

      return { success: true };
    } catch (error: any) {
      console.error('Failed to send email via Resend:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }
  }
}

/**
 * SendGrid email provider
 */
class SendGridProvider implements EmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: options.to }] }],
          from: { email: 'noreply@estatebali.com', name: 'EstateBali' },
          subject: options.subject,
          content: [
            { type: 'text/html', value: options.html },
            ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `SendGrid API error: ${error}` };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send email' };
    }
  }
}

/**
 * Mock email provider for development
 */
class MockProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    console.log('\n📧 [Mock Email] ==================');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('HTML:', options.html.substring(0, 100) + '...');
    console.log('=====================================\n');
    return { success: true };
  }
}

/**
 * Get configured email provider
 */
function getEmailProvider(): EmailProvider | null {
  // Try Resend first
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return new ResendProvider(resendKey);
  }

  // Try SendGrid
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey) {
    return new SendGridProvider(sendgridKey);
  }

  // Use mock provider in development
  if (process.env.NODE_ENV === 'development') {
    return new MockProvider();
  }

  return null;
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const provider = getEmailProvider();

  if (!provider) {
    console.error('No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY');
    return { success: false, error: 'Email service not configured' };
  }

  return provider.send(options);
}

/**
 * Email templates
 */
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string) => ({
    subject: 'Reset Your Password - EstateBali',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border-radius: 16px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="color: #00FF66; margin: 0; font-size: 32px; font-weight: bold;">EstateBali</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px 40px;">
                    <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 24px;">Reset Your Password</h2>
                    <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                      Hi ${userName || 'there'},
                    </p>
                    <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>

                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td style="border-radius: 8px; background-color: #00FF66;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; color: #000000; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #9CA3AF; margin: 20px 0; font-size: 14px; line-height: 1.5;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="color: #00FF66; margin: 0 0 20px; font-size: 14px; word-break: break-all;">
                      ${resetUrl}
                    </p>

                    <p style="color: #9CA3AF; margin: 20px 0 0; font-size: 14px; line-height: 1.5;">
                      This link will expire in 1 hour for security reasons.
                    </p>

                    <hr style="border: none; border-top: 1px solid #2A2A2A; margin: 30px 0;">

                    <p style="color: #6B7280; margin: 0; font-size: 12px; line-height: 1.5;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px; background-color: #0D0D0D; text-align: center;">
                    <p style="color: #6B7280; margin: 0; font-size: 12px;">
                      © 2025 EstateBali. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Reset Your Password - EstateBali\n\nHi ${userName || 'there'},\n\nWe received a request to reset your password. Click the link below to create a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour for security reasons.\n\nIf you didn't request a password reset, you can safely ignore this email. Your password will not be changed.\n\n© 2025 EstateBali. All rights reserved.`,
  }),

  welcomeEmail: (userName: string) => ({
    subject: 'Welcome to EstateBali!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to EstateBali</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="color: #00FF66; margin: 0; font-size: 32px; font-weight: bold;">EstateBali</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px 40px;">
                    <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 24px;">Welcome to EstateBali!</h2>
                    <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                      Hi ${userName},
                    </p>
                    <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                      Thank you for joining EstateBali - Bali's premier real estate platform. We're excited to help you find your dream property!
                    </p>

                    <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td style="border-radius: 8px; background-color: #00FF66;">
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/properties" style="display: inline-block; padding: 16px 32px; color: #000000; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Browse Properties
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #9CA3AF; margin: 20px 0 0; font-size: 16px; line-height: 1.5;">
                      Start exploring luxury villas, modern apartments, and prime land for sale and rent in Bali.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px; background-color: #0D0D0D; text-align: center;">
                    <p style="color: #6B7280; margin: 0; font-size: 12px;">
                      © 2025 EstateBali. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Welcome to EstateBali!\n\nHi ${userName},\n\nThank you for joining EstateBali - Bali's premier real estate platform. We're excited to help you find your dream property!\n\nStart exploring luxury villas, modern apartments, and prime land for sale and rent in Bali.\n\nVisit: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/properties\n\n© 2025 EstateBali. All rights reserved.`,
  }),
};
