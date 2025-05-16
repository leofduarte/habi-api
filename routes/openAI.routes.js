const express = require('express');
const router = express.Router();
const OpenAIController = require('../controllers/openAI.controller.js');

router.post('/suggest-goals', OpenAIController.generatePersonalizedGoalSuggestions);


module.exports = router;