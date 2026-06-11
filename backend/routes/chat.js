const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateAIResponse } = require('../services/gemini');

router.post('/', protect, async (req, res) => {
  try {
    const { message, context, laymanMode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let prompt = `
You are an AI assistant for Prism AI, a platform dedicated to detecting bias in datasets.
The user is currently analyzing a dataset with the following context:
${JSON.stringify(context || {})}

The user asks: "${message}"

Answer the question clearly and concisely, keeping the tone helpful and professional.
`;

    if (laymanMode) {
      prompt = `
You are an AI assistant for Prism AI, a platform dedicated to detecting bias in datasets.
IMPORTANT: The user is a layperson. Explain everything in extremely simple, friendly, layman terms with analogies (like sharing cake or sports tournament rules). Avoid technical jargon, equations, or statistics terminology. Keep explanations brief, reassuring, and helpful.

The user is currently analyzing a dataset with the following context:
${JSON.stringify(context || {})}

The user asks: "${message}"

Answer the question clearly, simply, and concisely.
`;
    }

    const reply = await generateAIResponse(prompt, 'chat', { laymanMode });
    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI assistant.' });
  }
});

module.exports = router;
