const prisma = require('../utils/prisma.utils');

async function deactivateInactiveUsers() {
    console.log('Starting job to deactivate inactive users...');

    try {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        console.log(`Deactivating users with last login before: ${threeMonthsAgo.toISOString()}`);

        const inactiveUsers = await prisma.users.findMany({
            where: {
                is_active: true,
                last_login: {
                    lt: threeMonthsAgo,
                },
            },
        });

        if (inactiveUsers.length === 0) {
            console.log('No inactive users found for deactivation.');
            return;
        }

        const userIdsToDeactivate = inactiveUsers.map(user => user.id);

        const updateResult = await prisma.users.updateMany({
            where: {
                id: {
                    in: userIdsToDeactivate,
                },
            },
            data: {
                is_active: false,
            },
        });

        console.log(`Successfully deactivated ${updateResult.count} users.`);

    } catch (error) {
        console.error('Error during inactive user deactivation job:', error);
    }
}

module.exports = { deactivateInactiveUsers }; 