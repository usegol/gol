// gpt4.js
import axios from 'axios';

export async function generateEventsFromPrompt(prompt) {
    const API_URL = 'https://api.openai.com/v1/engines/davinci/completions';
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
    try {
      const response = await axios.post(
        API_URL,
        {
          prompt,
          max_tokens: 60,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
  
      // The GPT-3 API is expected to return an array of events
      return JSON.stringify(response.data.choices[0].text.trim());
    } catch (error) {
      console.error('Error generating events from prompt:', error);
      return null;
    }
  }
  
  