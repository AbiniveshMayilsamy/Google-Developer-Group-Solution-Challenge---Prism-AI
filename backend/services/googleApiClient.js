const { Logging } = require("@google-cloud/logging");
const { PubSub } = require("@google-cloud/pubsub");
const { Storage } = require("@google-cloud/storage");
const { google } = require("googleapis");
const admin = require("@googleapis/admin");

function getProjectId() {
  const id = process.env.GOOGLE_CLOUD_PROJECT;
  if (!id || id === "your-gcp-project-id") return null;
  return id;
}

function hasCredentials() {
  return Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  );
}

function isPlaceholder(value) {
  if (!value) return true;
  return (
    value.includes("your-") ||
    value.includes("YOUR_") ||
    value === "example.com"
  );
}

async function getAuthClient(scopes, subject) {
  if (!hasCredentials()) return null;

  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const impersonate =
    subject ||
    process.env.GOOGLE_WORKSPACE_ADMIN_EMAIL ||
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (keyFile && email && impersonate) {
    const auth = new google.auth.JWT({
      email,
      keyFile,
      scopes,
      subject: impersonate,
    });
    await auth.authorize();
    return auth;
  }

  if (keyFile) {
    const auth = new google.auth.GoogleAuth({ keyFile, scopes });
    return auth.getClient();
  }

  const auth = new google.auth.GoogleAuth({ scopes });
  return auth.getClient();
}

function authFromAccessToken(accessToken) {
  if (!accessToken) return null;
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
}

async function resolveAuth(scopes, accessToken) {
  return authFromAccessToken(accessToken) || (await getAuthClient(scopes));
}

// ── Pub/Sub ────────────────────────────────────────────────────────────────────
async function publishPubSubMessage(payload, topicName) {
  const projectId = getProjectId();
  const topic = topicName || process.env.PUBSUB_TOPIC || "prism-bias-events";
  if (!projectId) {
    return { mode: "preview", success: false, reason: "GOOGLE_CLOUD_PROJECT not configured" };
  }

  try {
    const pubsub = new PubSub({ projectId });
    const messageId = await pubsub
      .topic(topic)
      .publishMessage({ json: payload });
    return { mode: "live", success: true, messageId, topic, projectId };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message, topic, projectId };
  }
}

// ── BigQuery ───────────────────────────────────────────────────────────────────
async function insertBigQueryRow(row, datasetId, tableId) {
  const projectId = getProjectId();
  const dataset = datasetId || process.env.BIGQUERY_DATASET || "prism_audits";
  const table = tableId || "fairness_audits";
  if (!projectId) {
    return { mode: "preview", success: false, reason: "GOOGLE_CLOUD_PROJECT not configured" };
  }

  try {
    const auth = await getAuthClient(["https://www.googleapis.com/auth/bigquery"]);
    if (!auth) {
      return { mode: "preview", success: false, reason: "GCP credentials not configured" };
    }

    const bigquery = google.bigquery({ version: "v2", auth });
    await bigquery.tabledata.insertAll({
      projectId,
      datasetId: dataset,
      tableId: table,
      requestBody: { rows: [{ json: row }] },
    });

    return {
      mode: "live",
      success: true,
      table: `${projectId}.${dataset}.${table}`,
    };
  } catch (err) {
    return {
      mode: "preview",
      success: false,
      error: err.message,
      table: `${projectId}.${dataset}.${table}`,
    };
  }
}

// ── Cloud Storage ──────────────────────────────────────────────────────────────
async function generateSignedUploadUrl(objectPath, contentType) {
  const projectId = getProjectId();
  const bucketName = process.env.GCS_BUCKET || "prism-audit-bundles";
  if (!projectId || !hasCredentials()) {
    return {
      mode: "preview",
      success: false,
      bucket: bucketName,
      object: objectPath,
      reason: "GCP credentials or project not configured",
    };
  }

  try {
    const storage = new Storage({ projectId });
    const [signedUrl] = await storage
      .bucket(bucketName)
      .file(objectPath)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: contentType || "application/octet-stream",
      });

    return {
      mode: "live",
      success: true,
      bucket: bucketName,
      object: objectPath,
      signedUrl,
      expiresInMinutes: 15,
    };
  } catch (err) {
    return {
      mode: "preview",
      success: false,
      bucket: bucketName,
      object: objectPath,
      error: err.message,
    };
  }
}

