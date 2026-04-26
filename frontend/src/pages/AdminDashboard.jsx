import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Users, Database, Activity, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent-secondary)' }}>Admin Override</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, Administrator {user?.name}</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel text-center">
          <Users size={32} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-primary)', fontSize: '2.5rem' }}>1,432</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Active Users</p>
        </div>
        <div className="glass-panel text-center">
          <Database size={32} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-primary)', fontSize: '2.5rem' }}>8,920</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Analyses Run</p>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <ShieldAlert color="var(--danger-color)" /> Critical Alerts
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>No critical system alerts. API quotas are within limits.</p>
      </div>
    </motion.div>
  );
}
