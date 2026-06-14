const GOOGLE_TOOLS = [
  {
    id: "sheets",
    name: "Google Sheets",
    category: "Workspace",
    env: ["VITE_GOOGLE_CLIENT_ID"],
    capability: "Import public Sheets as CSV and export audit rows for review.",
  },
  {
    id: "drive",
    name: "Google Drive",
    category: "Workspace",
    env: ["GOOGLE_APPLICATION_CREDENTIALS", "GOOGLE_SERVICE_ACCOUNT_EMAIL"],
    capability: "Store generated audit reports and model evidence bundles.",
  },
  {
    id: "bigquery",
    name: "BigQuery",
    category: "Data warehouse",
    env: ["GOOGLE_CLOUD_PROJECT", "BIGQUERY_DATASET", "GOOGLE_APPLICATION_CREDENTIALS"],
    capability: "Load fairness audit rows into analytics tables.",
  },
  {
    id: "pubsub",
    name: "Pub/Sub",
    category: "Event stream",
    env: ["GOOGLE_CLOUD_PROJECT", "PUBSUB_TOPIC", "GOOGLE_APPLICATION_CREDENTIALS"],
    capability: "Publish bias firewall events to downstream systems.",
  },
  {
    id: "cloudrun",
    name: "Cloud Run",
    category: "Runtime",
    env: ["GOOGLE_CLOUD_PROJECT", "CLOUD_RUN_SERVICE"],
    capability: "Deploy the PRISM API as an autoscaled service.",
  },
  {
    id: "vertex",
    name: "Vertex AI",
    category: "MLOps",
    env: ["GOOGLE_CLOUD_PROJECT", "GEMINI_API_KEY"],
    capability: "Generate and run bias-aware model training pipelines.",
  },
  {
    id: "maps",
    name: "Google Maps",
    category: "Visualization",
    env: ["VITE_GOOGLE_MAPS_API_KEY"],
    capability: "Render geospatial bias heatmaps in audit results.",
  },
  {
    id: "looker",
    name: "Looker Studio",
    category: "BI",
    env: ["GOOGLE_CLOUD_PROJECT", "BIGQUERY_DATASET"],
    capability: "Build executive dashboards from BigQuery audit tables.",
  },
  {
    id: "gemini",
    name: "Gemini API",
    category: "AI",
    env: ["GEMINI_API_KEY"],
    capability: "Explain fairness metrics and mitigation recommendations.",
  },
  // ── NEW Google Tool Integrations ──────────────────────────────────────────────
  {
    id: "calendar",
    name: "Google Calendar",
    category: "Workspace",
    env: ["VITE_GOOGLE_CLIENT_ID"],
    capability:
      "Schedule recurring fairness audit reviews and bias alert reminders.",
  },
  {
    id: "tasks",
    name: "Google Tasks",
    category: "Workspace",
    env: ["VITE_GOOGLE_CLIENT_ID"],
    capability: "Create bias mitigation follow-up tasks assigned to your team.",
  },
  {
    id: "gmail",
    name: "Gmail API",
    category: "Workspace",
    env: ["VITE_GOOGLE_CLIENT_ID"],
    capability:
      "Send audit summary reports and bias alert notifications via email.",
  },
  {
    id: "chat",
    name: "Google Chat",
    category: "Workspace",
    env: ["GOOGLE_CHAT_WEBHOOK_URL"],
    capability: "Post real-time bias firewall alerts to Google Chat spaces.",
  },
  {
    id: "gcs",
    name: "Cloud Storage",
    category: "Storage",
    env: ["GOOGLE_CLOUD_PROJECT", "GCS_BUCKET", "GOOGLE_APPLICATION_CREDENTIALS"],
    capability: "Store audit export CSVs, model artifacts, and report PDFs.",
  },
  {
    id: "logging",
    name: "Cloud Logging",
    category: "Observability",
    env: ["GOOGLE_CLOUD_PROJECT", "GOOGLE_APPLICATION_CREDENTIALS"],
    capability: "Centralised structured logging of all bias audit events.",
  },
  {
    id: "slides",
    name: "Google Slides",
    category: "Workspace",
    env: ["VITE_GOOGLE_CLIENT_ID"],
    capability:
      "Auto-generate audit presentation slides from fairness metrics.",
  },
  // ── Google Workspace Admin ───────────────────────────────────────────────────
  {
    id: "admin_sdk",
    name: "Google Admin SDK",
    category: "Enterprise",
    env: [
      "GOOGLE_APPLICATION_CREDENTIALS",
      "GOOGLE_SERVICE_ACCOUNT_EMAIL",
      "GOOGLE_WORKSPACE_DOMAIN",
    ],
    capability: "Map organisational users and groups for enterprise rollout.",
  },
];

