import { apiGet, apiPost } from "./api";

export async function getGoogleIntegrations() {
  return apiGet("/api/google/integrations");
}

export async function getGoogleEndpoints() {
  return apiGet("/api/google/endpoints");
}

export async function dispatchAuditToGoogle(auditContext, options = {}) {
  const payload = {
    services: options.services || ["pubsub", "bigquery", "logging", "chat", "gcs"],
    recipient: options.recipient,
    dashboardUrl: options.dashboardUrl || `${window.location.origin}/analyze/results`,
  };

  if (auditContext.auditId) {
    payload.auditId = auditContext.auditId;
  } else {
    payload.auditData = {
      datasetName: auditContext.datasetName,
      targetAttribute: auditContext.targetAttribute,
      sensitiveAttribute: auditContext.sensitiveAttribute,
      metrics: auditContext.metrics,
      status: auditContext.status,
      createdAt: new Date().toISOString(),
    };
  }

  return apiPost("/api/google/dispatch", payload);
}

export async function importGoogleSheet(sheetUrl) {
  return apiPost("/api/google/sheets/import", { sheetUrl });
}

export async function callGoogleService(endpoint, payload = {}, method = "POST") {
  if (method === "GET") return apiGet(endpoint);
  return apiPost(endpoint, payload);
}
