import { useEffect, useState } from "react";
import { Code2, Copy, Check, RefreshCw } from "lucide-react";
import { getGoogleEndpoints } from "../utils/googleApi";

const GoogleLogo = ({ style = {} }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
    alt="Google" 
    style={{ height: '18px', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block', filter: 'brightness(0) invert(1)', ...style }} 
  />
);

export default function GoogleApiReference() {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";

  useEffect(() => {
    getGoogleEndpoints()
      .then((data) => setEndpoints(data.endpoints || []))
      .catch(() => setEndpoints([]))
      .finally(() => setLoading(false));
  }, []);

  const copyPath = async (path) => {
    await navigator.clipboard.writeText(`${baseUrl}${path}`);
    setCopied(path);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="glass-panel" style={{ marginBottom: "3rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.35rem" }}>
          <Code2 size={20} color="var(--accent)" /> <GoogleLogo style={{ height: '22px' }} /> API Reference
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
          All <GoogleLogo style={{ height: '14px' }} /> integration endpoints require JWT auth via <code>Authorization: Bearer &lt;token&gt;</code>.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          <RefreshCw size={14} className="animate-spin" /> Loading endpoints...
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "0.6rem 0.5rem", color: "var(--text-secondary)" }}>Method</th>
                <th style={{ padding: "0.6rem 0.5rem", color: "var(--text-secondary)" }}>Endpoint</th>
                <th style={{ padding: "0.6rem 0.5rem", color: "var(--text-secondary)" }}>Description</th>
                <th style={{ padding: "0.6rem 0.5rem" }} />
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep) => (
                <tr key={ep.path} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.65rem 0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: ep.method === "GET" ? "#34d399" : "var(--accent-secondary)",
                      }}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td style={{ padding: "0.65rem 0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                    {ep.path}
                  </td>
                  <td style={{ padding: "0.65rem 0.5rem", color: "var(--text-secondary)" }}>
                    {ep.description}
                  </td>
                  <td style={{ padding: "0.65rem 0.5rem" }}>
                    <button
                      className="btn-secondary"
                      onClick={() => copyPath(ep.path)}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}
                    >
                      {copied === ep.path ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
