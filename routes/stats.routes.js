const express = require('express');
const StatsController = require('../controllers/stats.controller.js');
const { getUserStatsSchema, getWeeklyProgressSchema } = require('../validations/stats.validation.js');
const validateRequest = require('../middlewares/validateRequest.middleware.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistics related endpoints
 */

/**
 * @swagger
 * /stats/{userId}:
 *   get:
 *     summary: Get user statistics
 *     description: Retrieve statistics for a specific user by their user ID.
 *     tags:
 *       - Stats
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *       404:
 *         description: User not found
 */
router.get('/:userId', validateRequest(getUserStatsSchema), StatsController.getUserStats);

/**
 * @swagger
 * /stats/{userId}/weekly:
 *   get:
 *     summary: Get weekly progress
 *     description: Retrieve the weekly progress for a specific user by their user ID.
 *     tags:
 *       - Stats    
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved weekly progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: object
 *       404:
 *         description: User not found
 */
router.get('/:userId/weekly', validateRequest(getWeeklyProgressSchema), StatsController.getWeeklyProgress);

module.exports = router;