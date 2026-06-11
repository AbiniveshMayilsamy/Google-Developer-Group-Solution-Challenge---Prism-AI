const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateAIResponse(prompt, taskType, data = {}) {
  let finalPrompt = prompt;
  if (data.laymanMode) {
    finalPrompt = `IMPORTANT: The user is a layperson. Explain everything in extremely simple, friendly, layman terms with analogies (like sharing cake or sports tournament rules). Avoid technical jargon, equations, or statistics terminology. Keep explanations brief, reassuring, and helpful.

${prompt}`;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please configure it in your .env file.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`Gemini Service Error (${taskType}):`, error.message);
    throw new Error(`AI service error: ${error.message}`);
  }
}

async function getRecommendations(metrics, datasetContext, laymanMode) {
  let indianContextTip = '';
  const sens = datasetContext?.sensitiveAttribute || '';
  if (sens === 'Caste_Category' || sens === 'Dialect_Accent' || sens === 'State_of_Origin') {
    indianContextTip = `
Note: This analysis focuses on Indian recruitment bias metrics where the sensitive attribute is "${sens}".
- If "Caste_Category" (General vs Reserved): Address systemic opportunities and reservations compliance.
- If "Dialect_Accent" (Standard vs Regional Accent): Suggest anonymizing candidate accent clues or audio transcription pre-screening.
- If "State_of_Origin": Suggest removing address and local university proxies to prevent geographic discrimination.
Please customize the recommendations to address these Indian hiring biases.`;
  }

  const prompt = `
You are an expert AI Ethicist. Analyze these bias metrics:
- Target: ${datasetContext?.targetAttribute || 'Not specified'}
- Sensitive Attribute: ${datasetContext?.sensitiveAttribute || 'Not specified'}
- SPD: ${metrics.statisticalParityDifference}
- DI: ${metrics.disparateImpact}
${indianContextTip}

Provide 3 actionable recommendations (Pre-processing, In-processing, Post-processing) in clean Markdown.
`;
  return generateAIResponse(prompt, 'recommendations', { metrics, context: datasetContext, laymanMode });
}

async function getAuditSummary(auditData, laymanMode) {
  const prompt = `
Summarize this AI Fairness Audit in 3-4 bullet points:
- Dataset: ${auditData?.datasetName || 'Dataset'}
- Sensitive Attribute: ${auditData?.sensitiveAttribute || 'Sensitive Attribute'}
- Metrics: ${JSON.stringify(auditData?.metrics || {})}
- Status: ${auditData?.status || 'Biased'}

Focus on the severity of bias and the most critical area for improvement.
`;
  return generateAIResponse(prompt, 'audit', { auditData, laymanMode });
}

async function getDriftExplanation(driftMetrics, laymanMode) {
  const prompt = `
Explain this bias drift in an AI model:
- Metric Name: Disparate Impact
- Current Value: ${driftMetrics?.currentValue || '0.75'}
- Historical Average: ${driftMetrics?.historicalAverage || '0.95'}
- Trend: ${driftMetrics?.trend || 'Decreasing'}

Briefly explain why this drift might be happening (e.g., feedback loops, data shift) and what the immediate next step should be.
`;
  return generateAIResponse(prompt, 'drift', { driftMetrics, laymanMode });
}

async function getFirewallInsight(blockedReason, endpoint, laymanMode) {
  const prompt = `
An AI request to "${endpoint}" was blocked by the Prism AI Firewall.
Reason: ${blockedReason}

Provide a 1-sentence technical explanation of why this was blocked and a 1-sentence suggestion for how the developer can fix the underlying bias in the input data.
`;
  return generateAIResponse(prompt, 'firewall', { blockedReason, endpoint, laymanMode });
}

async function getVertexPipeline(metrics, config) {
  const prompt = `
You are a Senior Google Cloud MLOps Architect. Write a complete, production-ready Python script that integrates Google Vertex AI, Google Cloud Storage, Google Cloud Logging, and bias mitigation.

Here is the data context:
- Target Variable: ${config.targetAttribute || 'Outcome'}
- Sensitive Attribute: ${config.sensitiveAttribute || 'Sensitive_Attribute'}
- Privileged Group: ${config.privilegedGroup || 'Privileged'}
- Unprivileged Group: ${config.unprivilegedGroup || 'Unprivileged'}
- Favorable Outcome: ${config.favorableOutcome || 'Approved'}
- Current Disparate Impact: ${metrics.disparateImpact ? metrics.disparateImpact.toFixed(2) : '0.70'}
- Current Statistical Parity Difference: ${metrics.statisticalParityDifference ? metrics.statisticalParityDifference.toFixed(2) : '-0.20'}

The Python script must:
1. Initialize Google Cloud Vertex AI SDK.
2. Load data from a Google Cloud Storage bucket (GCS).
3. Preprocess and mitigate bias using a Sample Reweighing method for '${config.sensitiveAttribute || 'Sensitive_Attribute'}' to balance the representation.
4. Train a classification model (e.g. Scikit-Learn RandomForestClassifier) incorporating the calculated sample weights.
5. Save and upload the mitigated model to Vertex AI Model Registry.
6. Deploy the model to a Google Vertex AI Endpoint for real-time inference.
7. Integrate Google Cloud Logging (Stackdriver) to stream model inference inputs, outputs, and bias alerts.

Provide ONLY the clean Python code inside a markdown code block. Include comments explaining how to configure Google Cloud credentials, bucket names, and project IDs.
`;
  return generateAIResponse(prompt, 'vertex-pipeline', { laymanMode: false });
}

module.exports = {
  getRecommendations,
  getAuditSummary,
  getDriftExplanation,
  getFirewallInsight,
  getVertexPipeline,
  generateAIResponse
};
