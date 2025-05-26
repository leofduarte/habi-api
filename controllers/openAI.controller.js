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
      Every goal must be short and direct, no more than 25 characters. For each goal, generate 4 to 6 missions. These missions must be concrete, repeatable actions that can realistically be done every day or integrated into a daily routine. Do not include vague activities or generic labels like “practice mindfulness” or “engage in self-care”. Avoid any suggestion that requires a one-time action or external dependency, such as “join a club”, “seek therapy”, or “attend events”.
      Only suggest missions that the user can directly perform by themselves, repeatedly. The actions should be highly specific, clear, and short — no more than 5 words. Examples: “talk to a stranger”, “stretch after waking up”, “write one gratitude note”. Avoid words like “daily”, “always”, or “every day” — the habit should be implied by the simplicity and consistency of the action.
      Some of the questions are made to evaluate the user's emotional state and motivations. Use this information to create goals that are not only practical but also emotionally resonant. The goals should reflect the user's aspirations, struggles, and emotional needs. For example, if the user expresses a lack of motivation try to adapt the goals to be more easy to achieve, dont just give them a generic goal like “be more motivated” or "boost motivation" just work with the goals you have to make them in a way that the user does't lose motivation.
      The missions should be specific and actionable, allowing the user to take small steps toward their goals. Avoid vague or abstract suggestions. The missions should be easy to understand and implement, even for someone who may be feeling overwhelmed or unsure of where to start.
      The goals should be realistic and achievable, considering the user's current situation and emotional state. Avoid suggesting goals that are too ambitious or unrealistic, as this may lead to frustration or disappointment. Instead, focus on small, manageable steps that the user can take to build positive habits over time.
      Make sure the 4 goals together reflect all major themes in the user's answers. Do not ignore emotional needs, personal struggles, or subtle hints in their motivations. The focus is on building consistent habits from simple, realistic starting points.
      Return only the structured list of 4 goals and their corresponding missions. Do not include any explanation, formatting, or commentary.
      Return your response as a valid JSON array using this exact structure:
            [
              {
                "id": "goal-1",
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
      Here are the user's questionnaire answers:

      ${pairs
        .map((p, i) => `Q${i + 1}: ${p.question}\nA${i + 1}: ${p.answer}`)
        .join('\n\n')}`

      //! CHAMADA AO OPENAI
      const suggestions = await openAIService.generateCompletion(prompt, {
        model: 'gpt-3.5-turbo',
        maxTokens: 400,
        temperature: 0.7
      })

      //! RETORNO
      return res.status(200).json(jsend.success({ suggestions }))
    } catch (error) {
      return res.status(500).json(jsend.error({ message: error.message }))
    }
  }
}

module.exports = OpenAIController
