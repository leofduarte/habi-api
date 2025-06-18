const express = require('express');
const DailyQuoteController = require('../controllers/dailyQuote.controller.js');
const authenticateToken = require('../middlewares/jwt.middleware.js');
const { authorizeByQueryParam } = require('../middlewares/authorization.middleware.js');

const router = express.Router();

// Proteger todas as rotas de citações diárias com autenticação
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Daily Quotes
 *   description: Routes for retrieving daily motivational quotes
 */

/**
 * @swagger
 * /daily-quotes:
 *   get:
 *     summary: Get the daily motivational quote
 *     description: Retrieves the current daily motivational quote
 *     tags: [Daily Quotes]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user requesting the quote
 *     responses:
 *       200:
 *         description: Successfully retrieved daily quote
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
 *                     quote:
 *                       type: string
 *                       example: "Believe you can and you're halfway there."
 *                     presentedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-12T10:00:00.000Z"
 *       400:
 *         description: Missing required userId parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "User ID is required"
 *       404:
 *         description: No daily quote found for today
 *       500:
 *         description: Server error
 */
router.get('/', authorizeByQueryParam('userId', 'dailyQuote'), DailyQuoteController.getDailyQuote);

module.exports = router;