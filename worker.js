const cron = require('node-cron');
const count = require('./habi-api-cronjob/packages/sample/count/count.js');

cron.schedule('*/2 * * * *', async () => {
    console.log('Running in:', __dirname);
    console.log('Running scheduled task...');
    const result = await count.main();
    console.log(result);
});

console.log('Worker started. Waiting for scheduled tasks...');
