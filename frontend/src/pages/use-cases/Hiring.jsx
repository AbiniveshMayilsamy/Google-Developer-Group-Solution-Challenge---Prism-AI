import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

export default function Hiring() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '800px' }}>
      <h1 style={{ color: 'var(--accent-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users /> Prism for HR & Recruitment
      </h1>
      <p className="hero-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>Ensuring equitable hiring practices in automated resume screening.</p>
      
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h2>The Challenge</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Resume screening AI often learns from historical hiring data. If past data favors specific genders, zip codes, or educational backgrounds, the AI will unintentionally penalize qualified candidates outside those patterns.
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--accent-secondary)' }}>How Prism Helps</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>• Audits historical screening data</li>
            <li>• Flags disparate impact in candidate shortlists</li>
            <li>• Recommends blinding specific features</li>
          </ul>
        </div>
        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>Test Your HR Data Now</h3>
          <Link to="/analyze/new" className="btn-primary" style={{ marginTop: '1rem' }}>Run Analysis</Link>
        </div>
      </div>
    </motion.div>
  );
}
