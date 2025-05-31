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

            // Get unique question IDs from the responses
            const questionIds = [...new Set(responses.map(response => response.answers?.question?.id).filter(id => id))];

            // Fetch question details from questionsData for all unique question IDs
            const questionsMap = {};
            questionIds.forEach(questionId => {
                const question = questionsData.questions.find(q => q.id === questionId);
                if (question) {
                    questionsMap[questionId] = {
                        id: question.id,
                        text: question.text,
                        options: question.options || []
                    };
                }
            });

            const formattedResponses = responses.map((response) => {
                const questionId = response.answers?.question?.id;
                const questionFromMap = questionsMap[questionId];

                return {
                    id: response.id,
                    userId: response.fk_id_user,
                    timestamp: response.timestamp,
                    questionId: questionId,
                    question: questionFromMap || {
                        id: questionId,
                        text: response.answers?.question?.text || `Question ${questionId}`,
                        options: response.answers?.question?.options || []
                    },
                    response: response.answers?.response,
                };
            });

            res.status(200).json(jsend.success(formattedResponses));
        } catch (error) {
            console.error('Error fetching user responses:', error);
            res.status(500).json(jsend.error('Failed to fetch user responses'));
        }
    }

    static saveRestDays = async (req, res) => {
        try {
            const { restDays, goalId, userId } = req.body;

            if (!Array.isArray(restDays) || restDays.length === 0) {
                return res.status(400).json(jsend.fail({ error: "Rest days are required" }));
            }

            // Get the IDs of the selected days from the days_week table
            const days = await prisma.days_week.findMany({
                where: { day_name: { in: restDays } },
            });

            if (days.length === 0) {
                return res.status(400).json(jsend.fail({ error: "Invalid rest days" }));
            }

            // Save the rest days in the rest_days table
            const restDaysData = days.map((day) => ({
                fk_id_user: parseInt(userId, 10),
                fk_id_goal: goalId ? parseInt(goalId, 10) : null,
                fk_days_week: day.id,
            }));

            await prisma.rest_days.createMany({ data: restDaysData });

            res.status(201).json(jsend.success({ message: "Rest days saved successfully" }));
        } catch (error) {
            console.error("Error saving rest days:", error);
            res.status(500).json(jsend.error("Failed to save rest days"));
        }
    };
}

module.exports = QuestionController;