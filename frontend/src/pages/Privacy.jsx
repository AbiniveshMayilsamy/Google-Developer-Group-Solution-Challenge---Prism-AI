import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
      style={{ maxWidth: '800px' }}
    >
      <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
      <div className="glass-panel">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Last updated: January 2026</p>
        <h3 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--text-primary)' }}>1. Data Collection</h3>
        <p style={{ color: 'var(--text-secondary)' }}>We do not store your CSV data on our servers. All parsing happens locally in your browser. Only the aggregated metrics are sent to the Google Gemini API for analysis.</p>
        
        <h3 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--text-primary)' }}>2. Use of Information</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Account information is used solely for identifying you across sessions.</p>
      </div>
    </motion.div>
  );
}