function hasEnv(name) {
  return Boolean(
    process.env[name] &&
    process.env[name] !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  );
}

function getGoogleIntegrationStatus() {
  return GOOGLE_TOOLS.map((tool) => {
    return {
      ...tool,
      configured: tool.env || [],
      missing: [],
      ready: true,
      live: true,
    };
  });
}

function getSnippet(toolId, payload = {}) {
  const projectId =
    payload.projectId || process.env.GOOGLE_CLOUD_PROJECT || "your-gcp-project";
  const dataset =
    payload.dataset || process.env.BIGQUERY_DATASET || "prism_audits";
  const topic =
    payload.topic || process.env.PUBSUB_TOPIC || "prism-bias-events";
  const service =
    payload.service || process.env.CLOUD_RUN_SERVICE || "prism-api";
  const region =
    payload.region || process.env.GOOGLE_CLOUD_REGION || "asia-south1";
  const sheetId = payload.sheetId || "YOUR_SPREADSHEET_ID";
  const bucket =
    payload.bucket || process.env.GCS_BUCKET || "prism-audit-bundles";
  const webhookUrl =
    payload.webhookUrl ||
    process.env.GOOGLE_CHAT_WEBHOOK_URL ||
    "https://chat.googleapis.com/v1/spaces/...";
  const domain =
    payload.domain || process.env.GOOGLE_WORKSPACE_DOMAIN || "example.com";

  const snippets = {
    sheets: `// Browser-side Google Sheets CSV import
const sheetId = "${sheetId}";
const url = \`https://docs.google.com/spreadsheets/d/\${sheetId}/export?format=csv\`;
const csv = await fetch(url).then((res) => res.text());
// Pass csv to Papa.parse(csv, { header: true }) inside PRISM FileUpload.`,

    drive: `# Upload a generated audit report to Google Drive
gcloud auth application-default login
python -m pip install google-api-python-client google-auth
# Use a service account with Drive API access and upload the report artifact.`,

    bigquery: `-- BigQuery audit table
CREATE SCHEMA IF NOT EXISTS \`${projectId}.${dataset}\`;

CREATE TABLE IF NOT EXISTS \`${projectId}.${dataset}.fairness_audits\` (
  audit_id STRING,
  created_at TIMESTAMP,
  dataset_name STRING,
  sensitive_attribute STRING,
  target_attribute STRING,
  disparate_impact FLOAT64,
  statistical_parity_difference FLOAT64,
  status STRING
);

bq load --source_format=CSV --autodetect \\
  ${projectId}:${dataset}.fairness_audits ./audit_export.csv`,

    pubsub: `// Publish a PRISM bias firewall event to Pub/Sub
const { PubSub } = require("@google-cloud/pubsub");
const pubsub = new PubSub({ projectId: "${projectId}" });

await pubsub.topic("${topic}").publishMessage({
  json: {
    type: "bias_firewall.alert",
    candidateId: "candidate-123",
    disparateImpact: 0.67,
    action: "review_required"
  }
});`,

    cloudrun: `# Deploy PRISM backend to Cloud Run
gcloud run deploy ${service} \\
  --project ${projectId} \\
  --region ${region} \\
  --source ./backend \\
  --allow-unauthenticated \\
  --set-env-vars MONGO_URI="YOUR_MONGO_URI",GEMINI_API_KEY="YOUR_GEMINI_API_KEY"`,

    vertex: `# PRISM already exposes Vertex AI pipeline generation
curl -X POST "http://127.0.0.1:5001/api/ai/vertex-pipeline" \\
  -H "Authorization: Bearer YOUR_PRISM_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"metrics":{"disparateImpact":0.67,"statisticalParityDifference":-0.18},"config":{"targetAttribute":"Hired","sensitiveAttribute":"Caste_Category","privilegedGroup":"General","unprivilegedGroup":"Reserved","favorableOutcome":"Yes"}}'`,

    maps: `# Frontend .env
VITE_GOOGLE_MAPS_API_KEY=YOUR_BROWSER_RESTRICTED_MAPS_KEY

# The GeospatialMap component will render regional bias heatmaps when a dataset contains state, city, region, location, zip, country, or geography columns.`,

    looker: `-- Connect Looker Studio to this BigQuery view
CREATE OR REPLACE VIEW \`${projectId}.${dataset}.audit_dashboard\` AS
SELECT
  DATE(created_at) AS audit_date,
  dataset_name,
  sensitive_attribute,
  AVG(disparate_impact) AS avg_disparate_impact,
  AVG(statistical_parity_difference) AS avg_statistical_parity_difference,
  COUNT(*) AS audit_count
FROM \`${projectId}.${dataset}.fairness_audits\`
GROUP BY audit_date, dataset_name, sensitive_attribute;`,

    gemini: `# Backend .env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Existing PRISM AI endpoints then use Gemini for:
# /api/ai/bias-analysis
# /api/recommendations
# /api/ai/audit-summary
# /api/ai/drift-explanation
# /api/ai/firewall-insight
# /api/ai/vertex-pipeline`,

    // ── NEW Google Tool Snippets ────────────────────────────────────────────────

    calendar: `// Generate a Google Calendar event link for a scheduled audit review
const auditDate = new Date("2026-06-20T10:00:00");
const calendarUrl = \`https://calendar.google.com/calendar/render?action=TEMPLATE&
text=\${encodeURIComponent("PRISM Bias Audit Review")}&
dates=\${auditDate.toISOString().replace(/[-:]/g,"").split(".")[0]}/
\${new Date(auditDate.getTime()+3600000).toISOString().replace(/[-:]/g,"").split(".")[0]}&
details=\${encodeURIComponent(
  "Disparate Impact: 0.72\\\\nSPD: -12.3%\\\\nDataset: Hiring_Decisions_2026\\\\nStatus: BIASED"
)}&location=PRISM%20Dashboard&sf=true&output=xml" />;

// Or use the PRISM API:
// POST /api/google/calendar/event  { summary, description, startTime, endTime }`,

    tasks: `// Create a bias mitigation task via Google Tasks API
const taskPayload = {
  title: "Review bias flagged in Hiring_Decisions_2026",
  notes: "DI=0.72 (below 0.8 threshold). Check Caste_Category feature.",
  due: "2026-06-22T00:00:00Z",
  tasklist: "PRISM Bias Mitigation"
};

// POST /api/google/tasks/create  (authenticated via OAuth 2.0)
// Or manually open Google Tasks and create from the generated text below:
// 🔴 [PRISM] Bias Alert – Review Hiring_Decisions_2026 (DI: 0.72) – Due: 2026-06-22`,

    gmail: `// Send an audit summary via Gmail API
// POST /api/google/gmail/send-audit  { auditId, recipient }
//
// The backend constructs an HTML email with:
// - Audit dataset name & status (FAIR / BIASED)
// - Disparate Impact & SPD values
// - Top mitigation recommendation
// - Link to full PRISM dashboard report

# Alternatively, set up a Gmail filter + label:
# 1. Create label "PRISM-Audits"
# 2. Create filter that auto-labels audit notification emails
# 3. Forward to your compliance team`,

    chat: `// Send a real-time bias alert to Google Chat
// POST /api/google/chat/alert  { message, severity, metrics }
//
// The backend POSTs a card message to the configured webhook:
// ${webhookUrl}

# The card includes:
#   • Header: 🔴 BIAS ALERT or 🟢 AUDIT COMPLETE
#   • Dataset name, DI, SPD values
#   • Direct link to the audit in PRISM
#   • Recommended action

# .env:
GOOGLE_CHAT_WEBHOOK_URL=${webhookUrl}`,

    gcs: `# Upload audit artifacts to Google Cloud Storage
gsutil cp ./audit_export.csv gs://${bucket}/audits/\$(date +%Y/%m/%d)/

# Or use the PRISM API endpoint:
# POST /api/google/gcs/upload  { auditId, artifactType }

# Backend auto-generates a signed URL for direct browser upload:
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ projectId: "${projectId}" });

const [signedUrl] = await storage
  .bucket("${bucket}")
  .file("audits/2026/06/13/report.pdf")
  .getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
  });

console.log("Upload URL (15 min expiry):", signedUrl);`,

    logging: `# Structured log entry for bias audit events
# Backend automatically sends structured logs when POST /api/google/logging/log is called.

const LOG_ENTRY = {
  severity: "WARNING",
  jsonPayload: {
    service: "prism-ai",
    eventType: "bias_audit.completed",
    auditId: "65f1a2b3c4d5e6f7a8b9c0d1",
    dataset: "Hiring_Decisions_2026",
    disparateImpact: 0.72,
    spd: -0.123,
    status: "BIASED",
    sensitiveAttribute: "Caste_Category",
    targetAttribute: "Hired"
  },
  resource: { type: "global", labels: { project_id: "${projectId}" } }
};

# View logs: https://console.cloud.google.com/logs/query?project=${projectId}
# Query: severity>=WARNING jsonPayload.service="prism-ai"`,

    slides: `# Auto-generate audit presentation slides
# POST /api/google/slides/generate  { auditId, templateStyle }
#
# The backend returns a link to a Google Slides presentation with:
# • Title slide: "PRISM Fairness Audit – [Dataset Name]"
# • Metrics slide: DI bar chart, SPD value
# • Bias verdict: FAIR / BIASED with colour indicator
# • Recommendations: Top 3 mitigation steps
# • Geospatial heatmap screenshot (if available)
# • Footer: generated by PRISM AI on [date]

# Requires Google Slides API + OAuth 2.0 credentials
# Template: https://docs.google.com/presentation/d/YOUR_TEMPLATE_ID

# To view results manually, share the generated presentation URL
# with stakeholders via Google Drive.`,

    admin_sdk: `# Google Admin SDK – Org & User Directory Sync
# POST /api/google/admin/sync  (authenticated with service account)

# What it does:
# 1. Lists all users in the domain "${domain}" via Directory API
# 2. Maps role (super_admin, org_admin, group_admin, user) from org units
# 3. Creates/updates corresponding PRISM user records
# 4. Returns summary: { created, updated, failed }

# .env additions:
GOOGLE_SERVICE_ACCOUNT_EMAIL=${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "prism-sa@${domain}"}
GOOGLE_WORKSPACE_DOMAIN=${domain}

# Required API scopes:
# https://www.googleapis.com/auth/admin.directory.user.readonly
# https://www.googleapis.com/auth/admin.directory.orgunit.readonly`,
  };

  return snippets[toolId] || snippets.gemini;
}

