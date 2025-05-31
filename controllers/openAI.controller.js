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
You are a productivity and habit-building expert. Your task is to analyze the user's answers to a self-improvement questionnaire and generate 4 short personal goals. Each goal must reflect a combination of ideas, emotions, and intentions found across the user's responses. Do not treat answers in isolation — instead, merge them into unified goals that reflect the user's overall situation.
Every goal must be short and direct, no more than 2 to 4 words. For each goal, generate 4 to 6 missions. These missions must be concrete, repeatable actions that can realistically be done every day or integrated into a daily routine. Do not include vague activities or generic labels like “practice mindfulness” or “engage in self-care”. Avoid any suggestion that requires a one-time action or external dependency, such as “join a club”, “seek therapy”, or “attend events”.
Only suggest missions that the user can directly perform by themselves, repeatedly. The actions should be highly specific, clear, and short — no more than 5 words. Examples: “talk to a stranger”, “stretch after waking up”, “write one gratitude note”. Avoid words like “daily”, “always”, or “every day” — the habit should be implied by the simplicity and consistency of the action.
Make sure the 4 goals together reflect all major themes in the user's answers. Do not ignore emotional needs, personal struggles, or subtle hints in their motivations. The focus is on building consistent habits from simple, realistic starting points.

After generating the goals and missions, analyze how well this set matches the user's needs and context. Add a "match" value (from 0 to 1, where 1 means a perfect match) to the response, representing your confidence that these goals and missions are exactly what the user needs right now.

Return only a valid JSON object using this exact structure:
{
  "goals": [
    {
      "id": "goal-1",
      "match": 0.92,
      "goal": "Clearly written goal based on the user's needs",
      "missions": [
        "First actionable mission to move toward the goal",
        "Second actionable mission...", 
        "Third...",
        "Optional fourth..."
      ]
    },
    ...
  ]
}

Here are the user's questionnaire answers:
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

      //! RETORNO
      return res.status(200).json(jsend.success({ suggestions }))
    } catch (error) {
      console.error('OpenAI suggest-goals error:', error)
      return res.status(500).json(jsend.error({ message: error.message }))
    }
  }
}

module.exports = OpenAIController
