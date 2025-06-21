const prisma = require('../utils/prisma.utils.js')
const jsend = require('jsend')

class SpecialMissionController {
  static async getAllSpecialMissions(req, res) {
    try {
      const specialMissions = await prisma.special_missions.findMany()
      res.status(200).json(jsend.success(specialMissions))
    } catch (error) {
      console.error('Error fetching special missions:', error)
      res.status(500).json(jsend.error('Failed to fetch special missions'))
    }
  }

  static async getUserSpecialMissions(req, res) {
    try {
      const { userId } = req.params
      console.log(
        '🎯 [SpecialMission] Buscando missões especiais para usuário:',
        userId
      )

      if (!userId) {
        return res
          .status(400)
          .json(jsend.fail({ error: 'User ID is required' }))
      }

      const userMissions = await prisma.user_special_missions.findMany({
        where: { fk_id_user: parseInt(userId) },
        include: {
          special_missions: true
        }
      })

      console.log(
        '📋 [SpecialMission] Missões encontradas:',
        userMissions.length
      )

      if (userMissions.length === 0) {
        console.log(
          '❌ [SpecialMission] Nenhuma missão encontrada para o usuário'
        )
        return res
          .status(404)
          .json(jsend.fail({ error: 'No special missions found for the user' }))
      }

      console.log('✅ [SpecialMission] Retornando missões:', userMissions)
      res.status(200).json(jsend.success(userMissions))
    } catch (error) {
      console.error(
        '💥 [SpecialMission] Erro ao buscar missões especiais:',
        error
      )
      res.status(500).json(jsend.error('Failed to fetch user special missions'))
    }
  }

  static async assignSpecialMission(req, res) {
    try {
      const { userId, missionId, availableAt } = req.body

      if (!userId || !missionId) {
        return res
          .status(400)
          .json(jsend.fail({ error: 'User ID and mission ID are required' }))
      }

      const mission = await prisma.special_missions.findUnique({
        where: { id: parseInt(missionId) }
      })

      if (!mission) {
        return res
          .status(404)
          .json(jsend.fail({ error: 'Special mission not found' }))
      }

      const assignment = await prisma.user_special_missions.create({
        data: {
          fk_id_user: parseInt(userId),
          fk_id_special_mission: parseInt(missionId),
          available_at: availableAt ? new Date(availableAt) : new Date()
        }
      })

      res.status(201).json(jsend.success(assignment))
    } catch (error) {
      console.error('Error assigning special mission:', error)
      res.status(500).json(jsend.error('Failed to assign special mission'))
    }
  }

  static async completeSpecialMission(req, res) {
    try {
      const { userMissionId } = req.params

      if (!userMissionId) {
        return res
          .status(400)
          .json(jsend.fail({ error: 'User mission ID is required' }))
      }

      const userMission = await prisma.user_special_missions.findUnique({
        where: { id: parseInt(userMissionId) }
      })

      if (!userMission) {
        return res
          .status(404)
          .json(jsend.fail({ error: 'User special mission not found' }))
      }

      const updatedMission = await prisma.user_special_missions.update({
        where: { id: parseInt(userMissionId) },
        data: { completed_at: new Date() }
      })

      res.status(200).json(jsend.success(updatedMission))
    } catch (error) {
      console.error('Error completing special mission:', error)
      res.status(500).json(jsend.error('Failed to complete special mission'))
    }
  }

  static async createSpecialMission(req, res) {
    try {
      const { name, steps, link, isPartnership } = req.body

      if (!name || !steps) {
        return res
          .status(400)
          .json(jsend.fail({ error: 'Name and steps are required' }))
      }

      const mission = await prisma.special_missions.create({
        data: {
          name,
          steps: JSON.stringify(steps),
          link,
          is_partnership: isPartnership
        }
      })

      res.status(201).json(jsend.success(mission))
    } catch (error) {
      console.error('Error creating special mission:', error)
      res.status(500).json(jsend.error('Failed to create special mission'))
    }
  }

  static async resetUserSpecialMissions(req, res) {
    try {
      const { userId } = req.params

      if (!userId) {
        return res
          .status(400)
          .json(jsend.fail({ error: 'User ID is required' }))
      }

      // Mark incomplete missions as expired
      const expiredMissions = await prisma.user_special_missions.updateMany({
        where: {
          fk_id_user: parseInt(userId),
          completed_at: null,
          expired_at: null,
          available_at: {
            lte: new Date()
          }
        },
        data: {
          expired_at: new Date()
        }
      })

      // Assign new missions
      const availableMissions = await prisma.special_missions.findMany()
      const numberOfMissions = Math.min(3, availableMissions.length)
      const shuffled = [...availableMissions].sort(() => 0.5 - Math.random())
      const selectedMissions = shuffled.slice(0, numberOfMissions)

      const newAssignments = []
      for (const mission of selectedMissions) {
        const assignment = await prisma.user_special_missions.create({
          data: {
            fk_id_user: parseInt(userId),
            fk_id_special_mission: mission.id,
            available_at: new Date()
          }
        })
        newAssignments.push(assignment)
      }

      res.status(200).json(
        jsend.success({
          expiredCount: expiredMissions.count,
          newMissions: newAssignments
        })
      )
    } catch (error) {
      console.error('Error resetting user special missions:', error)
      res.status(500).json(jsend.error('Failed to reset user special missions'))
    }
  }
}

module.exports = SpecialMissionController
