import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, Database, Activity, ShieldAlert, CheckCircle, Clock, 
  Server, Search, RefreshCw, KeyRound, Play, Globe, Trash2, 
  Edit3, Plus, UserPlus, Building, Layers, Settings, Eye, CheckCircle2
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Dashboard view tabs: 'telemetry', 'users', 'organizations', 'transactions'
  const [activeTab, setActiveTab] = useState('telemetry');
  
  // Core lists
  const [usersList, setUsersList] = useState([]);
  const [orgsList, setOrgsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // System Telemetry stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAudits: 0,
    totalOrganizations: 0,
    computeUsage: 50,
    memoryAllocation: 40,
    networkTraffic: 60,
    databaseStatus: 'Connected'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Forms / Modals state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user', groupId: '' });
  
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', organizationId: '' });

  const [editingUser, setEditingUser] = useState(null);

  // Compute node provisioning
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState([
    { name: 'Coimbatore-South-01', location: 'Tamil Nadu', status: 'Active' },
    { name: 'Delhi-NCR-02', location: 'Delhi', status: 'Active' }
  ]);

  const fetchData = async () => {
    if (!user || !user.token) return;
    try {
      setError('');
      setLoading(true);
      
      // Fetch stats
      const statsData = await apiGet('/api/admin/stats');
      setStats(statsData);

      // Fetch users
      const usersData = await apiGet('/api/admin/users');
      setUsersList(usersData);

      // Fetch orgs
      const orgsData = await apiGet('/api/admin/organizations');
      setOrgsList(orgsData);

      // Fetch groups
      const groupsData = await apiGet('/api/admin/groups');
      setGroupsList(groupsData);

      // Fetch transactions
      const transactionsData = await apiGet('/api/admin/transactions');
      setTransactions(transactionsData);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sync administrative schemas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // User Actions
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/api/admin/users', newUser);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', role: 'user', groupId: '' });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await apiPut(`/api/admin/users/${editingUser.id || editingUser._id}`, editingUser);
      setEditingUser(null);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to remove this user account?')) return;
    try {
      await apiDelete(`/api/admin/users/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (userObj) => {
    const nextStatus = userObj.status === 'active' ? 'inactive' : 'active';
    try {
      await apiPut(`/api/admin/users/${userObj.id || userObj._id}`, { status: nextStatus });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  // Group Actions
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/api/admin/groups', newGroup);
      setShowAddGroup(false);
      setNewGroup({ name: '', description: '', organizationId: '' });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to provision group');
    }
  };

  // Compute Node simulation
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
      setActiveNodes([
        ...activeNodes,
        {
          name: `Bangalore-North-0${activeNodes.length + 1}`,
          location: 'Karnataka',
          status: 'Active'
        }
      ]);
    }
  }, [isProvisioning, provisionProgress]);

  // Google ecosystem indicators
  const googleServices = [
    { name: 'Google OAuth + Firebase', status: 'Connected', desc: 'Secure B2B authentication flow' },
    { name: 'Gemini 2.5 API SDK', status: 'Active (Flash/Pro)', desc: 'AI Ethicist explanations' },
    { name: 'Google Cloud Run', status: 'Deployed (2.2s)', desc: 'Autoscaled compute instance' },
    { name: 'Vertex AI Registry', status: 'Synced', desc: 'Model version deployment' },
    { name: 'BigQuery Analytics Hub', status: 'Connected', desc: 'Data warehouse bias ingestion' },
    { name: 'Google Maps Geo API', status: 'Active', desc: 'Geospatial regional distribution' },
    { name: 'Cloud Storage (GCS)', status: 'Active (2 Buckets)', desc: 'CSV dataset repository' },
    { name: 'Secret Manager', status: 'Encrypted', desc: 'Secure database & Gemini keys' },
    { name: 'Cloud Monitoring', status: 'Healthy', desc: 'Compute & memory metrics log' }
  ];

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="app-container text-center" style={{ paddingTop: '8rem' }}>
        <RefreshCw className="animate-spin" size={48} color="var(--accent)" />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Prism administrative cockpit...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      
      {/* Title */}
      <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent)' }}>Administrative Portal</h1>
          <p style={{ color: 'var(--text-2)' }}>Centralized workspace multitenancy, role configuration, and telemetry audit logs</p>
        </div>
        <button className="btn-secondary" onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={14} /> Refresh Cockpit
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(248,113,113,0.1)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Registered Access Accounts', val: stats.totalUsers, icon: <Users color="var(--accent)" /> },
          { label: 'Enterprise Organizations', val: stats.totalOrganizations, icon: <Building color="var(--accent-2)" /> },
          { label: 'Completed Bias Audits', val: stats.totalAudits, icon: <Database color="#34d399" /> },
          { label: 'Active Database Connection', val: stats.databaseStatus, icon: <ShieldAlert color="#34d399" /> }
        ].map((c, idx) => (
          <div key={idx} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
            <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{c.val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2rem', gap: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'telemetry', label: 'Telemetry & Cloud Logs', icon: <Activity size={16} /> },
          { id: 'users', label: 'Users & Teams Directory', icon: <Users size={16} /> },
          { id: 'organizations', label: 'Organization Tenants', icon: <Building size={16} /> },
          { id: 'transactions', label: 'Transaction Audit Trail', icon: <Clock size={16} /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === t.id ? 'var(--text-1)' : 'var(--text-2)',
              padding: '0.75rem 0.25rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={{ minHeight: '400px' }}>
        
        {/* TELEMETRY TAB */}
        {activeTab === 'telemetry' && (
          <div className="grid-2" style={{ gap: '2rem' }}>
            
            <div className="glass-panel">
              <h3 style={{ marginBottom: '1.25rem' }}>Local Compute Telemetry</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Compute CPU Load (US-East Hub)</span>
                    <strong>{stats.computeUsage}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <div style={{ width: `${stats.computeUsage}%`, height: '100%', background: 'var(--accent)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Weight Buffer Memory Usage</span>
                    <strong>{stats.memoryAllocation}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <div style={{ width: `${stats.memoryAllocation}%`, height: '100%', background: 'var(--accent-2)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Inbound Inferences Webhook Stream</span>
                    <strong>{stats.networkTraffic}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <div style={{ width: `${stats.networkTraffic}%`, height: '100%', background: '#34d399', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Server size={15} color="var(--accent)" /> Local Provisioned Nodes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '0.85rem 0' }}>
                  {activeNodes.map((node, idx) => (
                    <div key={idx} className="flex-between" style={{ fontSize: '0.82rem', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <span>🖧 <strong>{node.name}</strong> ({node.location})</span>
                      <span style={{ color: '#34d399' }}>● {node.status}</span>
                    </div>
                  ))}
                </div>

                {isProvisioning ? (
                  <div style={{ marginTop: '1.25rem' }}>
                    <div className="flex-between" style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginBottom: '0.3rem' }}>
                      <span>Deploying node weight registry...</span>
                      <strong>{provisionProgress}%</strong>
                    </div>
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${provisionProgress}%`, background: 'var(--accent)', height: '100%' }}></div>
                    </div>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={handleProvisionNode} style={{ width: '100%', padding: '0.55rem', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <Play size={10} /> Provision Bangalore-North Node
                  </button>
                )}
              </div>
            </div>

            <div className="glass-panel">
              <h3 style={{ marginBottom: '1.25rem' }}>Google Cloud Ecosystem Integrations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {googleServices.map((srv, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{srv.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-2)' }}>{srv.desc}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(52,211,153,0.08)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
                      <CheckCircle2 size={12} /> {srv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* USERS & GROUPS DIRECTORY TAB */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Control bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" onClick={() => { setEditingUser(null); setShowAddUser(!showAddUser); }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', fontSize: '0.82rem' }}>
                  <UserPlus size={14} /> Add User Account
                </button>
                <button className="btn-secondary" onClick={() => setShowAddGroup(!showAddGroup)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', fontSize: '0.82rem' }}>
                  <Plus size={14} /> Create New Group
                </button>
              </div>
            </div>

            {/* Add User form */}
            {showAddUser && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ border: '1px solid var(--accent)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Provision New User Credentials</h4>
                <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input type="text" className="text-input" placeholder="Rohan Sharma" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input type="email" className="text-input" placeholder="rohan@company.com" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <input type="password" className="text-input" placeholder="••••••••" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Access Role</label>
                    <select className="select-input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                      <option value="user">User</option>
                      <option value="group_admin">Group Admin</option>
                      <option value="org_admin">Organization Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Assign Group Team</label>
                    <select className="select-input" value={newUser.groupId} onChange={e => setNewUser({ ...newUser, groupId: e.target.value })}>
                      <option value="">No Team Group</option>
                      {groupsList.map(g => (
                        <option key={g.id || g._id} value={g.id || g._id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>Provision Account</button>
                    <button type="button" className="btn-secondary" onClick={() => setShowAddUser(false)} style={{ padding: '0.85rem' }}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Create Group form */}
            {showAddGroup && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ border: '1px solid var(--accent)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Create New Multi-tenant Group</h4>
                <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Group Name (e.g. Finance Team)</label>
                    <input type="text" className="text-input" placeholder="Hiring Team" required value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Description</label>
                    <input type="text" className="text-input" placeholder="Compliance and validation reviews for hiring algorithms" value={newGroup.description} onChange={e => setNewGroup({ ...newGroup, description: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Select Organization Tenant</label>
                    <select className="select-input" required value={newGroup.organizationId} onChange={e => setNewGroup({ ...newGroup, organizationId: e.target.value })}>
                      <option value="">-- Choose Tenant --</option>
                      {orgsList.map(o => (
                        <option key={o.id || o._id} value={o.id || o._id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>Create Group</button>
                    <button type="button" className="btn-secondary" onClick={() => setShowAddGroup(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Edit User Form */}
            {editingUser && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ border: '1px solid #fb923c' }}>
                <h4 style={{ marginBottom: '1rem' }}>Edit User: {editingUser.email}</h4>
                <form onSubmit={handleUpdateUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input type="text" className="text-input" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Role</label>
                    <select className="select-input" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                      <option value="user">User</option>
                      <option value="group_admin">Group Admin</option>
                      <option value="org_admin">Organization Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Status</label>
                    <select className="select-input" value={editingUser.status} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>Save Changes</button>
                    <button type="button" className="btn-secondary" onClick={() => setEditingUser(null)} style={{ padding: '0.85rem' }}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Users Directory List */}
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Name / Email</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Workspace Org</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Group Team</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id || u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.88rem' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {u.Organization ? u.Organization.name : <em style={{ color: 'var(--text-3)' }}>No Tenant</em>}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {u.Group ? u.Group.name : <em style={{ color: 'var(--text-3)' }}>No Group</em>}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                          background: u.role.includes('admin') ? 'var(--accent-dim)' : 'rgba(255,255,255,0.02)',
                          color: u.role.includes('admin') ? 'var(--accent)' : 'var(--text-2)',
                          border: `1px solid ${u.role.includes('admin') ? 'rgba(168,85,247,0.2)' : 'var(--border)'}`
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <button 
                          onClick={() => handleToggleStatus(u)}
                          disabled={u.email === 'admin@prismai.com'}
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: u.status === 'active' ? '#34d399' : 'var(--danger)',
                            fontWeight: 700, fontSize: '0.8rem'
                          }}
                        >
                          {u.status === 'active' ? '● Active' : '● Deactivated'}
                        </button>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button className="btn-secondary" onClick={() => setEditingUser(u)} style={{ padding: '0.35rem', borderRadius: '6px' }} title="Edit user">
                            <Edit3 size={12} />
                          </button>
                          <button 
                            className="btn-secondary" 
                            onClick={() => handleDeleteUser(u.id || u._id)} 
                            style={{ padding: '0.35rem', borderRadius: '6px', color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.2)' }}
                            disabled={u.email === 'admin@prismai.com'}
                            title="Delete user"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ORGANIZATIONS TAB */}
        {activeTab === 'organizations' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem' }}>Tenant Workspaces</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Tenant Name</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Slug Reference</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Subscription Level</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orgsList.map(org => (
                  <tr key={org.id || org._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.88rem' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{org.name}</td>
                    <td style={{ padding: '1rem 0.5rem', fontFamily: 'var(--font-mono)' }}>/{org.slug}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                        background: org.subscription === 'enterprise' ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.02)',
                        color: org.subscription === 'enterprise' ? '#34d399' : 'var(--text-2)',
                        border: `1px solid ${org.subscription === 'enterprise' ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`
                      }}>
                        {org.subscription?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: org.active ? '#34d399' : 'var(--danger)', fontWeight: 600 }}>
                      {org.active ? '● Active' : '● Blocked'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.25rem' }}>Security Transaction History (Last 10 Actions)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Time</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Authorized User</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Action Executed</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Domain Module</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.85rem' }}>
                    <td style={{ padding: '0.95rem 0.5rem', color: 'var(--text-2)' }}>
                      {new Date(t.time).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '0.95rem 0.5rem', fontWeight: 600 }}>{t.user}</td>
                    <td style={{ padding: '0.95rem 0.5rem' }}>{t.action}</td>
                    <td style={{ padding: '0.95rem 0.5rem', color: 'var(--accent-2)', fontWeight: 600 }}>{t.module}</td>
                    <td style={{ padding: '0.95rem 0.5rem' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem', borderRadius: '100px', fontSize: '0.68rem', fontWeight: 800,
                        background: t.status === 'Success' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                        color: t.status === 'Success' ? '#34d399' : 'var(--danger)'
                      }}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </motion.div>
  );
}
