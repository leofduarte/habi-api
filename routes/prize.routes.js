const express = require('express');
const PrizesController = require('../controllers/prize.controller.js');
const validateRequest = require('../middlewares/validateRequest.middleware.js');
const { prizeIdSchema, userIdSchema, redeemPrizeSchema } = require('../validations/prize.validation.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Prizes
 *   description: Routes for managing prizes
 */

/**
 * @swagger
 * /prizes:
 *   get:
 *     summary: Get all prizes
 *     tags: [Prizes]
 *     responses:
 *       200:
 *         description: A list of all prizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Prize 1"
 *                       description:
 *                         type: string
 *                         example: "This is a description of Prize 1"
 *                       partner_name:
 *                         type: string
 *                         example: "Partner Name"
 */
router.get('/', PrizesController.getAllPrizes);

/**
 * @swagger
 * /prizes/{id}:
 *   get:
 *     summary: Get a prize by its ID
 *     tags: [Prizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the prize
 *     responses:
 *       200:
 *         description: Details of the prize
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Prize 1"
 *                     description:
 *                       type: string
 *                       example: "This is a description of Prize 1"
 *                     partner_name:
 *                       type: string
 *                       example: "Partner Name"
 *       404:
 *         description: Prize not found
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
 *                       example: "Prize not found"
 */
router.get('/:id', validateRequest(prizeIdSchema), PrizesController.getPrizeById);

/**
 * @swagger
 * /prizes/user/{userId}:
 *   get:
 *     summary: Get prizes assigned to a user
 *     tags: [Prizes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of prizes assigned to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       fk_id_user:
 *                         type: integer
 *                         example: 123
 *                       fk_id_prize:
 *                         type: integer
 *                         example: 1
 *                       received_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-12T10:00:00.000Z"
 *                       expires_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-12T10:00:00.000Z"
 *                       is_used:
 *                         type: boolean
 *                         example: false
 *                       coupon:
 *                         type: string
 *                         example: "COUPON123"
 */
router.get('/user/:userId', validateRequest(userIdSchema), PrizesController.getPrizesByUserId);

/**
 * @swagger
 * /prizes/redeem/{userPrizeId}:
 *   put:
 *     summary: Redeem a user's prize
 *     tags: [Prizes]
 *     parameters:
 *       - in: path
 *         name: userPrizeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user's prize
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isUsed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Prize successfully redeemed
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
 *                     message:
 *                       type: string
 *                       example: "Prize successfully redeemed"
 *                     prize:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         is_used:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: Invalid input
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
 *                       example: "Invalid value for isUsed. It must be a boolean."
 *       404:
 *         description: User prize not found
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
 *                       example: "User prize not found"
 *       422:
 *         description: Validation error - Invalid request data
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
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["isUsed must be a boolean", "Prize isUsed can only be changed to true and cannot be reverted"]
 */
router.put('/redeem/:userPrizeId', validateRequest(redeemPrizeSchema), PrizesController.redeemPrize);

module.exports = router;