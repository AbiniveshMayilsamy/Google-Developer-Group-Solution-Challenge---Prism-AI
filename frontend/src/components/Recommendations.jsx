import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

export default function Recommendations({ metrics, config }) {
  const { laymanMode } = useTheme();
  const [loading, setLoading]               = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError]                   = useState('');

  const fetch_ = async () => {
    setLoading(true); setError(''); setRecommendations(null);
    try {
      const data = await apiPost('/api/recommendations', {
        metrics,
        datasetContext: config,
        laymanMode,
      });
      setRecommendations(data.recommendations);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isKeyError = error.toLowerCase().includes('api_key') ||
                     error.toLowerCase().includes('apikey') ||
                     error.toLowerCase().includes('aiza') ||
                     error.toLowerCase().includes('invalid') ||
                     error.toLowerCase().includes('key');

  return (
    <motion.div
      className="glass-panel"
      style={{ marginTop: '2rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Sparkles size={18} color="var(--accent)" /> AI Bias Mitigation Strategies
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {recommendations && (
            <button onClick={fetch_} disabled={loading} style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-2)', borderRadius: '999px',
              padding: '0.35rem 0.8rem', fontSize: '0.72rem', cursor: 'pointer',
            }}>
              <RefreshCw size={11} /> Regenerate
            </button>
          )}
          {!recommendations && (
            <button className="btn-primary" onClick={fetch_} disabled={loading}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</>
                : <><Sparkles size={14} /> Generate Strategies</>
              }
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-2)' }}
          >
            <Loader2 size={32} className="animate-spin"
              style={{ margin: '0 auto 0.75rem', color: 'var(--accent)', display: 'block' }} />
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Gemini is analyzing your bias metrics…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: '10px', padding: '1rem 1.1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <AlertTriangle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f87171', marginBottom: '0.35rem' }}>
                  AI Analysis Failed
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 0.6rem 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {error}
                </p>
                {isKeyError && (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600,
                      textDecoration: 'none', marginBottom: '0.5rem',
                    }}
                  >
                    <ExternalLink size={11} /> Get a free Gemini API key →
                  </a>
                )}
                <button onClick={fetch_} style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  background: 'none', border: '1px solid rgba(248,113,113,0.4)',
                  color: '#f87171', borderRadius: '6px',
                  padding: '0.3rem 0.7rem', fontSize: '0.75rem', cursor: 'pointer',
                }}>
                  <RefreshCw size={11} /> Retry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {recommendations && !loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              lineHeight: 1.75,
              background: 'rgba(0,0,0,0.2)',
              padding: '1.25rem', borderRadius: '10px',
              border: '1px solid var(--border)',
            }}
          >
            <ReactMarkdown components={{
              h1: ({ ...p }) => <h1 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.6rem' }} {...p} />,
              h2: ({ ...p }) => <h2 style={{ color: 'var(--accent)', fontSize: '0.95rem', marginTop: '1.1rem', marginBottom: '0.5rem' }} {...p} />,
              h3: ({ ...p }) => <h3 style={{ color: 'var(--text-1)', fontSize: '0.88rem', marginTop: '0.75rem', marginBottom: '0.35rem' }} {...p} />,
              p:  ({ ...p }) => <p  style={{ color: 'var(--text-2)', marginBottom: '0.65rem', fontSize: '0.85rem' }} {...p} />,
              ul: ({ ...p }) => <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.65rem' }} {...p} />,
              li: ({ ...p }) => <li style={{ color: 'var(--text-2)', marginBottom: '0.3rem', fontSize: '0.83rem' }} {...p} />,
              strong: ({ ...p }) => <strong style={{ color: 'var(--text-1)' }} {...p} />,
            }}>
              {recommendations}
            </ReactMarkdown>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