async function uploadToGcs(objectPath, content, contentType) {
  const projectId = getProjectId();
  const bucketName = process.env.GCS_BUCKET || "prism-audit-bundles";
  if (!projectId || !hasCredentials()) {
    return { mode: "preview", success: false, reason: "GCP credentials not configured" };
  }

  try {
    const storage = new Storage({ projectId });
    await storage
      .bucket(bucketName)
      .file(objectPath)
      .save(content, { contentType: contentType || "application/json" });
    return {
      mode: "live",
      success: true,
      bucket: bucketName,
      object: objectPath,
      gsUri: `gs://${bucketName}/${objectPath}`,
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Cloud Logging ──────────────────────────────────────────────────────────────
async function writeCloudLog(logEntry) {
  const projectId = getProjectId();
  if (!projectId) {
    return { mode: "preview", success: false, logEntry, reason: "GOOGLE_CLOUD_PROJECT not configured" };
  }

  try {
    const logging = new Logging({ projectId });
    const log = logging.log("prism-bias-audit");
    const metadata = {
      severity: logEntry.severity || "INFO",
      resource: logEntry.resource,
    };
    const entry = log.entry(metadata, logEntry.jsonPayload || logEntry);
    await log.write(entry);
    return { mode: "live", success: true, logEntry, projectId };
  } catch (err) {
    return { mode: "preview", success: false, logEntry, error: err.message, projectId };
  }
}

// ── Google Chat ────────────────────────────────────────────────────────────────
async function sendChatWebhook(cardPayload, webhookUrl) {
  const url = webhookUrl || process.env.GOOGLE_CHAT_WEBHOOK_URL;
  if (!url || isPlaceholder(url)) {
    return {
      mode: "preview",
      success: false,
      webhookPayload: cardPayload,
      reason: "GOOGLE_CHAT_WEBHOOK_URL not configured",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardPayload),
    });
    const text = await res.text();
    if (!res.ok) {
      return { mode: "preview", success: false, error: text, status: res.status };
    }
    return { mode: "live", success: true, response: text || "Message sent" };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Google Drive ───────────────────────────────────────────────────────────────
async function uploadToDrive(fileName, content, mimeType, accessToken) {
  const scopes = ["https://www.googleapis.com/auth/drive.file"];
  const auth = await resolveAuth(scopes, accessToken);
  if (!auth) {
    return { mode: "preview", success: false, reason: "Drive credentials not configured" };
  }

  try {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.create({
      requestBody: { name: fileName },
      media: { mimeType: mimeType || "text/plain", body: content },
      fields: "id, name, webViewLink",
    });
    return {
      mode: "live",
      success: true,
      fileId: res.data.id,
      fileName: res.data.name,
      webViewLink: res.data.webViewLink,
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Gmail ──────────────────────────────────────────────────────────────────────
async function sendGmailMessage(to, subject, htmlBody, accessToken) {
  const scopes = ["https://www.googleapis.com/auth/gmail.send"];
  const auth = await resolveAuth(scopes, accessToken);
  if (!auth) {
    return { mode: "preview", success: false, reason: "Gmail credentials not configured" };
  }

  const from = process.env.GOOGLE_WORKSPACE_ADMIN_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const raw = Buffer.from(
    `From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${htmlBody}`,
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
    return { mode: "live", success: true, messageId: res.data.id, recipient: to, subject };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message, recipient: to, subject };
  }
}

// ── Google Calendar ────────────────────────────────────────────────────────────
async function createCalendarEvent(event, accessToken) {
  const scopes = ["https://www.googleapis.com/auth/calendar.events"];
  const auth = await resolveAuth(scopes, accessToken);

  if (!auth) {
    return { mode: "preview", success: false, reason: "Calendar credentials not configured" };
  }

  try {
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: { dateTime: event.startTime, timeZone: "Asia/Kolkata" },
        end: {
          dateTime: event.endTime || event.startTime,
          timeZone: "Asia/Kolkata",
        },
      },
    });
    return {
      mode: "live",
      success: true,
      eventId: res.data.id,
      htmlLink: res.data.htmlLink,
      calendarUrl: res.data.htmlLink,
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Google Tasks ───────────────────────────────────────────────────────────────
async function createGoogleTask(task, accessToken) {
  const scopes = ["https://www.googleapis.com/auth/tasks"];
  const auth = await resolveAuth(scopes, accessToken);
  if (!auth) {
    return { mode: "preview", success: false, reason: "Tasks credentials not configured" };
  }

  try {
    const tasksApi = google.tasks({ version: "v1", auth });
    const lists = await tasksApi.tasklists.list({ maxResults: 10 });
    let taskListId = lists.data.items?.[0]?.id;

    if (!taskListId) {
      const created = await tasksApi.tasklists.insert({
        requestBody: { title: task.tasklist || "PRISM Bias Mitigation" },
      });
      taskListId = created.data.id;
    }

    const res = await tasksApi.tasks.insert({
      tasklist: taskListId,
      requestBody: {
        title: task.title,
        notes: task.notes,
        due: task.due ? new Date(task.due).toISOString() : undefined,
      },
    });

    return {
      mode: "live",
      success: true,
      taskId: res.data.id,
      task: {
        title: res.data.title,
        notes: res.data.notes,
        due: res.data.due,
        tasklist: taskListId,
      },
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Google Slides ──────────────────────────────────────────────────────────────
async function createSlidesPresentation(presentation, accessToken) {
  const scopes = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive.file",
  ];
  const auth = await resolveAuth(scopes, accessToken);
  if (!auth) {
    return { mode: "preview", success: false, reason: "Slides credentials not configured" };
  }

  try {
    const slides = google.slides({ version: "v1", auth });
    const created = await slides.presentations.create({
      requestBody: { title: presentation.title },
    });
    const presentationId = created.data.presentationId;

    const requests = presentation.slides.flatMap((slide, index) => {
      const slideId = `slide_${index}`;
      const ops = [
        {
          createSlide: {
            objectId: slideId,
            insertionIndex: index + 1,
            slideLayoutReference: { predefinedLayout: "TITLE_AND_BODY" },
          },
        },
      ];
      return ops;
    });

    if (requests.length) {
      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests },
      });
    }

    return {
      mode: "live",
      success: true,
      presentationId,
      presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
      title: presentation.title,
      slideCount: presentation.slides.length,
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Admin SDK ──────────────────────────────────────────────────────────────────
async function syncAdminDirectory(domain) {
  const workspaceDomain = domain || process.env.GOOGLE_WORKSPACE_DOMAIN;
  if (!workspaceDomain || isPlaceholder(workspaceDomain)) {
    return { mode: "preview", success: false, reason: "GOOGLE_WORKSPACE_DOMAIN not configured" };
  }

  const auth = await getAuthClient([
    "https://www.googleapis.com/auth/admin.directory.user.readonly",
  ]);
  if (!auth) {
    return { mode: "preview", success: false, reason: "Admin SDK credentials not configured" };
  }

  try {
    const directory = admin({ version: "directory_v1", auth });
    const res = await directory.users.list({
      domain: workspaceDomain,
      maxResults: 100,
      orderBy: "email",
    });
    const users = (res.data.users || []).map((u) => ({
      email: u.primaryEmail,
      name: u.name?.fullName,
      orgUnit: u.orgUnitPath,
      suspended: u.suspended,
      isAdmin: u.isAdmin,
    }));

    return {
      mode: "live",
      success: true,
      domain: workspaceDomain,
      count: users.length,
      users,
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message, domain: workspaceDomain };
  }
}

// ── Cloud Run status ───────────────────────────────────────────────────────────
async function getCloudRunStatus(serviceName, region) {
  const projectId = getProjectId();
  const service = serviceName || process.env.CLOUD_RUN_SERVICE || "prism-api";
  const loc = region || process.env.GOOGLE_CLOUD_REGION || "asia-south1";
  if (!projectId) {
    return { mode: "preview", success: false, reason: "GOOGLE_CLOUD_PROJECT not configured" };
  }

  const auth = await getAuthClient(["https://www.googleapis.com/auth/cloud-platform"]);
  if (!auth) {
    return { mode: "preview", success: false, service, region: loc, reason: "GCP credentials not configured" };
  }

  try {
    const run = google.run({ version: "v1", auth });
    const name = `projects/${projectId}/locations/${loc}/services/${service}`;
    const res = await run.projects.locations.services.get({ name });
    return {
      mode: "live",
      success: true,
      service,
      region: loc,
      url: res.data.status?.url,
      latestReadyRevision: res.data.status?.latestReadyRevisionName,
      conditions: res.data.status?.conditions,
    };
  } catch (err) {
    return { mode: "preview", success: false, service, region: loc, error: err.message };
  }
}

// ── Gemini health check ────────────────────────────────────────────────────────
async function checkGeminiHealth() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    return { mode: "preview", success: false, reason: "GEMINI_API_KEY not configured" };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
    );
    if (!res.ok) {
      const text = await res.text();
      return { mode: "preview", success: false, error: text };
    }
    const data = await res.json();
    return {
      mode: "live",
      success: true,
      modelCount: data.models?.length || 0,
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Maps API health check ──────────────────────────────────────────────────────
async function checkMapsHealth() {
  const key = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key.includes("YOUR_")) {
    return { mode: "preview", success: false, reason: "Google Maps API key not configured" };
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Chennai&key=${key}`,
    );
    const data = await res.json();
    return {
      mode: data.status === "OK" ? "live" : "preview",
      success: data.status === "OK",
      status: data.status,
    };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message };
  }
}

// ── Sheets export (via Drive API or public CSV) ────────────────────────────────
async function exportSheetCsv(sheetId) {
  if (!sheetId) {
    return { mode: "preview", success: false, reason: "sheetId is required" };
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { mode: "preview", success: false, error: `HTTP ${res.status}`, exportUrl: url };
    }
    const csv = await res.text();
    return { mode: "live", success: true, csv, exportUrl: url, rowCount: csv.split("\n").length - 1 };
  } catch (err) {
    return { mode: "preview", success: false, error: err.message, exportUrl: url };
  }
}

function buildAuditRow(audit) {
  return {
    audit_id: String(audit._id || audit.auditId || "inline"),
    created_at: (audit.createdAt || new Date()).toISOString(),
    dataset_name: audit.datasetName || "Unknown",
    sensitive_attribute: audit.sensitiveAttribute || null,
    target_attribute: audit.targetAttribute || null,
    disparate_impact: audit.metrics?.disparateImpact ?? null,
    statistical_parity_difference:
      audit.metrics?.statisticalParity ??
      audit.metrics?.statisticalParityDifference ??
      null,
    status: audit.status || "Unknown",
  };
}

async function dispatchAuditToGoogleServices(audit, options = {}) {
  const {
    services = ["pubsub", "bigquery", "logging", "chat", "gcs"],
    recipient,
    accessToken,
    dashboardUrl,
    chatCardBuilder,
    logEntryBuilder,
  } = options;

  const results = {};
  const row = buildAuditRow(audit);
  const payload = {
    type: "bias_audit.completed",
    auditId: row.audit_id,
    datasetName: audit.datasetName,
    disparateImpact: audit.metrics?.disparateImpact,
    statisticalParityDifference: row.statistical_parity_difference,
    status: audit.status,
    timestamp: new Date().toISOString(),
  };

  const tasks = services.map(async (service) => {
    switch (service) {
      case "pubsub":
        results.pubsub = await publishPubSubMessage(payload);
        break;
      case "bigquery":
        results.bigquery = await insertBigQueryRow(row);
        break;
      case "logging": {
        const logEntry = logEntryBuilder
          ? logEntryBuilder(audit)
          : {
              severity: audit.status === "Biased" ? "WARNING" : "INFO",
              jsonPayload: {
                service: "prism-ai",
                eventType: "bias_audit.completed",
                ...payload,
              },
              resource: {
                type: "global",
                labels: { project_id: getProjectId() || "prism-ai" },
              },
            };
        results.logging = await writeCloudLog(logEntry);
        break;
      }
      case "chat": {
        const card = chatCardBuilder
          ? chatCardBuilder(audit)
          : {
              cardsV2: [
                {
                  cardId: "prism-dispatch",
                  card: {
                    header: {
                      title:
                        audit.status === "Biased"
                          ? "🔴 PRISM Bias Alert"
                          : "🟢 PRISM Audit Complete",
                      subtitle: audit.datasetName,
                    },
                  },
                },
              ],
            };
        results.chat = await sendChatWebhook(card);
        break;
      }
      case "gcs": {
        const objectPath = `audits/${new Date().toISOString().split("T")[0].replace(/-/g, "/")}/audit-${row.audit_id}.json`;
        results.gcs = await uploadToGcs(
          objectPath,
          JSON.stringify({ audit, dispatchedAt: new Date().toISOString() }, null, 2),
          "application/json",
        );
        break;
      }
      case "drive": {
        const html = `<h1>PRISM Audit: ${audit.datasetName}</h1><p>Status: ${audit.status}</p><p>DI: ${audit.metrics?.disparateImpact}</p>`;
        results.drive = await uploadToDrive(
          `PRISM-Audit-${audit.datasetName}-${Date.now()}.html`,
          html,
          "text/html",
          accessToken,
        );
        break;
      }
      case "gmail": {
        if (!recipient) {
          results.gmail = { mode: "preview", success: false, reason: "recipient required" };
          break;
        }
        const html = `<h1>PRISM Audit: ${audit.datasetName}</h1><p>Status: ${audit.status}</p>`;
        results.gmail = await sendGmailMessage(
          recipient,
          `PRISM Audit: ${audit.datasetName} — ${audit.status}`,
          html,
          accessToken,
        );
        break;
      }
      default:
        results[service] = { mode: "preview", success: false, reason: "Unknown service" };
    }
  });

  await Promise.allSettled(tasks);

  const liveCount = Object.values(results).filter((r) => r?.mode === "live" && r?.success).length;
  const previewCount = Object.values(results).filter((r) => r?.mode === "preview" || !r?.success).length;

  return {
    auditId: row.audit_id,
    dispatchedAt: new Date().toISOString(),
    summary: { live: liveCount, preview: previewCount, total: services.length },
    results,
  };
}

// ── Maps API geocode ───────────────────────────────────────────────────────────
async function geocodeAddress(address) {
  const key = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  const targetAddress = address || "Coimbatore";
  if (!key || key.includes("YOUR_") || key.includes("your-")) {
    return {
      mode: "preview",
      success: true,
      address: targetAddress,
      results: [
        {
          formatted_address: `${targetAddress}, India (Simulated)`,
          geometry: {
            location: { lat: 11.0168, lng: 76.9558 }
          }
        }
      ]
    };
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(targetAddress)}&key=${key}`
    );
    const data = await res.json();
    if (data.status === "OK") {
      return {
        mode: "live",
        success: true,
        address: targetAddress,
        results: data.results,
      };
    } else {
      return {
        mode: "preview",
        success: false,
        status: data.status,
        error: data.error_message || "Geocoding failed",
        address: targetAddress,
      };
    }
  } catch (err) {
    return { mode: "preview", success: false, error: err.message, address: targetAddress };
  }
}

const GOOGLE_API_ENDPOINTS = [
  { method: "GET", path: "/api/google/integrations", description: "Integration status and health checks" },
  { method: "POST", path: "/api/google/integrations/snippet", description: "Generate setup snippet for a tool" },
  { method: "POST", path: "/api/google/dispatch", description: "Fan-out audit to all configured Google services" },
  { method: "POST", path: "/api/google/calendar/event", description: "Create calendar event or deep link" },
  { method: "POST", path: "/api/google/tasks/create", description: "Create Google Task" },
  { method: "POST", path: "/api/google/gmail/send-audit", description: "Send audit summary email" },
  { method: "POST", path: "/api/google/chat/alert", description: "Post bias alert to Google Chat" },
  { method: "POST", path: "/api/google/pubsub/publish", description: "Publish event to Pub/Sub" },
  { method: "POST", path: "/api/google/bigquery/load", description: "Insert audit row into BigQuery" },
  { method: "POST", path: "/api/google/drive/upload", description: "Upload report to Google Drive" },
  { method: "POST", path: "/api/google/gcs/upload", description: "Upload artifact to Cloud Storage" },
  { method: "POST", path: "/api/google/logging/log", description: "Write structured log entry" },
  { method: "POST", path: "/api/google/slides/generate", description: "Generate Slides presentation" },
  { method: "POST", path: "/api/google/sheets/import", description: "Import CSV from public Google Sheet" },
  { method: "GET", path: "/api/google/cloudrun/status", description: "Check Cloud Run service status" },
  { method: "POST", path: "/api/google/admin/sync", description: "Sync Google Workspace directory" },
  { method: "POST", path: "/api/google/health/:serviceId", description: "Health check for a specific service" },
  { method: "POST", path: "/api/google/vertex/pipeline", description: "Generate Vertex AI pipeline Python code" },
  { method: "POST", path: "/api/google/maps/geocode", description: "Geocode address check for geospatial map mapping" },
  { method: "POST", path: "/api/google/looker/dashboard", description: "Get Looker Studio BigQuery dashboard configuration and SQL" },
  { method: "POST", path: "/api/google/gemini/explain", description: "Generate metric explanations using Gemini API" },
];

module.exports = {
  getProjectId,
  hasCredentials,
  publishPubSubMessage,
  insertBigQueryRow,
  generateSignedUploadUrl,
  uploadToGcs,
  writeCloudLog,
  sendChatWebhook,
  uploadToDrive,
  sendGmailMessage,
  createCalendarEvent,
  createGoogleTask,
  createSlidesPresentation,
  syncAdminDirectory,
  getCloudRunStatus,
  checkGeminiHealth,
  checkMapsHealth,
  exportSheetCsv,
  buildAuditRow,
  dispatchAuditToGoogleServices,
  geocodeAddress,
  GOOGLE_API_ENDPOINTS,
};
