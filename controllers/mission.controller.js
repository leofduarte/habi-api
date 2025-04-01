const MissionModel = require('../models/mission.model.js');

class MissionController {
    static async getAllMissions(req, res) {
        try {
            const { goalId } = req.query;

            if (!goalId) {
                return res.status(400).json({ error: 'Goal ID is required' });
            }

            const missions = await MissionModel.getAllMissionsByGoalId(parseInt(goalId));
            res.status(200).json(missions);
        } catch (error) {
            console.error('Error getting missions:', error);
            res.status(500).json({ error: 'Failed to get missions' });
        }
    }

    static async getMissionById(req, res) {
        try {
            const { id } = req.params;
            const mission = await MissionModel.getMissionById(parseInt(id));

            if (!mission) {
                return res.status(404).json({ error: 'Mission not found' });
            }

            res.status(200).json(mission);
        } catch (error) {
            console.error('Error getting mission:', error);
            res.status(500).json({ error: 'Failed to get mission' });
        }
    }

    static async createMission(req, res) {
        try {
            const { title, description, emoji, status, fk_id_goal, days } = req.body;

            if (!title || !fk_id_goal) {
                return res.status(400).json({ error: 'Title and goal ID are required' });
            }

            const mission = await MissionModel.createMission({
                title,
                description,
                emoji,
                status,
                fk_id_goal: parseInt(fk_id_goal),
                days: days?.map(day => parseInt(day)),
            });

            res.status(201).json(mission);
        } catch (error) {
            console.error('Error creating mission:', error);
            res.status(500).json({ error: 'Failed to create mission' });
        }
    }

    static async updateMission(req, res) {
        try {
            const { id } = req.params;
            const { title, description, emoji, status, days } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }

            const mission = await MissionModel.updateMission(parseInt(id), {
                title,
                description,
                emoji,
                status,
                days: days?.map(day => parseInt(day)),
            });

            res.status(200).json(mission);
        } catch (error) {
            console.error('Error updating mission:', error);
            res.status(500).json({ error: 'Failed to update mission' });
        }
    }

    static async deleteMission(req, res) {
        try {
            const { id } = req.params;
            await MissionModel.deleteMission(parseInt(id));

            res.status(200).json({
                success: true,
                message: `Mission with ID ${id} has been successfully deleted`
            });
        } catch (error) {
            console.error('Error deleting mission:', error);
            res.status(500).json({ error: 'Failed to delete mission' });
        }
    }
}

module.exports = MissionController;