import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

export default function Recommendations({ metrics, config }) {
  const { laymanMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const fetch_ = async () => {
    setLoading(true); setError('');
    try {
      const data = await apiPost('/api/recommendations', { metrics, datasetContext: config, laymanMode });
      setRecommendations(data.recommendations);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="glass-panel" style={{ marginTop: '2rem' }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--accent)" /> AI Bias Mitigation
        </h3>
        {!recommendations && (
          <button className="btn-primary" onClick={fetch_} disabled={loading}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
            {loading ? <><Loader2 size={14} className="animate-spin" /> Analyzing...</> : 'Generate Strategies'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: '#f87171', padding: '0.85rem', background: 'rgba(248,113,113,0.08)', borderRadius: '8px', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {loading && !recommendations && (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-2)' }}>
          <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: 'var(--accent)', display: 'block' }} />
          <p style={{ fontSize: '0.85rem' }}>Gemini is analyzing your bias metrics...</p>
        </div>
      )}

      {recommendations && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ lineHeight: 1.7, background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <ReactMarkdown components={{
            h1: ({ ...p }) => <h1 style={{ color: 'var(--accent)', fontSize: '1.3rem', marginBottom: '0.75rem' }} {...p} />,
            h2: ({ ...p }) => <h2 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginTop: '1.25rem', marginBottom: '0.6rem' }} {...p} />,
            h3: ({ ...p }) => <h3 style={{ color: 'var(--text-1)', fontSize: '1rem', marginTop: '0.85rem', marginBottom: '0.4rem' }} {...p} />,
            p:  ({ ...p }) => <p  style={{ color: 'var(--text-2)', marginBottom: '0.75rem', fontSize: '0.88rem' }} {...p} />,
            ul: ({ ...p }) => <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }} {...p} />,
            li: ({ ...p }) => <li style={{ color: 'var(--text-2)', marginBottom: '0.35rem', fontSize: '0.85rem' }} {...p} />,
          }}>{recommendations}</ReactMarkdown>
        </motion.div>
      )}
    </motion.div>
  );
}
