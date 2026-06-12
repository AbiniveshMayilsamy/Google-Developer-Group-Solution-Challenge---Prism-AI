const { GoogleGenAI } = require("@google/genai");

const GEMINI_MODELS = [
  "models/gemini-2.5-flash",
  "models/gemini-2.0-flash-lite-001",
  "models/gemini-2.0-flash",
  "models/gemini-2.0-flash-001",
];

// ─── Timeout wrapper ──────────────────────────────────────────────────────────
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

// ─── Gemini (primary) ─────────────────────────────────────────────────────────
async function tryGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env");

  const ai = new GoogleGenAI({ apiKey });
  const errors = [];

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`🔌 Trying Gemini model: ${modelName}`);
      const response = await withTimeout(
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
        }),
        30000,
      );
      const text = response.text;
      if (text && text.trim()) {
        console.log(`✅ Gemini (${modelName}) succeeded`);
        return { text: text.trim(), provider: `Gemini (${modelName})` };
      }
    } catch (err) {
      console.warn(`⚠️  Gemini (${modelName}) failed:`, err.message);
      errors.push(`${modelName}: ${err.message}`);
    }
  }
  throw new Error(`All Gemini models failed — ${errors.join(" | ")}`);
}

// ─── HuggingFace (fallback 1) ─────────────────────────────────────────────────
async function tryHuggingFace(prompt) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY not set");

  const HF_MODELS = [
    "mistralai/Mistral-7B-Instruct-v0.3",
    "HuggingFaceH4/zephyr-7b-beta",
  ];

  const errors = [];
  for (const model of HF_MODELS) {
    try {
      console.log(`🔌 Trying HuggingFace: ${model}`);
      const res = await withTimeout(
        fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 800,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        }),
        25000,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const text = data?.[0]?.generated_text || data?.generated_text;
      if (text && text.trim()) {
        console.log(`✅ HuggingFace (${model}) succeeded`);
        return { text: text.trim(), provider: `HuggingFace (${model})` };
      }
    } catch (err) {
      console.warn(`⚠️  HuggingFace (${model}) failed:`, err.message);
      errors.push(`${model}: ${err.message}`);
    }
  }
  throw new Error(`All HuggingFace models failed — ${errors.join(" | ")}`);
}

// ─── OpenAI (fallback 2) ──────────────────────────────────────────────────────
async function tryOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  console.log("🔌 Trying OpenAI gpt-4o-mini");
  const res = await withTimeout(
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      }),
    }),
    25000,
  );
  if (!res.ok)
    throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI");
  console.log("✅ OpenAI succeeded");
  return { text: text.trim(), provider: "OpenAI (gpt-4o-mini)" };
}