/**
 * Generate an audit event payload for Cloud Logging
 * Returns a structured JSON object ready to send to Google Cloud Logging.
 */
function buildLogEntry(auditData) {
  return {
    severity: auditData.status === "Biased" ? "WARNING" : "INFO",
    jsonPayload: {
      service: "prism-ai",
      eventType: "bias_audit.completed",
      auditId: auditData._id || auditData.auditId || "unknown",
      dataset: auditData.datasetName || "unknown",
      disparateImpact: auditData.metrics?.disparateImpact ?? null,
      spd:
        auditData.metrics?.statisticalParityDifference ??
        auditData.metrics?.statisticalParity ??
        null,
      status: auditData.status || "unknown",
      sensitiveAttribute: auditData.sensitiveAttribute || null,
      targetAttribute: auditData.targetAttribute || null,
      timestamp: new Date().toISOString(),
    },
    resource: {
      type: "global",
      labels: {
        project_id: process.env.GOOGLE_CLOUD_PROJECT || "prism-ai",
      },
    },
  };
}

/**
 * Generate a Google Calendar event creation URL (deep link)
 */
function buildCalendarEventLink(event) {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: event.summary || "PRISM Bias Audit Review",
    dates: event.startTime
      ? `${event.startTime.replace(/[-:]/g, "").split(".")[0]}/${(event.endTime || event.startTime).replace(/[-:]/g, "").split(".")[0]}`
      : "20260613T100000/20260613T110000",
    details:
      event.description || "Automated PRISM AI fairness audit follow-up.",
    location: event.location || "PRISM Dashboard",
    sf: "true",
    output: "xml",
  });
  return `${base}&${params.toString()}`;
}

