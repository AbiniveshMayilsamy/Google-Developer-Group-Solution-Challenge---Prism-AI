import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Users, Database, Activity, ShieldAlert, CheckCircle, Clock, Server, Search, RefreshCw, KeyRound, Play } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAudits: 0,
    computeUsage: 50,
    memoryAllocation: 40,
    networkTraffic: 60,
    databaseStatus: 'Connecting...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Provisioning state
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState([
    { name: 'Coimbatore-South-01', location: 'Tamil Nadu', status: 'Active' },
    { name: 'Delhi-NCR-02', location: 'Delhi', status: 'Active' }
  ]);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

  const fetchAdminData = async () => {
    if (!user || !user.token) return;
    try {
      setError('');
      // Fetch users
      const usersRes = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const usersData = await usersRes.json();
      if (!usersRes.ok) throw new Error(usersData.message || 'Failed to fetch users');
      setUsersList(usersData);

      // Fetch stats
      const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const statsData = await statsRes.json();
      if (!statsRes.ok) throw new Error(statsData.message || 'Failed to fetch statistics');
      setStats(statsData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while loading admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Poll stats every 8 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const statsData = await res.json();
          setStats(statsData);
        }
      } catch (err) {
        // quiet fail on polling
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const handleToggleRole = async (targetUserId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`${BASE_URL}/api/admin/users/${targetUserId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update role');
      
      // Update local list state
      setUsersList(usersList.map(u => u._id === targetUserId ? { ...u, role: nextRole } : u));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProvisionNode = () => {
    if (isProvisioning) return;
    setIsProvisioning(true);
    setProvisionProgress(0);
  };

  useEffect(() => {
    if (isProvisioning && provisionProgress < 100) {
      const timer = setTimeout(() => {
        setProvisionProgress(p => p + 10);
      }, 300);
      return () => clearTimeout(timer);
    } else if (provisionProgress >= 100 && isProvisioning) {
      setIsProvisioning(false);
      const newNodes = [
        ...activeNodes,
        {
          name: `Bangalore-North-0${activeNodes.length + 1}`,
          location: 'Karnataka',
          status: 'Active'
        }
      ];
      setActiveNodes(newNodes);
    }
  }, [isProvisioning, provisionProgress]);

  const systemStatus = [
    { label: 'Gemini 2.5', status: 'Operational', color: 'var(--success-color)', icon: <CheckCircle size={16} /> },
    { label: 'Database', status: stats.databaseStatus, color: 'var(--success-color)', icon: <Database size={16} /> },
    { label: 'Auth Middleware', status: 'Active', color: 'var(--success-color)', icon: <ShieldAlert size={16} /> },
    { label: 'Refresh Rate', status: 'Live', color: 'var(--accent-secondary)', icon: <Clock size={16} /> },
  ];

  if (loading) {
    return (
      <div className="app-container text-center" style={{ paddingTop: '8rem' }}>
        <RefreshCw className="animate-spin" size={48} color="var(--accent)" />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading system control metrics...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent-secondary)' }}>System Administration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Centralized monitoring & user access permissions for Prism AI</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {systemStatus.map((item, idx) => (
            <div key={idx} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: item.color }}>{item.icon}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{item.label}:</span>
              <span style={{ fontWeight: 600 }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', borderRadius: '8px', color: 'var(--danger-color)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(0, 255, 204, 0.1)', borderRadius: '16px' }}>
            <Users size={40} color="var(--accent-secondary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1 }}>{stats.totalUsers}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total Registered Users</p>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(255, 204, 0, 0.1)', borderRadius: '16px' }}>
            <Activity size={40} color="var(--accent-color)" />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', lineHeight: 1 }}>{stats.totalAudits.toLocaleString()}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Bias Audits Completed</p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* User Management Section */}
        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <h3>Registered Access Accounts</h3>
            <button className="btn-secondary" onClick={fetchAdminData} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <RefreshCw size={12} /> Sync Users
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>User Info</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Access Level</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1.2rem 0' }}>
                    <div style={{ fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '1.2rem 0', fontSize: '0.9rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '100px', 
                      fontSize: '0.7rem', 
                      background: u.role === 'admin' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255,255,255,0.03)',
                      color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)',
                      border: `1px solid ${u.role === 'admin' ? 'rgba(168, 85, 247, 0.2)' : 'var(--panel-border)'}`,
                      fontWeight: 600
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 0', textAlign: 'right' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', borderColor: u.role === 'admin' ? 'var(--warning-color)' : 'var(--accent-secondary)' }}
                      onClick={() => handleToggleRole(u._id, u.role)}
                      disabled={u.email === 'admin@prismai.com'} // Protect master admin
                    >
                      {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compute Load & Node Provisioning Section */}
        <div className="glass-panel">
          <h3>Local Compute Infrastructure</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '1.5rem 0', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Real-time CPU and Memory telemetry across active computational pipelines.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Compute Load (US-East Hub)</span>
                <strong>{stats.computeUsage}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <div style={{ width: `${stats.computeUsage}%`, height: '100%', background: 'var(--accent-secondary)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Model Weights Memory Buffer</span>
                <strong>{stats.memoryAllocation}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <div style={{ width: `${stats.memoryAllocation}%`, height: '100%', background: 'var(--accent-color)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Inbound Verification Traffic</span>
                <strong>{stats.networkTraffic}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <div style={{ width: `${stats.networkTraffic}%`, height: '100%', background: stats.networkTraffic > 80 ? 'var(--danger-color)' : 'var(--accent-secondary)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.2rem', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
            <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={16} color="var(--accent)" /> Distributed Compute Nodes
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
              {activeNodes.map((node, nIdx) => (
                <div key={nIdx} className="flex-between" style={{ fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.01)' }}>
                  <span>🖧 <strong>{node.name}</strong> ({node.location})</span>
                  <span style={{ color: 'var(--success-color)' }}>● {node.status}</span>
                </div>
              ))}
            </div>

            {isProvisioning ? (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1rem' }}>
                <div className="flex-between" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  <span>Provisioning Bangalore node...</span>
                  <strong>{provisionProgress}%</strong>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${provisionProgress}%`, background: 'var(--accent-secondary)', height: '100%' }}></div>
                </div>
              </div>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleProvisionNode} 
                style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Play size={12} /> Provision Bangalore Node
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
