const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const questionsData = require('../data/questions');

const questions = questionsData.questions;

class QuestionModel {

    static getAllQuestions = () => {
        return questions;
    };

    static getQuestionById = (id) => {
        const questionId = typeof id === 'string' ? parseInt(id, 10) : id;

        const question = questions.find((q) => q.id === questionId);
        if (!question) {
            throw new Error('Question not found');
        }
        return question;
    };

    static async addResponse(userId, questionId, response) {
        try {
            const question = questions.find((q) => q.id === questionId);
            if (!question) {
                throw new Error('Question not found');
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
                    fk_id_user: userId,
                    answers: answers,
                },
            });

            return userResponse;
        } catch (error) {
            console.error('Error adding response to user_answers:', error);
            throw error;
        }
    }
}

module.exports = QuestionModel;