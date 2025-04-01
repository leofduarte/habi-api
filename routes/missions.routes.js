const express = require('express');
const MissionController = require('../controllers/mission.controller.js');

const router = express.Router();

// GET /api/v1/missions - get all missions of specific goal
router.get('/', MissionController.getAllMissions);

router.get('/:id', MissionController.getMissionById);

router.post('/', MissionController.createMission);

router.put('/:id', MissionController.updateMission);

router.delete('/:id', MissionController.deleteMission);

module.exports = router;