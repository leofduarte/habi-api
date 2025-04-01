const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MissionModel {
  static async getAllMissionsByGoalId(goalId) {
    try {
      return await prisma.missions.findMany({
        where: { fk_id_goal: goalId },
        include: {
          mission_days: {
            include: {
              days_week: true,
            },
          },
          mission_completions: true,
        },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async getMissionById(missionId) {
    try {
      return await prisma.missions.findUnique({
        where: { id: missionId },
        include: {
          mission_days: {
            include: {
              days_week: true,
            },
          },
          mission_completions: true,
        },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async createMission(missionData) {
    try {
      const { title, description, emoji, status, fk_id_goal, days } = missionData;
      
      const mission = await prisma.missions.create({
        data: {
          title,
          description,
          emoji,
          status,
          streaks: 0,
          fk_id_goal,
        },
      });

      if (days && days.length > 0) {
        for (const dayId of days) {
          await prisma.mission_days.create({
            data: {
              fk_id_mission: mission.id,
              fk_days_week_id: dayId,
            },
          });
        }
      }

      return mission;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async updateMission(missionId, missionData) {
    try {
      const { title, description, emoji, status, days } = missionData;
      
      const mission = await prisma.missions.update({
        where: { id: missionId },
        data: {
          title,
          description,
          emoji,
          status,
        },
      });

      if (days && days.length > 0) {
        // Delete existing mission_days
        await prisma.mission_days.deleteMany({
          where: { fk_id_mission: missionId },
        });

        for (const dayId of days) {
          await prisma.mission_days.create({
            data: {
              fk_id_mission: missionId,
              fk_days_week_id: dayId,
            },
          });
        }
      }

      return mission;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async deleteMission(missionId) {
    try {
      // delete mission_days records
      await prisma.mission_days.deleteMany({
        where: { fk_id_mission: missionId },
      });

      // delete mission_completions records
      await prisma.mission_completions.deleteMany({
        where: { fk_id_mission: missionId },
      });

      // delete the mission
      return await prisma.missions.delete({
        where: { id: missionId },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

module.exports = MissionModel;