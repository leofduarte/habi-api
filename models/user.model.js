const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
  static async getUserById(userId) {
    try {
      return await prisma.users.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      return await prisma.users.findUnique({
        where: { email },
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      return await prisma.users.update({
        where: { id: userId },
        data: userData,
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateUserPassword() {
  }

  static async invalidateRefreshTokens() {
  }

  static async deleteUser() {
  }

  static async updatePassword() {
  }

  static async getProfile() {
  }
}

module.exports = UserModel;