// ─── Claude (fallback 3) ──────────────────────────────────────────────────────
async function tryClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  console.log("🔌 Trying Claude claude-3-haiku-20240307");
  const res = await withTimeout(
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    }),
    25000,
  );
  if (!res.ok)
    throw new Error(`Claude HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Claude");
  console.log("✅ Claude succeeded");
  return { text: text.trim(), provider: "Claude (claude-3-haiku)" };
}

// ─── Core dispatcher ──────────────────────────────────────────────────────────
async function generateAIResponse(prompt, taskType, data = {}) {
  let finalPrompt = prompt;
  if (data.laymanMode) {
    finalPrompt = `IMPORTANT: The user is a layperson. Explain in simple, friendly terms with analogies. Avoid jargon.\n\n${prompt}`;
  }

  const providers = [tryGemini, tryHuggingFace, tryOpenAI, tryClaude];
  const providerNames = ["Gemini", "HuggingFace", "OpenAI", "Claude"];
  const allErrors = [];

  for (let i = 0; i < providers.length; i++) {
    try {
      const result = await providers[i](finalPrompt);
      if (i > 0) console.log(`ℹ️  Fallback used: ${result.provider}`);
      return result.text;
    } catch (err) {
      console.warn(`❌ ${providerNames[i]} unavailable:`, err.message);
      allErrors.push(`${providerNames[i]}: ${err.message}`);
    }
  }

  console.warn("ℹ️ All primary and secondary API providers failed. Activating local high-fidelity fallback.");
  return tryLocalMockFallback(prompt, taskType, data);
}

// ─── Local Mock Fallback Generator ───────────────────────────────────────────
function tryLocalMockFallback(prompt, taskType, data = {}) {
  const warning = `💡 **Local Demo Mode**: Gemini API key is invalid or rate-limited. Displaying local AI audit analysis.\n\n`;

  if (taskType === "bias-metric-analysis") {
    const metrics = data.metrics || {};
    const config = data.config || {};
    const di = metrics.disparateImpact ?? 0.76;
    const spd = metrics.statisticalParityDifference ?? -0.15;
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

    const targetAttribute = config.targetAttribute || "Hiring Decision";
    const sensitiveAttribute = config.sensitiveAttribute || "Gender";
    const privilegedGroup = config.privilegedGroup || "Male";
    const unprivilegedGroup = config.unprivilegedGroup || "Female";
    const privRate = ((metrics.privFavorableRate ?? 0.85) * 100).toFixed(1);
    const unprivRate = ((metrics.unprivFavorableRate ?? 0.65) * 100).toFixed(1);

    if (data.laymanMode) {
      return (
        warning +
        `## What the numbers mean
Think of this like sharing a box of chocolates among two groups of students: ${privilegedGroup}s and ${unprivilegedGroup}s. We want to be fair and give everyone an equal shot at getting a chocolate. If we end up giving almost all the chocolates to ${privilegedGroup}s and very few to ${unprivilegedGroup}s, that's not fair.

Here, the selection rate shows that we are favoring one group. The disparity index is like a ratio: if it's 1.0, both groups got chocolates equally. If it is lower than 0.8, ${unprivilegedGroup}s are getting left out. If it is higher than 1.25, ${unprivilegedGroup}s are getting way too many compared to ${privilegedGroup}s, which also causes an imbalance.

## Bias verdict
Based on the selection rate ratio of **${di.toFixed(4)}** and statistical difference of **${(spd * 100).toFixed(2)}%**, there is a clear bias in how candidates are being selected. The system flagged this as a **${diStatus}** state with respect to ${sensitiveAttribute}.

## Immediate actions
1. Adjust the hiring criteria so we look at candidates without being influenced by sensitive attributes like ${sensitiveAttribute}.
2. Balance the dataset by giving extra attention or support to the group that is underrepresented (${unprivilegedGroup}).
3. Use fairness-boosting methods (like reweighing or adjusting score thresholds) to balance selections.`
      );
    } else {
      return (
        warning +
        `## What the numbers mean
| Metric | Current Value | Target Value | Status | Interpretation |
| :--- | :--- | :--- | :--- | :--- |
| Disparate Impact (DI) | **${di.toFixed(4)}** | 1.0 (Range: 0.80 - 1.25) | **${diStatus}** | Selection rate for ${unprivilegedGroup} is ${di.toFixed(2)}x that of ${privilegedGroup}. |
| Statistical Parity Diff (SPD) | **${(spd * 100).toFixed(2)}%** | 0.0% (Range: ±10.0%) | **${spdStatus}** | The difference in selection probability between groups is ${(spd * 100).toFixed(1)}%. |

## Bias verdict
**Status: ${diStatus}**
The system has evaluated the dataset with respect to the sensitive attribute **${sensitiveAttribute}** (Target: **${targetAttribute}**). A disparate impact ratio of **${di.toFixed(4)}** indicates that the selection rates between the privileged (${privilegedGroup}: ${privRate}%) and unprivileged (${unprivilegedGroup}: ${unprivRate}%) groups deviate significantly from the equity baseline. Immediate mitigation is recommended.

## Immediate actions
1. **Pre-processing Reweighing**: Apply frequency weights to input instances prior to model training to neutralize historical bias in the training set.
2. **Threshold Optimization**: Apply Reject Option Classification (ROC) post-hoc to optimize decision boundaries near the classification threshold for ${unprivilegedGroup}.
3. **Fairness Constraints**: Retrain the classifier using in-processing constraints (e.g., adversarial debiasing) to minimize mutual information between predictions and sensitive indicators.`
      );
    }
  }

  if (taskType === "recommendations") {
    const metrics = data.metrics || {};
    const datasetContext = data.datasetContext || {};
    const sens = datasetContext.sensitiveAttribute || "Gender";

    let contextSpecificPre = "";
    let contextSpecificIn = "";
    let contextSpecificPost = "";

    if (["Caste_Category", "Dialect_Accent", "State_of_Origin"].includes(sens)) {
      contextSpecificPre = `* **Mitigate Caste/Regional Hiring Disparities**: For the Indian hiring context with sensitive attribute "${sens}", apply pre-processing frequency reweighing to neutralize historical systemic underrepresentation of Reserved/Regional groups without losing informational feature entropy.`;
      contextSpecificIn = `* **Linguistic/Demographic Adversarial Debiasing**: Train an adversarial network alongside the main classifier to guarantee that embeddings are completely orthogonal to caste identifiers or regional accent features.`;
      contextSpecificPost = `* **Linguistic Equalized Odds**: Recalibrate acceptance thresholds per accent or origin category to achieve identical true positive and false positive rates.`;
    } else {
      contextSpecificPre = `* **Sample Weight Reweighing**: Apply frequency weights to input instances prior to model training to neutralize historical bias in the training set for sensitive attribute "${sens}".`;
      contextSpecificIn = `* **Adversarial Debiasing**: Implement adversarial training constraints to minimize mutual information between predictions and sensitive indicators ("${sens}").`;
      contextSpecificPost = `* **Reject Option Classification**: Apply post-hoc threshold adjustment to optimize decision boundaries near the classification threshold for the unprivileged group.`;
    }

    if (data.laymanMode) {
      return (
        warning +
        `1. **Pre-processing (Data Level)**:
   * We need to balance the dataset before training. We can do this by assigning higher weights to the unprivileged group (${sens}) in our training data.
   ${contextSpecificPre}
2. **In-processing (Model Level)**:
   * We can train our model with fairness rules so it learns to ignore the sensitive attribute during training.
   ${contextSpecificIn}
3. **Post-processing (Output Level)**:
   * We can adjust the final scores slightly for candidates near the borderline to make sure both groups are treated equally.
   ${contextSpecificPost}`
      );
    } else {
      return (
        warning +
        `1. **Pre-processing (Data Level)**:
   * **Sample Reweighing**: Apply mathematical frequency weights to the training dataset. This adjusts the importance of samples based on their sensitive group and outcome to ensure the training algorithm treats groups equally.
   ${contextSpecificPre}
2. **In-processing (Model Level)**:
   * **Grid Search / Exponentiated Gradient**: Train the estimator with constraint optimization, introducing a penalty term directly in the loss function to minimize classification disparity based on "${sens}".
   ${contextSpecificIn}
3. **Post-processing (Output Level)**:
   * **Reject Option Classification (ROC)**: Adjust probability thresholds for predictions near the decision boundary. Candidates in the unprivileged group who are within a critical threshold region get favorable outcomes boosted to satisfy equalized odds or demographic parity.
   ${contextSpecificPost}`
      );
    }
  }

  if (taskType === "audit") {
    const auditData = data.auditData || {};
    const datasetName = auditData.datasetName || "Uploaded Dataset";
    const sensitiveAttribute = auditData.sensitiveAttribute || "Gender";
    const metrics = auditData.metrics || {};
    const di = metrics.disparateImpact ?? 0.76;
    const spd = metrics.statisticalParityDifference ?? -0.15;
    const status = auditData.status || "BIASED";

    return (
      warning +
      `* **Audit Focus**: Completed a comprehensive fairness evaluation of the dataset **${datasetName}** using sensitive attribute **${sensitiveAttribute}**.
* **Disparity Verdict**: The dataset exhibits a disparate impact ratio of **${di.toFixed(3)}** and statistical parity difference of **${(spd * 100).toFixed(1)}%**, resulting in a classification of **${status}**.
* **Hiring Impact**: Unprivileged group selection rates violate the standard four-fifths rule (0.80), demonstrating clear underrepresentation in favorable outcomes.
* **Primary Mitigation Recommendation**: Implement pre-processing sample reweighing followed by a Bias Firewall for runtime prediction shielding.`
    );
  }

  if (taskType === "drift") {
    const driftMetrics = data.driftMetrics || {};
    const currentValue = driftMetrics.currentValue ?? 0.76;
    const historicalAverage = driftMetrics.historicalAverage ?? 1.0;
    const trend = driftMetrics.trend ?? "Worsening";
    const sensitiveAttribute = driftMetrics.sensitiveAttribute ?? "Gender";

    return (
      warning +
      `Model bias has shifted from a historical Disparate Impact of **${historicalAverage}** to a current value of **${currentValue}**, representing a **${trend}** trend for sensitive attribute **${sensitiveAttribute}**. This drift is likely driven by changes in candidate demographics or system feedback loops, requiring immediate threshold recalibration.`
    );
  }

  if (taskType === "firewall") {
    const blockedReason = data.blockedReason || "High disparate impact risk";
    const endpoint = data.endpoint || "hiring";

    return (
      warning +
      `The prediction request to endpoint \`/${endpoint}\` was blocked because the incoming feature combination triggered a Bias Firewall policy due to: **${blockedReason}**. To fix this, developers should deploy a mitigated model version or pass inputs through a real-time bias transformer to balance selection probabilities.`
    );
  }

  if (taskType === "vertex-pipeline") {
    const metrics = data.metrics || {};
    const config = data.config || {};
    const di = metrics.disparateImpact ?? 0.76;
    const spd = metrics.statisticalParityDifference ?? -0.15;
    const targetAttribute = config.targetAttribute || "Hiring Decision";
    const sensitiveAttribute = config.sensitiveAttribute || "Gender";
    const privilegedGroup = config.privilegedGroup || "Male";
    const unprivilegedGroup = config.unprivilegedGroup || "Female";
    const favorableOutcome = config.favorableOutcome || "Hired";

    return (
      warning +
      `\`\`\`python
# ==============================================================================
# Vertex AI Bias Mitigation & Model Registry Pipeline
# Generated in Local Demo Mode
# Metrics context: Current DI: ${di.toFixed(3)}, SPD: ${(spd * 100).toFixed(1)}%
# Target: ${targetAttribute}, Sensitive: ${sensitiveAttribute}
# ==============================================================================

import os
import pandas as pd
import numpy as np
from google.cloud import aiplatform
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.utils.class_weight import compute_sample_weight

def init_and_run_pipeline():
    # 1. Initialize Google Vertex AI SDK
    aiplatform.init(
        project=os.environ.get("GCP_PROJECT_ID", "prism-ai-demo"),
        location=os.environ.get("GCP_REGION", "us-central1")
    )
    
    # 2. Load dataset from GCS Bucket
    gcs_uri = f"gs://{os.environ.get('GCS_BUCKET', 'prism-ai-datasets')}/hiring_data.csv"
    print(f"Reading dataset from: {gcs_uri}")
    df = pd.read_csv(gcs_uri)
    
    # 3. Apply sample reweighing for Bias Mitigation
    # We construct sample weights to equalize the selection rates of sensitive attribute groups
    sensitive_col = "${sensitiveAttribute}"
    target_col = "${targetAttribute}"
    
    # Calculate group outcomes
    n = len(df)
    n_priv = len(df[df[sensitive_col] == "${privilegedGroup}"])
    n_unpriv = len(df[df[sensitive_col] == "${unprivilegedGroup}"])
    
    n_fav = len(df[df[target_col] == "${favorableOutcome}"])
    n_unfav = len(df[df[target_col] != "${favorableOutcome}"])
    
    # Calculate intersection counts
    n_priv_fav = len(df[(df[sensitive_col] == "${privilegedGroup}") & (df[target_col] == "${favorableOutcome}")])
    n_priv_unfav = len(df[(df[sensitive_col] == "${privilegedGroup}") & (df[target_col] != "${favorableOutcome}")])
    n_unpriv_fav = len(df[(df[sensitive_col] == "${unprivilegedGroup}") & (df[target_col] == "${favorableOutcome}")])
    n_unpriv_unfav = len(df[(df[sensitive_col] == "${unprivilegedGroup}") & (df[target_col] != "${favorableOutcome}")])
    
    # Compute weight dictionary for group combinations
    weights = []
    for idx, row in df.iterrows():
        s = row[sensitive_col]
        y = row[target_col]
        
        if s == "${privilegedGroup}" and y == "${favorableOutcome}":
            w = (n_priv * n_fav) / (n * n_priv_fav) if n_priv_fav > 0 else 1.0
        elif s == "${privilegedGroup}" and y != "${favorableOutcome}":
            w = (n_priv * n_unfav) / (n * n_priv_unfav) if n_priv_unfav > 0 else 1.0
        elif s == "${unprivilegedGroup}" and y == "${favorableOutcome}":
            w = (n_unpriv * n_fav) / (n * n_unpriv_fav) if n_unpriv_fav > 0 else 1.0
        else:
            w = (n_unpriv * n_unfav) / (n * n_unpriv_unfav) if n_unpriv_unfav > 0 else 1.0
        weights.append(w)
        
    df["sample_weight"] = weights
    
    # Prepare features and target
    X = df.drop(columns=[target_col, sensitive_col, "sample_weight"], errors="ignore")
    # One-hot encode categorical features
    X = pd.get_dummies(X, drop_first=True)
    y = (df[target_col] == "${favorableOutcome}").astype(int)
    
    X_train, X_test, y_train, y_test, w_train, w_test = train_test_split(
        X, y, df["sample_weight"], test_size=0.2, random_state=42
    )
    
    # 4. Train RandomForestClassifier with bias mitigation sample weights
    print("Training RandomForest Classifier with sample weights...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train, sample_weight=w_train)
    
    # Evaluate performance and bias metrics
    accuracy = model.score(X_test, y_test)
    print(f"Mitigated Model Accuracy: {accuracy:.4f}")
    
    # 5. Upload model to Google Vertex AI Model Registry
    print("Uploading mitigated model to Vertex AI Model Registry...")
    model_uploaded = aiplatform.Model.upload(
        display_name="prism-mitigated-hiring-model",
        artifact_uri=f"gs://{os.environ.get('GCS_BUCKET')}/model_artifacts/",
        serving_container_image_uri="us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.1-0:latest"
    )
    
    # 6. Deploy model to online Vertex AI Endpoint
    print("Deploying model to Endpoint...")
    endpoint = model_uploaded.deploy(
        machine_type="n1-standard-4",
        min_replica_count=1,
        max_replica_count=3
    )
    print(f"Model deployed successfully! Endpoint Name: {endpoint.resource_name}")

if __name__ == "__main__":
    init_and_run_pipeline()
\`\`\``
    );
  }

  if (taskType === "chat") {
    const message = (data.message || "").toLowerCase();

    let answer = "";
    if (message.includes("disparate impact") || message.includes("di")) {
      answer = `**Disparate Impact (DI)** is a key metric used to identify systemic bias. It's calculated by taking the selection rate of the unprivileged group and dividing it by the selection rate of the privileged group:
$$\\text{Disparate Impact} = \\frac{\\text{Selection Rate (Unprivileged)}}{\\text{Selection Rate (Privileged)}}$$

Under the US EEOC's "four-fifths rule," a DI value below **0.80** indicates a adverse impact/bias against the unprivileged group. A DI of **1.0** indicates perfect fairness. Values above **1.25** represent reverse bias, meaning the unprivileged group is selected at a much higher rate.`;
    } else if (message.includes("statistical parity") || message.includes("spd")) {
      answer = `**Statistical Parity Difference (SPD)** measures the difference in selection rates between the unprivileged group and the privileged group:
$$\\text{SPD} = \\text{Selection Rate (Unprivileged)} - \\text{Selection Rate (Privileged)}$$

Ideally, SPD should be **0%** (no difference). An SPD within **-10% to +10%** is generally considered fair. A large negative percentage shows bias against the unprivileged group.`;
    } else if (message.includes("mitigate") || message.includes("fix") || message.includes("reweigh")) {
      answer = `Prism AI offers three stages of bias mitigation:
1. **Pre-processing (Data Level)**: Modifies training datasets before model training (e.g., **Reweighing**, which applies mathematical weights to samples to equalize outcomes).
2. **In-processing (Model Level)**: Adds fairness constraints directly during training (e.g., **Adversarial Debiasing**).
3. **Post-processing (Output Level)**: Adjusts model decision boundaries on predictions after training (e.g., **Reject Option Classification**).`;
    } else if (message.includes("caste") || message.includes("accent") || message.includes("india")) {
      answer = `In Indian recruitment systems, structural biases often emerge around:
- **Caste Category** (General vs Reserved categories)
- **Dialect/Accent** (Regional vs Urban standard pronunciations)
- **State of Origin**

Prism AI helps flag and correct these imbalances. For dialect and accent bias, it is recommended to augment recruitment audio transcripts to normalize acoustic features, or utilize Reject Option Classification to adjust scoring boundaries.`;
    } else if (message.includes("export") || message.includes("csv")) {
      answer = `To export your debiased dataset:
1. Navigate to the **Bias Fixer** card.
2. Ensure you have calculated your mitigated results (Disparate Impact neutralized to ~1.0).
3. Click the **Export Mitigated Balanced CSV** button. The system will automatically download a balanced, re-weighted, or resampled version of the dataset ready to retrain your models bias-free.`;
    } else if (message.includes("how are you") || message.includes("hello") || message.includes("hi")) {
      answer = `Hello! I am the Prism AI virtual assistant. I can help explain AI fairness concepts, guide you through mitigating bias in your datasets, explain metrics like Disparate Impact and Statistical Parity Difference, or explain how to configure B2B firewalls. How can I help you today?`;
    } else {
      answer = `Prism AI is a premium platform for auditing model fairness, tracking drift, deploying Bias Firewalls, and generating Vertex AI pipelines. 

To evaluate bias in your data:
1. Go to **New Audit** and upload a dataset.
2. Select your Target attribute, Sensitive attribute, and Privileged/Unprivileged groups.
3. Review the **Fairness Meter** analysis to see if your model is biased.
4. Use the **Bias Fixer** card to mitigate bias and export a balanced CSV.

Let me know if you have any questions about specific fairness metrics, B2B integrations, or pipelines!`;
    }

    if (data.laymanMode) {
      answer = answer + `\n\n*Note: I have simplified this explanation. Let me know if you would like technical equations or machine learning details!*`;
    }

    return warning + answer;
  }

  return warning + `Successfully generated simulation response for task type "${taskType}".`;
}

