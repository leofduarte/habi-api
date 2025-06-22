const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');
const loggerWinston = require('../utils/loggerWinston.utils');



async function createMissionWithDays(tx, missionData) {
    const { title, description, emoji, status, fk_id_goal, days } = missionData;

    if (!title || title.length < 3) {
        throw new Error('Title is required and must be at least 3 characters long');
    }

    if (!fk_id_goal || isNaN(parseInt(fk_id_goal))) {
        throw new Error('A valid goal ID is required');
    }

    const goalId = parseInt(fk_id_goal);
    
    // Verify the goal exists
    const goal = await tx.goals.findUnique({
        where: { id: goalId }
    });

    if (!goal) {
        throw new Error(`Goal with ID ${goalId} does not exist`);
    }

    const mission = await tx.missions.create({
        data: {
            title,
            description: description || "",
            emoji: emoji || "",
            status: status || "active",
            streaks: 0,
            fk_id_goal: goalId,
        },
    });

    if (days && days.length > 0) {
        // Validate days array
        if (!Array.isArray(days)) {
            throw new Error('Days must be an array of numbers');
        }

        for (const dayId of days) {
            const parsedDayId = parseInt(dayId);
            if (isNaN(parsedDayId) || parsedDayId < 1 || parsedDayId > 7) {
                throw new Error(`Invalid day ID: ${dayId}. Must be a number between 1 and 7`);
            }

            await tx.mission_days.create({
                data: {
                    fk_id_mission: mission.id,
                    fk_days_week_id: parsedDayId,
                },
            });
        }
    }

    loggerWinston.info('Mission created', { goalId, mission: JSON.stringify(mission) });
    return mission;
}

class MissionController {
    static async getAllMissions(req, res) {
        try {
            const { goalId } = req.query;

            if (!goalId) {
                return res.status(400).json(jsend.fail({ error: 'Goal ID is required' }));
            }

            const missions = await prisma.missions.findMany({
                where: { fk_id_goal: parseInt(goalId) },
                include: {
                    mission_days: {
                        include: {
                            days_week: true,
                        },
                    },
                    mission_completions: true,
                },
            });

            res.status(200).json(jsend.success(missions));
        } catch (error) {
            console.error('Error getting missions:', error);
            res.status(500).json(jsend.error('Failed to get missions'));
        }
    }

    static async getMissionById(req, res) {
        try {
            const { id } = req.params;
            const mission = await prisma.missions.findUnique({
                where: { id: parseInt(id) },
                include: {
                    mission_days: {
                        include: {
                            days_week: true,
                        },
                    },
                    mission_completions: true,
                },
            });

            if (!mission) {
                return res.status(404).json(jsend.fail({ error: 'Mission not found' }));
            }

            res.status(200).json(jsend.success(mission));
        } catch (error) {
            console.error('Error getting mission:', error);
            res.status(500).json(jsend.error('Failed to get mission'));
        }
    }

    static async createMission(req, res) {
        try {
            const { title, description, emoji, status, fk_id_goal, days } = req.body;

            if (!title || !fk_id_goal) {
                return res.status(400).json(jsend.fail({ error: 'Title and goal ID are required' }));
            }

            const mission = await prisma.missions.create({
                data: {
                    title,
                    description,
                    emoji,
                    status,
                    streaks: 0,
                    fk_id_goal: parseInt(fk_id_goal),
                },
            });

            if (days && days.length > 0) {
                for (const dayId of days.map(day => parseInt(day))) {
                    await prisma.mission_days.create({
                        data: {
                            fk_id_mission: mission.id,
                            fk_days_week_id: dayId,
                        },
                    });
                }
            }

            loggerWinston.info('Mission created', { goalId: fk_id_goal, mission: JSON.stringify(mission) });
            res.status(201).json(jsend.success(mission));
        } catch (error) {
            loggerWinston.error('Error creating mission', { error: error.message, stack: error.stack, goalId: fk_id_goal });
            console.error('Error creating mission:', error);
            res.status(500).json(jsend.error('Failed to create mission'));
        }
    }

