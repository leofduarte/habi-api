const prisma = require('../utils/prisma.utils.js');

function getTodayInTimezone(offset) {
    // offset in hours, e.g. -3 for Brazil
    const now = new Date();
    // Get UTC midnight
    const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    // Adjust for timezone
    utcMidnight.setHours(utcMidnight.getHours() + offset);
    return utcMidnight;
}

function getRandomHourBetween10And22() {
    // Returns a random integer between 10 and 22 (inclusive)
    return Math.floor(Math.random() * (22 - 10 + 1)) + 10;
}

function getRandomMinute() {
    return Math.floor(Math.random() * 60);
}

function getRandomSecond() {
    return Math.floor(Math.random() * 60);
}

async function assignSpecialMissionToAllUsers() {
    const now = new Date();
    console.log("Starting special mission assignment job at", now)
    try {
        // Get all active users with timezone info and sponsor_special_mission preference
        const users = await prisma.users.findMany({
            where: { is_active: true },
            select: { id: true, timezone_offset: true, sponsor_special_mission: true }
        });

        // Define the date range for today (UTC)
        const todayStart = getTodayInTimezone(0);
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);

        // Fetch all missions scheduled for today, once.
        const scheduledMissions = await prisma.special_mission_schedules.findMany({
            where: {
                scheduled_date: {
                    gte: todayStart,
                    lt: tomorrowStart
                }
            },
            include: { special_missions: true }
        });

        for (const user of users) {
            let mission = null;

            // 1. Try to find a suitable mission from the ones scheduled for today
            if (scheduledMissions.length > 0) {
                const suitableScheduledMission = scheduledMissions.find(
                    sm => user.sponsor_special_mission !== false || sm.special_missions.is_partnership === false
                );
                if (suitableScheduledMission) {
                    mission = suitableScheduledMission.special_missions;
                }
            }

            // 2. If no suitable scheduled mission is found, find an unscheduled one
            if (!mission) {
                let missionWhere = {
                    schedules: { none: {} },
                };
                if (user.sponsor_special_mission === false) {
                    missionWhere.is_partnership = false;
                }
                const unscheduledMissions = await prisma.special_missions.findMany({
                    where: missionWhere
                });
                if (unscheduledMissions.length > 0) {
                    mission = unscheduledMissions[Math.floor(Math.random() * unscheduledMissions.length)];
                }
            }

            if (!mission) {
                console.log(`No available special mission for user ${user.id} today.`);
                continue;
            }

            const offset = user.timezone_offset || 0;
            const userMidnight = getTodayInTimezone(offset);
            const randomHour = getRandomHourBetween10And22();
            const randomMinute = getRandomMinute();
            const randomSecond = getRandomSecond();
            const availableAt = new Date(userMidnight);
            availableAt.setHours(randomHour, randomMinute, randomSecond, 0);

            // Check if already assigned for today
            const alreadyAssigned = await prisma.user_special_missions.findFirst({
                where: {
                    fk_id_user: user.id,
                    available_at: {
                        gte: userMidnight,
                        lt: new Date(userMidnight.getTime() + 24 * 60 * 60 * 1000) // before next midnight
                    }
                }
            });

            if (alreadyAssigned) {
                console.log(`Mission ${alreadyAssigned.fk_id_special_mission} already assigned to user ${user.id} for today.`);
                continue;
            }

            await prisma.user_special_missions.create({
                data: {
                    fk_id_user: user.id,
                    fk_id_special_mission: mission.id,
                    available_at: availableAt
                }
            });
            console.log(`Assigned mission ${mission.id} to user ${user.id} (available at ${availableAt.toISOString()})`);
        }
        console.log('Done assigning special missions to all users.');
    } catch (error) {
        console.error('Error assigning special missions:', error);
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = { assignSpecialMissionToAllUsers };