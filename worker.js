const cron = require('node-cron');
const count = require('./habi-api-cronjob/packages/sample/count/count.js');
const specialMissionJob = require('./scripts/cron-job-special-mission.js');


cron.schedule('*/2 * * * *', async () => {
    console.log('Running in:', __dirname);
    console.log('Running scheduled task...');
    const result = await count.main();
    console.log(result);
});

cron.schedule('0 0 * * *', async () => {
    console.log('Running special mission job...');
    try {
        const result = await specialMissionJob.main();
        console.log('Special mission job completed successfully:', result);
    } catch (error) {
        console.error('Error in special mission job:', error);
    }
}
);

console.log('Worker started. Waiting for scheduled tasks...');
