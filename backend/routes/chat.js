const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ 
        reply: `[API KEY NOT CONFIGURED] I am your AI assistant, but I need an API key to process your query: "${message}"` 
      });
    }

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an AI assistant for Prism AI, a platform dedicated to detecting bias in datasets.
The user is currently analyzing a dataset with the following context:
${JSON.stringify(context || {})}

The user asks: "${message}"

Answer the question clearly and concisely, keeping the tone helpful and professional.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI assistant.' });
  }
});

module.exports = router;
