const bcrypt = require('bcrypt')
const prisma = require('../utils/prisma.utils.js')
const jsend = require('jsend')
const { filterSensitiveUserData } = require('../utils/user.utils.js')
const loggerWinston = require('../utils/loggerWinston.utils')

class UserController {
  //! for testing
  static async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id, 10)

      if (isNaN(userId)) {
        return res
          .status(400)
          .json(jsend.fail({ error: 'Invalid user ID format' }))
      }

      const user = await prisma.users.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return res.status(404).json(jsend.fail({ error: 'User not found' }))
      }

      const safeUserData = filterSensitiveUserData(user)
      res.status(200).json(jsend.success(safeUserData))
    } catch (error) {
      res.status(500).json(jsend.error({ error: error.message }))
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const { email } = req.query
      if (!email) {
        return res.status(400).json(jsend.fail({ error: 'Email is required' }))
      }

      const user = await prisma.users.findUnique({
        where: { email }
      })

      if (!user) {
        return res.status(404).json(jsend.fail({ error: 'User not found' }))
      }

      const safeUserData = filterSensitiveUserData(user)
      res.status(200).json(jsend.success(safeUserData))
    } catch (error) {
      res.status(500).json(jsend.error({ error: error.message }))
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id)
      const {
        email,
        password,
        firstName,
        lastName,
        timezone_offset,
        timezone_name,
        sponsor_special_mission
      } = req.body

      if (
        !email &&
        !password &&
        !firstName &&
        !lastName &&
        timezone_offset === undefined &&
        !timezone_name &&
        sponsor_special_mission === undefined
      ) {
        return res
          .status(400)
          .json(
            jsend.fail({ error: 'At least one field to update is required' })
          )
      }

      const existingUser = await prisma.users.findUnique({
        where: { id: userId }
      })

      if (!existingUser) {
        return res.status(404).json(jsend.fail({ error: 'User not found' }))
      }

      const updateData = {}
      if (email) updateData.email = email
      if (firstName) updateData.first_name = firstName
      if (lastName) updateData.last_name = lastName
      if (timezone_offset !== undefined)
        updateData.timezone_offset = timezone_offset
      if (timezone_name) updateData.timezone_name = timezone_name
      if (sponsor_special_mission !== undefined)
        updateData.sponsor_special_mission = sponsor_special_mission

      if (password) {
        const saltRounds = 10
        updateData.password = await bcrypt.hash(password, saltRounds)
      }

      const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: updateData
      })

      const safeUserData = filterSensitiveUserData(updatedUser)
      loggerWinston.info('User updated', { userId, user: JSON.stringify(updatedUser) })
      res.status(200).json(jsend.success(safeUserData))
    } catch (error) {
      loggerWinston.error('Error updating user', { error: error.message, stack: error.stack, userId: req.params.id })
      res.status(500).json(jsend.error({ error: error.message }))
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id)

      await prisma.users.delete({
        where: { id: userId }
      })

      loggerWinston.info('User deleted', { userId: req.params.id })
      res
        .status(200)
        .json(jsend.success({ message: 'User deleted successfully' }))
    } catch (error) {
      loggerWinston.error('Error deleting user', { error: error.message, stack: error.stack, userId: req.params.id })
      res.status(500).json(
        jsend.error({
          message: 'Failed to delete user.',
          error: error.message
        })
      )
    }
  }

  //! static async changePassword(req, res) {
  //   try {
  //     const userId = parseInt(req.params.id);
  //     const { currentPassword, newPassword } = req.body;

  //     if (!currentPassword || !newPassword) {
  //       return res.status(400).json(jsend.fail({ error: 'Current password and new password are required' }));
  //     }

  //     const user = await prisma.users.findUnique({
  //       where: { id: userId },
  //     });

  //     if (!user) {
  //       return res.status(404).json(jsend.fail({ error: 'User not found' }));
  //     }

  //     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  //     if (!isPasswordValid) {
  //       return res.status(401).json(jsend.fail({ error: 'Current password is incorrect' }));
  //     }

  //     const saltRounds = 10;
  //     const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  //     await prisma.users.update({
  //       where: { id: userId },
  //       data: { password: hashedNewPassword },
  //     });

  //     res.status(200).json(jsend.success({ message: 'Password updated successfully' }));
  //   } catch (error) {
  //     res.status(500).json(jsend.error({ error: error.message }));
  //   }
  //! }

  static async getRestDays(req, res) {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json(jsend.fail({ error: 'Invalid user ID format' }));
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json(jsend.fail({ error: 'User not found' }));
        }

        const restDays = await prisma.rest_days.findMany({
            where: { fk_id_user: userId },
            include: { days_week: true },
        });

        const restDayNames = restDays.map((rd) => rd.days_week.day_name);

        res.status(200).json(jsend.success({ restDays: restDayNames }));
    } catch (error) {
        res.status(500).json(jsend.error({ error: error.message }));
    }
  }

  static async updateRestDays(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const { restDays } = req.body;

        if (!Array.isArray(restDays)) {
            return res.status(400).json(jsend.fail({ error: "Rest days must be an array" }));
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json(jsend.fail({ error: 'User not found' }));
        }

        const dayNames = restDays.map(d => d.toUpperCase());

        const days = await prisma.days_week.findMany({
            where: {
                day_name: {
                    in: dayNames,
                },
            },
        });

        if (days.length !== restDays.length) {
            return res.status(400).json(jsend.fail({ error: "Invalid rest days provided" }));
        }

        const restDaysData = days.map((day) => ({
            fk_id_user: userId,
            fk_days_week: day.id,
        }));

        await prisma.$transaction([
            prisma.rest_days.deleteMany({
                where: { fk_id_user: userId },
            }),
            prisma.rest_days.createMany({
                data: restDaysData,
            }),
        ]);
        
        const updatedRestDays = await prisma.rest_days.findMany({
            where: { fk_id_user: userId },
            include: { days_week: true }
        });

        const responseRestDays = updatedRestDays.map(rd => rd.days_week.day_name)

        res.status(200).json(jsend.success({ restDays: responseRestDays, message: "Rest days updated successfully" }));
    } catch (error) {
        console.error("Error updating rest days:", error);
        res.status(500).json(jsend.error("Failed to update rest days"));
    }
  }
}
module.exports = UserController
