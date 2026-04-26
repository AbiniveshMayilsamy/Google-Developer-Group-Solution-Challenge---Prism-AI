import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';

export default function Lending() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '800px' }}>
      <h1 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Building /> Prism for Financial Lending
      </h1>
      <p className="hero-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>Detecting redlining and algorithmic discrimination in loan approvals.</p>
      
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h2>The Challenge</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Credit scoring models can act as black boxes, potentially denying loans based on proxy variables tied to race or marital status, leading to regulatory violations and unfair practices.
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--accent-color)' }}>How Prism Helps</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>• Ensures Equal Opportunity compliance</li>
            <li>• Detects proxy bias in zip codes</li>
            <li>• Generates audit-ready fairness reports</li>
          </ul>
        </div>
        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>Audit Your Lending Model</h3>
          <Link to="/analyze/new" className="btn-secondary" style={{ marginTop: '1rem' }}>Run Analysis</Link>
        </div>
      </div>
    </motion.div>
  );
}
