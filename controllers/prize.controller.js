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
            const userId = parseInt(req.params.userId);

            if (isNaN(userId)) {
                return res.status(400).json(jsend.fail({ error: 'User ID must be a valid number' }));
            }

            const prizes = await prisma.user_prizes.findMany({
                where: { fk_id_user: userId },
                include: {
                    prizes: true,
                },
                orderBy: {
                    id: 'asc',
                },
            });

            if (prizes.length === 0) {
                return res.status(200).json(jsend.success({ message: 'No prizes found for this user' }));
            }

            res.status(200).json(jsend.success(prizes));
        } catch (error) {
            console.error('Error fetching user prizes:', error);
            res.status(500).json(jsend.error('Failed to fetch prizes for user'));
        }
    }

    static async redeemPrize(req, res) {
        try {
            const { userPrizeId } = req.params;
            const { isUsed } = req.body;

            if (typeof isUsed !== 'boolean') {
                return res.status(400).json(jsend.fail({ error: 'Invalid value for isUsed. It must be a boolean.' }));
            }

            const currentPrize = await prisma.user_prizes.findUnique({
                where: { id: parseInt(userPrizeId) },
            });

            if (!currentPrize) {
                return res.status(404).json(jsend.fail({ error: 'User prize not found' }));
            }

            if (currentPrize.is_used === true && isUsed === false) {
                return res.status(400).json(jsend.fail({
                    error: 'Once a prize is redeemed, it cannot be un-redeemed.'
                }));
            }

            const updatedPrize = await prisma.user_prizes.update({
                where: { id: parseInt(userPrizeId) },
                data: { is_used: isUsed },
            });

            return res.status(200).json(jsend.success({
                message: 'Prize successfully redeemed',
                prize: updatedPrize
            }));
        } catch (error) {
            console.error('Error redeeming prize:', error);
            res.status(500).json(jsend.error('Failed to redeem prize'));
        }
    }
}

module.exports = PrizesController;