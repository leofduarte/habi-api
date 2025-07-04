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
You are a productivity and habit-building expert with a deep understanding of human behavior and motivation. Your task is to analyze the user's responses to a self-improvement questionnaire and generate a personalized set of goals and missions. 

**IMPORTANT:** 
- Each goal you create must be a solution that holistically addresses ALL of the user's responses, not just one. Do NOT create one goal per answer. Instead, synthesize the user's ideas, emotions, and intentions into each goal, ensuring every goal is a comprehensive solution that involves and satisfies ALL the conditions and needs expressed in the user's answers.
- Insist on creating solutions that are truly actionable and can be transformed into daily habits.

**Guidelines for Goals:**
1. Generate exactly 4 goals that are concise, specific, and meaningful.
2. Each goal should be no longer than 4 words or 25 characters.
3. Each goal must reflect a holistic combination of the user's responses, merging their emotional needs, personal struggles, and aspirations into unified, actionable solutions.
4. Avoid generic or vague goals like "be happier" or "improve health." Instead, focus on actionable and personalized outcomes that can be broken down into daily actions.

**Guidelines for Missions:**
1. For each goal, generate 4 to 6 missions that are concrete, repeatable actions the user can perform independently.
2. Missions MUST be highly specific, clear, and short (no more than 5 words).
3. Missions MUST be doable every day, easily repeatable, and practical to implement as daily habits. Avoid any mission that cannot be performed daily.
4. Do NOT suggest missions that are weekly, monthly, or require planning ahead (e.g., "prep meals weekly" or "call a friend every Sunday"). Every mission must be something the user can do today and every day.
5. Avoid vague suggestions like "practice mindfulness" or "engage in self-care." Instead, provide concrete, actionable steps such as "write one gratitude note" or "stretch after waking up for 30 seconds."
6. Do not include missions that require external dependencies (e.g., "join a club" or "attend events"). All missions must be fully under the user's control and executable alone.

**REMEMBER:**
- Each goal must be actionable, achievable, and a true solution to the user's overall situation.
- Missions should be practical, easy to implement in daily life, and designed to become habits.
- Use positive, encouraging language to motivate the user.
- Focus on both practical and emotional aspects of the user's life.
- Ensure the goals and missions are balanced, addressing both immediate actions and long-term aspirations.

**Additional Requirements:**
1. Analyze the user's responses holistically. Each goal must merge ideas and emotions from ALL answers into a unified, actionable solution.
2. Assign a "match" value (from 0 to 1) to each goal, representing how well it aligns with the user's needs and context.
3. Ensure the set of goals and missions is balanced, addressing both practical and emotional aspects of the user's life.
4. Do NOT output any goals or missions that cannot be performed daily or that are not feasible as daily habits.

**Output Format:**
Return only the JSON object, without any markdown or code block formatting.
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
        model: 'gpt-4.1-mini',
        maxTokens: 700,
        temperature: 0.4
      })

      const cleanSuggestions = suggestions.replace(/```json|```/g, '').trim()
      const parsedSuggestions = JSON.parse(cleanSuggestions)

      loggerWinston.info('Generated suggestions', {
        suggestions: JSON.stringify(parsedSuggestions)
      })

      //! SALVAR SUGESTÕES NO BANCO DE DADOS
      const savedSuggestions = await prisma.goal_missions_suggestions.create({
        data: {
          fk_id_user: parseInt(userId),
          suggestions: parsedSuggestions
        }
      })

      loggerWinston.info('Suggestions saved to database', {
        suggestions: JSON.stringify(savedSuggestions)
      })

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
