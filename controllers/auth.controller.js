const bcrypt = require('bcrypt');
const AuthModel = require('../models/auth.model.js');

class AuthController {
    static async registerUser(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const existingUser = await AuthModel.getUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
            }

            //# Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await AuthModel.registerUser({
                email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName
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

            const user = await AuthModel.getUserByEmail(email);
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

    static async revokeSession(req, res) { }

    static async iniciateEmailVerification(req, res) { }

    static async refreshAccessToken(req, res) { }

    static async initiatePasswordReset(req, res) { }

    static async completePasswordReset(req, res) { }
}

module.exports = AuthController;