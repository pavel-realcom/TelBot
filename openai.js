const axios = require('axios');
const {oaiKey} = require('./config');

const openAIUrl = 'https://api.openai.com/v1/chat/completions';

async function fetchChatGPTResponse(content='empty prompt',system = '') {
    try {
        const messages = []
        if (system) {
            messages.push({ role: 'system', content: system })
        }
        const response = await axios.post(
            openAIUrl,
            {
                model: "gpt-4",
                messages: messages.concat([
                    {
                      role: 'user',
                      content,
                    },
                  ]),
                temperature: 0.5,
                max_tokens: 1000,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            },
            {
                headers: {
                    'Authorization': `Bearer ${oaiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error in request to  OpenAI:', error.message);
        return null;
    }
}

module.exports = { fetchChatGPTResponse }