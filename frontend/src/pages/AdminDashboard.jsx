import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Users, Database, Activity, ShieldAlert, CheckCircle, Clock, Server, Search } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', joined: '2026-04-20', status: 'Active' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@fintech.io', role: 'Researcher', joined: '2026-04-22', status: 'Active' },
    { id: '3', name: 'Mike Ross', email: 'mike@legal.com', role: 'Auditor', joined: '2026-04-25', status: 'Pending' },
    { id: '4', name: 'Elena Vance', email: 'elena@vance.net', role: 'User', joined: '2026-04-26', status: 'Active' },
  ];

  const systemStatus = [
    { label: 'Gemini API', status: 'Operational', color: 'var(--success-color)', icon: <CheckCircle size={16} /> },
    { label: 'Database', status: 'Healthy', color: 'var(--success-color)', icon: <Database size={16} /> },
    { label: 'Auth Service', status: 'Operational', color: 'var(--success-color)', icon: <ShieldAlert size={16} /> },
    { label: 'System Latency', status: '42ms', color: 'var(--accent-secondary)', icon: <Clock size={16} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent-secondary)' }}>System Administration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Centralized monitoring for Prism AI Infrastructure</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {systemStatus.map((item, idx) => (
            <div key={idx} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: item.color }}>{item.icon}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{item.label}:</span>
              <span style={{ fontWeight: 600 }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(0, 255, 204, 0.1)', borderRadius: '16px' }}>
            <Users size={40} color="var(--accent-secondary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1 }}>1,432</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total Registered Users</p>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(255, 204, 0, 0.1)', borderRadius: '16px' }}>
            <Activity size={40} color="var(--accent-color)" />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1 }}>28,491</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Bias Audits Completed</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <h3>Recent User Activity</h3>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
              <Search size={14} /> View All
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>User</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Role</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1.2rem 0' }}>
                    <div style={{ fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '1.2rem 0', fontSize: '0.9rem' }}>{u.role}</td>
                  <td style={{ padding: '1.2rem 0' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '100px', 
                      fontSize: '0.7rem', 
                      background: u.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: u.status === 'Active' ? 'var(--success-color)' : 'var(--warning-color)',
                      border: `1px solid ${u.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                    }}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel">
          <h3>System Infrastructure</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '1.5rem 0' }}>Real-time health monitoring for globally distributed nodes.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Compute Usage (US-East)</span>
                <span>64%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <div style={{ width: '64%', height: '100%', background: 'var(--accent-secondary)', borderRadius: '10px' }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Memory Allocation</span>
                <span>42%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <div style={{ width: '42%', height: '100%', background: 'var(--accent-color)', borderRadius: '10px' }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Network Traffic</span>
                <span>88%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <div style={{ width: '88%', height: '100%', background: 'var(--danger-color)', borderRadius: '10px' }}></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1rem', background: 'rgba(0, 255, 204, 0.05)', borderRadius: '12px', border: '1px dashed rgba(0, 255, 204, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Server size={24} color="var(--accent-secondary)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Provisioning New Node</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Coimbatore-South-01 deployment in progress...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
