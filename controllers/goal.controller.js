const prisma = require('../utils/prisma');

class GoalController {
    static async getAllGoals(req, res) {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const goals = await prisma.goals.findMany({
                where: { fk_id_user: parseInt(userId) },
                include: {
                    missions: true
                }
            });

            res.status(200).json(goals);
        } catch (error) {
            console.error('Error fetching goals:', error);
            res.status(500).json({ error: 'Failed to fetch goals' });
        }
    }

    static async getGoalById(req, res) {
        try {
            const { id } = req.params;

            const goal = await prisma.goals.findUnique({
                where: { id: parseInt(id) },
                include: {
                    missions: true
                }
            });

            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }

            res.status(200).json(goal);
        } catch (error) {
            console.error('Error fetching goal:', error);
            res.status(500).json({ error: 'Failed to fetch goal' });
        }
    }

    static async createGoal(req, res) {
        try {
            const { title, description, userId, isDone = false } = req.body;

            if (!title || !userId) {
                return res.status(400).json({ error: 'Title and user ID are required' });
            }

            const goal = await prisma.goals.create({
                data: {
                    title,
                    description,
                    fk_id_user: parseInt(userId),
                    is_done: isDone
                }
            });

            res.status(201).json(goal);
        } catch (error) {
            console.error('Error creating goal:', error);
            res.status(500).json({ error: 'Failed to create goal' });
        }
    }

    static async updateGoal(req, res) {
        try {
            const { id } = req.params;
            const { title, description, isDone } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }

            const goal = await prisma.goals.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    description,
                    is_done: isDone
                }
            });

            res.status(200).json(goal);
        } catch (error) {
            console.error('Error updating goal:', error);
            res.status(500).json({ error: 'Failed to update goal' });
        }
    }

    static async deleteGoal(req, res) {
        try {
            const { id } = req.params;

            // Check if the goal exists
            const goal = await prisma.goals.findUnique({
                where: { id: parseInt(id) }
            });

            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }

            // Delete goal and cascading relations (missions)
            await prisma.goals.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).json({
                success: true,
                message: `Goal with ID ${id} has been successfully deleted`
            });
        } catch (error) {
            console.error('Error deleting goal:', error);
            res.status(500).json({ error: 'Failed to delete goal' });
        }
    }
}

module.exports = GoalController;