const prisma = require("../utils/prisma.utils.js");

async function testSpecialMissionAssignment() {
    try {
        console.log('🧪 Starting Special Mission Assignment Test');

        const userId = 53; // Your test user

        // 1. Check if user exists and has timezone set
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                timezone_offset: true,
                timezone_name: true
            }
        });

        if (!user) {
            throw new Error(`User ${userId} not found`);
        }

        console.log('👤 User found:', user);

        // 2. Check available special missions
        const availableMissions = await prisma.special_missions.findMany();
        console.log(`📋 Available special missions: ${availableMissions.length}`);

        if (availableMissions.length === 0) {
            throw new Error('No special missions available to assign');
        }

        // 3. Generate random time between 10 AM and 10 PM (like frontend does)
        const getRandomSpecialMissionTime = () => {
            const randomHour = Math.floor(Math.random() * (22 - 10 + 1)) + 10; // Between 10 and 22
            const specialMissionTime = new Date();
            specialMissionTime.setHours(randomHour, 0, 0, 0);
            return specialMissionTime;
        };

        // 4. Assign 3 random special missions with random times
        const numberOfMissions = Math.min(3, availableMissions.length);
        const shuffled = [...availableMissions].sort(() => 0.5 - Math.random());
        const selectedMissions = shuffled.slice(0, numberOfMissions);

        console.log(`🎯 Assigning ${numberOfMissions} special missions to user ${userId}`);

        const assignments = [];

        for (const mission of selectedMissions) {
            const randomTime = getRandomSpecialMissionTime();

            const assignment = await prisma.user_special_missions.create({
                data: {
                    fk_id_user: userId,
                    fk_id_special_mission: mission.id,
                    available_at: randomTime,
                }
            });

            assignments.push({
                ...assignment,
                mission_name: mission.name,
                available_hour: randomTime.getHours()
            });

            console.log(`✅ Assigned "${mission.name}" available at ${randomTime.getHours()}:00`);
        }

        // 5. Verify assignments were created
        const userMissions = await prisma.user_special_missions.findMany({
            where: { fk_id_user: userId },
            include: {
                special_missions: true
            },
            orderBy: {
                available_at: 'desc'
            }
        });

        console.log('\n📊 User Special Missions Summary:');
        userMissions.forEach(mission => {
            const status = mission.completed_at ? 'COMPLETED' :
                mission.expired_at ? 'EXPIRED' :
                    new Date() >= mission.available_at ? 'AVAILABLE' : 'PENDING';

            console.log(`- ${mission.special_missions.name}: ${status} (Available at: ${mission.available_at.toLocaleString()})`);
        });

        return assignments;

    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test
if (require.main === module) {
    testSpecialMissionAssignment()
        .then((assignments) => {
            console.log('\n🎉 Test completed successfully!');
            console.log('📋 New assignments:', assignments.length);
        })
        .catch((error) => {
            console.error('💥 Test failed:', error);
            process.exit(1);
        });
}

module.exports = { testSpecialMissionAssignment };