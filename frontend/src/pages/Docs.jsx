import { motion } from 'framer-motion';

export default function Docs() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-container"
      style={{ maxWidth: '800px' }}
    >
      <h1 style={{ marginBottom: '2rem', color: 'var(--accent-secondary)' }}>Documentation</h1>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Metrics Explained</h2>
        <h3 style={{ color: 'var(--accent-color)' }}>Statistical Parity Difference (SPD)</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Measures the difference in the rate of favorable outcomes received by the unprivileged group compared to the privileged group. An ideal value is 0.
        </p>
        
        <h3 style={{ color: 'var(--accent-color)' }}>Disparate Impact (DI)</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The ratio of the rate of favorable outcomes for the unprivileged group to the privileged group. An ideal value is 1. Industry standards often use the "four-fifths rule" (0.8).
        </p>
      </div>
    </motion.div>
  );
}
