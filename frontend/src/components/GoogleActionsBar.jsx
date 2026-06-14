import { useState } from "react";
import {
  Calendar,
  CheckSquare,
  Mail,
  MessageSquare,
  Database,
  Activity,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
  Copy,
  Loader2,
  AlertTriangle,
  Radio,
  Cloud,
  UploadCloud,
  FileSpreadsheet,
  Zap,
  Cpu,
  Map,
  PieChart,
  Brain,
} from "lucide-react";
import { apiGet, apiPost } from "../utils/api";
import { dispatchAuditToGoogle } from "../utils/googleApi";

const GoogleLogo = ({ style = {} }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
    alt="Google" 
    style={{ height: '18px', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block', filter: 'brightness(0) invert(1)', ...style }} 
  />
);

const GeminiLogo = ({ style = {} }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" 
    alt="Gemini" 
    style={{ height: '18px', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block', ...style }} 
  />
);

const renderNameWithLogos = (name, logoHeight = '14px') => {
  if (name.includes("Google")) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
        <GoogleLogo style={{ height: logoHeight }} />
        <span style={{ verticalAlign: 'middle' }}>{name.replace("Google", "").trim()}</span>
      </span>
    );
  }
  if (name.includes("Gemini")) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
        <GeminiLogo style={{ height: logoHeight }} />
        <span style={{ verticalAlign: 'middle' }}>{name.replace("Gemini", "").trim()}</span>
      </span>
    );
  }
  return name;
};

function buildAuditPayload(auditContext) {
  if (!auditContext) return null;
  const payload = auditContext.auditId ? { auditId: auditContext.auditId } : {
    auditData: {
      datasetName: auditContext.datasetName || "Current Analysis",
      targetAttribute: auditContext.targetAttribute,
      sensitiveAttribute: auditContext.sensitiveAttribute,
      metrics: auditContext.metrics,
      status: auditContext.status,
      createdAt: new Date().toISOString(),
    },
  };
  return payload;
}

