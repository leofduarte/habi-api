const openAIService = require('../services/openAI.service.js');
const prisma = require('../utils/prisma');

class OpenAIController {
    static async generatePersonalizedMissionsSuggestions(req, res) {
        try {
            const { userId, goal } = req.body;

            if (!userId || !goal) {
                return res.status(400).json({ error: 'User ID and goal are required' });
            }

            const user = await prisma.users.findUnique({ where: { id: parseInt(userId) } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userAnswers = await prisma.user_answers.findMany({
                where: { fk_id_user: parseInt(userId) },
                orderBy: { timestamp: 'desc' },
                take: 5
            });

            const prompt = `Generate 5 personalized mission suggestions for a user with the following goal: "${goal}".
                            The user has answered the following questions:
                            Previous responses: ${JSON.stringify(userAnswers.map(a => a.answers))}`;

            const suggestions = await openAIService.generateCompletion(prompt, {
                model: 'gpt-3.5-turbo',
                maxTokens: 800,
                temperature: 0.7
            });

            return res.status(200).json({ suggestions });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async generatePersonalizedGoalSuggestions(req, res) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const user = await prisma.users.findUnique({ where: { id: parseInt(userId) } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userAnswers = await prisma.user_answers.findMany({
                where: { fk_id_user: parseInt(userId) },
                orderBy: { timestamp: 'desc' },
                take: 5
            });

            const prompt = `Generate 4 personalized goal suggestions for a user based on their previous answers.
                           These should be life improvement goals that are realistic and actionable.
                           Previous responses: ${JSON.stringify(userAnswers.map(a => a.answers))}`;

            const suggestions = await openAIService.generateCompletion(prompt, {
                model: 'gpt-3.5-turbo',
                maxTokens: 500,
                temperature: 0.7
            });

            return res.status(200).json({ suggestions });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = OpenAIController;