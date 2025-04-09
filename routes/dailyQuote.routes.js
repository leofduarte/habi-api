const express = require('express');
const DailyQuoteController = require('../controllers/dailyQuote.controller.js');

const router = express.Router();

// GET /api/v1/daily-quotes - get daily quote for a user
router.get('/', DailyQuoteController.getDailyQuote);

module.exports = router;