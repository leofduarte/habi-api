const prisma = require('../utils/prisma');
const questionsData = require('../data/questions');

class QuestionController {
    static getAllQuestions = async (req, res) => {
        try {
            const questions = questionsData.questions;
            res.json(questions);
        } catch (err) {
            console.error('Error fetching questions:', err);
            res.status(500).json({ error: 'Error fetching questions' });
        }
    };

    static getQuestionById = async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const question = questionsData.questions.find((q) => q.id === id);

            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }

            res.json(question);
        } catch (err) {
            console.error('Error fetching question:', err);
            res.status(500).json({ error: 'Error processing request' });
        }
    }

    static addResponse = async (req, res) => {
        try {
            const { userId, questionId, response } = req.body;

            if (!userId || !questionId || !response) {
                return res.status(400).json({ error: 'User ID, question ID, and response are required' });
            }

            const question = questionsData.questions.find((q) => q.id === questionId);
            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }

            const answers = {
                question: {
                    id: question.id,
                    text: question.text,
                    options: question.options,
                },
                response: response,
            };

            const userResponse = await prisma.user_answers.create({
                data: {
                    fk_id_user: parseInt(userId),
                    answers: answers,
                },
            });

            res.status(201).json(userResponse);
        } catch (error) {
            console.error('Error adding response:', error);
            res.status(500).json({ error: error.message });
        }
    };

    static async getUserResponses(req, res) {
        try {
            const { userId } = req.params;

            const responses = await prisma.user_answers.findMany({
                where: { fk_id_user: parseInt(userId) },
            });

            res.status(200).json(responses);
        } catch (error) {
            console.error('Error fetching user responses:', error);
            res.status(500).json({ error: 'Failed to fetch user responses' });
        }
    }
}

module.exports = QuestionController;