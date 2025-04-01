const PrizesModel = require('../models/prize.model.js');

class PrizesController {
    static async getAllPrizes(req, res) {
        try {
            const prizes = await PrizesModel.getAllPrizes();
            res.status(200).json(prizes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch prizes' });
        }
    }

    static async getPrizeById(req, res) {
        try {
            const { id } = req.params;
            const prize = await PrizesModel.getPrizeById(parseInt(id));
            if (!prize) {
                return res.status(404).json({ error: 'Prize not found' });
            }
            res.status(200).json(prize);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch prize' });
        }
    }

    static async getPrizesByUserId(req, res) {
        try {
            const { userId } = req.params;
            const prizes = await PrizesModel.getPrizesByUserId(parseInt(userId));
            res.status(200).json(prizes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch prizes for user' });
        }
    }

    static async updatePrizeStatus(req, res) {
        try {
            console.log('updatePrizeStatus called with params:', req.params, 'and body:', req.body);
            const { userPrizeId } = req.params;
            const { isUsed } = req.body;

            if (typeof isUsed !== 'boolean') {
                return res.status(400).json({ error: 'Invalid value for isUsed. It must be a boolean.' });
            }

            const updatedPrize = await PrizesModel.updatePrizeStatus(parseInt(userPrizeId), isUsed);
            res.status(200).json(updatedPrize);
        } catch (error) {
            console.error('Error updating prize status:', error);
            res.status(500).json({ error: 'Failed to update prize status' });
        }
    }

}

module.exports = PrizesController;