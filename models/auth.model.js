const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthModel {
  static async getUserByEmail(email) {
    try {
      return await prisma.users.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      return await prisma.users.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async registerUser(userData) {
    try {
      return await prisma.users.create({
        data: userData,
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async createSession() { }
  static async invalidateSession() { }
  static async validateToken() { }
  static async createPasswordResetToken() { }
  static async verifyPasswordResetToken() { }
  static async createEmailVerificationToken() { }
  static async verifyEmailToken() { }
}

module.exports = AuthModel;