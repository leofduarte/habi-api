const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma')

class AuthController {
    static async registerUser(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const existingUser = await prisma.users.findUnique({
                where: { email },
            });

            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
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
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async authenticateUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const user = await prisma.users.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async revokeSession(req, res) {
        res.status(200).json({ message: 'Logged out successfully' });
    }

    static async iniciateEmailVerification(req, res) { }

    static async refreshAccessToken(req, res) { }

    static async initiatePasswordReset(req, res) { }

    static async completePasswordReset(req, res) { }
}

module.exports = AuthController;