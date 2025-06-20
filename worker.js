const cron = require('node-cron');
const { assignSpecialMissionToAllUsers } = require('./scripts/assign-special-mission');

cron.schedule('*/2 * * * *', async () => {
    console.log('Running special mission assignment job...');
    try {

        await assignSpecialMissionToAllUsers();
        console.log('Special mission assignment job completed successfully');
    } catch (error) {
        console.error('Error in special mission assignment job:', error);
    }
});

console.log('Worker started. Waiting for scheduled tasks...');