import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-container"
      style={{ maxWidth: '800px' }}
    >
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '3rem' }}>About Unbiased AI</h1>
      <div className="glass-panel">
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Our mission is to build a future where automated decisions are fair, transparent, and equitable. We believe that technology should empower everyone, not inadvertently reinforce historical biases.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.8' }}>
          Leveraging Google GenAI, our platform analyzes datasets and model outputs to identify disparate impacts, offering actionable strategies to mitigate bias before it causes harm in the real world.
        </p>
      </div>
    </motion.div>
  );
}
