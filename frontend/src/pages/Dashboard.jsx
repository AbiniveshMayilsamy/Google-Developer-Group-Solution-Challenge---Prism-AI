import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Plus, Clock, Settings as SettingsIcon } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)' }}>Welcome, {user?.name || 'User'}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here is an overview of your AI fairness projects.</p>
        </div>
        <Link to="/analyze/new" className="btn-primary">
          <Plus size={18} /> New Analysis
        </Link>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Activity color="var(--accent-secondary)" /> System Status
          </h3>
          <p style={{ color: 'var(--success-color)', fontSize: '1.2rem', fontWeight: 'bold' }}>All systems operational.</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Gemini AI API: Connected</p>
        </div>

        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Clock color="var(--accent-color)" /> Recent Activity
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>You have no recent analyses. Start a new project to detect bias.</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link to="/history" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} /> View History
        </Link>
        <Link to="/settings" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={18} /> Settings
        </Link>
      </div>
    </motion.div>
  );
}
