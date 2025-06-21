const prisma = require('../utils/prisma.utils.js');

function getStartOfDayInTimezone(date, offsetHours) {
    // Create a date object from the server's time
    const localDate = new Date(date);
    // Get the UTC time in milliseconds
    const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
    // Create a new date object for the target timezone
    const userTime = new Date(utc + (3600000 * offsetHours));
    // Set to the beginning of that day in the user's timezone
    userTime.setHours(0, 0, 0, 0);
    return userTime;
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
        const todayStartUTC = getStartOfDayInTimezone(now, 0);
        const tomorrowStartUTC = new Date(todayStartUTC);
        tomorrowStartUTC.setDate(tomorrowStartUTC.getDate() + 1);

        // 1. Check for scheduled sponsored mission for today
        const scheduledMissions = await prisma.sponsor_special_mission_schedules.findMany({
            where: {
                scheduled_date: {
                    gte: todayStartUTC,
                    lt: tomorrowStartUTC
                }
            },
            include: { special_missions: true }
        });
        const scheduledSponsored = scheduledMissions.find(sm => sm.special_missions.is_partnership === true);

        // 2. For non-sponsored users, ensure daily_special_mission is set for today
        let dailySpecialMission = await prisma.daily_special_mission.findUnique({
            where: { date: todayStartUTC }
        });
        if (!dailySpecialMission) {
            // Pick a random non-sponsored mission
            const nonSponsoredMissions = await prisma.special_missions.findMany({
                where: { is_partnership: false }
            });
            if (nonSponsoredMissions.length > 0) {
                const chosen = nonSponsoredMissions[Math.floor(Math.random() * nonSponsoredMissions.length)];
                dailySpecialMission = await prisma.daily_special_mission.create({
                    data: {
                        date: todayStartUTC,
                        fk_id_special_mission: chosen.id
                    }
                });
                console.log(`Set daily non-sponsored special mission for today: ${chosen.id}`);
            } else {
                console.log('No non-sponsored special missions available to set for today.');
            }
        }

        for (const user of users) {
            const offset = user.timezone_offset || 0;
            const userMidnight = getStartOfDayInTimezone(now, offset);
            const userNextMidnight = new Date(userMidnight);
            userNextMidnight.setDate(userNextMidnight.getDate() + 1);

            // Check if user already has a special mission for today
            const alreadyAssigned = await prisma.user_special_missions.findFirst({
                where: {
                    fk_id_user: user.id,
                    available_at: {
                        gte: userMidnight,
                        lt: userNextMidnight
                    }
                }
            });
            if (alreadyAssigned) {
                console.log(`User ${user.id} already has mission ${alreadyAssigned.fk_id_special_mission} for today. Skipping.`);
                continue;
            }

            let mission = null;
            // Assign sponsored if user wants and there is a scheduled sponsored mission
            if (user.sponsor_special_mission !== false && scheduledSponsored) {
                mission = scheduledSponsored.special_missions;
            } else if (dailySpecialMission) {
                // Otherwise assign the daily non-sponsored mission
                mission = await prisma.special_missions.findUnique({ where: { id: dailySpecialMission.fk_id_special_mission } });
            }
            if (!mission) {
                console.log(`No available special mission for user ${user.id} today.`);
                continue;
            }

            const randomHour = getRandomHourBetween10And22();
            const randomMinute = getRandomMinute();
            const randomSecond = getRandomSecond();
            const availableAt = new Date(userMidnight);
            availableAt.setHours(randomHour, randomMinute, randomSecond, 0);

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