// ─── Bias Metric Analysis ─────────────────────────────────────────────────────
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

NOTE: DI > 1.25 means REVERSE BIAS — unprivileged group is over-favoured, NOT a good result. Both extremes indicate bias.

Respond in clean Markdown with exactly 3 sections:
## What the numbers mean
## Bias verdict
## Immediate actions`;

  return generateAIResponse(prompt, "bias-metric-analysis", { laymanMode, metrics, config });
}

// ─── Recommendations ──────────────────────────────────────────────────────────
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

  return generateAIResponse(prompt, "recommendations", { laymanMode, metrics, datasetContext });
}

// ─── Audit Summary ────────────────────────────────────────────────────────────
async function getAuditSummary(auditData, laymanMode) {
  const prompt = `Summarize this AI Fairness Audit in 3-4 bullet points.
Dataset: ${auditData?.datasetName || "Dataset"}
Sensitive Attribute: ${auditData?.sensitiveAttribute}
Metrics: DI=${auditData?.metrics?.disparateImpact?.toFixed(3)}, SPD=${(auditData?.metrics?.statisticalParityDifference * 100)?.toFixed(1)}%
Status: ${auditData?.status}

Focus on bias severity and the most critical improvement needed.`;

  return generateAIResponse(prompt, "audit", { laymanMode, auditData });
}

