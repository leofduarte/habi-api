const express = require('express');
const GoalMissionsSuggestionsController = require('../controllers/goalMissionsSuggestions.controller.js');
const router = express.Router();

/**
 * @swagger
 * /api/v1/goal-missions-suggestions/{userId}:
 *   get:
 *     summary: Get goal and mission suggestions for a user
 *     description: Fetches the latest goal and mission suggestions for a specific user from the database.
 *     tags:
 *       - Goal Missions Suggestions
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to fetch suggestions for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           fk_id_user:
 *                             type: integer
 *                             example: 123
 *                           suggestions:
 *                             type: object
 *                             description: JSON object containing goals and missions.
 *                             example: 
 *                               goals: 
 *                                 - id: "goal-1"
 *                                   match: 0.92
 *                                   goal: "Improve fitness"
 *                                   missions:
 *                                     - "Walk 10,000 steps"
 *                                     - "Do 20 push-ups"
 *                                     - "Stretch for 5 minutes"
 *       400:
 *         description: Bad request. Missing or invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 error:
 *                   type: string
 *                   example: User ID is required.
 *       404:
 *         description: No suggestions found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 error:
 *                   type: string
 *                   example: No suggestions found for this user.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */
router.get('/:userId', GoalMissionsSuggestionsController.getSuggestionsByUser);

module.exports = router;