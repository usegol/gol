import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Replace this with your actual API key

const instance = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

const configuration = new Configuration({
    organization: "org-G3hasM1xhAw2wU8QYxZwrAKD",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const fetchMotivationalQuote = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: 'Generate a motivational quote',
          max_tokens: 50,
          n: 1,
          stop: null,
          temperature: 1,
        }),
      });
  
      const data = await response.json();
      return data.choices[0].text.trim();
    } catch (error) {
      console.error(error);
      return 'Error fetching quote';
    }
  };
  