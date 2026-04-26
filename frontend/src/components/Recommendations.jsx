import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Recommendations({ metrics, config }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:5001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          datasetContext: config
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="glass-panel" 
      style={{ marginTop: '2rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles color="var(--warning-color)" /> 
          AI Bias Mitigation
        </h2>
        {!recommendations && (
          <button 
            className="btn-primary" 
            onClick={fetchRecommendations}
            disabled={loading}
          >
            {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : 'Generate Strategies'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: 'var(--danger-color)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {loading && !recommendations && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-color)' }} />
          <p>Google Gemini is analyzing your bias metrics...</p>
        </div>
      )}

      {recommendations && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            lineHeight: '1.6', 
            color: 'var(--text-primary)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Use ReactMarkdown to safely render the markdown returned from Gemini */}
          <ReactMarkdown
             components={{
               h1: ({node, ...props}) => <h1 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '1rem' }} {...props} />,
               h2: ({node, ...props}) => <h2 style={{ color: 'var(--accent-color)', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
               h3: ({node, ...props}) => <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem' }} {...props} />,
               p: ({node, ...props}) => <p style={{ marginBottom: '1rem' }} {...props} />,
               ul: ({node, ...props}) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
               li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
             }}
          >
            {recommendations}
          </ReactMarkdown>
        </motion.div>
      )}
    </motion.div>
  );
}
