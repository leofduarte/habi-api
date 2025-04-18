const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma');
const jsend = require('jsend');
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
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            const newUser = await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    first_name: firstName,
                    last_name: lastName
                },
            });
    
            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json(jsend.success(userWithoutPassword));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async authenticateUser(req, res) {
        try {
            const { email, password } = req.validatedData; // Use validated data from middleware
    
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
    
            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json(jsend.success(userWithoutPassword));
        } catch (error) {
            res.status(500).json(jsend.error(error.message));
        }
    }

    static async revokeSession(req, res) {
        res.status(200).json(jsend.success('Logged out successfully'));
    }

    static async iniciateEmailVerification(req, res) {
        res.status(501).json(jsend.fail('Not implemented'));
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