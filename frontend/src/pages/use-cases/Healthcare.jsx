import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

export default function Healthcare() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '800px' }}>
      <h1 style={{ color: 'var(--success-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <HeartPulse /> Prism for Healthcare
      </h1>
      <p className="hero-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>Guaranteeing equitable outcomes in AI medical diagnostics and triage.</p>
      
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h2>The Challenge</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Diagnostic algorithms trained on imbalanced datasets can exhibit varying accuracy rates across different racial or age demographics, leading to misdiagnoses in underrepresented groups.
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--accent-color)' }}>How Prism Helps</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>• Validates diagnostic models across sub-cohorts</li>
            <li>• Flags disparate accuracy rates immediately</li>
            <li>• Generates AI mitigation strategies using Gemini</li>
          </ul>
        </div>
        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>Validate Your Clinical Data</h3>
          <Link to="/analyze/new" className="btn-primary" style={{ marginTop: '1rem' }}>Run Analysis</Link>
        </div>
      </div>
    </motion.div>
  );
}
