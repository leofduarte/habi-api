const express = require('express');
const router = express.Router();
const SpecialMissionController = require('../controllers/specialMission.controller.js');

// GET /api/v1/special-missions - Get all special missions
router.get('/', SpecialMissionController.getAllSpecialMissions);

// GET /api/v1/special-missions/user/:userId - Get user's special missions
router.get('/user/:userId', SpecialMissionController.getUserSpecialMissions);

// POST /api/v1/special-missions/assign - Assign mission to user
router.post('/assign', SpecialMissionController.assignSpecialMission);

// PUT /api/v1/special-missions/complete/:userMissionId - Mark mission as completed
router.put('/complete/:userMissionId', SpecialMissionController.completeSpecialMission);

// POST /api/v1/special-missions - Create a new special mission
router.post('/', SpecialMissionController.createSpecialMission);

module.exports = router;