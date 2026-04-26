import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
      style={{ maxWidth: '800px' }}
    >
      <h1 style={{ marginBottom: '2rem' }}>Terms of Service</h1>
      <div className="glass-panel">
        <h3 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--text-primary)' }}>1. Acceptance of Terms</h3>
        <p style={{ color: 'var(--text-secondary)' }}>By accessing Unbiased AI Decision, you agree to be bound by these terms.</p>
        
        <h3 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--text-primary)' }}>2. Disclaimer</h3>
        <p style={{ color: 'var(--text-secondary)' }}>The AI-generated mitigation strategies are suggestions and should be reviewed by human experts before implementation in production systems.</p>
      </div>
    </motion.div>
  );
}
