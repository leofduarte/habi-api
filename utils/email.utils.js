// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: 'smtp.resend.com',
//   port: 587,
//   auth: {
//     user: 'resend',
//     pass: process.env.RESEND_SMTP_API_KEY
//   }
// });

// async function sendVerificationEmail(to, url) {
//   await transporter.sendMail({
//     from: '"HABI" <onboarding@resend.dev>',
//     to,
//     subject: 'Verify your email',
//     html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
//   });
// }

const fetch = require('node-fetch');

async function sendVerificationEmail(to, url) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_SMTP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'HABI <onboarding@resend.dev>',
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

