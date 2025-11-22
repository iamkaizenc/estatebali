// Simple SendGrid test with https module
const https = require('https');
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
  console.error('❌ SENDGRID_API_KEY not found');
  process.exit(1);
}

console.log('✅ API Key found:', apiKey.substring(0, 15) + '...');
console.log('📧 Testing SendGrid...\n');

const data = JSON.stringify({
  personalizations: [{
    to: [{ email: 'emirtufan33@gmail.com' }],
    subject: 'EstateBali SendGrid Test ✨'
  }],
  from: {
    email: 'noreply@estatebali.com',
    name: 'EstateBali'
  },
  content: [{
    type: 'text/html',
    value: '<h1>Hello from EstateBali!</h1><p>Your SendGrid integration is working! 🎉</p>'
  }]
});

const options = {
  hostname: 'api.sendgrid.com',
  port: 443,
  path: '/v3/mail/send',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode, res.statusMessage);

  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 202) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Recipient: emirtufan33@gmail.com');
      console.log('\n⚠️  Important: Make sure noreply@estatebali.com is verified in SendGrid');
      console.log('   Verify at: https://app.sendgrid.com/settings/sender_auth/senders');
    } else {
      console.log('❌ Failed:', responseData);
      if (res.statusCode === 403) {
        console.log('\n💡 Sender email not verified. Please verify noreply@estatebali.com');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(data);
req.end();
