var express = require('express');
var router = express.Router();
var QuestionController = require('../controllers/question.controller.js');

router.get('/', QuestionController.getAllQuestions);
router.get('/:id', QuestionController.getQuestionById);
router.post('/response', QuestionController.addResponse);


module.exports = router;
