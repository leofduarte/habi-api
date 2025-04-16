const express = require('express');
const GoalController = require('../controllers/goal.controller.js');
const validateRequest = require('../middlewares/validateRequest.middleware.js');
const { createGoalSchema, updateGoalSchema, goalIdSchema } = require('../validations/goal.validation.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Goal management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the goal
 *         description:
 *           type: string
 *           description: Description of the goal
 *         completed:
 *           type: boolean
 *           description: Completion status of the goal
 *         userId:
 *           type: string
 *           description: ID of the user associated with the goal
 *       example:
 *         title: "Learn Node.js"
 *         description: "Complete the Node.js course on Udemy"
 *         completed: false
 *         userId: "60d5f484f1a2c8b4b8c8e4a3"
 *     GoalUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Updated title of the goal
 *         description:
 *           type: string
 *           description: Updated description of the goal
 *         completed:
 *           type: boolean
 *           description: Updated completion status of the goal
 *       example:
 *         title: "Learn Advanced Node.js"
 *         description: "Complete the advanced Node.js course on Udemy"
 *         completed: true
 */


/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get all goals for a specific user
 *     tags: [Goals]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose goals are being fetched
 *     responses:
 *       200:
 *         description: A list of goals for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *       400:
 *         description: User ID is required
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
 *                       example: User ID is required
 *       404:
 *         description: User not found or no goals found for the specified user
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
 *                       example: User not found
 *                     message:
 *                       type: string
 *                       example: No goals found for the specified user
 *       500:
 *         description: Failed to fetch goals
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
 *                   example: Failed to fetch goals
 */
router.get('/', GoalController.getAllGoals);

/**
 * @swagger
 * /goals/{id}:
 *   get:
 *     summary: Get a goal by ID
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to retrieve
 *     responses:
 *       200:
 *         description: A goal object
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
 *                     title:
 *                       type: string
 *                       example: "Learn Node.js"
 *                     description:
 *                       type: string
 *                       example: "Complete the Node.js course on Udemy"
 *                     completed:
 *                       type: boolean
 *                       example: false
 *                     userId:
 *                       type: string
 *                       example: "60d5f484f1a2c8b4b8c8e4a3"
 *       400:
 *         description: Invalid ID format
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
 *                       example: Invalid ID format
 *       404:
 *         description: Goal not found
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
 *                       example: Goal not found
 *       500:
 *         description: Failed to fetch goal
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
 *                   example: Failed to fetch goal
 */
router.get('/:id', validateRequest(goalIdSchema), GoalController.getGoalById);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Goal'
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       400:
 *         description: Invalid request
 */
router.post('/', validateRequest(createGoalSchema), GoalController.createGoal);

/**
 * @swagger
 * /goals/{id}:
 *   put:
 *     summary: Update a goal
 *     tags: [Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalUpdate'
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       400:
 *         description: Invalid request
 */
router.put('/:id', validateRequest(updateGoalSchema), GoalController.updateGoal);

/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to delete
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       404:
 *         description: Goal not found
 */
router.delete('/:id', validateRequest(goalIdSchema), GoalController.deleteGoal);

module.exports = router;