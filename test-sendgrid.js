// Test SendGrid email service
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

const apiKey = env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY not found in environment');
  console.error('💡 Please set SENDGRID_API_KEY in your .env file');
  process.exit(1);
}

console.log('✅ SENDGRID_API_KEY found:', apiKey.substring(0, 15) + '...');
console.log('\n📧 Testing SendGrid API...\n');

async function testEmail() {
  try {
    const emailContent = `
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
                    <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 24px;">SendGrid Email Service Test! 🎉</h2>
                    <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                      Your SendGrid API integration is working perfectly!
                    </p>
                    <p style="color: #9CA3AF; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                      ✅ Password reset emails<br>
                      ✅ Welcome emails<br>
                      ✅ All transactional emails are ready!
                    </p>
                    <div style="background-color: #0D0D0D; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p style="color: #6B7280; margin: 0; font-size: 14px;">
                        <strong style="color: #00FF66;">API Key:</strong> ${apiKey.substring(0, 15)}...<br>
                        <strong style="color: #00FF66;">Status:</strong> Active<br>
                        <strong style="color: #00FF66;">Provider:</strong> SendGrid
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
    `;

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'emirtufan33@gmail.com' }],
          subject: '🎉 EstateBali SendGrid Test'
        }],
        from: {
          email: 'noreply@estatebali.com',
          name: 'EstateBali'
        },
        content: [
          {
            type: 'text/html',
            value: emailContent
          },
          {
            type: 'text/plain',
            value: 'EstateBali Email Service Test - Your SendGrid API integration is working perfectly!'
          }
        ]
      }),
    });

    if (response.ok || response.status === 202) {
      console.log('✅ Email sent successfully via SendGrid!');
      console.log('📬 To: emirtufan33@gmail.com');
      console.log('📧 Status:', response.status, response.statusText);
      console.log('\n🎉 SendGrid API is working! Check your inbox.');
      console.log('\n⚠️  Important: Make sure noreply@estatebali.com is verified in your SendGrid account.');
      console.log('   If not verified, go to: https://app.sendgrid.com/settings/sender_auth/senders');
    } else {
      const errorText = await response.text();
      console.error('❌ Error sending email:');
      console.error('Status:', response.status, response.statusText);
      console.error('Response:', errorText);

      if (response.status === 403) {
        console.log('\n💡 Error 403: Sender email not verified');
        console.log('   Please verify noreply@estatebali.com in SendGrid:');
        console.log('   https://app.sendgrid.com/settings/sender_auth/senders');
      }
    }
  } catch (error) {
    console.error('❌ Failed to send test email:');
    console.error(error.message);
  }
}

testEmail();
