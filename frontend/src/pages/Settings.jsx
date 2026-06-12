import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, User, Key, Bell, CheckCircle } from 'lucide-react';
import { apiPost } from '../utils/api';

export default function Settings() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ biasAlerts: true, driftAlerts: true, weeklyReport: false });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    setSaving(true);
    try {
      await apiPost('/api/auth/change-password', { currentPassword: currentPw, newPassword: newPw });
      setPwSuccess('Password updated successfully');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setPwError(err.message || 'Failed to update password');
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '700px' }}>

      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
        <SettingsIcon size={26} color="var(--accent)" /> Settings
      </h1>

      {/* Profile */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <User size={16} color="var(--accent)" /> Profile
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-1)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>{user?.email}</div>
            <div style={{ fontSize: '0.72rem', marginTop: '0.2rem', color: ['super_admin', 'org_admin', 'admin'].includes(user?.role) ? '#f87171' : 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role}</div>
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Display Name</label>
          <input type="text" className="text-input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input type="email" className="text-input" value={user?.email || ''} readOnly style={{ opacity: 0.6 }} />
        </div>
        <button className="btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => {}}>Save Profile</button>
      </div>

      {/* Password */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Key size={16} color="var(--accent)" /> Change Password
        </h3>
        {user?.googleId ? (
          <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Your account uses Google Sign-In. Password change is not available.</p>
        ) : (
          <form onSubmit={handlePasswordChange}>
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input type="password" className="text-input" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">New Password</label>
              <input type="password" className="text-input" value={newPw} onChange={e => setNewPw(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input type="password" className="text-input" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
            </div>
            {pwError && <div style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '1rem' }}>{pwError}</div>}
            {pwSuccess && <div style={{ color: '#34d399', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={14}/>{pwSuccess}</div>}
            <button type="submit" className="btn-primary" disabled={saving} style={{ fontSize: '0.85rem' }}>
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>

      {/* Notifications */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Bell size={16} color="var(--accent)" /> Notification Preferences
        </h3>
        {[
          { key: 'biasAlerts', label: 'Bias Detected Alerts', desc: 'Notify when a new audit detects DI below 0.8' },
          { key: 'driftAlerts', label: 'Drift Monitor Alerts', desc: 'Notify when model fairness degrades over time' },
          { key: 'weeklyReport', label: 'Weekly Audit Summary', desc: 'Receive a weekly digest of all your audits' },
        ].map(({ key, label, desc }) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-1)' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{desc}</div>
            </div>
            <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
              <input type="checkbox" checked={notifications[key]} onChange={e => setNotifications(p => ({ ...p, [key]: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '999px', background: notifications[key] ? 'var(--accent)' : 'var(--border)', transition: 'background 0.2s' }}>
                <span style={{ position: 'absolute', top: '3px', left: notifications[key] ? '22px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }}/>
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(248,113,113,0.3)' }}>
        <h3 style={{ color: '#f87171', marginBottom: '1rem' }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Logging out will clear your session. Your audits remain saved in the database.</p>
        <button className="btn-secondary" onClick={logout} style={{ borderColor: '#f87171', color: '#f87171', fontSize: '0.85rem' }}>
          Sign Out
        </button>
      </div>

    </motion.div>
  );
}
