import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, ServerCrash, Activity } from 'lucide-react';

export default function Firewall() {
  const [logs, setLogs] = useState([]);
  const [blockedCount, setBlockedCount] = useState(0);

  useEffect(() => {
    // Simulate incoming API requests
    const interval = setInterval(() => {
      const isBiased = Math.random() > 0.7; // 30% chance of biased decision
      const id = Math.random().toString(36).substring(7);
      
      const newLog = {
        id,
        timestamp: new Date().toISOString().split('T')[1].substring(0, 8),
        endpoint: ['/api/loan/approve', '/api/hr/screen', '/api/health/triage'][Math.floor(Math.random() * 3)],
        status: isBiased ? 'BLOCKED' : 'PASSED',
        reason: isBiased ? 'Disparate Impact < 0.8 (Age)' : 'Compliant'
      };

      if (isBiased) setBlockedCount(prev => prev + 1);

      setLogs(prev => [newLog, ...prev].slice(0, 8)); // Keep last 8 logs
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)' }}>
            <ShieldAlert size={32} /> Real-Time Bias Firewall
          </h1>
          <p className="hero-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>Intercepting and auditing algorithmic decisions before they reach the real world.</p>
        </div>
        
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1rem 2rem', border: '1px solid var(--danger-color)' }}>
          <h3 style={{ color: 'var(--danger-color)', fontSize: '2rem' }}>{blockedCount}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Biased Decisions Blocked</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Activity color="var(--accent-color)" /> Live API Traffic
          </h3>
          
          <div style={{ background: '#000', padding: '1rem', borderRadius: '8px', border: '1px solid #333', height: '400px', overflow: 'hidden', fontFamily: 'monospace' }}>
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ 
                    padding: '0.8rem', 
                    borderBottom: '1px solid #222',
                    color: log.status === 'BLOCKED' ? 'var(--danger-color)' : 'var(--success-color)',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>[{log.timestamp}] {log.endpoint}</span>
                  <span style={{ fontWeight: 'bold' }}>{log.status} - {log.reason}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <ServerCrash size={60} color="var(--accent-secondary)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2>Middleware Integration</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: 1.6 }}>
            Prism AI can be deployed as an active API middleware. Instead of uploading CSVs, route your internal ML predictions through our firewall. 
            If a prediction violates statistical parity, we block the response and return an automated mitigation strategy.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
