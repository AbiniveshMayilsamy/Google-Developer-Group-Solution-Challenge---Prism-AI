import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard({ metrics }) {
  const { terms } = useTheme();
  if (!metrics) return null;

  const spd = metrics.statisticalParityDifference;
  const di = metrics.disparateImpact;

  // SPD ideal is 0. Between -0.1 and 0.1 is usually considered fair.
  const spdStatus = Math.abs(spd) <= 0.1 ? 'good' : (Math.abs(spd) <= 0.2 ? 'warning' : 'danger');
  
  // DI ideal is 1. Between 0.8 and 1.25 is usually considered fair (80% rule).
  const diStatus = (di >= 0.8 && di <= 1.25) ? 'good' : ((di >= 0.7 && di <= 1.4) ? 'warning' : 'danger');

  return (
    <motion.div 
      className="grid-2" 
      style={{ marginTop: '2rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="glass-panel metric-card">
        <h3 style={{ color: 'var(--text-secondary)' }}>Statistical Parity Difference</h3>
        <div className={`metric-value ${spdStatus}`}>
          {(spd * 100).toFixed(2)}%
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Ideal value is 0%. Positive means the unprivileged {terms.population} has a higher {terms.outcome} rate.
        </p>
      </div>

      <div className="glass-panel metric-card">
        <h3 style={{ color: 'var(--text-secondary)' }}>Disparate Impact</h3>
        <div className={`metric-value ${diStatus}`}>
          {di.toFixed(2)}
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Ideal value is 1.0. Industry standard threshold is 0.8 (80% rule) for {terms.outcome}.
        </p>
      </div>
    </motion.div>
  );
}
