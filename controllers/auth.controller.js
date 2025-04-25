const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma.utils');
const jsend = require('jsend');
const { generateJwt } = require('../utils/jwt.utils');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/email.utils');

const tokenBlacklist = new Set();

const MAX_LOGIN_ATTEMPTS = 10;
const JAIL_TIME_MS = 15 * 60 * 1000;


class AuthController {
    static async registerUser(req, res) {
        try {
            const { email, password, firstName, lastName } = req.validatedData;

            const existingUser = await prisma.users.findUnique({
                where: { email },
            });

            if (existingUser) {
                return res.status(409).json(jsend.fail('User already exists'));
            }

            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const emailVerificationToken = crypto.randomBytes(32).toString('hex');

            const newUser = await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    first_name: firstName,
                    last_name: lastName,
                    is_verified: false,
                    emailVerificationToken
                },
            });

            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
            await sendVerificationEmail(email, verificationUrl);


            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json(jsend.success(userWithoutPassword));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async authenticateUser(req, res) {
        try {
            const { email, password } = req.validatedData;

            const user = await prisma.users.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json(jsend.fail('Invalid email or password'));
            }

            if (user.loginJailUntil && new Date() < user.loginJailUntil) {
                return res.status(429).json(jsend.fail('Too many failed attempts. Try again later.'));
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                const failedAttempts = (user.failedLoginAttempts || 0) + 1;
                let jailUntil = null;
                if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
                    jailUntil = new Date(Date.now() + JAIL_TIME_MS);
                }
                await prisma.users.update({
                    where: { email },
                    data: {
                        failedLoginAttempts: failedAttempts,
                        loginJailUntil: jailUntil,
                    },
                });
                return res.status(401).json(jsend.fail('Invalid email or password'));
            }

            if (user.failedLoginAttempts > 0 || user.loginJailUntil) {
                await prisma.users.update({
                    where: { email },
                    data: {
                        failedLoginAttempts: 0,
                        loginJailUntil: null,
                    },
                });
            }

            const token = generateJwt(user);

            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json(jsend.success({ ...userWithoutPassword, token }));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async revokeSession(req, res) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (token) {
            tokenBlacklist.add(token);
        }
        res.status(200).json(jsend.success('Logged out successfully'));
    }

    static async initiateEmailVerification(req, res) {
        try {
            const { email } = req.body;
            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                return res.status(404).json(jsend.fail('User not found'));
            }
            if (user.is_verified) {
                return res.status(400).json(jsend.fail('Email already verified'));
            }
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            await prisma.users.update({
                where: { email },
                data: { emailVerificationToken }
            });

            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
            await sendVerificationEmail(email, verificationUrl);

            res.status(200).json(jsend.success('Verification email sent'));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async completeEmailVerification(req, res) {
        try {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json(jsend.fail('Verification token is required'));
            }
            const user = await prisma.users.findFirst({ where: { emailVerificationToken: token } });
            if (!user) {
                return res.status(400).json(jsend.fail('Invalid or expired token'));
            }
            await prisma.users.update({
                where: { id: user.id },
                data: { is_verified: true, emailVerificationToken: null }
            });
            res.status(200).json(jsend.success('Email verified successfully'));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async refreshAccessToken(req, res) {
        res.status(501).json(jsend.fail('Not implemented'));
    }

    static async initiatePasswordReset(req, res) {
        res.status(501).json(jsend.fail('Not implemented'));
    }

    static async completePasswordReset(req, res) {
        res.status(501).json(jsend.fail('Not implemented'));
    }
}

module.exports = AuthController;