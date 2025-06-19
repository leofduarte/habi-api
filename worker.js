// const cron = require('node-cron');
// const { main: resetSpecialMissions } = require('./scripts/cron-job-special-mission');

// // Schedule the special mission reset to run every hour
// // This ensures we catch midnight for all timezones
// cron.schedule('0 * * * *', async () => {
//     console.log('Running special mission reset job...');
//     try {
//         await resetSpecialMissions();
//         console.log('Special mission reset job completed successfully');
//     } catch (error) {
//         console.error('Error in special mission reset job:', error);
//     }
// });

// console.log('Worker started. Waiting for scheduled tasks...');