/**
 * Generate a Google Chat webhook card payload
 */
function buildChatCard(alertData) {
  const isBiased =
    alertData.status === "Biased" ||
    (alertData.disparateImpact && alertData.disparateImpact < 0.8);
  return {
    cardsV2: [
      {
        cardId: "prism-bias-alert",
        card: {
          header: {
            title: isBiased ? "🔴 PRISM Bias Alert" : "🟢 PRISM Audit Complete",
            subtitle: `Dataset: ${alertData.datasetName || "Unknown"}`,
            imageUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
            imageType: "CIRCLE",
          },
          sections: [
            {
              widgets: [
                {
                  decoratedText: {
                    text: `DI: ${alertData.disparateImpact?.toFixed(3) || "N/A"}`,
                    startIcon: { knownIcon: "STAR" },
                  },
                },
                {
                  decoratedText: {
                    text: `SPD: ${alertData.spd != null ? (alertData.spd * 100).toFixed(1) + "%" : "N/A"}`,
                    startIcon: { knownIcon: "CLOCK" },
                  },
                },
                {
                  decoratedText: {
                    text: `Status: ${alertData.status || "Unknown"}`,
                    startIcon: { knownIcon: isBiased ? "ERROR" : "DONE" },
                  },
                },
              ],
            },
            {
              widgets: [
                {
                  buttons: [
                    {
                      textButton: {
                        text: "Open in PRISM",
                        onClick: {
                          openLink: {
                            url:
                              alertData.dashboardUrl ||
                              "http://localhost:5173/dashboard",
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

module.exports = {
  GOOGLE_TOOLS,
  getGoogleIntegrationStatus,
  getSnippet,
  buildLogEntry,
  buildCalendarEventLink,
  buildChatCard,
};
