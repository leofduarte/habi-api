const express = require('express');
const QuestionController = require('../controllers/question.controller.js');
const validateRequest = require('../middlewares/validateRequest.middleware.js');
const {
    // questionIdSchema, 
    addResponseSchema,
    // userResponsesSchema
} = require('../validations/question.validation.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Questions management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - text
 *         - options
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the question
 *         text:
 *           type: string
 *           description: The content of the question
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Option identifier
 *               emoji:
 *                 type: string
 *                 description: Emoji representing the option
 *               text:
 *                 type: string
 *                 description: Text description for the option
 *           description: Available answer options for the question
 *       example:
 *         id: 1
 *         text: "What is your greatest challenge in developing healthy habits?"
 *         options: [
 *           { "id": 1, "emoji": "💪", "text": "Finding time" },
 *           { "id": 2, "emoji": "🥦", "text": "Staying motivated" },
 *           { "id": 3, "emoji": "🧘", "text": "Knowing where to start" },
 *           { "id": 4, "emoji": "🤸🏻‍♂", "text": "Getting back on track after missing a day" }
 *         ]
 *     
 *     QuestionResponse:
 *       type: object
 *       required:
 *         - userId
 *         - questionId
 *         - response
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID of the user submitting the response
 *         questionId:
 *           type: integer
 *           description: ID of the question being answered
 *         response:
 *           type: string
 *           description: The user's selected answer
 *       example:
 *         userId: 1
 *         questionId: 1
 *         response: "2"
 *     
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the response
 *         userId:
 *           type: integer
 *           description: ID of the user who submitted the response
 *         questionId:
 *           type: integer
 *           description: ID of the question that was answered
 *         response:
 *           type: string
 *           description: The user's submitted answer
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the response was submitted
 *       example:
 *         id: 1
 *         userId: 42
 *         questionId: 101
 *         response: "2"
 *         timestamp: "2025-04-12T10:00:00.000Z"
 *     
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *           description: Status of the API response
 *         data:
 *           type: object
 *           description: Response data (when status is success)
 *         message:
 *           type: string
 *           description: Error message (when status is error)
 *       example:
 *         status: "success"
 *         data: {}
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
router.get('/:id',
    // validateRequest(questionIdSchema), 
    QuestionController.getQuestionById);

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
 *             required:
 *               - userId
 *               - questionId
 *               - response
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user submitting the response
 *                 example: 1
 *               questionId:
 *                 type: integer
 *                 description: ID of the question being answered
 *                 example: 1
 *               response:
 *                 type: string
 *                 description: The user's response to the question
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
router.post('/response', validateRequest(addResponseSchema), QuestionController.addResponse);

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
router.get('/user/:userId/responses',
    // validateRequest(userResponsesSchema),
    QuestionController.getUserResponses);

module.exports = router;