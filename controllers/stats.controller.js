const prisma = require('../utils/prisma');
const jsend = require('jsend');

class StatsController {
    static async getUserStats(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json(jsend.fail({ error: 'User ID is required' }));
            }

            // Get user's goals and missions
            const goals = await prisma.goals.findMany({
                where: { fk_id_user: parseInt(userId) },
                include: {
                    missions: {
                        include: {
                            mission_completions: true
                        }
                    }
                }
            });

            const totalGoals = goals.length;
            const completedGoals = goals.filter(goal => goal.is_done).length;

            let totalMissions = 0;
            let totalCompletions = 0;
            let streaksSum = 0;

            goals.forEach(goal => {
                totalMissions += goal.missions.length;
                goal.missions.forEach(mission => {
                    totalCompletions += mission.mission_completions.length;
                    streaksSum += mission.streaks || 0;
                });
            });

            // Get the user's prize count
            const prizesCount = await prisma.user_prizes.count({
                where: { fk_id_user: parseInt(userId) }
            });

            // Get user's longest streak
            const missions = await prisma.missions.findMany({
                where: {
                    goals: {
                        fk_id_user: parseInt(userId)
                    }
                },
                orderBy: {
                    streaks: 'desc'
                },
                take: 1
            });

            const longestStreak = missions.length > 0 ? missions[0].streaks || 0 : 0;

            const stats = {
                totalGoals,
                completedGoals,
                goalCompletionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
                totalMissions,
                totalCompletions,
                missionCompletionRate: totalMissions > 0 ? (totalCompletions / totalMissions) * 100 : 0,
                averageStreak: totalMissions > 0 ? streaksSum / totalMissions : 0,
                longestStreak,
                prizesCount
            };

            return res.status(200).json(jsend.success(stats));
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return res.status(500).json(jsend.error('Failed to fetch user statistics'));
        }
    }

    static async getWeeklyProgress(req, res) {
        try {
            const { userId } = req.params;
            const { startDate } = req.query;

            if (!userId) {
                return res.status(400).json(jsend.fail({ error: 'User ID is required' }));
            }

            // Start date defaults to 7 days ago if not provided
            const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            // Get all missions for this user
            const missions = await prisma.missions.findMany({
                where: {
                    goals: {
                        fk_id_user: parseInt(userId)
                    }
                },
                include: {
                    mission_completions: {
                        where: {
                            completion_date: {
                                gte: start
                            }
                        }
                    },
                    mission_days: {
                        include: {
                            days_week: true
                        }
                    }
                }
            });

            // Process data by day
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const weeklyData = days.map(day => {
                const dayMissions = missions.filter(mission => {
                    return mission.mission_days.some(md =>
                        md.days_week && md.days_week.day_name &&
                        md.days_week.day_name.toUpperCase() === day
                    );
                });

                const totalScheduled = dayMissions.length;

                // Count completions for this day of the week in the date range
                let completedCount = 0;
                dayMissions.forEach(mission => {
                    mission.mission_completions.forEach(completion => {
                        const completionDay = days[new Date(completion.completion_date).getDay()];
                        if (completionDay === day) {
                            completedCount++;
                        }
                    });
                });

                return {
                    day,
                    totalScheduled,
                    completed: completedCount,
                    completionRate: totalScheduled > 0 ? (completedCount / totalScheduled) * 100 : 0
                };
            });

            return res.status(200).json(jsend.success(weeklyData));
        } catch (error) {
            console.error('Error fetching weekly progress:', error);
            return res.status(500).json(jsend.error('Failed to fetch weekly progress'));
        }
    }
}

module.exports = StatsController;