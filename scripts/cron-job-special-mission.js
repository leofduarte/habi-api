const prisma = require("../utils/prisma.utils.js");


async function main(event, context) {
  try {
    console.log('🚀 Starting special missions reset job at:', new Date().toISOString());
    console.log('📊 Environment:', process.env.NODE_ENV);
    console.log('🔗 Database URL configured:', !!process.env.DATABASE_URL);

    const now = new Date();
    const currentUTCHour = now.getUTCHours();
    const currentUTCMinute = now.getUTCMinutes();

    console.log(`⏰ Current UTC time: ${currentUTCHour}:${currentUTCMinute.toString().padStart(2, '0')}`);

    console.log('🕒 Checking for missions outside 10AM-10PM window...');
    await expireOutOfWindowMissions();
    
    const usersToReset = await findUsersAtMidnight(currentUTCHour, currentUTCMinute);

    console.log(`👥 Found ${usersToReset.length} users to reset special missions for`);

    if (usersToReset.length === 0) {
      console.log('ℹ️  No users found at midnight in their timezone right now');
      return {
        statusCode: 200,
        body: {
          message: 'No users to reset at this time',
          timestamp: now.toISOString()
        }
      };
    }

    let resetCount = 0;

    for (const user of usersToReset) {
      try {
        await resetUserSpecialMissions(user);
        resetCount++;
        console.log(`✅ Reset special missions for user ${user.id} (timezone offset: ${user.timezone_offset})`);
      } catch (error) {
        console.error(`❌ Failed to reset special missions for user ${user.id}:`, error.message);
      }
    }

    console.log(`🎉 Successfully reset special missions for ${resetCount}/${usersToReset.length} users`);

    return {
      statusCode: 200,
      body: {
        message: `Special missions reset completed for ${resetCount} users`,
        timestamp: now.toISOString(),
        totalUsers: usersToReset.length,
        successfulResets: resetCount
      }
    };

  } catch (error) {
    console.error('💥 Error in special missions reset job:', error);
    console.error('Stack trace:', error.stack);
    return {
      statusCode: 500,
      body: {
        error: 'Failed to reset special missions',
        details: error.message
      }
    };
  } finally {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
  }
}

async function findUsersAtMidnight(currentUTCHour, currentUTCMinute) {
  const targetTimezones = [];

  for (let offset = -12; offset <= 14; offset++) {
    const localHour = (currentUTCHour + offset + 24) % 24;

    if (localHour === 0 && currentUTCMinute >= 0 && currentUTCMinute < 15) {
      targetTimezones.push(offset);
    }
  }

  console.log(`🌍 Looking for users in timezone offsets: [${targetTimezones.join(', ')}]`);

  if (targetTimezones.length === 0) {
    console.log('ℹ️  No timezone offsets result in midnight at this UTC time');
    return [];
  }

  try {
    const users = await prisma.users.findMany({
      where: {
        timezone_offset: {
          in: targetTimezones
        }
      },
      select: {
        id: true,
        timezone_offset: true,
        first_name: true,
      }
    });

    console.log(`📋 Database query found ${users.length} users with matching timezone offsets`);
    return users;
  } catch (error) {
    console.error('💥 Database error in findUsersAtMidnight:', error);
    throw error;
  }
}

async function resetUserSpecialMissions(user) {
  console.log(`🔄 Processing special missions reset for user ${user.id} (${user.first_name || 'Unknown'})`);

  try {
    const incompleteMissions = await prisma.user_special_missions.updateMany({
      where: {
        fk_id_user: user.id,
        completed_at: null,
        expired_at: null,
        available_at: { lte: new Date() }
      },
      data: { expired_at: new Date() }
    });

    console.log(`📝 Found ${incompleteMissions.length} incomplete missions for user ${user.id}`);

    if (incompleteMissions.length > 0) {
      await prisma.user_special_missions.updateMany({
        where: {
          id: {
            in: incompleteMissions.map(mission => mission.id)
          }
        },
        data: {
          expired_at: new Date()
        }
      });

      console.log(`⏰ Marked ${incompleteMissions.length} incomplete missions as expired for user ${user.id}`);
    }

    await assignDailySpecialMissions(user.id);
  } catch (error) {
    console.error(`💥 Error in resetUserSpecialMissions for user ${user.id}:`, error);
    throw error;
  }
}

async function assignDailySpecialMissions(userId) {
  console.log(`🎯 Assigning daily special missions to user ${userId}`);

  try {
    const availableMissions = await prisma.special_missions.findMany();

    if (availableMissions.length === 0) {
      console.log(`⚠️  No special missions available to assign to user ${userId}`);
      return;
    }

    const numberOfMissions = Math.min(3, availableMissions.length);
    const shuffled = [...availableMissions].sort(() => 0.5 - Math.random());
    const selectedMissions = shuffled.slice(0, numberOfMissions);

    const currentTime = new Date();
    let assignedCount = 0;

    for (const mission of selectedMissions) {
      try {
        await prisma.user_special_missions.create({
          data: {
            fk_id_user: userId,
            fk_id_special_mission: mission.id,
            available_at: currentTime,
          }
        });
        assignedCount++;
      } catch (error) {
        console.error(`❌ Failed to assign mission ${mission.id} to user ${userId}:`, error.message);
      }
    }

    console.log(`✅ Assigned ${assignedCount}/${selectedMissions.length} special missions to user ${userId}`);
  } catch (error) {
    console.error(`💥 Error in assignDailySpecialMissions for user ${userId}:`, error);
    throw error;
  }
}

async function expireOutOfWindowMissions() {
  const now = new Date();
  const users = await prisma.users.findMany({
    select: { id: true, timezone_offset: true }
  });

  for (const user of users) {
    // Calculate user's local time
    const userLocalTime = new Date(now.getTime() + (user.timezone_offset * 60 * 60 * 1000));
    const userHour = userLocalTime.getHours();

    // If outside 10AM-10PM window (22:00-10:00)
    if (userHour >= 22 || userHour < 10) {
      await prisma.user_special_missions.updateMany({
        where: {
          fk_id_user: user.id,
          completed_at: null,
          expired_at: null,
          available_at: { lte: now }
        },
        data: { expired_at: now }
      });
    }
  }
}


// Run the function if this script is executed directly
if (require.main === module) {
  main()
    .then((result) => {
      console.log('🎉 Special missions reset completed successfully');
      console.log('📊 Result:', JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Special missions reset failed:', error);
      process.exit(1);
    });
}

module.exports = { main };