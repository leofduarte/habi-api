const express = require('express');
const MissionController = require('../controllers/mission.controller.js');

const router = express.Router();

router.get('/', MissionController.getAllMissions);

router.get('/:id', MissionController.getMissionById);

router.post('/', MissionController.createMission);
router.put('/:id', MissionController.updateMission);
router.delete('/:id', MissionController.deleteMission);

router.post('/toggle-completion', MissionController.toggleMissionCompletion);

module.exports = router;