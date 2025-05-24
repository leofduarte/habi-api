const prisma = require("../utils/prisma.utils.js");

async function populateTimezones() {
  try {
    const result = await prisma.users.updateMany({
      where: {
        timezone_offset: null
      },
      data: {
        timezone_offset: 0,
        timezone_name: 'UTC'
      }
    });

    console.log(`Updated ${result.count} users`);
  } catch (error) {
    console.error('Error populating timezones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateTimezones();