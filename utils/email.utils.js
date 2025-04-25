const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_SMTP_API_KEY
  }
});

async function sendVerificationEmail(to, url) {
  await transporter.sendMail({
    from: '"Your App" <no-reply@habi.app.com>',
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
}

module.exports = { sendVerificationEmail };