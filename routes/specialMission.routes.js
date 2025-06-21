const express = require('express')
const router = express.Router()
const SpecialMissionController = require('../controllers/specialMission.controller.js')
const authenticateToken = require('../middlewares/jwt.middleware.js')
const {
  authorizeResource,
  authorizeByQueryParam,
  authorizeCreation
} = require('../middlewares/authorization.middleware.js')

// Proteger todas as rotas de missões especiais com autenticação
router.use(authenticateToken)

/**
 * @swagger
 * tags:
 *   name: Special Missions
 *   description: Routes for managing special missions
 */

/**
 * @swagger
 * /special-missions:
 *   get:
 *     summary: Get all special missions
 *     tags: [Special Missions]
 *     responses:
 *       200:
 *         description: A list of all special missions
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
 *                         example: "Special Mission 1"
 *                       steps:
 *                         type: string
 *                         example: "[\"Step 1\", \"Step 2\"]"
 *                       link:
 *                         type: string
 *                         example: "http://example.com"
 *                       is_partnership:
 *                         type: boolean
 *                         example: false
 */
router.get('/', SpecialMissionController.getAllSpecialMissions)

/**
 * @swagger
 * /special-missions/user/{userId}:
 *   get:
 *     summary: Get special missions assigned to a user
 *     tags: [Special Missions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of special missions assigned to the user
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
 *                       fk_id_special_mission:
 *                         type: integer
 *                         example: 1
 *                       available_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-12T10:00:00.000Z"
 */
router.get(
  '/user/:userId',
  authorizeResource('user'),
  SpecialMissionController.getUserSpecialMissions
)

/**
 * @swagger
 * /special-missions/assign:
 *   post:
 *     summary: Assign a special mission to a user
 *     tags: [Special Missions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *               missionId:
 *                 type: integer
 *                 example: 1
 *               availableAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-12T10:00:00.000Z"
 *     responses:
 *       201:
 *         description: Special mission assigned successfully
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
 *                       example: 123
 *                     fk_id_special_mission:
 *                       type: integer
 *                       example: 1
 *                     available_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-12T10:00:00.000Z"
 */
router.post(
  '/assign',
  authorizeCreation('specialMission'),
  SpecialMissionController.assignSpecialMission
)

/**
 * @swagger
 * /special-missions/complete/{userMissionId}:
 *   put:
 *     summary: Mark a special mission as completed
 *     tags: [Special Missions]
 *     parameters:
 *       - in: path
 *         name: userMissionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user's special mission
 *     responses:
 *       200:
 *         description: Special mission marked as completed
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
 *                     completed_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-12T10:00:00.000Z"
 */
router.put(
  '/complete/:userMissionId',
  authorizeResource('specialMission'),
  SpecialMissionController.completeSpecialMission
)

/**
 * @swagger
 * /special-missions:
 *   post:
 *     summary: Create a new special mission
 *     tags: [Special Missions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Special Mission 1"
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Step 1", "Step 2"]
 *               link:
 *                 type: string
 *                 example: "http://example.com"
 *               isPartnership:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Special mission created successfully
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
 *                       example: "Special Mission 1"
 *                     steps:
 *                       type: string
 *                       example: "[\"Step 1\", \"Step 2\"]"
 *                     link:
 *                       type: string
 *                       example: "http://example.com"
 *                     is_partnership:
 *                       type: boolean
 *                       example: false
 */
router.post('/', SpecialMissionController.createSpecialMission)

module.exports = router