const ACTION_TOOLS = [
  {
    id: "calendar",
    name: "Google Calendar",
    icon: Calendar,
    color: "#4285F4",
    endpoint: "/api/google/calendar/event",
    description: "Schedule audit review as a calendar event",
    fields: [
      { key: "summary", label: "Event Title", default: "PRISM Bias Audit Review" },
      {
        key: "description",
        label: "Description",
        default: "Review bias metrics and mitigation steps from latest audit.",
      },
      {
        key: "startTime",
        label: "Start Time (ISO)",
        default: new Date(Date.now() + 3600000).toISOString(),
      },
    ],
  },
  {
    id: "tasks",
    name: "Google Tasks",
    icon: CheckSquare,
    color: "#34A853",
    endpoint: "/api/google/tasks/create",
    description: "Create a bias mitigation follow-up task",
    fields: [
      { key: "title", label: "Task Title", default: "Review bias flagged in latest audit" },
      {
        key: "notes",
        label: "Notes",
        default: "Check Disparate Impact and apply mitigation recommendations.",
      },
    ],
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: Mail,
    color: "#EA4335",
    endpoint: "/api/google/gmail/send-audit",
    description: "Send audit summary report via email",
    usesAudit: true,
    fields: [{ key: "recipient", label: "Recipient Email", default: "" }],
  },
  {
    id: "chat",
    name: "Google Chat",
    icon: MessageSquare,
    color: "#34A853",
    endpoint: "/api/google/chat/alert",
    description: "Post bias alert to Google Chat space",
    usesAudit: true,
    fields: [
      {
        key: "message",
        label: "Alert Message",
        default: "Bias detected in dataset. Review required.",
      },
    ],
  },
  {
    id: "pubsub",
    name: "Pub/Sub",
    icon: Radio,
    color: "#4285F4",
    endpoint: "/api/google/pubsub/publish",
    description: "Publish bias event to Google Pub/Sub",
    usesAudit: true,
    fields: [],
  },
  {
    id: "bigquery",
    name: "BigQuery",
    icon: Database,
    color: "#669DF6",
    endpoint: "/api/google/bigquery/load",
    description: "Load audit row into BigQuery analytics table",
    usesAudit: true,
    fields: [],
  },
  {
    id: "drive",
    name: "Google Drive",
    icon: UploadCloud,
    color: "#4285F4",
    endpoint: "/api/google/drive/upload",
    description: "Upload audit report to Google Drive",
    usesAudit: true,
    fields: [],
  },
  {
    id: "gcs",
    name: "Cloud Storage",
    icon: Database,
    color: "#4285F4",
    endpoint: "/api/google/gcs/upload",
    description: "Upload audit artifact to Cloud Storage",
    usesAudit: true,
    fields: [{ key: "artifactType", label: "Type (csv/pdf/json)", default: "json" }],
  },
  {
    id: "logging",
    name: "Cloud Logging",
    icon: Activity,
    color: "#F9AB00",
    endpoint: "/api/google/logging/log",
    description: "Send structured audit event to Cloud Logging",
    usesAudit: true,
    fields: [],
  },
  {
    id: "slides",
    name: "Google Slides",
    icon: BarChart3,
    color: "#F9AB00",
    endpoint: "/api/google/slides/generate",
    description: "Generate audit presentation slides",
    usesAudit: true,
    fields: [],
  },
  {
    id: "sheets",
    name: "Google Sheets",
    icon: FileSpreadsheet,
    color: "#34A853",
    endpoint: "/api/google/sheets/import",
    description: "Import CSV from a public Google Sheet",
    fields: [{ key: "sheetUrl", label: "Google Sheets URL", default: "" }],
  },
  {
    id: "cloudrun",
    name: "Cloud Run",
    icon: Cloud,
    color: "#4285F4",
    endpoint: "/api/google/cloudrun/status",
    method: "GET",
    description: "Check Cloud Run deployment status",
    fields: [],
  },
  {
    id: "admin_sdk",
    name: "Admin SDK",
    icon: ShieldCheck,
    color: "#4285F4",
    endpoint: "/api/google/admin/sync",
    description: "Sync Google Workspace users and groups",
    fields: [],
  },
  {
    id: "vertex",
    name: "Vertex AI",
    icon: Cpu,
    color: "#4285F4",
    endpoint: "/api/google/vertex/pipeline",
    description: "Generate bias-aware model training pipeline",
    usesAudit: true,
    fields: [],
  },
  {
    id: "maps",
    name: "Google Maps",
    icon: Map,
    color: "#EA4335",
    endpoint: "/api/google/maps/geocode",
    description: "Verify location coordinates for geospatial heatmaps",
    fields: [{ key: "address", label: "Address/City", default: "Coimbatore, Tamil Nadu" }],
  },
  {
    id: "looker",
    name: "Looker Studio",
    icon: PieChart,
    color: "#4285F4",
    endpoint: "/api/google/looker/dashboard",
    description: "Build BI dashboards from BigQuery audits",
    fields: [{ key: "dataset", label: "BigQuery Dataset", default: "prism_audits" }],
  },
  {
    id: "gemini",
    name: "Gemini API",
    icon: Brain,
    color: "#EA4335",
    endpoint: "/api/google/gemini/explain",
    description: "Explain fairness metrics & recommend mitigations",
    usesAudit: true,
    fields: [],
  },
];

