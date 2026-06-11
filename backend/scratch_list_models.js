require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key found');
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const result = await genAI.listModels();
    console.log('Available Models:');
    result.models.forEach(m => console.log(`- ${m.name}`));
  } catch (err) {
    console.error('Error listing models:', err.message);
  }
}

listModels();
