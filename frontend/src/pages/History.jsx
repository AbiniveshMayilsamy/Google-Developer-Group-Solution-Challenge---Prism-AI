import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Clock, AlertTriangle, CheckCircle, Brain, Sparkles, Loader2, Plus } from 'lucide-react';
import { apiGet, apiPost } from '../utils/api';

export default function History() {
  const { laymanMode } = useTheme();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState({});

  useEffect(() => {
    apiGet('/api/audits/history')
      .then(data => setAudits(Array.isArray(data) ? data : []))
      .catch(() => setAudits([]))
      .finally(() => setLoading(false));
  }, []);

  const generateSummary = async (audit) => {
    if (summaries[audit._id]) return;
    setLoadingSummaries(p => ({ ...p, [audit._id]: true }));
    try {
      const data = await apiPost('/api/ai/audit-summary', { ...audit, laymanMode });
      setSummaries(p => ({ ...p, [audit._id]: data.summary }));
    } catch {
      setSummaries(p => ({ ...p, [audit._id]: 'Failed to generate summary.' }));
    } finally {
      setLoadingSummaries(p => ({ ...p, [audit._id]: false }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock size={26} color="var(--accent)" /> Analysis History
        </h1>
        <Link to="/analyze/new" className="btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={15} /> New Analysis
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-2)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--accent)' }} />
          Loading your audit history...
        </div>
      ) : audits.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
          <FileText size={48} color="var(--text-2)" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
          <h3 style={{ marginBottom: '0.75rem' }}>No audits yet</h3>
          <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Run your first bias analysis to see results here.
          </p>
          <Link to="/analyze/new" className="btn-primary">Run First Audit</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {audits.map(audit => (
            <div key={audit._id} className="glass-panel"
              style={{ padding: 0, overflow: 'hidden', borderLeft: `4px solid ${audit.status === 'Fair' ? '#34d399' : '#f87171'}` }}>

              <div className="flex-between" style={{ padding: '1.25rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                    <FileText size={16} color="var(--accent)" />
                    {audit.datasetName}
                  </h3>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.8rem' }}>
                    {audit.sensitiveAttribute} → {audit.targetAttribute} &nbsp;·&nbsp;
                    DI: <strong style={{ color: 'var(--text-1)' }}>{audit.metrics?.disparateImpact?.toFixed(3)}</strong> &nbsp;·&nbsp;
                    {new Date(audit.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: audit.status === 'Fair' ? '#34d399' : '#f87171' }}>
                    {audit.status === 'Fair' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                    {audit.status}
                  </div>
                  <button
                    onClick={() => generateSummary(audit)}
                    disabled={loadingSummaries[audit._id]}
                    style={{
                      background: summaries[audit._id] ? 'var(--accent-dim)' : 'var(--accent)',
                      color: summaries[audit._id] ? 'var(--accent)' : '#000',
                      border: summaries[audit._id] ? '1px solid var(--accent)' : 'none',
                      padding: '0.45rem 0.9rem', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {loadingSummaries[audit._id]
                      ? <><Loader2 size={13} className="animate-spin" /> Analyzing...</>
                      : <><Brain size={13} /> {summaries[audit._id] ? 'View Summary' : 'AI Summary'}</>
                    }
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {summaries[audit._id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
                      <Sparkles size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ color: 'var(--text-1)', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
                        {summaries[audit._id]}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
