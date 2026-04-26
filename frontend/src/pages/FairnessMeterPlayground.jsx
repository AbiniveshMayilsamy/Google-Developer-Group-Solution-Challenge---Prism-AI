import { useState } from 'react';
import { motion } from 'framer-motion';
import FairnessMeter from '../components/FairnessMeter';

export default function FairnessMeterPlayground() {
  const [score, setScore] = useState(1.0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '800px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Fairness Meter Playground</h1>
      <p className="hero-subtitle" style={{ fontSize: '1.1rem' }}>
        Interact with the slider below to see how Disparate Impact scores are evaluated.
        Scores between 0.8 and 1.25 are considered legally fair.
      </p>
      
      <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <FairnessMeter score={score} metricName="Simulated Disparate Impact" />
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem' }}>Adjust Score Manually</h3>
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.01" 
          value={score} 
          onChange={(e) => setScore(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div className="flex-between" style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          <span>Highly Biased (0.0)</span>
          <span>Perfectly Fair (1.0)</span>
          <span>Highly Biased (2.0)</span>
        </div>
      </div>
    </motion.div>
  );
}
