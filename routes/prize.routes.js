const express = require('express');
const PrizesController = require('../controllers/prize.controller.js');

const router = express.Router();

router.get('/', PrizesController.getAllPrizes);
router.get('/:id', PrizesController.getPrizeById);
router.get('/user/:userId', PrizesController.getPrizesByUserId);
router.put('/status/:userPrizeId', PrizesController.updatePrizeStatus);

module.exports = router;