    static async updateMission(req, res) {
        try {
            const { id } = req.params;
            const { title, description, emoji, status, days, updated_at } = req.body;
            const missionId = parseInt(id);

            const existingMission = await prisma.missions.findUnique({
                where: { id: missionId },
            });

            if (!existingMission) {
                return res.status(404).json(jsend.fail({ error: 'Mission not found' }));
            }

            // Create update data object with only provided fields
            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (emoji !== undefined) updateData.emoji = emoji;
            if (status !== undefined) updateData.status = status;
            if (updated_at !== undefined) updateData.updated_at = new Date(updated_at);

            // Only update if there are fields to update
            let mission = existingMission;
            if (Object.keys(updateData).length > 0) {
                mission = await prisma.missions.update({
                    where: { id: missionId },
                    data: updateData,
                });
            }

            // Handle days update if provided
            if (days && Array.isArray(days)) {
                await prisma.mission_days.deleteMany({
                    where: { fk_id_mission: missionId },
                });

                for (const dayId of days.map(day => parseInt(day))) {
                    await prisma.mission_days.create({
                        data: {
                            fk_id_mission: missionId,
                            fk_days_week_id: dayId,
                        },
                    });
                }
            }

            // Fetch the complete updated mission
            const updatedMission = await prisma.missions.findUnique({
                where: { id: missionId },
                include: {
                    mission_days: {
                        include: {
                            days_week: true,
                        },
                    },
                },
            });

            loggerWinston.info('Mission updated', { missionId: req.params.id });
            res.status(200).json(jsend.success(updatedMission));
        } catch (error) {
            loggerWinston.error('Error updating mission', { error: error.message, stack: error.stack, missionId: req.params.id });
            console.error('Error updating mission:', error);
            res.status(500).json(jsend.error('Failed to update mission'));
        }
    }

    static async deleteMission(req, res) {
        try {
            const { id } = req.params;
            const missionId = parseInt(id);

            const existingMission = await prisma.missions.findUnique({
                where: { id: missionId },
            });

            if (!existingMission) {
                return res.status(404).json(jsend.fail({ error: 'Mission not found' }));
            }

            await prisma.$transaction([
                prisma.mission_days.deleteMany({
                    where: { fk_id_mission: missionId },
                }),

                prisma.mission_completions.deleteMany({
                    where: { fk_id_mission: missionId },
                }),

                prisma.missions.delete({
                    where: { id: missionId },
                }),
            ]);

            loggerWinston.info('Mission deleted', { missionId: req.params.id });
            res.status(200).json(jsend.success({
                message: `Mission with ID ${id} has been successfully deleted`
            }));
        } catch (error) {
            loggerWinston.error('Error deleting mission', { error: error.message, stack: error.stack, missionId: req.params.id });
            console.error('Error deleting mission:', error);
            res.status(500).json(jsend.error({
                error: 'Failed to delete mission',
                details: error.message
            }));
        }
    }

