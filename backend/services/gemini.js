const { GoogleGenAI } = require("@google/genai");

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite-001",
  "gemini-1.5-flash",
];

// ─── Timeout wrapper ──────────────────────────────────────────────────────────
// Timeout helper
function withTimeout(promise, ms = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timed out after ${ms / 1000}s`)),
        ms,
      ),
    ),
  ]);
}

// Try Gemini models (Gemini-only dispatcher per user request)
async function tryGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env");
  const ai = new GoogleGenAI({ apiKey });
  const errors = [];

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`🔌 Trying Gemini model: ${modelName}`);
      const response = await withTimeout(
        ai.models.generateContent({ model: modelName, contents: prompt }),
        30000,
      );
      // @google/genai v2: response.text is a getter string, not a method
      const text =
        typeof response?.text === 'string'
          ? response.text
          : typeof response?.text === 'function'
          ? response.text()
          : response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            response?.candidates?.[0]?.content;
      if (text && String(text).trim()) {
        console.log(`✅ Gemini (${modelName}) succeeded`);
        return { text: String(text).trim(), provider: `Gemini (${modelName})` };
      }
    } catch (err) {
      console.warn(`⚠️  Gemini (${modelName}) failed:`, err.message || err);
      // If error suggests quota exhaustion, try to parse retry delay and wait once
      const msg = String(err.message || err || "");
      const retryMatch =
        msg.match(/retry in (\d+(?:\.\d+)?)s/i) ||
        msg.match(/retryDelay\\":\\"(\d+)s/);
      if (retryMatch) {
        const secs = parseFloat(retryMatch[1]);
        const waitMs = Math.ceil((secs + 0.5) * 1000);
        console.log(
          `⏳ Detected RESOURCE_EXHAUSTED — waiting ${Math.ceil(waitMs / 1000)}s before retrying ${modelName}`,
        );
        try {
          await new Promise((r) => setTimeout(r, waitMs));
          // single retry for this model
          const retryResp = await withTimeout(
            ai.models.generateContent({ model: modelName, contents: prompt }),
            30000,
          );
          const retryText =
            typeof retryResp?.text === 'string'
              ? retryResp.text
              : typeof retryResp?.text === 'function'
              ? retryResp.text()
              : retryResp?.candidates?.[0]?.content?.parts?.[0]?.text ||
                retryResp?.candidates?.[0]?.content;
          if (retryText && String(retryText).trim()) {
            console.log(`✅ Gemini (${modelName}) succeeded on retry`);
            return {
              text: String(retryText).trim(),
              provider: `Gemini (${modelName})`,
            };
          }
        } catch (retryErr) {
          console.warn(
            `⚠️  Retry for Gemini (${modelName}) failed:`,
            retryErr.message || retryErr,
          );
          errors.push(
            `${modelName} (retry): ${retryErr.message || String(retryErr)}`,
          );
          continue;
        }
      }
      errors.push(`${modelName}: ${err.message || String(err)}`);
    }
  }
  throw new Error(`All Gemini models failed — ${errors.join(" | ")}`);
}

// Core dispatcher: generateAIResponse (Gemini-only)
async function generateAIResponse(prompt, taskType = "general", data = {}) {
  try {
    const res = await tryGemini(prompt);
    return res.text;
  } catch (err) {
    console.error("❌ Gemini unavailable:", err.message || err);
    // If OpenAI key is available, attempt OpenAI fallback
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        console.log("🔁 Falling back to OpenAI API...");
        const openaiReply = await tryOpenAI(prompt, openaiKey);
        return openaiReply;
      } catch (oerr) {
        console.error("❌ OpenAI fallback failed:", oerr.message || oerr);
        throw new Error(
          `All providers failed. Gemini: ${err.message || err}; OpenAI: ${oerr.message || oerr}`,
        );
      }
    }
    throw err;
  }
}

// OpenAI fallback using REST API (no extra dependency)
async function tryOpenAI(prompt, key) {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.2,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`OpenAI error ${res.status}: ${txt}`);
    }

    const j = await res.json();
    const content = j?.choices?.[0]?.message?.content || j?.choices?.[0]?.text;
    if (!content) throw new Error("OpenAI returned empty response");
    return String(content).trim();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Helper wrappers that build prompts and call generateAIResponse
async function getBiasMetricAnalysis(metrics, config, laymanMode) {
  const di = metrics.disparateImpact ?? 0;
  const spd = metrics.statisticalParityDifference ?? 0;
  const diStatus =
    di >= 0.8 && di <= 1.25
      ? "FAIR"
      : di > 1.25
        ? "REVERSE BIAS"
        : di >= 0.6
          ? "CAUTION"
          : "BIASED";
  const spdStatus =
    Math.abs(spd) <= 0.1 ? "FAIR" : Math.abs(spd) <= 0.2 ? "CAUTION" : "BIASED";

  const prompt = `You are an expert AI Ethics Auditor.

BIAS METRICS:
- Disparate Impact (DI): ${di.toFixed(4)} — ${diStatus} (ideal=1.0, fair range=0.8–1.25)
- Statistical Parity Difference (SPD): ${(spd * 100).toFixed(2)}% — ${spdStatus} (ideal=0%, fair=±10%)

DATASET:
- Target: ${config?.targetAttribute || "Unknown"}
- Sensitive Attribute: ${config?.sensitiveAttribute || "Unknown"}
- Privileged Group: ${config?.privilegedGroup || "Unknown"} — selection rate ${((metrics.privFavorableRate ?? 0) * 100).toFixed(1)}%
- Unprivileged Group: ${config?.unprivilegedGroup || "Unknown"} — selection rate ${((metrics.unprivFavorableRate ?? 0) * 100).toFixed(1)}%
- Favorable Outcome: ${config?.favorableOutcome || "Unknown"}

NOTE: DI > 1.25 means REVERSE BIAS — unprivileged group is over-favoured. Both extremes indicate bias.

Respond in clean Markdown with exactly 3 sections:
## What the numbers mean
## Bias verdict
## Immediate actions`;

  return generateAIResponse(prompt, "bias-metric-analysis", {
    laymanMode,
    metrics,
    config,
  });
}