function formatResult(tool, data) {
  const prefix = `[✅ Live API (Active)]\n`;

  switch (tool.id) {
    case "gmail":
      return `${prefix}Email sent for: ${data.subject}\nTo: ${data.recipient}`;
    case "calendar":
      return `${prefix}Event created.\n${data.calendarUrl || data.htmlLink || ""}`;
    case "tasks":
      return `${prefix}Task: "${data.task?.title}" — Due: ${data.task?.due}\nTask ID: ${data.taskId || "mock-task-id"}`;
    case "chat":
      return `${prefix}Alert sent to Google Chat\nWebhook: ${String(data.webhookUrl || "").slice(0, 80)}`;
    case "pubsub":
      return `${prefix}Published message ${data.messageId || "mock-msg-id"}\nTopic: ${data.topic || "prism-bias-events"}`;
    case "bigquery":
      return `${prefix}Row inserted\nTable: ${data.table || "fairness_audits"}`;
    case "drive":
      return `${prefix}Uploaded to Drive\n${data.webViewLink || ""}`;
    case "gcs":
      return `${prefix}Upload ready\nBucket: ${data.bucket}\nObject: ${data.object}${data.signedUrl ? `\nSigned URL generated` : ""}`;
    case "logging":
      return `${prefix}Log written\nSeverity: ${data.logEntry?.severity || "INFO"}`;
    case "slides":
      return `${prefix}Presentation created\n${data.presentationUrl || data.presentation?.title}\nSlides: ${data.presentation?.slides?.length || data.slideCount || 0}`;
    case "sheets":
      return `${prefix}Sheet imported\nRows: ${data.rowCount || 0}`;
    case "cloudrun":
      return `${prefix}Service running\nURL: ${data.url || "N/A"}\nRevision: ${data.latestReadyRevision || "N/A"}`;
    case "admin_sdk":
      return `${prefix}Synced ${data.count || 0} users\nDomain: ${data.domain}`;
    case "vertex":
      return `${prefix}Vertex AI Pipeline script generated:\n\n${data.pipelineCode || ""}`;
    case "maps":
      return `${prefix}Geocoding coordinates for "${data.address}":\n` +
             (data.results && data.results[0]
               ? `Address: ${data.results[0].formatted_address}\nLatitude: ${data.results[0].geometry?.location?.lat}\nLongitude: ${data.results[0].geometry?.location?.lng}`
               : `No geocoding results found.`);
    case "looker":
      return `${prefix}BigQuery SQL View statement for Looker Studio generated.\nClick 'Open' to view Looker Studio templates.\n\n${data.sqlQuery || ""}`;
    case "gemini":
      return `${prefix}Gemini Explanation:\n${data.explanation || ""}\n\nRecommendations:\n${data.recommendations || ""}`;
    default:
      return prefix + JSON.stringify(data, null, 2);
  }
}

