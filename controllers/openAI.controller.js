const openAIService = require('../services/openAI.service.js')
const prisma = require('../utils/prisma.utils.js')
const jsend = require('jsend')

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

      //! PROMPT OTIMIZADO
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
3. Avoid vague suggestions like "practice mindfulness" or "engage in self-care." Instead, provide actionable steps such as "write one gratitude note" or "stretch after waking up."
4. Do not include missions that require external dependencies (e.g., "join a club" or "attend events").

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

      console.log('Generated suggestions:', parsedSuggestions)


      //! SALVAR SUGESTÕES NO BANCO DE DADOS
      const savedSuggestions = await prisma.goal_missions_suggestions.create({
        data: {
          fk_id_user: parseInt(userId),
          suggestions: parsedSuggestions,
        },
      });

      console.log('Suggestions saved to database:', savedSuggestions);


      //! RETORNO
      return res.status(200).json(jsend.success({ suggestions }))
    } catch (error) {
      console.error('OpenAI suggest-goals error:', error)
      return res.status(500).json(jsend.error({ message: error.message }))
    }
  }
}

module.exports = OpenAIController