    static async toggleMissionCompletion(req, res) {
        try {
            const { missionId, completionDate, userId } = req.body;

            if (!missionId) {
                return res.status(400).json(jsend.fail({ error: 'Mission ID is required' }));
            }

            if (!userId) {
                return res.status(400).json(jsend.fail({ error: 'User ID is required' }));
            }

            const missionIdInt = parseInt(missionId);
            const userIdInt = parseInt(userId);

            if (isNaN(missionIdInt) || missionIdInt <= 0) {
                return res.status(400).json(jsend.fail({ error: 'Mission ID must be a positive integer' }));
            }

            if (isNaN(userIdInt) || userIdInt <= 0) {
                return res.status(400).json(jsend.fail({ error: 'User ID must be a positive integer' }));
            }

            // Get user's timezone offset
            const user = await prisma.users.findUnique({
                where: { id: userIdInt },
                select: { timezone_offset: true }
            });

            if (!user) {
                return res.status(404).json(jsend.fail({ error: 'User not found' }));
            }

            const missionWithGoal = await prisma.missions.findUnique({
                where: { id: missionIdInt },
                include: {
                    goals: {
                        select: {
                            fk_id_user: true,
                        },
                    },
                },
            });

            if (!missionWithGoal) {
                return res.status(404).json(jsend.fail({ error: 'Mission not found' }));
            }

            if (missionWithGoal.goals.fk_id_user !== userIdInt) {
                return res.status(403).json(jsend.fail({ error: 'You are not authorized to toggle this mission' }));
            }

            let parsedCompletionDate = null;
            if (completionDate) {
                parsedCompletionDate = new Date(completionDate);
                if (isNaN(parsedCompletionDate.getTime())) {
                    return res.status(400).json(jsend.fail({ error: 'Invalid completion date format' }));
                }
            }

            // Get current time in user's timezone
            const now = new Date();
            const userLocalTime = new Date(now.getTime() + (user.timezone_offset * 60 * 60 * 1000));
            
            // Set both dates to start of day in user's timezone
            const today = new Date(userLocalTime);
            today.setHours(0, 0, 0, 0);

            if (parsedCompletionDate) {
                // Convert completion date to user's timezone
                const completionDateInUserTz = new Date(parsedCompletionDate.getTime() + (user.timezone_offset * 60 * 60 * 1000));
                completionDateInUserTz.setHours(0, 0, 0, 0);

                if (completionDateInUserTz > today) {
                    return res.status(400).json(jsend.fail({ error: 'Completion date cannot be in the future' }));
                }
            }

            const existingCompletion = await prisma.mission_completions.findFirst({
                where: {
                    fk_id_mission: missionIdInt,
                    fk_id_user: userIdInt,
                    completion_date: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            });

            let result;
            await prisma.$transaction(async (tx) => {
                if (existingCompletion) {
                    await tx.mission_completions.delete({
                        where: { id: existingCompletion.id }
                    });

                    result = {
                        completed: false,
                        message: 'Mission marked as incomplete',
                        removedCompletion: existingCompletion
                    };
                } else {
                    const completionDateToUse = completionDate ? new Date(completionDate) : new Date();
                    
                    // Convert to user's timezone
                    const completionDateInUserTz = new Date(completionDateToUse.getTime() + (user.timezone_offset * 60 * 60 * 1000));
                    completionDateInUserTz.setHours(0, 0, 0, 0);

                    if (completionDateInUserTz.getTime() !== today.getTime()) {
                        throw new Error('Completion date must be today');
                    }

                    const completion = await tx.mission_completions.create({
                        data: {
                            fk_id_mission: missionIdInt,
                            fk_id_user: userIdInt,
                            completion_date: completionDateInUserTz
                        }
                    });

                    result = {
                        completed: true,
                        message: 'Mission marked as complete',
                        completion: completion
                    };
                }
            });

            res.status(200).json(jsend.success(result));
        } catch (error) {
            console.error('Error toggling mission completion:', error);
            res.status(500).json(jsend.error({
                error: 'Failed to toggle mission completion',
                details: error.message
            }));
        }
    }

    static async createMultipleMissions(req, res) {
        try {
            const { missions } = req.body;

            if (!Array.isArray(missions) || missions.length === 0) {
                return res.status(400).json(jsend.fail({ error: "Missions array is required and cannot be empty" }));
            }

            // Validate each mission before processing
            for (const mission of missions) {
                if (!mission.title || mission.title.length < 3) {
                    return res.status(400).json(jsend.fail({ 
                        error: "Each mission must have a title with at least 3 characters",
                        invalidMission: mission
                    }));
                }
                if (!mission.fk_id_goal || isNaN(parseInt(mission.fk_id_goal))) {
                    return res.status(400).json(jsend.fail({ 
                        error: "Each mission must have a valid goal ID",
                        invalidMission: mission
                    }));
                }
                if (mission.days && !Array.isArray(mission.days)) {
                    return res.status(400).json(jsend.fail({ 
                        error: "Days must be an array of numbers",
                        invalidMission: mission
                    }));
                }
            }

            const createdMissions = await prisma.$transaction(async (tx) => {
                const results = [];
                for (const missionData of missions) {
                    try {
                        const mission = await createMissionWithDays(tx, missionData);
                        results.push(mission);
                    } catch (error) {
                        throw new Error(`Failed to create mission "${missionData.title}": ${error.message}`);
                    }
                }
                return results;
            });

            res.status(201).json(jsend.success(createdMissions));
        } catch (error) {
            console.error("Error creating multiple missions:", error);
            res.status(500).json(jsend.error({
                message: "Failed to create multiple missions",
                details: error.message
            }));
        }
    }
}

module.exports = MissionController;