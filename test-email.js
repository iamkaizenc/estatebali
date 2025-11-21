// Test email service
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const env = {};
envLines.forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const apiKey = env.RESEND_API_KEY;

if (!apiKey) {
  console.error('❌ RESEND_API_KEY not found in environment');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY found:', apiKey.substring(0, 10) + '...');
console.log('\n📧 Testing Resend API...\n');

async function testEmail() {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'EstateBali <onboarding@resend.dev>',
        to: 'emirtufan33@gmail.com',
        subject: '🎉 EstateBali Email Service Test',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                        <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 24px;">Email Service Test Successful! 🎉</h2>
                        <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                          Your Resend API integration is working perfectly!
                        </p>
                        <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                          ✅ Password reset emails<br>
                          ✅ Welcome emails<br>
                          ✅ All transactional emails are ready!
                        </p>
                        <div style="background-color: #0D0D0D; padding: 20px; border-radius: 8px; margin: 20px 0;">
                          <p style="color: #6B7280; margin: 0; font-size: 14px;">
                            <strong style="color: #00FF66;">API Key:</strong> ${apiKey.substring(0, 10)}...<br>
                            <strong style="color: #00FF66;">Status:</strong> Active<br>
                            <strong style="color: #00FF66;">Provider:</strong> Resend
                          </p>
                        </div>
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
        text: 'EstateBali Email Service Test - Your Resend API integration is working perfectly!',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Email ID:', data.id);
      console.log('📬 To:', 'emirtufan33@gmail.com');
      console.log('\n🎉 Resend API is working! Check your inbox.');
    } else {
      console.error('❌ Error sending email:');
      console.error(data);
    }
  } catch (error) {
    console.error('❌ Failed to send test email:');
    console.error(error.message);
  }
}

testEmail();
