import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Plus, Clock, Settings as SettingsIcon, CheckCircle, AlertTriangle, BarChart3, Shield, History, Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) { setLoading(false); return; }
    apiGet('/api/audits/history')
      .then(data => setRecentAudits(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => setRecentAudits([]))
      .finally(() => setLoading(false));
  }, [user]);

  const quickLinks = [
    { to: '/analyze/new',    icon: <Plus size={20}/>,       label: 'New Audit',       desc: 'Upload CSV or enter data manually' },
    { to: '/drift-monitor',  icon: <Activity size={20}/>,   label: 'Drift Monitor',   desc: 'Track fairness over time' },
    { to: '/firewall',       icon: <Shield size={20}/>,     label: 'Bias Firewall',   desc: 'Real-time prediction protection' },
    { to: '/fairness-meter', icon: <BarChart3 size={20}/>,  label: 'Fairness Meter',  desc: 'Playground & simulator' },
    { to: '/developer',      icon: <Code2 size={20}/>,      label: 'Developer API',   desc: 'B2B Integration Portal & REST sandbox' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">

      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.3rem' }}>Welcome back, {user?.name || 'User'} 👋</h1>
          <p style={{ color: 'var(--text-2)' }}>Your AI fairness audit dashboard</p>
        </div>
        <Link to="/analyze/new" className="btn-primary"><Plus size={16}/> New Analysis</Link>
      </div>

      {/* Quick links */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {quickLinks.map(({ to, icon, label, desc }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)', marginBottom: '0.15rem' }}>{label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>{desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2">
        {/* System status */}
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Activity size={18} color="var(--accent)"/> System Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Gemini AI API',   ok: true,  status: 'Connected'   },
              { label: 'Bias Engine',     ok: true,  status: 'Operational' },
              { label: 'Audit Storage',   ok: !!user?.token, status: user?.token ? 'Active' : 'Not authenticated' },
              { label: 'Drift Monitor',   ok: true,  status: 'Running'     },
            ].map(({ label, status, ok }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: ok ? '#34d399' : '#fb923c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ok ? '#34d399' : '#fb923c', display: 'inline-block' }}/>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent audits */}
        <div className="glass-panel" style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color="var(--accent)"/> Recent Audits
          </h3>
          {loading ? (
            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Loading...</p>
          ) : recentAudits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1rem' }}>No audits yet.</p>
              <Link to="/analyze/new" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.5rem 1.25rem' }}>Run First Audit</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentAudits.map(audit => (
                <div key={audit._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0.85rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '0.15rem' }}>{audit.datasetName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>
                      {audit.sensitiveAttribute} → {audit.targetAttribute} · DI: {audit.metrics?.disparateImpact?.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: audit.status === 'Fair' ? '#34d399' : '#f87171', flexShrink: 0 }}>
                    {audit.status === 'Fair' ? <CheckCircle size={13}/> : <AlertTriangle size={13}/>}
                    {audit.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/history" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <History size={16}/> Full History
        </Link>
        <Link to="/settings" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <SettingsIcon size={16}/> Settings
        </Link>
      </div>
    </motion.div>
  );
}
