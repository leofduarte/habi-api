const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/stats.controller.js');

// GET /api/v1/stats/:userId - Get user statistics
router.get('/:userId', StatsController.getUserStats);

// GET /api/v1/stats/:userId/weekly - Get weekly progress
router.get('/:userId/weekly', StatsController.getWeeklyProgress);

module.exports = router;