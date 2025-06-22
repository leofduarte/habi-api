const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');
const { generateJwt } = require('../utils/jwt.utils.js');
// const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/email.utils.js');
const { filterSensitiveUserData } = require('../utils/user.utils.js');
const loggerWinston = require('../utils/loggerWinston.utils');

const VERIFICATION_CODE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class AuthController {
    static async registerUser(req, res) {
        try {
            const { email, password, firstName, lastName, timezone_offset, timezone_name } = req.body;

            const existingUser = await prisma.users.findUnique({
                where: { email },
            });

            if (existingUser) {
                return res.status(400).json(jsend.fail({ error: 'Email already registered' }));
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            const codeExpiry = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

            const newUser = await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    first_name: firstName,
                    last_name: lastName,
                    last_login: new Date(),
                    is_active: true,
                    timezone_offset: timezone_offset || 0,
                    timezone_name: timezone_name || 'UTC',
                    is_verified: false,
                    verificationCode,
                    codeExpiry
                },
            });

            loggerWinston.info('User registered', { email, userId: newUser.id });

            console.log('User created, sending verification email...');
            await sendVerificationEmail(email, verificationCode);

            // Assign a special mission immediately upon signup
            const now = new Date();
            const todayStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            const tomorrowStartUTC = new Date(todayStartUTC);
            tomorrowStartUTC.setDate(tomorrowStartUTC.getDate() + 1);

            // 1. Check for scheduled sponsored mission for today
            const scheduledMissions = await prisma.sponsor_special_mission_schedules.findMany({
                where: {
                    scheduled_date: {
                        gte: todayStartUTC,
                        lt: tomorrowStartUTC
                    }
                },
                include: { special_missions: true }
            });
            const scheduledSponsored = scheduledMissions.find(sm => sm.special_missions.is_partnership === true);

            let mission = null;
            if (newUser.sponsor_special_mission !== false && scheduledSponsored) {
                mission = scheduledSponsored.special_missions;
            } else {
                // Get the daily non-sponsored mission
                let dailySpecialMission = await prisma.daily_special_mission.findUnique({
                    where: { date: todayStartUTC }
                });
                if (!dailySpecialMission) {
                    // Pick a random non-sponsored mission and set it for today
                    const nonSponsoredMissions = await prisma.special_missions.findMany({
                        where: { is_partnership: false }
                    });
                    if (nonSponsoredMissions.length > 0) {
                        const chosen = nonSponsoredMissions[Math.floor(Math.random() * nonSponsoredMissions.length)];
                        dailySpecialMission = await prisma.daily_special_mission.create({
                            data: {
                                date: todayStartUTC,
                                fk_id_special_mission: chosen.id
                            }
                        });
                    }
                }
                if (dailySpecialMission) {
                    mission = await prisma.special_missions.findUnique({ where: { id: dailySpecialMission.fk_id_special_mission } });
                }
            }
            if (mission) {
                const availableAt = new Date(newUser.created_at || Date.now());
                availableAt.setMinutes(availableAt.getMinutes() - 1); // Make it available in the past
                await prisma.user_special_missions.create({
                    data: {
                        fk_id_user: newUser.id,
                        fk_id_special_mission: mission.id,
                        available_at: availableAt
                    }
                });
            }

            const token = generateJwt(newUser);
            const safeUserData = filterSensitiveUserData(newUser);
            
            loggerWinston.info('Registration successful', { email: email, user: JSON.stringify(safeUserData) });
            res.status(201).json(jsend.success({ 
                ...safeUserData, 
                token,
                requiresVerification: true
            }));
        } catch (error) {
            loggerWinston.error('Registration error', { error: error.message, stack: error.stack, name: error.name });
            res.status(500).json(jsend.error({
                message: 'Registration failed',
                details: error.message
            }));
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

            // Update the last_login field
            const updatedUser = await prisma.users.update({
                where: { email },
                data: {
                    last_login: new Date()
                }
            });

            loggerWinston.info('User login', { email, userId: user.id });

            const token = generateJwt(updatedUser);
            const safeUserData = filterSensitiveUserData(updatedUser);
            res.status(200).json(jsend.success({ ...safeUserData, token }));
        } catch (error) {
            loggerWinston.error('Login error', { error: error.message, stack: error.stack });
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

            // Update user verification status and clear verification data
            const updatedUser = await prisma.users.update({
                where: { id: user.id },
                data: { 
                    is_verified: true, 
                    verificationCode: null,
                    codeExpiry: null
                }
            });

            loggerWinston.info('Email verified', { userId: updatedUser.id, email: updatedUser.email });

            const newToken = generateJwt(updatedUser);
            const safeUserData = filterSensitiveUserData(updatedUser);
            
            res.status(200).json(jsend.success({ 
                message: 'Email verified successfully',
                token: newToken,
                user: safeUserData
            }));
        } catch (error) {
            loggerWinston.error('Email verification error', { error: error.message, stack: error.stack });
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

            loggerWinston.info('Verification code resent', { email });

            res.status(200).json(jsend.success('Verification code sent'));
        } catch (error) {
            loggerWinston.error('Resend verification error', { error: error.message, stack: error.stack });
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async revokeSession(req, res) {
        try {
            // Since we're using JWT, we don't need to do anything server-side
            // The client should remove the token from storage
            res.status(200).json(jsend.success('Logged out successfully'));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }
}

module.exports = AuthController;