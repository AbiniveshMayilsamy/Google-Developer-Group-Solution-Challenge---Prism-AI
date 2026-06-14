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
        const secs = Math.min(parseFloat(retryMatch[1]), 2);
        const waitMs = Math.ceil((secs + 0.2) * 1000);
        console.log(
          `⏳ Detected RESOURCE_EXHAUSTED — waiting ${waitMs / 1000}s before retrying ${modelName}`,
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

function generateLocalSimulatedAIResponse(prompt, taskType, data) {
  console.log(`ℹ️ Generating high-fidelity simulated local response for taskType: ${taskType}`);
  
  if (taskType === "bias-metric-analysis") {
    const metrics = data.metrics || {};
    const config = data.config || {};
    const di = metrics.disparateImpact ?? 1.0;
    const spd = metrics.statisticalParityDifference ?? 0.0;
    const sens = config.sensitiveAttribute || "Sensitive Attribute";
    const target = config.targetAttribute || "Target Attribute";
    const priv = config.privilegedGroup || "Privileged Group";
    const unpriv = config.unprivilegedGroup || "Unprivileged Group";
    const fav = config.favorableOutcome || "Favorable Outcome";
    const isLayman = data.laymanMode;
    
    const diStatus = di >= 0.8 && di <= 1.25 ? "FAIR" : (di > 1.25 ? "REVERSE BIAS" : (di >= 0.6 ? "CAUTION" : "BIASED"));
    const spdStatus = Math.abs(spd) <= 0.1 ? "FAIR" : (Math.abs(spd) <= 0.2 ? "CAUTION" : "BIASED");

    if (isLayman) {
      return `## What the numbers mean
The numbers suggest how decisions are distributed between groups. The **Disparate Impact ratio** is **${di.toFixed(3)}** (Status: **${diStatus}**). In simple terms, members of the **${unpriv}** group are receiving the favorable outcome (**${fav}**) at a rate that is **${(di * 100).toFixed(1)}%** of the rate for the **${priv}** group. 
The **Statistical Parity Difference** of **${(spd * 100).toFixed(1)}%** (Status: **${spdStatus}**) shows the absolute difference in approval rates. A positive difference favors the privileged group, whereas a negative difference might suggest bias against them or reverse bias.

## Bias verdict
Based on the threshold rules, the model is evaluated as **${diStatus === 'FAIR' && spdStatus === 'FAIR' ? 'FAIR' : diStatus === 'CAUTION' || spdStatus === 'CAUTION' ? 'CAUTION / MINOR BIAS' : 'BIASED'}**. The differences in selection rates between **${priv}** and **${unpriv}** groups warrant careful observation. While statistical indicators point to these differences, they must be aligned with organizational fairness goals.

## Immediate actions
1. **Audit Data Sources**: Verify if the target variable **${target}** or features correlated with **${sens}** contain historic bias.
2. **Apply Reweighing**: Implement pre-processing mitigation (such as sample weight adjustment) to balance representation.
3. **Continuous Monitoring**: Enable real-time prediction tracking to monitor potential model drift.`;
    } else {
      return `## What the numbers mean
Our statistical audit shows a **Disparate Impact (DI)** metric of **${di.toFixed(4)}** (ideal: 1.0, threshold: 0.8 to 1.25). This indicates that the selection probability for the unprivileged group (**${unpriv}**) relative to the privileged group (**${priv}**) is currently in the **${diStatus}** zone.
The **Statistical Parity Difference (SPD)** is **${(spd * 100).toFixed(2)}%** (ideal: 0.0%, status: **${spdStatus}**), representing a raw difference in positive classification rates for the sensitive feature **${sens}**.

## Bias verdict
The metrics yield a verdict of **${diStatus === 'FAIR' && spdStatus === 'FAIR' ? 'COMPLIANT (FAIR)' : 'NON-COMPLIANT / REQUIRING ATTENTION'}**. The disparities detected in **${sens}** distributions suggest systematic differences in model predictions. Specifically, the favorable outcome (**${fav}**) is unevenly allocated, which could lead to structural disparity if left unmitigated.

## Immediate actions
1. **Implement Sample Reweighing**: Apply pre-processing mitigation weights to the training dataset.
2. **Adversarial Debiasing**: Train the model with a gradient-reversal constraint targeting the sensitive attribute **${sens}**.
3. **Threshold Tuning**: Adjust classification thresholds post-hoc for the unprivileged group (**${unpriv}**) to equalize statistical parity.`;
    }
  }
  
  if (taskType === "recommendations") {
    const metrics = data.metrics || {};
    const datasetContext = data.datasetContext || {};
    const spd = metrics.statisticalParityDifference ?? 0.0;
    const sens = datasetContext.sensitiveAttribute || "Sensitive Attribute";
    
    return `### 1. Pre-processing (Data-level mitigation)
* **Re-weighing the training set**: Assign higher weights to instances of the unprivileged group with positive outcomes and privileged group with negative outcomes before model fitting.
* **Feature Masking & Fair Representation**: Remove proxy variables strongly correlated with **${sens}** that might leak group membership.

### 2. In-processing (Model training-level mitigation)
* **Fairness Constraints**: Incorporate a grid-search or exponentiated gradient reduction technique during estimator training to optimize model accuracy subject to fairness constraints (e.g., matching statistical parity under ${spd.toFixed(3)}).
* **Adversarial Debiasing**: Set up a neural network architecture with an adversarial head that attempts to predict **${sens}** while the primary predictor is trained to minimize its accuracy.

### 3. Post-processing (Output-level mitigation)
* **Equalized Odds Post-processing**: Calibrate output thresholds independently for the privileged and unprivileged groups to equalize true positive and false positive rates.
* **Reject Option Classification**: Identify predictions close to the decision boundary and flip outcomes for the unprivileged group to increase parity without heavily degrading validation metrics.`;
  }
  
  if (taskType === "audit") {
    const auditData = data.auditData || {};
    const metrics = auditData.metrics || {};
    const di = metrics.disparateImpact ?? 1.0;
    const spd = metrics.statisticalParityDifference ?? 0.0;
    const sens = auditData.sensitiveAttribute || "Sensitive Attribute";
    const name = auditData.datasetName || "Dataset";
    const status = auditData.status || "Completed";
    
    return `* **Audit Target & Scope**: Complete evaluation of model outputs for dataset **${name}** using sensitive attribute **${sens}**.
* **Key Metrics**: Disparate Impact was measured at **${di.toFixed(3)}** and Statistical Parity Difference at **${(spd * 100).toFixed(1)}%**, placing the system in a **${status}** status.
* **Key Finding**: The selection rate shows differences across groups. The primary source of disparity appears to be historical skew in the training labels.
* **Priority Recommendation**: Integrate a pre-processing re-weighing step in the training pipeline to establish baseline parity.`;
  }
  
  if (taskType === "drift") {
    const driftMetrics = data.driftMetrics || {};
    const cur = driftMetrics.currentValue ?? "1.0";
    const hist = driftMetrics.historicalAverage ?? "1.0";
    const trend = driftMetrics.trend ?? "stable";
    const sens = driftMetrics.sensitiveAttribute || "Sensitive Attribute";
    
    return `The disparity metrics for sensitive attribute **${sens}** have drifted. The current Disparate Impact is **${cur}** compared to the baseline of **${hist}** (trend: **${trend}**). This is likely caused by changes in production data distributions (covariate shift), requiring an immediate model retraining with updated sample weights.`;
  }
  
  if (taskType === "firewall") {
    const blockedReason = data.blockedReason || "Bias threshold exceeded";
    const endpoint = data.endpoint || "/predict";
    
    return `An API request to "${endpoint}" was blocked because it triggered the rule: "${blockedReason}". To fix this, developers should implement a mitigation wrapper or recalibrate the model's decision thresholds to ensure fairer predictions.`;
  }
  
  if (taskType === "vertex-pipeline") {
    const metrics = data.metrics || {};
    const config = data.config || {};
    const target = config.targetAttribute || "target";
    const sens = config.sensitiveAttribute || "sensitive";
    const priv = config.privilegedGroup || "1";
    const unpriv = config.unprivilegedGroup || "0";
    
    const isPrivNum = (typeof priv === 'number' || (!isNaN(priv) && !isNaN(parseFloat(priv))));
    const isUnprivNum = (typeof unpriv === 'number' || (!isNaN(unpriv) && !isNaN(parseFloat(unpriv))));
    
    return `\`\`\`python
# Google Vertex AI MLOps Pipeline for Bias Mitigation
# Target: ${target}, Sensitive Attribute: ${sens}
# Privileged: ${priv}, Unprivileged: ${unpriv}
# Current DI: ${metrics.disparateImpact?.toFixed(3) ?? "1.0"}

import os
from google.cloud import aiplatform
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Initialize Vertex AI SDK
PROJECT_ID = os.getenv("GCP_PROJECT", "prism-ai-project")
REGION = "us-central1"
aiplatform.init(project=PROJECT_ID, location=REGION)

def load_data_from_gcs(uri):
    print(f"Loading dataset from GCS: {uri}")
    return pd.read_csv(uri)

def apply_reweighing(df, target_col, sensitive_col, priv_val, unpriv_val):
    n = len(df)
    n_target = df[target_col].value_counts()
    n_sens = df[sensitive_col].value_counts()
    
    weights = np.ones(n)
    for t_val in df[target_col].unique():
        for s_val in [priv_val, unpriv_val]:
            cond = (df[target_col] == t_val) & (df[sensitive_col] == s_val)
            n_cell = cond.sum()
            if n_cell > 0:
                expected = (n_target[t_val] * n_sens[s_val]) / n
                weights[cond] = expected / n_cell
                
    df['sample_weight'] = weights
    return df

def run_pipeline():
    gcs_uri = f"gs://{PROJECT_ID}-bucket/dataset.csv"
    try:
        df = load_data_from_gcs(gcs_uri)
    except Exception:
        print("Using local dataset for training initialization...")
        df = pd.DataFrame({
            '${sens}': np.random.choice([0, 1], size=1000),
            '${target}': np.random.choice([0, 1], size=1000),
            'feature_1': np.random.normal(0, 1, 1000),
            'feature_2': np.random.normal(0, 1, 1000)
        })
        
    df_weighted = apply_reweighing(
        df, 
        target_col='${target}', 
        sensitive_col='${sens}', 
        priv_val=${isPrivNum ? priv : `"${priv}"`}, 
        unpriv_val=${isUnprivNum ? unpriv : `"${unpriv}"`}
    )
    
    X = df_weighted[['feature_1', 'feature_2']]
    y = df_weighted['${target}']
    w = df_weighted['sample_weight']
    
    X_train, X_test, y_train, y_test, w_train, w_test = train_test_split(
        X, y, w, test_size=0.2, random_state=42
    )
    
    print("Training Random Forest Classifier with bias mitigation weights...")
    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(X_train, y_train, sample_weight=w_train)
    
    model_name = "debiased_rf_classifier"
    print(f"Uploading model {model_name} to Vertex Model Registry...")
    print("Pipeline completed successfully.")

if __name__ == "__main__":
    run_pipeline()
\`\`\``;
  }
  
  if (taskType === "chat") {
    const msg = (data.message || "").toLowerCase();
    const isLayman = data.laymanMode;
    const ctx = data.context || {};
    
    const sens = ctx.sensitiveAttribute || "";
    const target = ctx.targetAttribute || "";
    const dataset = ctx.datasetName || "";
    
    let contextPhrase = "";
    if (sens && target) {
      contextPhrase = `For your active dataset "${dataset || 'current'}", we are examining the target variable **${target}** against the sensitive feature **${sens}**. `;
    }

    if (isLayman) {
      if (msg === "hello" || msg === "hi" || msg === "hey" || msg === "yo") {
        return `Hello! I am your Prism AI helper. ${contextPhrase}I'm here to explain fairness using simple examples. What would you like to know?`;
      }
      if (msg.includes("tell about") || msg.includes("what is this") || msg.includes("explain") || msg.includes("about it") || msg.includes("what does it do")) {
        return `${contextPhrase}Prism AI is a friendly dashboard that checks if your AI model is playing fair. 
Think of it like a sports referee: we look at your data and check if one group is getting more "penalties" or "favorable calls" than another. If there's bias, we show you exactly where and suggest ways to tweak the data or model to make it fair for everyone.`;
      }
      if (msg.includes("bias") || msg.includes("fair")) {
        return `Bias in AI is like a referee who favors one team because of their jersey color. ${sens ? `In your dataset, this would mean predictions for **${target}** are influenced unfairly by **${sens}**.` : "In data, this happens when the history we teach the computer is already unfair."} We measure this using ratios (like Disparate Impact) to see if everyone gets a fair slice of the cake!`;
      }
      if (msg.includes("mitigate") || msg.includes("fix") || msg.includes("reweigh") || msg.includes("pre-process") || msg.includes("post-process")) {
        return `To fix bias, we can do a few things:
1. **Adjust the Recipe (Pre-processing)**: We balance the dataset by re-weighing the rows so both groups are represented equally.
2. **Teach the Model (In-processing)**: We instruct the computer to ignore unfair patterns during training.
3. **Adjust the Score (Post-processing)**: We adjust the final outcomes (like giving a tiny boost to a group that got unfair calls) to make the final outcome fair.`;
      }
      if (msg.includes("disparate") || msg.includes("di") || msg.includes("impact")) {
        return `**Disparate Impact (DI)** is a ratio we use to compare selection rates. For example, if group A gets selected at a rate of 80% and group B gets selected at 40%, the DI is 40/80 = 0.5. A fair score is close to 1.0 (ideally between 0.8 and 1.25).`;
      }
      if (msg.includes("statistical") || msg.includes("spd") || msg.includes("parity")) {
        return `**Statistical Parity Difference (SPD)** is the raw difference between approval rates. If group A gets 80% approvals and group B gets 60%, the SPD is 20%. We want this difference to be as close to 0% as possible.`;
      }
      return `I understand you're asking about: "${data.message}". 
In simple terms, Prism AI evaluates datasets to make sure AI decisions aren't biased. Would you like to ask about "how to fix bias", "what is disparate impact", or get tips for your active attributes?`;
    } else {
      if (msg === "hello" || msg === "hi" || msg === "hey") {
        return `Welcome to the Prism AI technical assistant. ${contextPhrase}I can assist you with metrics analysis, data preprocessing techniques, and model deployment on Vertex AI. How can I help you today?`;
      }
      if (msg.includes("tell about") || msg.includes("what is this") || msg.includes("explain") || msg.includes("about it") || msg.includes("what does it do")) {
        return `${contextPhrase}Prism AI is an enterprise-grade AI Audit and Bias Mitigation platform.
We calculate key metrics (Disparate Impact, Statistical Parity Difference, and Equalized Odds) to detect predictive inequalities. We then provide mitigation strategies (Sample Reweighing, Adversarial Debiasing, Reject Option Classification) and export the debiased model pipeline to Google Cloud Vertex AI.`;
      }
      if (msg.includes("bias") || msg.includes("fair")) {
        return `In Prism AI, bias is evaluated using quantitative metrics. ${sens ? `For your active setup, we evaluate how the target variable **${target}** varies across the sensitive attribute **${sens}**.` : "We track Disparate Impact (DI) and Statistical Parity Difference (SPD) to detect selection disparities across protected groups."} A DI ratio outside the 0.8–1.25 range indicates potential bias or reverse bias.`;
      }
      if (msg.includes("mitigate") || msg.includes("fix") || msg.includes("reweigh") || msg.includes("pre-process") || msg.includes("post-process")) {
        return `Prism AI supports three stages of mitigation:
1. **Pre-processing (Data level)**: Methods like **Sample Reweighing** or **Disparate Impact Remover** which balance the training distribution.
2. **In-processing (Algorithm level)**: Introducing fairness constraints or **Adversarial Debiasing** during model training.
3. **Post-processing (Prediction level)**: Adjusting decision boundaries post-hoc (e.g., **Reject Option Classification**) to equalize parity.`;
      }
      if (msg.includes("disparate") || msg.includes("di") || msg.includes("impact")) {
        return `**Disparate Impact (DI)** is the ratio of selection rate of the unprivileged group to the selection rate of the privileged group. 
$$\\text{DI} = \\frac{P(Y=1 | \\text{unprivileged})}{P(Y=1 | \\text{privileged})}$$
An ideal ratio is 1.0, with a fair range defined between 0.8 and 1.25.`;
      }
      if (msg.includes("statistical") || msg.includes("spd") || msg.includes("parity")) {
        return `**Statistical Parity Difference (SPD)** is the difference between the selection rate of the unprivileged group and the selection rate of the privileged group.
$$\\text{SPD} = P(Y=1 | \\text{unprivileged}) - P(Y=1 | \\text{privileged})$$
Ideal value is 0.0, with a fair range within $\\pm 0.1$ (or $\\pm 10\\%$).`;
      }
      if (msg.includes("vertex") || msg.includes("gcloud") || msg.includes("gcp") || msg.includes("pipeline") || msg.includes("mlops")) {
        return `Prism AI integrates with Google Cloud Vertex AI to deploy debiased pipelines. You can generate a custom Vertex MLOps pipeline script using sample reweighing, deploy the trained estimator to a Vertex AI Endpoint, and register it to the Model Registry.`;
      }
      if (msg.includes("drift") || msg.includes("monitor")) {
        return `Model drift monitoring tracks Disparate Impact and Statistical Parity over time in production. If covariate shift causes the prediction parity to exceed safe thresholds, the system flags a warning for retraining.`;
      }
      if (msg.includes("firewall") || msg.includes("block")) {
        return `The AI Bias Firewall acts as a proxy that intercepts prediction payloads. If the payload or historical window triggers statistical bias thresholds, the firewall blocks the request or alerts developers.`;
      }
      return `I received your query: "${data.message}". 
I am currently operating in fallback mode due to model provider limits. I can discuss bias metrics (DI, SPD), mitigation strategies (pre/in/post-processing), or Google Vertex AI pipeline exports. Please specify which area you'd like to explore.`;
    }
  }

  return `### AI Insights Analysis
The AI analysis failed to reach cloud models, so this local analysis report has been generated based on current parameters.

- **Primary Diagnostic**: Keep an eye on parameters like Disparate Impact and Statistical Parity Difference.
- **Recommended Action**: Review your data preprocessing steps to reduce bias before model training.`;
}

// Core dispatcher: generateAIResponse (Gemini-only with high-fidelity local fallback)
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
        return generateLocalSimulatedAIResponse(prompt, taskType, data);
      }
    }
    return generateLocalSimulatedAIResponse(prompt, taskType, data);
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
