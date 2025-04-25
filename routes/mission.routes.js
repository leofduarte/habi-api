const express = require('express');
const MissionController = require('../controllers/mission.controller.js');
const validateRequest = require('../middlewares/validateRequest.middleware.js');
const {
    createMissionSchema,
    updateMissionSchema,
    // missionIdSchema,
    toggleMissionCompletionSchema
} = require('../validations/mission.validation.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Missions
 *   description: Mission management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Mission:
 *       type: object
 *       required:
 *         - title
 *         - fk_id_goal
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the mission
 *         title:
 *           type: string
 *           description: Title of the mission
 *         description:
 *           type: string
 *           description: Description of the mission
 *         emoji:
 *           type: string
 *           description: Emoji associated with the mission
 *         status:
 *           type: string
 *           description: Status of the mission
 *         streaks:
 *           type: integer
 *           description: Streak count for the mission
 *         fk_id_goal:
 *           type: integer
 *           description: ID of the goal associated with the mission
 *         days:
 *           type: array
 *           items:
 *             type: integer
 *           description: Days of the week associated with the mission
 *       example:
 *         id: 1
 *         title: "Morning Exercise"
 *         description: "Do 30 minutes of exercise"
 *         emoji: "🏋️"
 *         status: "active"
 *         streaks: 5
 *         fk_id_goal: 1
 *         days: [1, 3, 5]
 */

/**
 * @swagger
 * /missions:
 *   get:
 *     summary: Get all missions for a specific goal
 *     tags: [Missions]
 *     parameters:
 *       - in: query
 *         name: goalId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal whose missions are being fetched
 *     responses:
 *       200:
 *         description: A list of missions for the specified goal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mission'
 *       400:
 *         description: Goal ID is required
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
 *                       example: Goal ID is required
 *       500:
 *         description: Failed to fetch missions
 */
router.get('/', MissionController.getAllMissions);

/**
 * @swagger
 * /missions/{id}:
 *   get:
 *     summary: Get a mission by ID
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the mission to retrieve
 *     responses:
 *       200:
 *         description: A mission object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       404:
 *         description: Mission not found
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
 *                       example: Mission not found
 *       500:
 *         description: Failed to fetch mission
 */
router.get('/:id', 
    // validateRequest(missionIdSchema),
    MissionController.getMissionById);

/**
 * @swagger
 * /missions:
 *   post:
 *     summary: Create a new mission
 *     tags: [Missions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       201:
 *         description: Mission created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Failed to create mission
 */
router.post('/', validateRequest(createMissionSchema), MissionController.createMission);

/**
 * @swagger
 * /missions/{id}:
 *   put:
 *     summary: Update a mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the mission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       200:
 *         description: Mission updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Mission not found
 *       500:
 *         description: Failed to update mission
 */
router.put('/:id', validateRequest(updateMissionSchema), MissionController.updateMission);

/**
 * @swagger
 * /missions/{id}:
 *   delete:
 *     summary: Delete a mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the mission to delete
 *     responses:
 *       200:
 *         description: Mission deleted successfully
 *       404:
 *         description: Mission not found
 *       500:
 *         description: Failed to delete mission
 */
router.delete('/:id', 
    // validateRequest(missionIdSchema),
    MissionController.deleteMission);

/**
 * @swagger
 * /missions/toggle-completion:
 *   post:
 *     summary: Toggle the completion status of a mission
 *     tags: [Missions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - missionId
 *               - userId
 *             properties:
 *               missionId:
 *                 type: integer
 *                 description: ID of the mission
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *               completionDate:
 *                 type: string
 *                 format: date
 *                 description: Completion date (optional, defaults to today)
 *             example:
 *               missionId: 1
 *               userId: 123
 *               completionDate: "2025-04-11"
 *     responses:
 *       200:
 *         description: Mission completion status toggled successfully
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
 *                     completed:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Mission marked as complete"
 *                     completion:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         fk_id_mission:
 *                           type: integer
 *                           example: 1
 *                         fk_id_user:
 *                           type: integer
 *                           example: 123
 *                         completion_date:
 *                           type: string
 *                           format: date
 *                           example: "2025-04-11"
 *       400:
 *         description: Invalid request
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
 *                       example: "Mission ID is required"
 *       404:
 *         description: Mission not found
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
 *                       example: "Mission not found"
 *       500:
 *         description: Failed to toggle mission completion
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
 *                   example: "Failed to toggle mission completion"
 */
router.post('/toggle-completion', validateRequest(toggleMissionCompletionSchema), MissionController.toggleMissionCompletion);

module.exports = router;