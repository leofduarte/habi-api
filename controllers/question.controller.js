const QuestionModel = require('../models/question.model.js');

class QuestionController {
    static getAllQuestions = async (req, res) => {
        try {
            const questions = QuestionModel.getAllQuestions();
            res.json(questions);
        } catch (err) {
            console.error('Error fetching questions:', err);
            res.status(500).send('Error fetching questions');
        }
    };

    static getQuestionById = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        try {
            const question = QuestionModel.getQuestionById(id);
            res.json(question);
        } catch (err) {
            console.error('Error fetching question:', err);
            res.status(404).send('Question not found');
        }
    }

    static addResponse = async (req, res) => {
        try {
            const { userId, questionId, response } = req.body;
    
            if (!userId || !questionId || !response) {
                return res.status(400).json({ error: 'User ID, question ID, and response are required' });
            }
    
            const userResponse = await QuestionModel.addResponse(userId, questionId, response);
            res.status(201).json(userResponse);
        } catch (error) {
            console.error('Error adding response:', error);
            res.status(500).json({ error: error.message });
        }
    };
}


module.exports = QuestionController;