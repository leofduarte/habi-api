import prisma from '../utils/prisma.utils.js';

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
    console.log("chamado", now)
    try {
        // Get all active users with timezone info and sponsor_special_mission preference
        const users = await prisma.users.findMany({
            where: { is_active: true },
            select: { id: true, timezone_offset: true, sponsor_special_mission: true }
        });

        // Use UTC+0 for mission selection
        const today = getTodayInTimezone(0);

        // Find missions scheduled for today in special_mission_schedules
        const scheduledMissions = await prisma.special_mission_schedules.findMany({
            where: { scheduled_date: today },
            include: { special_missions: true }
        });

        let mission = null;
        let isSponsored = false;
        if (scheduledMissions.length > 0) {
            mission = scheduledMissions[0].special_missions;
            isSponsored = mission.is_partnership === true;
        } else {
            // Find unscheduled missions that are not partnership
            const unscheduledMissions = await prisma.special_missions.findMany({
                where: {
                    schedules: { none: {} },
                    OR: [
                        { is_partnership: false },
                        { is_partnership: null }
                    ]
                }
            });
            if (unscheduledMissions.length > 0) {
                mission = unscheduledMissions[0];
                isSponsored = mission.is_partnership === true;
            }
        }

        if (!mission) {
            console.log('No available special mission for today.');
            return;
        }

        for (const user of users) {
            // If user opted out of sponsored missions and the mission is sponsored, skip
            if (isSponsored && user.sponsor_special_mission === false) {
                console.log(`User ${user.id} opted out of sponsored missions. Skipping assignment.`);
                continue;
            }

            const offset = user.timezone_offset || 0;
            const userMidnight = getTodayInTimezone(offset);
            const randomHour = getRandomHourBetween10And22();
            const randomMinute = getRandomMinute();
            const randomSecond = getRandomSecond();
            const availableAt = new Date(userMidnight);
            availableAt.setHours(randomHour, randomMinute, randomSecond, 0); // Set to random hour, minute, second in user's timezone

            // Check if already assigned for today
            const alreadyAssigned = await prisma.user_special_missions.findFirst({
                where: {
                    fk_id_user: user.id,
                    fk_id_special_mission: mission.id,
                    available_at: {
                        gte: userMidnight,
                        lt: new Date(userMidnight.getTime() + 24 * 60 * 60 * 1000) // before next midnight
                    }
                }
            });

            if (alreadyAssigned) {
                console.log(`Mission ${mission.id} already assigned to user ${user.id} for today.`);
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
        console.log('Done assigning the same special mission to all users.');
    } catch (error) {
        console.error('Error assigning special missions:', error);
    } finally {
        await prisma.$disconnect();
    }
}
