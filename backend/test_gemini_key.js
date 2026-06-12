require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found in env');
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  for (const m of models) {
    try {
      console.log(`\nTesting model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('Verify model connectivity.');
      console.log(`✅ Success with ${m}! Response snippet: "${result.response.text().trim().substring(0, 30)}..."`);
    } catch (err) {
      console.error(`❌ Failed with ${m}:`, err.message);
    }
  }
}

testAllModels();
