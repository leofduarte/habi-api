const nodemailer = require('nodemailer');
const loggerWinston = require('./loggerWinston.utils');

const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    auth: {
        user: 'resend',
        pass: process.env.RESEND_SMTP_API_KEY,
    },
});

const sendVerificationEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: 'HABI <noreply@habi-app.pt>',
            to: email,
            subject: 'Your HABI Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #F06B2D; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">HABI</h1>
                    </div>
                    <div style="padding: 40px 20px; background-color: #ffffff;">
                        <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Verify your email address</h2>
                        <p style="color: #4B5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                            To complete your registration and start your habit-forming journey, please enter this verification code:
                        </p>
                        <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                            <h1 style="color: #F06B2D; margin: 0; font-size: 36px; letter-spacing: 8px; font-weight: bold;">${code}</h1>
                        </div>
                        <p style="color: #4B5563; font-size: 14px; margin: 20px 0;">
                            ⏱️ This code will expire in 15 minutes
                        </p>
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                            <p style="color: #6B7280; font-size: 14px; margin: 0;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>
                        </div>
                    </div>
                    <div style="padding: 20px; background-color: #F9FAFB; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB;">
                        <p style="margin: 0;">© ${new Date().getFullYear()} HABI. All rights reserved.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        loggerWinston.info('Verification email sent', { email });
    } catch (error) {
        loggerWinston.error('Error sending verification email', { error: error.message, email });
        throw error;
    }
};

module.exports = {
    sendVerificationEmail,
};

