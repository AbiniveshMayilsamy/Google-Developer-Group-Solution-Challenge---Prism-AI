const { GoogleGenAI } = require('@google/generative-ai');

const FALLBACK_RECOMMENDATIONS = `[API LIMIT REACHED] We detected a bias score in the system. To mitigate this:
1. **Pre-processing:** Re-sample your data to balance the protected classes.
2. **In-processing:** Use adversarial debiasing techniques during model training.
3. **Post-processing:** Adjust classification thresholds differently for the protected groups.
(The AI is currently at its limit, but these industry-standard steps will help reduce bias.)`;

async function getRecommendations(metrics, datasetContext) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return `[API KEY NOT CONFIGURED] We detected a bias score in the system. To mitigate this:
1. **Pre-processing:** Re-sample your data to balance the protected classes.
2. **In-processing:** Use adversarial debiasing techniques during model training.
3. **Post-processing:** Adjust classification thresholds differently for the protected groups.
(Provide a valid GEMINI_API_KEY to get real AI-generated recommendations based on your context.)`;
  }

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert AI Ethicist and Data Scientist. I have analyzed an AI model's dataset/predictions.

Context:
- Target Variable: ${datasetContext?.targetAttribute || 'Not specified'}
- Sensitive Attribute: ${datasetContext?.sensitiveAttribute || 'Not specified'}
- Privileged Group: ${datasetContext?.privilegedGroup || 'Not specified'}
- Unprivileged Group: ${datasetContext?.unprivilegedGroup || 'Not specified'}

Calculated Metrics:
- Statistical Parity Difference (SPD): ${metrics.statisticalParityDifference}
- Disparate Impact (DI): ${metrics.disparateImpact}

Instructions:
1. Briefly explain what these metrics mean in this specific context.
2. Provide 3 highly actionable, specific recommendations to reduce this bias. Categorize them into Pre-processing (data level), In-processing (model training level), and Post-processing (prediction level).
3. Keep the tone professional, objective, and easy to understand for non-technical users.
4. Format your response in clean Markdown.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Service Error:', error);
    return FALLBACK_RECOMMENDATIONS;
  }
}

module.exports = {
  getRecommendations,
};
