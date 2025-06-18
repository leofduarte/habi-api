const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetSpecialMissionsForTimezone(timezoneOffset) {
    try {
        // Get current time in UTC
        const now = new Date();
        
        // Calculate midnight in the target timezone
        const midnightInTimezone = new Date(now);
        midnightInTimezone.setUTCHours(24 - timezoneOffset, 0, 0, 0);
        
        // Get all users in this timezone
        const users = await prisma.users.findMany({
            where: {
                timezone_offset: timezoneOffset,
                is_active: true
            },
            select: {
                id: true
            }
        });

        console.log(`Processing ${users.length} users in timezone offset ${timezoneOffset}`);

        // Process each user in a transaction
        for (const user of users) {
            await prisma.$transaction(async (tx) => {
                // Mark incomplete missions as expired
                await tx.user_special_missions.updateMany({
                    where: {
                        fk_id_user: user.id,
                        completed_at: null,
                        expired_at: null,
                        available_at: {
                            lte: midnightInTimezone
                        }
                    },
                    data: {
                        expired_at: midnightInTimezone
                    }
                });

                // Get available special missions
                const availableMissions = await tx.special_missions.findMany({
                    where: {
                        is_active: true
                    }
                });

                // Select random missions (up to 3)
                const numberOfMissions = Math.min(3, availableMissions.length);
                const shuffled = [...availableMissions].sort(() => 0.5 - Math.random());
                const selectedMissions = shuffled.slice(0, numberOfMissions);

                // Assign new missions
                for (const mission of selectedMissions) {
                    // Generate random hour between 10 AM and 10 PM in user's timezone
                    const randomHour = Math.floor(Math.random() * (22 - 10 + 1)) + 10;
                    const availableAt = new Date(midnightInTimezone);
                    availableAt.setUTCHours(randomHour - timezoneOffset, 0, 0, 0);

                    await tx.user_special_missions.create({
                        data: {
                            fk_id_user: user.id,
                            fk_id_special_mission: mission.id,
                            available_at: availableAt
                        }
                    });
                }
            });
        }

        console.log(`Successfully reset special missions for timezone offset ${timezoneOffset}`);
    } catch (error) {
        console.error(`Error resetting special missions for timezone offset ${timezoneOffset}:`, error);
        throw error;
    }
}

async function main() {
    try {
        console.log('Starting special mission reset process...');
        
        // Get all unique timezone offsets from users
        const timezoneOffsets = await prisma.users.findMany({
            select: {
                timezone_offset: true
            },
            distinct: ['timezone_offset']
        });

        // Process each timezone
        for (const { timezone_offset } of timezoneOffsets) {
            await resetSpecialMissionsForTimezone(timezone_offset);
        }

        console.log('Special mission reset process completed successfully');
    } catch (error) {
        console.error('Error in special mission reset process:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Export the main function
module.exports = { main };

// If this script is run directly (not imported)
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
} 