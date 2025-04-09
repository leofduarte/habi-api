const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateCompletion(prompt, options = {}) {
        try {
            const response = await this.client.chat.completions.create({
                model: options.model || 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: options.maxTokens || 500,
                temperature: options.temperature || 0.7,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

}

module.exports = new OpenAIService();