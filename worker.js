const cron = require('node-cron');
const { assignSpecialMissionToAllUsers } = require('./scripts/assign-special-mission');
const { deactivateInactiveUsers } = require('./scripts/deactivate-inactive-users');

cron.schedule('*/2 * * * *', async () => {
    console.log('Running special mission assignment job...');
    try {

        await assignSpecialMissionToAllUsers();
        console.log('Special mission assignment job completed successfully');
    } catch (error) {
        console.error('Error in special mission assignment job:', error);
    }
});

cron.schedule('0 0 1 */3 *', async () => {
    console.log('Running job to deactivate inactive users...');
    try {
        await deactivateInactiveUsers();
        console.log('Deactivation job completed successfully.');
    } catch (error) {
        console.error('Error in deactivation job:', error);
    }
});

console.log('Worker started. Waiting for scheduled tasks...');