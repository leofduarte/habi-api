const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');
const questionsData = require('../data/questions');

class QuestionController {
    static getAllQuestions = async (req, res) => {
        try {
            const questions = questionsData.questions;
            res.status(200).json(jsend.success(questions));
        } catch (err) {
            console.error('Error fetching questions:', err);
            res.status(500).json(jsend.error('Error fetching questions'));
        }
    };

    static getQuestionById = async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const question = questionsData.questions.find((q) => q.id === id);

            if (!question) {
                return res.status(404).json(jsend.fail({ error: 'Question not found' }));
            }

            res.status(200).json(jsend.success(question));
        } catch (err) {
            console.error('Error fetching question:', err);
            res.status(500).json(jsend.error('Error processing request'));
        }
    };

    static addResponse = async (req, res) => {
        try {
            const { userId, questionId, response } = req.body;

            if (!userId || !questionId || !response) {
                return res.status(400).json(jsend.fail({ error: 'User ID, question ID, and response are required' }));
            }

            const question = questionsData.questions.find((q) => q.id === questionId);
            if (!question) {
                return res.status(404).json(jsend.fail({ error: 'Question not found' }));
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

            res.status(201).json(jsend.success(userResponse));
        } catch (error) {
            console.error('Error adding response:', error);
            res.status(500).json(jsend.error({ error: error.message }));
        }
    };

        static async getUserResponses(req, res) {
        try {
            const { userId } = req.params;
    
            const responses = await prisma.user_answers.findMany({
                where: { fk_id_user: parseInt(userId) },
                select: {
                    id: true,
                    fk_id_user: true,
                    timestamp: true,
                    answers: true,
                },
            });
    
            const formattedResponses = responses.map((response) => ({
                id: response.id,
                userId: response.fk_id_user,
                timestamp: response.timestamp,
                questionId: response.answers.question.id,
                response: response.answers.response,
            }));
    
            res.status(200).json(jsend.success(formattedResponses));
        } catch (error) {
            console.error('Error fetching user responses:', error);
            res.status(500).json(jsend.error('Failed to fetch user responses'));
        }
    }
}

module.exports = QuestionController;