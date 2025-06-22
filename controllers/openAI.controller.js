const openAIService = require('../services/openAI.service.js')
const prisma = require('../utils/prisma.utils.js')
const jsend = require('jsend')
const loggerWinston = require('../utils/loggerWinston.utils.js')

class OpenAIController {
  //! GERAR OBJETIVOS PERSONALIZADOS

  static async generatePersonalizedGoalSuggestions(req, res) {
    try {
      const { userId, pairs } = req.body

      //! VALIDAÇÕES INICIAIS
      if (!userId || !pairs) {
        return res.status(400).json(
          jsend.fail({
            error: 'User ID and questionnaire pairs are required'
          })
        )

      }

      const user = await prisma.users.findUnique({
        where: { id: parseInt(userId) }
      })
      if (!user) {
        return res.status(404).json(jsend.fail({ error: 'User not found' }))
      }

      const prompt = `
You are a productivity and habit-building expert with a deep understanding of human behavior and motivation. Your task is to analyze the user's responses to a self-improvement questionnaire and generate a personalized set of goals and missions. Each goal should reflect a combination of the user's ideas, emotions, and intentions, providing a holistic approach to their self-improvement journey.

**Guidelines for Goals:**
1. Generate exactly 4 goals that are concise, specific, and meaningful.
2. Each goal should be no longer than 4 words or 25 characters.
3. Ensure the goals address key themes from the user's responses, such as emotional needs, personal struggles, or aspirations.
4. Avoid generic or vague goals like "be happier" or "improve health." Instead, focus on actionable and personalized outcomes.

**Guidelines for Missions:**
1. For each goal, generate 4 to 6 missions that are concrete, repeatable actions the user can perform independently.
2. Missions should be highly specific, clear, and short (no more than 5 words).
3. Avoid vague suggestions like "practice mindfulness" or "engage in self-care." Instead, provide actionable steps such as "write one gratitude note" or "stretch after waking up for 30 seconds."
4. Do not include missions that require external dependencies (e.g., "join a club" or "attend events").

**REMEMBER:**
- Each goal must be actionable and achievable.
- Missions should be practical and easy to implement in daily life.
- Use positive, encouraging language to motivate the user.
- Focus on both practical and emotional aspects of the user's life.
- Ensure the goals and missions are balanced, addressing both immediate actions and long-term aspirations.

**Additional Requirements:**
1. Analyze the user's responses holistically. Merge ideas and emotions into unified goals that reflect their overall situation.
2. Assign a "match" value (from 0 to 1) to each goal, representing how well it aligns with the user's needs and context.
3. Ensure the set of goals and missions is balanced, addressing both practical and emotional aspects of the user's life.

**Output Format:**
Return a valid JSON object using this exact structure:
{
  "goals": [
    {
      "id": "goal-1",
      "match": 0.92,
      "goal": "Clearly written goal",
      "missions": [
        "First actionable mission",
        "Second actionable mission",
        "Third actionable mission",
        "Optional fourth mission"
      ]
    },
    ...
  ]
}

**User's Questionnaire Responses:**
${pairs
          .map((p, i) => `Q${i + 1}: ${p.question}\nA${i + 1}: ${p.answer}`)
          .join('\n\n')}
`
      //! CHAMADA AO OPENAI
      const suggestions = await openAIService.generateCompletion(prompt, {
        model: 'gpt-3.5-turbo',
        maxTokens: 600,
        temperature: 0.7
      })

      const parsedSuggestions = JSON.parse(suggestions)

      loggerWinston.info('Generated suggestions', { suggestions: JSON.stringify(parsedSuggestions) })


      //! SALVAR SUGESTÕES NO BANCO DE DADOS
      const savedSuggestions = await prisma.goal_missions_suggestions.create({
        data: {
          fk_id_user: parseInt(userId),
          suggestions: parsedSuggestions,
        },
      });

      loggerWinston.info('Suggestions saved to database', { suggestions: JSON.stringify(savedSuggestions) })


      //! RETORNO
      return res.status(200).json(jsend.success({ suggestions }))
    } catch (error) {
      console.error('OpenAI suggest-goals error:', error)
      return res.status(500).json(jsend.error({ message: error.message }))
    }
  }


  //! nao esta a ser usado
  //   static async generateMissionSuggestions(req, res) {
  //     try {
  //       const { userId, goal } = req.body;

  //       if (!userId || !goal) {
  //         return res.status(400).json(
  //           jsend.fail({
  //             error: 'User ID and goal are required',
  //           })
  //         );
  //       }

  //       // Optionally, fetch user data for context
  //       const user = await prisma.users.findUnique({
  //         where: { id: parseInt(userId) },
  //       });
  //       if (!user) {
  //         return res.status(404).json(jsend.fail({ error: 'User not found' }));
  //       }

  //       const prompt = `
  // You are a productivity and habit-building expert. The user has chosen the following goal: "${goal}".

  // Your task is to generate a list of 5 specific, actionable, and motivating missions that the user can do to make real progress toward this goal. Each mission should be a clear, concrete action that the user can start immediately, and should be written as a direct instruction (e.g., "Write down three things you're grateful for today", "Go for a 10-minute walk after lunch", "Organize your workspace for 5 minutes").

  // **Guidelines:**
  // - Missions must be simple, practical, and easy to understand.
  // - Each mission should help the user take a real step toward their goal.
  // - Avoid vague or generic suggestions.
  // - Use positive, encouraging language.

  // **Output Format:**
  // Return a valid JSON object:
  // {
  //   "missions": [
  //     "Mission 1",
  //     "Mission 2",
  //     "Mission 3",
  //     "Mission 4",
  //     "Mission 5"
  //   ]
  // }
  // `;

  //       const suggestions = await openAIService.generateCompletion(prompt, {
  //         model: 'gpt-3.5-turbo',
  //         maxTokens: 300,
  //         temperature: 0.7,
  //       });

  //       const parsedSuggestions = JSON.parse(suggestions);

  //       await prisma.mission_suggestions.create({
  //         data: {
  //           fk_id_user: parseInt(userId),
  //           goal,
  //           suggestions: parsedSuggestions,
  //         },
  //       });

  //       return res.status(200).json(jsend.success({ suggestions: parsedSuggestions }));
  //     } catch (error) {
  //       console.error('Mission suggestions error:', error);
  //       return res.status(500).json(jsend.error({ message: error.message }));
  //     }
  //   }
}

module.exports = OpenAIController
