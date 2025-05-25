const cron = require('node-cron');
const count = require('./packages/sample/count/count.js');

cron.schedule('*/2 * * * *', async () => {
  console.log('Running scheduled task...');
  const result = await count.main();
  console.log(result);
});

console.log('Worker started. Waiting for scheduled tasks...');
