import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function History() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/audits/history', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setAudits(data);
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchHistory();
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock /> Analysis History
      </h1>

      {loading ? (
        <div className="text-center" style={{ padding: '3rem' }}>Loading...</div>
      ) : audits.length === 0 ? (
        <div className="glass-panel text-center">
          <h3 style={{ color: 'var(--text-secondary)' }}>No previous records found.</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Once you run a bias analysis, your past reports will be saved here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {audits.map(audit => (
            <div key={audit._id} className="glass-panel flex-between" style={{ padding: '1.5rem', borderLeft: `4px solid ${audit.status === 'Fair' ? 'var(--success-color)' : 'var(--danger-color)'}` }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} color="var(--accent-color)" /> {audit.datasetName}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Target: {audit.targetAttribute} | Sensitive: {audit.sensitiveAttribute} | Date: {new Date(audit.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-center">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: audit.status === 'Fair' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                  {audit.status === 'Fair' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                  <strong>{audit.status}</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  DI Score: {audit.metrics.disparateImpact.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