// ─── Drift Explanation ────────────────────────────────────────────────────────
async function getDriftExplanation(driftMetrics, laymanMode) {
  const prompt = `Explain this AI model bias pattern in 2-3 sentences:
- Disparate Impact now: ${driftMetrics?.currentValue ?? "unknown"}
- Original / baseline: ${driftMetrics?.historicalAverage ?? "unknown"}
- Trend: ${driftMetrics?.trend ?? "unknown"}
- Sensitive Attribute: ${driftMetrics?.sensitiveAttribute ?? "unknown"}

What is causing this and what is the immediate next step?`;

  return generateAIResponse(prompt, "drift", { laymanMode, driftMetrics });
}

// ─── Firewall Insight ─────────────────────────────────────────────────────────
async function getFirewallInsight(blockedReason, endpoint, laymanMode) {
  const prompt = `An AI prediction request to "${endpoint}" was blocked.
Reason: ${blockedReason}

In exactly 2 sentences: why was it blocked, and how can the developer fix the underlying bias?`;

  return generateAIResponse(prompt, "firewall", { laymanMode, blockedReason, endpoint });
}

// ─── Vertex AI Pipeline ───────────────────────────────────────────────────────
async function getVertexPipeline(metrics, config) {
  const prompt = `You are a Senior Google Cloud MLOps Architect. Write a complete production-ready Python script using Google Vertex AI, GCS, and bias mitigation.

Context:
- Target: ${config.targetAttribute}, Sensitive: ${config.sensitiveAttribute}
- Privileged: ${config.privilegedGroup}, Unprivileged: ${config.unprivilegedGroup}
- Favorable outcome: ${config.favorableOutcome}
- Current DI: ${metrics.disparateImpact?.toFixed(3)}, SPD: ${(metrics.statisticalParityDifference * 100)?.toFixed(1)}%

Script must: init Vertex AI SDK, load from GCS, apply sample reweighing for bias mitigation, train RandomForestClassifier with weights, upload to Vertex AI Model Registry, deploy to endpoint, log with Cloud Logging.

Provide ONLY Python code in a markdown code block with config comments.`;

  return generateAIResponse(prompt, "vertex-pipeline", { laymanMode: false, metrics, config });
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
