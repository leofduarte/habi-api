const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');

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

            res.status(201).json(jsend.success(mission));
        } catch (error) {
            console.error('Error creating mission:', error);
            res.status(500).json(jsend.error('Failed to create mission'));
        }
    }

    static async updateMission(req, res) {
        try {
            const { id } = req.params;
            const { title, description, emoji, status, days } = req.body;
            const missionId = parseInt(id);

            if (!title) {
                return res.status(400).json(jsend.fail({ error: 'Title is required' }));
            }

            const existingMission = await prisma.missions.findUnique({
                where: { id: missionId },
            });

            if (!existingMission) {
                return res.status(404).json(jsend.fail({ error: 'Mission not found' }));
            }

            const mission = await prisma.missions.update({
                where: { id: missionId },
                data: {
                    title,
                    description,
                    emoji,
                    status,
                },
            });

            if (days && days.length > 0) {
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

            res.status(200).json(jsend.success(mission));
        } catch (error) {
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

            res.status(200).json(jsend.success({
                message: `Mission with ID ${id} has been successfully deleted`
            }));
        } catch (error) {
            console.error('Error deleting mission:', error);
            res.status(500).json(jsend.error('Failed to delete mission'));
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

            // Fetch the user's timezone offset
            const user = await prisma.users.findUnique({
                where: { id: userIdInt },
                select: { timezone_offset: true },
            });

            if (!user) {
                return res.status(404).json(jsend.fail({ error: 'User not found' }));
            }

            const timezoneOffset = user.timezone_offset || 0; // Default to UTC if no offset is set

            // Parse and adjust the completion date to UTC
            let parsedCompletionDate = null;
            if (completionDate) {
                parsedCompletionDate = new Date(completionDate);
                if (isNaN(parsedCompletionDate.getTime())) {
                    return res.status(400).json(jsend.fail({ error: 'Invalid completion date format' }));
                }

                // Adjust the completion date to UTC
                parsedCompletionDate = new Date(parsedCompletionDate.getTime() - timezoneOffset * 60 * 60 * 1000);
            }

            // Get the current date in the user's local timezone and adjust to UTC
            const now = new Date();
            const userLocalNow = new Date(now.getTime() - timezoneOffset * 60 * 60 * 1000);
            userLocalNow.setHours(0, 0, 0, 0);

            if (parsedCompletionDate && parsedCompletionDate > now) {
                return res.status(400).json(jsend.fail({ error: 'Completion date cannot be in the future' }));
            }

            const existingCompletion = await prisma.mission_completions.findFirst({
                where: {
                    fk_id_mission: missionIdInt,
                    fk_id_user: userIdInt,
                    completion_date: {
                        gte: userLocalNow,
                        lt: new Date(userLocalNow.getTime() + 24 * 60 * 60 * 1000),
                    },
                },
            });

            let result;
            await prisma.$transaction(async (tx) => {
                if (existingCompletion) {
                    await tx.mission_completions.delete({
                        where: { id: existingCompletion.id },
                    });

                    result = {
                        completed: false,
                        message: 'Mission marked as incomplete',
                        removedCompletion: existingCompletion,
                    };
                } else {
                    const completionDateToUse = parsedCompletionDate || now;

                    const completion = await tx.mission_completions.create({
                        data: {
                            fk_id_mission: missionIdInt,
                            fk_id_user: userIdInt,
                            completion_date: completionDateToUse,
                        },
                    });

                    result = {
                        completed: true,
                        message: 'Mission marked as complete',
                        completion: completion,
                    };
                }
            });

            res.status(200).json(jsend.success(result));
        } catch (error) {
            console.error('Error toggling mission completion:', error);
            res.status(500).json(jsend.error({
                error: 'Failed to toggle mission completion',
                details: error.message,
            }));
        }
    }

    static async createMultipleMissions(req, res) {
        try {
            const { missions, goalId, userId } = req.body;

            if (!Array.isArray(missions) || missions.length === 0) {
                return res.status(400).json(jsend.fail({ error: "Missions array is required and cannot be empty" }));
            }

            if (!goalId || !userId) {
                return res.status(400).json(jsend.fail({ error: "Goal ID and User ID are required" }));
            }

            // Get the user's rest days
            const restDays = await prisma.rest_days.findMany({
                where: { fk_id_user: parseInt(userId), fk_id_goal: parseInt(goalId) },
                include: { days_week: true },
            });

            const restDayNames = restDays.map((day) => day.days_week.day_name);

            // Get all days of the week
            const allDays = await prisma.days_week.findMany();
            const nonRestDays = allDays
                .filter((day) => !restDayNames.includes(day.day_name))
                .map((day) => day.id);

            const createdMissions = await prisma.$transaction(async (tx) => {
                const results = [];

                for (const missionData of missions) {
                    const { title, description, emoji, status, fk_id_goal } = missionData;

                    if (!title || !fk_id_goal) {
                        throw new Error("Title and goal ID are required for each mission");
                    }

                    // Create the mission
                    const mission = await tx.missions.create({
                        data: {
                            title,
                            description: description || title,
                            emoji: emoji || "",
                            status: status || "active",
                            fk_id_goal: parseInt(fk_id_goal),
                        },
                    });

                    // Assign non-rest days to the mission
                    for (const dayId of nonRestDays) {
                        await tx.mission_days.create({
                            data: {
                                fk_id_mission: mission.id,
                                fk_days_week_id: dayId,
                            },
                        });
                    }

                    results.push(mission);
                }

                return results;
            });

            res.status(201).json(jsend.success(createdMissions));
        } catch (error) {
            console.error("Error creating multiple missions:", error);
            res.status(500).json(jsend.error("Failed to create multiple missions"));
        }
    };
}

module.exports = MissionController;