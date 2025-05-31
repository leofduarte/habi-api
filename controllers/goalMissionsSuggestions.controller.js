const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');

class GoalMissionsSuggestionsController {
  static async getSuggestionsByUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json(jsend.fail({ error: 'User ID is required' }));
      }

      const suggestions = await prisma.goal_missions_suggestions.findMany({
        where: { fk_id_user: parseInt(userId) },
        orderBy: { id: 'desc' }, // Fetch the latest suggestions first
      });

      if (!suggestions || suggestions.length === 0) {
        return res.status(404).json(jsend.fail({ error: 'No suggestions found for this user' }));
      }

      return res.status(200).json(jsend.success({ suggestions }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  }
}

module.exports = GoalMissionsSuggestionsController;