const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
  static async getUserById(userId) {
    return await prisma.users.findUnique({
      where: { id: userId },
    });
  }

  static async getUserByEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
    });
  }

  static async updateUser(userId, userData) {
    return await prisma.users.update({
      where: { id: userId },
      data: userData,
    });
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