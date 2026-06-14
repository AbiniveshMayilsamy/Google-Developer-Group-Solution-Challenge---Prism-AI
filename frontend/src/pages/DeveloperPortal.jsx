import { useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Cpu,
  Check,
  Copy,
  Key,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { apiPost } from "../utils/api";
import GoogleIntegrationsPanel from "../components/GoogleIntegrationsPanel";
import GoogleActionsBar from "../components/GoogleActionsBar";
import GoogleApiReference from "../components/GoogleApiReference";

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState("curl"); // 'curl', 'node', 'python'
  const [copied, setCopied] = useState(false);

  // Sandbox State
  const [name, setName] = useState("Rahul Paswan");
  const [stateOfOrigin, setStateOfOrigin] = useState("South");
  const [casteCategory, setCasteCategory] = useState("Reserved");
  const [dialectAccent, setDialectAccent] = useState("Regional Accent");
  const [interviewScore, setInterviewScore] = useState(78);

  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";

  const codeSnippets = {
    curl: `curl -X POST "${BASE_URL}/api/integration/evaluate-hiring" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "${name}",
    "stateOfOrigin": "${stateOfOrigin}",
    "casteCategory": "${casteCategory}",
    "dialectAccent": "${dialectAccent}",
    "interviewScore": ${interviewScore}
  }'`,
    node: `// Integration for Custom HR Screening Pipelines (Node.js)
const evaluateCandidate = async () => {
  const url = "${BASE_URL}/api/integration/evaluate-hiring";
  const payload = {
    name: "${name}",
    stateOfOrigin: "${stateOfOrigin}",
    casteCategory: "${casteCategory}",
    dialectAccent: "${dialectAccent}",
    interviewScore: ${interviewScore}
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log("Decision Outcomes:", result);
  } catch (err) {
    console.error("Connection error:", err);
  }
};

evaluateCandidate();`,
    python: `# Python Integration with PRISM Bias Mitigation Firewall
import requests

url = "${BASE_URL}/api/integration/evaluate-hiring"
payload = {
    "name": "${name}",
    "stateOfOrigin": "${stateOfOrigin}",
    "casteCategory": "${casteCategory}",
    "dialectAccent": "${dialectAccent}",
    "interviewScore": ${interviewScore}
}

try:
    response = requests.post(url, json=payload)
    result = response.json()
    print(f"Candidate Decision: {result['decision']}")
    print(f"Bias Alert: {result['biasRisk']}")
except Exception as e:
    print("API Error:", e)
`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestAPI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setApiResponse(null);
    try {
      // Direct post to backend integration endpoint
      const result = await apiPost("/api/integration/evaluate-hiring", {
        name,
        stateOfOrigin,
        casteCategory,
        dialectAccent,
        interviewScore,
      });
      setApiResponse(result);
    } catch (err) {
      setError(
        err.message || "Failed to submit candidate verification request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
      style={{ paddingBottom: '6rem' }}
    >
      <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
        {/* Eyebrow badge in Wibify style */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.65rem', 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          padding: '0.45rem 1.1rem', 
          borderRadius: '99px', 
          fontSize: '0.72rem', 
          color: 'var(--text-2)', 
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
          <span>[01] B2B Integrations</span>
          <span style={{ display: 'flex', gap: '3px', marginLeft: '0.5rem' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4285F4' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#EA4335' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FBBC05' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#34A853' }}></span>
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 800, 
          letterSpacing: '-0.04em', 
          lineHeight: 1.05, 
          fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
          marginBottom: '1.5rem'
        }}>
          Developer <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Portal</em>
          </span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '700px' }}>
          Connect Keka, Zoho People, Workday, or custom applicant tracking
          software (ATS) to PRISM's Real-time Bias Firewall.
        </p>
      </div>

      <GoogleIntegrationsPanel />

      <GoogleApiReference />

      <GoogleActionsBar />

      <div className="grid-2" style={{ gap: "2rem", marginBottom: "3rem" }}>
        {/* Sandbox UI Form */}
        <div className="glass-panel">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
            }}
          >
            <Cpu size={18} color="var(--accent)" /> Candidate Screening Sandbox
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Adjust the candidate metrics below. The code blocks on the right
            will dynamically update, showing you the exact REST request. Click
            "Execute REST Request" to query our AI Firewall sandbox.
          </p>

          <form
            onSubmit={handleTestAPI}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Candidate Name</label>
              <input
                type="text"
                className="text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid-2" style={{ gap: "0.75rem" }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Caste Category</label>
                <select
                  className="select-input"
                  value={casteCategory}
                  onChange={(e) => setCasteCategory(e.target.value)}
                >
                  <option value="General">General Category</option>
                  <option value="Reserved">Reserved Category</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Dialect & Accent</label>
                <select
                  className="select-input"
                  value={dialectAccent}
                  onChange={(e) => setDialectAccent(e.target.value)}
                >
                  <option value="Standard">Standard Accent</option>
                  <option value="Regional Accent">Regional Accent</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: "0.75rem" }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">State of Origin</label>
                <select
                  className="select-input"
                  value={stateOfOrigin}
                  onChange={(e) => setStateOfOrigin(e.target.value)}
                >
                  <option value="North">North India</option>
                  <option value="South">South India</option>
                  <option value="East">East India</option>
                  <option value="West">West India</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label
                  className="input-label"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Interview Score{" "}
                  <span style={{ color: "var(--accent)" }}>
                    {interviewScore}
                  </span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={interviewScore}
                  onChange={(e) => setInterviewScore(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "0.85rem" }}
            >
              {loading ? "Executing request..." : "Execute REST Request"}
            </button>
          </form>
        </div>

        {/* Dynamic Code Generator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              borderBottom: "1px solid var(--panel-border)",
              paddingBottom: "0.5rem",
            }}
          >
            <button
              className={`code-tab-button ${activeTab === "curl" ? "active" : ""}`}
              onClick={() => setActiveTab("curl")}
            >
              cURL
            </button>
            <button
              className={`code-tab-button ${activeTab === "node" ? "active" : ""}`}
              onClick={() => setActiveTab("node")}
            >
              Node.js
            </button>
            <button
              className={`code-tab-button ${activeTab === "python" ? "active" : ""}`}
              onClick={() => setActiveTab("python")}
            >
              Python
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <button
              className="btn-secondary"
              onClick={copyToClipboard}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
                zIndex: 10,
              }}
            >
              {copied ? (
                <Check size={12} color="var(--accent)" />
              ) : (
                <Copy size={12} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <pre className="code-block" style={{ height: "340px", margin: 0 }}>
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Sandbox Executed Result Container */}
      {(apiResponse || error) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{
            marginBottom: "3rem",
            border:
              apiResponse?.biasRisk === "High"
                ? "1px solid rgba(248,113,113,0.3)"
                : "1px solid rgba(52,211,153,0.3)",
            background:
              apiResponse?.biasRisk === "High"
                ? "rgba(248,113,113,0.02)"
                : "rgba(52,211,153,0.02)",
          }}
        >
          <div
            className="flex-between"
            style={{
              borderBottom: "1px solid var(--panel-border)",
              paddingBottom: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                Server Response Header
              </span>
              <h3
                style={{
                  margin: 0,
                  color:
                    apiResponse?.biasRisk === "High"
                      ? "var(--danger)"
                      : "var(--success-color)",
                }}
              >
                {apiResponse
                  ? "200 OK · Evaluation Completed"
                  : "500 Server Error"}
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                color:
                  apiResponse?.biasRisk === "High"
                    ? "var(--danger)"
                    : "var(--success-color)",
                background:
                  apiResponse?.biasRisk === "High"
                    ? "rgba(248,113,113,0.1)"
                    : "rgba(52,211,153,0.1)",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
              }}
            >
              {apiResponse?.biasRisk === "High" ? (
                <AlertTriangle size={14} />
              ) : (
                <ShieldCheck size={14} />
              )}
              Bias Risk: {apiResponse?.biasRisk}
            </div>
          </div>

          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

          {apiResponse && (
            <div className="dev-result-grid">
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Candidate Name
                    </span>
                    <div style={{ fontWeight: 600 }}>
                      {apiResponse.candidateName}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Raw Score / Outcome Decision
                    </span>
                    <div style={{ fontWeight: 600 }}>
                      {apiResponse.score} /{" "}
                      <span
                        style={{
                          color:
                            apiResponse.decision === "Hired"
                              ? "var(--success-color)"
                              : "var(--danger)",
                        }}
                      >
                        {apiResponse.decision}
                      </span>
                    </div>
                  </div>
                  {apiResponse.reasons.length > 0 && (
                    <div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Intercepted Bias Penalties
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.35rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {apiResponse.reasons.map((r, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.2rem 0.5rem",
                              background: "rgba(248,113,113,0.15)",
                              color: "var(--danger)",
                              borderRadius: "4px",
                              fontWeight: 600,
                            }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  borderLeft: "1px solid var(--panel-border)",
                  paddingLeft: "2rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: "0.4rem",
                  }}
                >
                  Mitigation Engine Recommendation
                </span>
                <div
                  style={{
                    padding: "1rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed var(--panel-border)",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    color: "var(--text-secondary)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      color: apiResponse.mitigationAlert
                        ? "var(--warning)"
                        : "var(--success-color)",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <ShieldCheck size={16} /> Firewall Status Alert Verdict
                  </div>
                  <p style={{ margin: 0 }}>{apiResponse.actionRecommended}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Production REST Client details */}
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            padding: "0.75rem",
            background: "rgba(168,85,247,0.1)",
            borderRadius: "10px",
          }}
        >
          <Key size={24} color="var(--accent-secondary)" />
        </div>
        <div>
          <h4 style={{ margin: 0 }}>Production API Credentials & OAuth Keys</h4>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            To utilize PRISM API in production, navigate to{" "}
            <strong style={{ color: "var(--text-1)" }}>
              Settings &rarr; API Keys
            </strong>{" "}
            to generate client tokens and secrets. Refer to the official Docs
            tab for full endpoint request and payload structures.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
