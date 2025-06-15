const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma.utils');
const jsend = require('jsend');
const { generateJwt } = require('../utils/jwt.utils');
// const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/email.utils');
// const loggerWinston = require('../utils/loggerWinston.utils');

const VERIFICATION_CODE_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_VERIFICATION_ATTEMPTS = 3;
const VERIFICATION_ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

class AuthController {
    static async registerUser(req, res) {
        try {
            const { email, password, firstName, lastName, timezone_offset, timezone_name } = req.validatedData;
    
            const existingUser = await prisma.users.findUnique({
                where: { email },
            });
    
            if (existingUser) {
                return res.status(409).json(jsend.fail('User already exists'));
            }
    
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Generate a 4-digit verification code
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            const codeExpiry = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);
    
            const newUser = await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    first_name: firstName,
                    last_name: lastName,
                    timezone_offset: timezone_offset || 0,
                    timezone_name: timezone_name || 'UTC',
                    is_verified: false,
                    verificationCode,
                    codeExpiry
                },
            });
    
            await sendVerificationEmail(email, verificationCode);
    
            const token = generateJwt(newUser);
    
            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json(jsend.success({ 
                ...userWithoutPassword, 
                token,
                requiresVerification: true
            }));
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json(jsend.error('Registration failed'));
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

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json(jsend.fail('Invalid email or password'));
            }

            if (!user.is_verified) {
                // Generate new verification code if expired
                if (!user.verificationCode || !user.codeExpiry || new Date() > user.codeExpiry) {
                    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
                    const codeExpiry = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);
                    
                    await prisma.users.update({
                        where: { email },
                        data: { 
                            verificationCode,
                            codeExpiry
                        }
                    });

                    await sendVerificationEmail(email, verificationCode);
                }

                return res.status(403).json(jsend.fail({
                    message: 'Please verify your email to continue',
                    code: 'EMAIL_NOT_VERIFIED',
                    requiresVerification: true
                }));
            }

            const token = generateJwt(user);
            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json(jsend.success({ ...userWithoutPassword, token }));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { code } = req.body;
            if (!code) {
                return res.status(400).json(jsend.fail('Verification code is required'));
            }

            const user = await prisma.users.findFirst({ 
                where: { 
                    verificationCode: code,
                    codeExpiry: {
                        gt: new Date()
                    }
                }
            });

            if (!user) {
                return res.status(400).json(jsend.fail('Invalid or expired code'));
            }

            await prisma.users.update({
                where: { id: user.id },
                data: { 
                    is_verified: true, 
                    verificationCode: null,
                    codeExpiry: null
                }
            });

            const newToken = generateJwt(user);
            res.status(200).json(jsend.success({ 
                message: 'Email verified successfully',
                token: newToken,
                user: {
                    ...user,
                    password: undefined
                }
            }));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async resendVerification(req, res) {
        try {
            const { email } = req.body;
            const user = await prisma.users.findUnique({ where: { email } });
            
            if (!user) {
                return res.status(404).json(jsend.fail('User not found'));
            }
            
            if (user.is_verified) {
                return res.status(400).json(jsend.fail('Email already verified'));
            }

            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            const codeExpiry = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

            await prisma.users.update({
                where: { email },
                data: { 
                    verificationCode,
                    codeExpiry
                }
            });

            await sendVerificationEmail(email, verificationCode);

            res.status(200).json(jsend.success('Verification code sent'));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }
}

module.exports = AuthController;