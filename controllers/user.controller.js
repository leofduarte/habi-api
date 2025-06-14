const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');

class UserController {
  //! for testing
  static async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);

      if (isNaN(userId)) {
        return res.status(400).json(jsend.fail({ error: 'Invalid user ID format' }));
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json(jsend.fail({ error: 'User not found' }));
      }

      const { password, ...userWithoutPassword } = user;
      res.status(200).json(jsend.success(userWithoutPassword));
    } catch (error) {
      res.status(500).json(jsend.error({ error: error.message }));
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json(jsend.fail({ error: 'Email is required' }));
      }

      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json(jsend.fail({ error: 'User not found' }));
      }

      const { password, ...userWithoutPassword } = user;
      res.status(200).json(jsend.success(userWithoutPassword));
    } catch (error) {
      res.status(500).json(jsend.error({ error: error.message }));
    }
  }

  static async updateUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { email, password, firstName, lastName, timezone_offset, timezone_name } = req.body;

    if (!email && !password && !firstName && !lastName && timezone_offset === undefined && !timezone_name) {
      return res.status(400).json(jsend.fail({ error: 'At least one field to update is required' }));
    }

    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json(jsend.fail({ error: 'User not found' }));
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (timezone_offset !== undefined) updateData.timezone_offset = timezone_offset;
    if (timezone_name) updateData.timezone_name = timezone_name;

    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(jsend.success(userWithoutPassword));
  } catch (error) {
    res.status(500).json(jsend.error({ error: error.message }));
  }
}

  static async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const { password } = req.body;

      if (!password) {
        return res.status(400).json(jsend.fail({ error: 'Password is required for account deletion' }));
      }

      const existingUser = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json(jsend.fail({ error: 'User not found' }));
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(401).json(jsend.fail({ error: 'Invalid password' }));
      }

      await prisma.users.delete({
        where: { id: userId },
      });

      res.status(200).json(jsend.success({ message: 'User deleted successfully' }));
    } catch (error) {
      res.status(500).json(jsend.error({ error: error.message }));
    }
  }

  //! static async changePassword(req, res) {
  //   try {
  //     const userId = parseInt(req.params.id);
  //     const { currentPassword, newPassword } = req.body;

  //     if (!currentPassword || !newPassword) {
  //       return res.status(400).json(jsend.fail({ error: 'Current password and new password are required' }));
  //     }

  //     const user = await prisma.users.findUnique({
  //       where: { id: userId },
  //     });

  //     if (!user) {
  //       return res.status(404).json(jsend.fail({ error: 'User not found' }));
  //     }

  //     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  //     if (!isPasswordValid) {
  //       return res.status(401).json(jsend.fail({ error: 'Current password is incorrect' }));
  //     }

  //     const saltRounds = 10;
  //     const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  //     await prisma.users.update({
  //       where: { id: userId },
  //       data: { password: hashedNewPassword },
  //     });

  //     res.status(200).json(jsend.success({ message: 'Password updated successfully' }));
  //   } catch (error) {
  //     res.status(500).json(jsend.error({ error: error.message }));
  //   }
  //! }

}

module.exports = UserController;