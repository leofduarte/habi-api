const fetch = require('node-fetch');

async function sendVerificationEmail(to, url) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_SMTP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'HABI <noreply@habi-app.pt>',
      to,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
}

module.exports = { sendVerificationEmail };