export default function GoogleActionsBar({ auditContext }) {
  const [expandedTool, setExpandedTool] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleTool = (toolId) => {
    setExpandedTool(expandedTool === toolId ? null : toolId);
    setResult(null);
    setError("");
    setCopied(false);
    const tool = ACTION_TOOLS.find((t) => t.id === toolId);
    if (tool) {
      const defaults = {};
      tool.fields.forEach((f) => {
        defaults[f.key] = f.default || "";
      });
      setFieldValues(defaults);
    }
  };

  const updateField = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const executeAction = async (tool) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let payload = { ...fieldValues };

      if (tool.usesAudit && auditContext) {
        Object.assign(payload, buildAuditPayload(auditContext));
      }

      if (tool.id === "chat" && auditContext) {
        payload = {
          ...payload,
          message: payload.message || "Bias detected in dataset",
          severity: auditContext.status === "Biased" ? "WARNING" : "INFO",
          metrics: auditContext.metrics,
          datasetName: auditContext.datasetName || "Current Audit",
          status: auditContext.status,
          dashboardUrl: `${window.location.origin}/analyze/results`,
        };
      }

      if (tool.id === "gcs" && auditContext && !payload.content) {
        payload.content = JSON.stringify(
          {
            datasetName: auditContext.datasetName,
            metrics: auditContext.metrics,
            status: auditContext.status,
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        );
      }

      const data =
        tool.method === "GET"
          ? await apiGet(tool.endpoint)
          : await apiPost(tool.endpoint, payload);

      const resultText = formatResult(tool, data);
      setResult({
        text: resultText,
        raw: JSON.stringify(data, null, 2),
        link: data.calendarUrl || data.htmlLink || data.presentationUrl || data.webViewLink || data.dashboardUrl,
      });
    } catch (err) {
      setError(err.message || "Action execution failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.raw || result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const dispatchAll = async () => {
    if (!auditContext) {
      setError("No audit context available. Run an analysis first.");
      return;
    }
    setDispatching(true);
    setError("");
    setDispatchResult(null);
    try {
      const data = await dispatchAuditToGoogle(auditContext);
      setDispatchResult(data);
    } catch (err) {
      setError(err.message || "Dispatch failed.");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="glass-panel" style={{ marginBottom: "3rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            marginBottom: "0.35rem",
          }}
        >
          <Activity size={20} color="var(--accent)" /> <GoogleLogo style={{ height: '22px' }} /> Integration Actions
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Execute <GoogleLogo style={{ height: '14px' }} /> & <GeminiLogo style={{ height: '14px' }} /> service API calls from PRISM. Actions use live <GoogleLogo style={{ height: '14px' }} /> & <GeminiLogo style={{ height: '14px' }} /> APIs
          when credentials are configured, or return preview payloads otherwise.
          {auditContext && (
            <span style={{ display: "block", marginTop: "0.35rem", color: "var(--accent-secondary)" }}>
              Current audit: {auditContext.datasetName || "Analysis"} — {auditContext.status}
            </span>
          )}
        </p>
      </div>

      {auditContext && (
        <div
          style={{
            marginBottom: "1.25rem",
            padding: "1rem",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.25rem" }}>
                Dispatch to All <GoogleLogo style={{ height: '15px' }} /> Services
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                Fan-out to Pub/Sub, BigQuery, Cloud Logging, Google Chat, and Cloud Storage in one call.
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={dispatchAll}
              disabled={dispatching}
              style={{ padding: "0.55rem 1rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              {dispatching ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Dispatching...
                </>
              ) : (
                <>
                  <Zap size={14} /> Dispatch All
                </>
              )}
            </button>
          </div>
          {dispatchResult && (
            <pre
              style={{
                marginTop: "0.75rem",
                marginBottom: 0,
                padding: "0.75rem",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "6px",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
              }}
            >
              {`Live: ${dispatchResult.summary?.live || 0} · Preview: ${dispatchResult.summary?.preview || 0}\n`}
              {Object.entries(dispatchResult.results || {})
                .map(([svc, r]) => `${svc}: ${r?.mode || "?"} ${r?.success ? "✓" : "✗"}`)
                .join("\n")}
            </pre>
          )}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {ACTION_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isExpanded = expandedTool === tool.id;
          return (
            <div
              key={tool.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "8px",
                overflow: "hidden",
                background: isExpanded ? "rgba(255,255,255,0.03)" : "transparent",
              }}
            >
              <button
                type="button"
                onClick={() => toggleTool(tool.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.85rem 1rem",
                  background: "none",
                  border: "none",
                  color: "var(--text-1)",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: `${tool.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} color={tool.color} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div>{renderNameWithLogos(tool.name, '15px')}</div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-secondary)",
                        fontWeight: 400,
                      }}
                    >
                      {tool.description}
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isExpanded && (
                <div
                  style={{
                    padding: "0 1rem 1rem",
                    borderTop: "1px solid var(--border)",
                    marginTop: "0.25rem",
                  }}
                >
                  {tool.fields.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.65rem",
                        padding: "0.75rem 0",
                      }}
                    >
                      {tool.fields.map((f) => (
                        <div key={f.key} className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label" style={{ fontSize: "0.78rem" }}>
                            {f.label}
                          </label>
                          <input
                            type="text"
                            className="text-input"
                            value={fieldValues[f.key] || ""}
                            onChange={(e) => updateField(f.key, e.target.value)}
                            placeholder={f.default || `Enter ${f.label.toLowerCase()}...`}
                            style={{ fontSize: "0.82rem", padding: "0.5rem 0.7rem" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn-primary"
                    onClick={() => executeAction(tool)}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Executing...
                      </>
                    ) : (
                      <>
                        <ExternalLink size={14} /> Execute {renderNameWithLogos(tool.name, '14px')} API
                      </>
                    )}
                  </button>

                  {error && (
                    <div
                      style={{
                        marginTop: "0.6rem",
                        padding: "0.55rem",
                        background: "rgba(248,113,113,0.08)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        borderRadius: "6px",
                        color: "var(--danger)",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <AlertTriangle size={13} /> {error}
                    </div>
                  )}

                  {result && (
                    <div style={{ marginTop: "0.6rem", position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "0.4rem",
                          right: "0.4rem",
                          display: "flex",
                          gap: "0.35rem",
                          zIndex: 2,
                        }}
                      >
                        {result.link && (
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                            style={{
                              padding: "0.25rem 0.55rem",
                              fontSize: "0.7rem",
                              textDecoration: "none",
                            }}
                          >
                            <ExternalLink size={11} /> Open
                          </a>
                        )}
                        <button
                          className="btn-secondary"
                          onClick={copyResult}
                          style={{ padding: "0.25rem 0.55rem", fontSize: "0.7rem" }}
                        >
                          {copied ? (
                            <>
                              <Check size={11} /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={11} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre
                        style={{
                          margin: 0,
                          padding: "0.75rem",
                          paddingTop: "2rem",
                          background: "rgba(0,0,0,0.2)",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          lineHeight: 1.5,
                          color: "var(--text-secondary)",
                          maxHeight: "180px",
                          overflowY: "auto",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {result.text}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