async function getRecommendations(metrics, datasetContext, laymanMode) {
  let indianTip = "";
  const sens = datasetContext?.sensitiveAttribute || "";
  if (["Caste_Category", "Dialect_Accent", "State_of_Origin"].includes(sens)) {
    indianTip = `\nNote: Sensitive attribute is "${sens}" — an Indian hiring context. Tailor recommendations accordingly.`;
  }

  const prompt = `You are an expert AI Ethicist.

Dataset: Target=${datasetContext?.targetAttribute}, Sensitive=${datasetContext?.sensitiveAttribute}
DI=${metrics.disparateImpact?.toFixed(4)}, SPD=${(metrics.statisticalParityDifference * 100)?.toFixed(2)}%
${indianTip}

NOTE: DI > 1.25 means reverse bias — unprivileged group is over-favoured. Both extremes need fixing.

Give 3 actionable bias mitigation recommendations in clean Markdown:
1. Pre-processing (data level)
2. In-processing (model training level)
3. Post-processing (output level)`;

  return generateAIResponse(prompt, "recommendations", {
    laymanMode,
    metrics,
    datasetContext,
  });
}

async function getAuditSummary(auditData, laymanMode) {
  const prompt = `Summarize this AI Fairness Audit in 3-4 bullet points.
Dataset: ${auditData?.datasetName || "Dataset"}
Sensitive Attribute: ${auditData?.sensitiveAttribute}
Metrics: DI=${auditData?.metrics?.disparateImpact?.toFixed(3)}, SPD=${(auditData?.metrics?.statisticalParityDifference * 100)?.toFixed(1)}%
Status: ${auditData?.status}

Focus on bias severity and the most critical improvement needed.`;

  return generateAIResponse(prompt, "audit", { laymanMode, auditData });
}

async function getDriftExplanation(driftMetrics, laymanMode) {
  const prompt = `Explain this AI model bias pattern in 2-3 sentences:
- Disparate Impact now: ${driftMetrics?.currentValue ?? "unknown"}
- Original / baseline: ${driftMetrics?.historicalAverage ?? "unknown"}
- Trend: ${driftMetrics?.trend ?? "unknown"}
- Sensitive Attribute: ${driftMetrics?.sensitiveAttribute ?? "unknown"}

What is causing this and what is the immediate next step?`;

  return generateAIResponse(prompt, "drift", { laymanMode, driftMetrics });
}

async function getFirewallInsight(blockedReason, endpoint, laymanMode) {
  const prompt = `An AI prediction request to "${endpoint}" was blocked.
Reason: ${blockedReason}

In exactly 2 sentences: why was it blocked, and how can the developer fix the underlying bias?`;

  return generateAIResponse(prompt, "firewall", {
    laymanMode,
    blockedReason,
    endpoint,
  });
}

async function getVertexPipeline(metrics, config) {
  const prompt = `You are a Senior Google Cloud MLOps Architect. Write a complete production-ready Python script using Google Vertex AI, GCS, and bias mitigation.

Context:
- Target: ${config.targetAttribute}, Sensitive: ${config.sensitiveAttribute}
- Privileged: ${config.privilegedGroup}, Unprivileged: ${config.unprivilegedGroup}
- Favorable outcome: ${config.favorableOutcome}
- Current DI: ${metrics.disparateImpact?.toFixed(3)}, SPD: ${(metrics.statisticalParityDifference * 100)?.toFixed(1)}%

Script must: init Vertex AI SDK, load from GCS, apply sample reweighing for bias mitigation, train RandomForestClassifier with weights, upload to Vertex AI Model Registry, deploy to endpoint, log with Cloud Logging.

Provide ONLY Python code in a markdown code block with config comments.`;

  return generateAIResponse(prompt, "vertex-pipeline", {
    laymanMode: false,
    metrics,
    config,
  });
}

module.exports = {
  generateAIResponse,
  getBiasMetricAnalysis,
  getRecommendations,
  getAuditSummary,
  getDriftExplanation,
  getFirewallInsight,
  getVertexPipeline,
};
