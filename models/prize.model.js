const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PrizesModel {
    static async getAllPrizes() {
        try {
            return await prisma.prizes.findMany();
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }

    static async getPrizeById(prizeId) {
        try {
            return await prisma.prizes.findUnique({
                where: { id: prizeId },
            });
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }

    static async getPrizesByUserId(userId) {
        try {
            return await prisma.user_prizes.findMany({
                where: { fk_id_user: userId },
                include: {
                    prizes: true, //$ Incluir prize details
                },
                orderBy: {
                    id: 'asc', //$ Order by user_prize ID
                },
            });
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }

    static async updatePrizeStatus(userPrizeId, isUsed) {
        try {
            return await prisma.user_prizes.update({
                where: { id: userPrizeId },
                data: { is_used: isUsed },
            });
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }
}

module.exports = PrizesModel;