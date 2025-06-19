const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');
const { filterSensitiveUserData } = require('../utils/user.utils.js');

class GoalController {
    static async getAllGoals(req, res) {
        try {
            const { userId } = req.query;
    
            if (!userId) {
                return res.status(400).json(jsend.fail({ error: 'User ID is required' }));
            }
    
            const user = await prisma.users.findUnique({
                where: { id: parseInt(userId) }
            });
    
            if (!user) {
                return res.status(404).json(jsend.fail({ error: 'User not found' }));
            }
    
            const goals = await prisma.goals.findMany({
                where: { fk_id_user: parseInt(userId) },
                include: {
                    missions: false //! missions are not included in the response
                }
            });
    
            if (goals.length === 0) {
                return res.status(404).json(jsend.fail({ message: 'No goals found for the specified user' }));
            }
    
            // Filter out any sensitive user data if it exists in the goals
            const safeGoals = goals.map(goal => {
                if (goal.user) {
                    goal.user = filterSensitiveUserData(goal.user);
                }
                return goal;
            });
    
            res.status(200).json(jsend.success(safeGoals));
        } catch (error) {
            console.error('Error fetching goals:', error);
            res.status(500).json(jsend.error('Failed to fetch goals'));
        }
    }

    static async getGoalById(req, res) {
        try {
            const { id } = req.params;

            const goal = await prisma.goals.findUnique({
                where: { id: parseInt(id) },
                include: {
                    missions: false //! missions are not included in the response
                }
            });

            if (!goal) {
                return res.status(404).json(jsend.fail({ error: 'Goal not found' }));
            }

            res.status(200).json(jsend.success(goal));
        } catch (error) {
            console.error('Error fetching goal:', error);
            res.status(500).json(jsend.error('Failed to fetch goal'));
        }
    }

    static async createGoal(req, res) {
        try {
            const { title, description, userId, isDone = false } = req.body;

            if (!title || !userId) {
                return res.status(400).json(jsend.fail({ error: 'Title and user ID are required' }));
            }

            const goal = await prisma.goals.create({
                data: {
                    title,
                    description,
                    fk_id_user: parseInt(userId),
                    is_done: isDone
                }
            });

            res.status(201).json(jsend.success(goal));
        } catch (error) {
            console.error('Error creating goal:', error);
            res.status(500).json(jsend.error('Failed to create goal'));
        }
    }

    static async updateGoal(req, res) {
        try {
            const { id } = req.params;
            const { title, description, isDone } = req.body;

            if (!title) {
                return res.status(400).json(jsend.fail({ error: 'Title is required' }));
            }

            const goal = await prisma.goals.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    description,
                    is_done: isDone
                }
            });

            res.status(200).json(jsend.success(goal));
        } catch (error) {
            console.error('Error updating goal:', error);
            res.status(500).json(jsend.error('Failed to update goal'));
        }
    }

    static async deleteGoal(req, res) {
        try {
            const { id } = req.params;

            const goal = await prisma.goals.findUnique({
                where: { id: parseInt(id) }
            });

            if (!goal) {
                return res.status(404).json(jsend.fail({ error: 'Goal not found' }));
            }

            await prisma.goals.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).json(jsend.success({
                message: `Goal with ID ${id} has been successfully deleted`
            }));
        } catch (error) {
            console.error('Error deleting goal:', error);
            res.status(500).json(jsend.error('Failed to delete goal'));
        }
    }
}

module.exports = GoalController;