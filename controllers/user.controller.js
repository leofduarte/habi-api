const UserModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');

class UserController {
  static async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const user = await UserModel.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const existingUser = await UserModel.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      //# Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const updatedUser = await UserModel.updateUser(userId, {
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser() {
  }

  static async changePassword() {
  }
 
  static async getUserProfile() {
  }
}

module.exports = UserController;