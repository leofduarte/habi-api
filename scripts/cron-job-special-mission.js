const prisma = require("../utils/prisma.utils.js");

async function main(event, context) {
  try {
    console.log('Starting special missions reset job at:', new Date().toISOString());
    
    const now = new Date();
    const currentUTCHour = now.getUTCHours();
    const currentUTCMinute = now.getUTCMinutes();
    
    const usersToReset = await findUsersAtMidnight(currentUTCHour, currentUTCMinute);
    
    console.log(`Found ${usersToReset.length} users to reset special missions for`);
    
    let resetCount = 0;
    
    for (const user of usersToReset) {
      try {
        await resetUserSpecialMissions(user);
        resetCount++;
        console.log(`Reset special missions for user ${user.id} in timezone offset ${user.timezone_offset}`);
      } catch (error) {
        console.error(`Failed to reset special missions for user ${user.id}:`, error);
      }
    }
    
    console.log(`Successfully reset special missions for ${resetCount} users`);
    
    return {
      statusCode: 200,
      body: {
        message: `Special missions reset completed for ${resetCount} users`,
        timestamp: now.toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error in special missions reset job:', error);
    return {
      statusCode: 500,
      body: {
        error: 'Failed to reset special missions',
        details: error.message
      }
    };
  } finally {
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
  
  console.log(`Looking for users in timezone offsets: ${targetTimezones.join(', ')}`);
  
  const users = await prisma.users.findMany({
    where: {
      timezone_offset: {
        in: targetTimezones
      },
      is_active: true,
    },
    select: {
      id: true,
      timezone_offset: true,
      email: true,
    }
  });
  
  return users;
}

async function resetUserSpecialMissions(user) {
  console.log(`Processing special missions reset for user ${user.id}`);
  
  const incompleteMissions = await prisma.user_special_missions.findMany({
    where: {
      fk_id_user: user.id,
      completed_at: null,
      expired_at: null,
      available_at: {
        lte: new Date()
      }
    },
    include: {
      special_missions: true
    }
  });
  
  if (incompleteMissions.length === 0) {
    console.log(`No incomplete special missions to reset for user ${user.id}`);
  } else {
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
    
    console.log(`Marked ${incompleteMissions.length} incomplete missions as expired for user ${user.id}`);
  }
  
  await assignDailySpecialMissions(user.id);
}

async function assignDailySpecialMissions(userId) {
  console.log(`Assigning daily special missions to user ${userId}`);
  
  const availableMissions = await prisma.special_missions.findMany({
    // logica específica para filtrar missoes disponíveis
  });
  
  if (availableMissions.length === 0) {
    console.log(`No special missions available to assign to user ${userId}`);
    return;
  }
  
  const numberOfMissions = Math.min(3, availableMissions.length);
  const shuffled = [...availableMissions].sort(() => 0.5 - Math.random());
  const selectedMissions = shuffled.slice(0, numberOfMissions);
  
  const currentTime = new Date();
  
  for (const mission of selectedMissions) {
    try {
      await prisma.user_special_missions.create({
        data: {
          fk_id_user: userId,
          fk_id_special_mission: mission.id,
          available_at: currentTime,
        }
      });
    } catch (error) {
      console.error(`Failed to assign mission ${mission.id} to user ${userId}:`, error);
    }
  }
  
  console.log(`Assigned ${selectedMissions.length} special missions to user ${userId}`);
}

// Run the function if this script is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('Special missions reset completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Special missions reset failed:', error);
      process.exit(1);
    });
}

module.exports = { main };