const prisma = require('../utils/prisma');
const jsend = require('jsend');
class PrizesController {
    static async getAllPrizes(req, res) {
        try {
            const prizes = await prisma.prizes.findMany();
            res.status(200).json(jsend.success(prizes));
        } catch (error) {
            console.error('Error fetching prizes:', error);
            res.status(500).json(jsend.error('Failed to fetch prizes'));
        }
    }

    static async getPrizeById(req, res) {
        try {
            const { id } = req.params;
            const prize = await prisma.prizes.findUnique({
                where: { id: parseInt(id) },
            });
            
            if (!prize) {
                return res.status(404).json(jsend.fail({ error: 'Prize not found' }));
            }
            
            res.status(200).json(jsend.success(prize));
        } catch (error) {
            console.error('Error fetching prize:', error);
            res.status(500).json(jsend.error('Failed to fetch prize'));
        }
    }

    static async getPrizesByUserId(req, res) {
        try {
            const { userId } = req.params;
            
            const prizes = await prisma.user_prizes.findMany({
                where: { fk_id_user: parseInt(userId) },
                include: {
                    prizes: true,
                },
                orderBy: {
                    id: 'asc',
                },
            });
            
            res.status(200).json(jsend.success(prizes));
        } catch (error) {
            console.error('Error fetching user prizes:', error);
            res.status(500).json(jsend.error('Failed to fetch prizes for user'));
        }
    }

    static async updatePrizeStatus(req, res) {
        try {
            const { userPrizeId } = req.params;
            const { isUsed } = req.body;

            if (typeof isUsed !== 'boolean') {
                return res.status(400).json(jsend.fail({ error: 'Invalid value for isUsed. It must be a boolean.' }));
            }

            // Check if user prize exists
            const existingUserPrize = await prisma.user_prizes.findUnique({
                where: { id: parseInt(userPrizeId) },
            });

            if (!existingUserPrize) {
                return res.status(404).json(jsend.fail({ error: 'User prize not found' }));
            }

            // Update prize status
            const updatedPrize = await prisma.user_prizes.update({
                where: { id: parseInt(userPrizeId) },
                data: { is_used: isUsed },
            });
            
            res.status(200).json(jsend.success(updatedPrize));
        } catch (error) {
            console.error('Error updating prize status:', error);
            res.status(500).json(jsend.error('Failed to update prize status'));
        }
    }
}

module.exports = PrizesController;