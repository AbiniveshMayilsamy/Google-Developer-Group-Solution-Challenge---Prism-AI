import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
      style={{ maxWidth: '800px' }}
    >
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Account Settings</h1>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '1.5rem' }}>Profile Information</h2>
        <div className="input-group">
          <label className="input-label">Name</label>
          <input type="text" className="text-input" value={user?.name || ''} readOnly />
        </div>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input type="email" className="text-input" value={user?.email || ''} readOnly />
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}>API Configuration</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Configure your Google Gemini API Key to enable AI mitigation strategies. (Currently managed in the backend .env)
        </p>
        <div className="input-group">
          <label className="input-label">Gemini API Key (Coming Soon)</label>
          <input type="password" className="text-input" placeholder="••••••••••••••••" disabled />
        </div>
        <button className="btn-primary" disabled>Update Configuration</button>
      </div>
    </motion.div>
  );
}
