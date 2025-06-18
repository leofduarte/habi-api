const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetSpecialMissionsForTimezone(timezoneOffset) {
    console.log('=== RESET SPECIAL MISSIONS FUNCTION STARTED ===');
    console.log(`Timezone offset received: ${timezoneOffset}`);
    
    try {
        // Simple test to check if Prisma is working
        console.log('Testing Prisma connection...');
        const testUsers = await prisma.users.findMany({
            take: 5, // Only fetch 5 users for testing
            select: {
                id: true,
                email: true,
                timezone_offset: true
            }
        });
        
        console.log(`Prisma connection successful! Found ${testUsers.length} users in database`);
        console.log('Sample users:', testUsers);
        
        // Get current time in UTC
        const now = new Date();
        console.log(`Current UTC time: ${now.toISOString()}`);
        
        console.log('=== FUNCTION COMPLETED SUCCESSFULLY ===');
        
        return {
            success: true,
            message: `Prisma connection test successful for timezone offset ${timezoneOffset}`,
            usersFound: testUsers.length,
            sampleUsers: testUsers
        };
        
    } catch (error) {
        console.error(`Error in resetSpecialMissionsForTimezone:`, error);
        throw error;
    } finally {
        await prisma.$disconnect();
        console.log('Database connection closed');
    }
}

//     try {
//         // Get current time in UTC
//         const now = new Date();
//         console.log(`Current UTC time: ${now.toISOString()}`);
        
//         // Calculate midnight in the target timezone
//         const midnightInTimezone = new Date(now);
//         midnightInTimezone.setUTCHours(24 - timezoneOffset, 0, 0, 0);
//         console.log(`Midnight in timezone ${timezoneOffset}: ${midnightInTimezone.toISOString()}`);
        
//         // Get all users in this timezone
//         console.log('Fetching users from database...');
//         const users = await prisma.users.findMany({
//             where: {
//                 timezone_offset: timezoneOffset,
//                 is_active: true
//             },
//             select: {
//                 id: true
//             }
//         });

//         console.log(`Found ${users.length} users in timezone offset ${timezoneOffset}`);
        
//         if (users.length > 0) {
//             console.log('Sample user IDs:', users.slice(0, 3).map(u => u.id));
//         }

//         // Get available special missions
//         console.log('Fetching available special missions...');
//         const availableMissions = await prisma.special_missions.findMany({
//             where: {
//                 is_active: true
//             }
//         });

//         console.log(`Found ${availableMissions.length} available special missions`);
        
//         if (availableMissions.length > 0) {
//             console.log('Sample mission IDs:', availableMissions.slice(0, 3).map(m => m.id));
//         }

//         // Simulate processing (without actual database writes for testing)
//         console.log('Simulating mission processing...');
//         for (const user of users.slice(0, 2)) { // Only process first 2 users for testing
//             console.log(`Processing user ${user.id}...`);
            
//             // Simulate random mission selection
//             const numberOfMissions = Math.min(3, availableMissions.length);
//             const shuffled = [...availableMissions].sort(() => 0.5 - Math.random());
//             const selectedMissions = shuffled.slice(0, numberOfMissions);
            
//             console.log(`Would assign ${selectedMissions.length} missions to user ${user.id}`);
            
//             for (const mission of selectedMissions) {
//                 const randomHour = Math.floor(Math.random() * (22 - 10 + 1)) + 10;
//                 const availableAt = new Date(midnightInTimezone);
//                 availableAt.setUTCHours(randomHour - timezoneOffset, 0, 0, 0);
                
//                 console.log(`Would create mission ${mission.id} for user ${user.id} at ${availableAt.toISOString()}`);
//             }
//         }

//         console.log('=== FUNCTION COMPLETED SUCCESSFULLY ===');
        
//         return {
//             success: true,
//             message: `Successfully tested reset special missions for timezone offset ${timezoneOffset}`,
//             usersProcessed: users.length,
//             missionsAvailable: availableMissions.length
//         };
        
//     } catch (error) {
//         console.error(`Error in resetSpecialMissionsForTimezone:`, error);
//         throw error;
//     } finally {
//         await prisma.$disconnect();
//         console.log('Database connection closed');
//     }
// }

// Main function that will be called by the serverless platform
async function main(args) {
    console.log('=== MAIN FUNCTION STARTED ===');
    console.log('Arguments received:', args);
    
    try {
        // Get timezone offset from args or use default
        const timezoneOffset = parseInt(args.timezoneOffset) || 0;
        console.log(`Using timezone offset: ${timezoneOffset}`);
        
        const result = await resetSpecialMissionsForTimezone(timezoneOffset);
        
        console.log('=== MAIN FUNCTION COMPLETED ===');
        return {
            statusCode: 200,
            body: result
        };
    } catch (error) {
        console.error('Error in main function:', error);
        return {
            statusCode: 500,
            body: {
                error: 'Failed to reset special missions',
                details: error.message
            }
        };
    }
}

module.exports = { main, resetSpecialMissionsForTimezone };
