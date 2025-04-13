var express = require('express');
var router = express.Router();
var QuestionController = require('../controllers/question.controller.js');


/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Questions management routes
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Retrieve all questions
 *     tags:
 *       - Questions
 *     responses:
 *       200:
 *         description: A list of questions
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
 *                       text:
 *                         type: string
 *                         example: "What is your favorite color?"
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "Red"
 */
router.get('/', QuestionController.getAllQuestions);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Retrieve a question by ID
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: A single question
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
 *                     text:
 *                       type: string
 *                       example: "What is your favorite color?"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Red"
 *       404:
 *         description: Question not found
 */
router.get('/:id', QuestionController.getQuestionById);

/**
 * @swagger
 * /questions/response:
 *   post:
 *     summary: Add a response to a question
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               questionId:
 *                 type: integer
 *                 example: 1
 *               response:
 *                 type: string
 *                 example: "Blue"
 *     responses:
 *       201:
 *         description: Response added successfully
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
 *                     fk_id_user:
 *                       type: integer
 *                       example: 1
 *                     answers:
 *                       type: object
 *                       properties:
 *                         question:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             text:
 *                               type: string
 *                               example: "What is your favorite color?"
 *                             options:
 *                               type: array
 *                               items:
 *                                 type: string
 *                                 example: "Red"
 *                         response:
 *                           type: string
 *                           example: "Blue"
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Question not found
 */
router.post('/response', QuestionController.addResponse);

/**
 * @swagger
 * /questions/user/{userId}/responses:
 *   get:
 *     summary: Retrieve all responses for a user
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of user responses
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
 *                       userId:
 *                         type: integer
 *                         example: 42
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-12T10:00:00.000Z"
 *                       questionId:
 *                         type: integer
 *                         example: 101
 *                       response:
 *                         type: string
 *                         example: "Blue"
 *       404:
 *         description: User responses not found
 */
router.get('/user/:userId/responses', QuestionController.getUserResponses);

module.exports = router;