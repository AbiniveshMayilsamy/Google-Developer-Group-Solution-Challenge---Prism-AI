import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <div className="text-center" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Simple, Transparent Pricing</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Choose the plan that fits your scale.</p>
      </div>

      <div className="grid-2">
        <div className="glass-panel text-center">
          <h2>Starter</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0', color: 'var(--accent-secondary)' }}>Free</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>For students and solo developers.</p>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: '2' }}>
            <li>Up to 5 CSV Uploads/day</li>
            <li>Basic Fairness Metrics</li>
            <li>Community Support</li>
          </ul>
          <Link to="/register" className="btn-secondary" style={{ width: '100%' }}>Get Started</Link>
        </div>

        <div className="glass-panel text-center" style={{ border: '1px solid var(--accent-color)' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--accent-color)', color: '#000', padding: '0.2rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>MOST POPULAR</div>
          <h2>Pro</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0', color: 'var(--accent-color)' }}>$29<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>For professional data scientists.</p>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: '2' }}>
            <li>Unlimited Uploads</li>
            <li>Google Gemini Integration</li>
            <li>Export PDF Reports</li>
          </ul>
          <Link to="/register" className="btn-primary" style={{ width: '100%' }}>Upgrade Now</Link>
        </div>
      </div>
    </motion.div>
  );
}
