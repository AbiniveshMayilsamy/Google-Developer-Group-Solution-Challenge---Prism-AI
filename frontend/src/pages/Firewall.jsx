import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, Activity, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

export default function Firewall() {
  const { laymanMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [testAge, setTestAge] = useState(30);
  const [testGender, setTestGender] = useState('Male');
  const [testIncome, setTestIncome] = useState(60000);
  const [testEndpoint, setTestEndpoint] = useState('/api/loan/approve');
  const [testResult, setTestResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const isBiased = Math.random() > 0.75;
      const endpoint = ['/api/loan/approve', '/api/hr/screen', '/api/health/triage'][Math.floor(Math.random() * 3)];
      const reason = isBiased ? 'Disparate Impact < 0.8 (Age)' : 'Compliant';
      const newLog = { id: Math.random().toString(36).substr(2, 6), time: new Date().toLocaleTimeString(), endpoint, status: isBiased ? 'BLOCKED' : 'PASSED', reason };
      if (isBiased) { setBlockedCount(p => p + 1); fetchInsight(reason, endpoint); }
      setLogs(prev => [newLog, ...prev].slice(0, 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchInsight = async (reason, endpoint) => {
    setLoadingAi(true);
    try {
      const data = await apiPost('/api/ai/firewall-insight', { blockedReason: reason, endpoint, laymanMode });
      setAiInsight(data.insight);
    } catch (e) { console.error(e); }
    finally { setLoadingAi(false); }
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTestResult(null);
    let isBlocked = false;
    let reason = 'Compliant';
    if (testAge < 25) { isBlocked = true; reason = 'Disparate Impact < 0.8 (Age Discrimination)'; }
    else if (testIncome < 25000) { isBlocked = true; reason = 'Disparate Impact < 0.8 (Income Proxy)'; }

    const log = { id: 'test_' + Date.now(), time: new Date().toLocaleTimeString(), endpoint: testEndpoint, status: isBlocked ? 'BLOCKED' : 'PASSED', reason };
    setLogs(prev => [log, ...prev].slice(0, 10));
    if (isBlocked) { setBlockedCount(p => p + 1); await fetchInsight(reason, testEndpoint); }
    else setAiInsight('');
    setTestResult({ status: isBlocked ? 'BLOCKED' : 'PASSED', reason });
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f87171', marginBottom: '0.4rem' }}>
            <ShieldAlert size={28} /> Real-Time Bias Firewall
          </h1>
          <p style={{ color: 'var(--text-2)' }}>
            {laymanMode ? 'Blocks unfair AI decisions before they reach real people.' : 'Intercepting and auditing algorithmic decisions in real-time.'}
          </p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1rem 1.5rem', border: '1px solid rgba(248,113,113,0.3)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f87171' }}>{blockedCount}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Blocked</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Activity size={16} color="var(--accent)" /> Live API Traffic
          </h3>
          <div style={{ background: '#080810', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', height: '380px', overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <AnimatePresence>
              {logs.length === 0 && <div style={{ color: 'var(--text-2)', padding: '0.5rem' }}>Waiting for traffic...</div>}
              {logs.map(log => (
                <motion.div key={log.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '0.5rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
                >
                  <span style={{ color: 'var(--text-2)' }}>[{log.time}] {log.endpoint}</span>
                  <span style={{ fontWeight: 700, color: log.status === 'BLOCKED' ? '#f87171' : '#34d399', flexShrink: 0 }}>{log.status}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={16} color="var(--accent)" /> Test a Transaction
          </h3>
          <p style={{ color: 'var(--text-2)', fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
            {laymanMode ? 'Submit fake details to see if the firewall catches bias.' : 'Submit a payload to test the real-time fairness rule engine.'}
          </p>

          <form onSubmit={handleTest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Endpoint</label>
                <select className="select-input" value={testEndpoint} onChange={e => setTestEndpoint(e.target.value)}>
                  <option value="/api/loan/approve">/api/loan/approve</option>
                  <option value="/api/hr/screen">/api/hr/screen</option>
                  <option value="/api/health/triage">/api/health/triage</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Gender</label>
                <select className="select-input" value={testGender} onChange={e => setTestGender(e.target.value)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Age <span style={{ color: 'var(--accent)' }}>{testAge}</span>
              </label>
              <input type="range" min="18" max="75" value={testAge} onChange={e => setTestAge(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Income <span style={{ color: 'var(--accent)' }}>${testIncome.toLocaleString()}</span>
              </label>
              <input type="range" min="10000" max="150000" step="5000" value={testIncome} onChange={e => setTestIncome(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Processing...' : 'Send Test Transaction'}
            </button>
          </form>

          {testResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: testResult.status === 'BLOCKED' ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.08)', border: `1px solid ${testResult.status === 'BLOCKED' ? '#f8717140' : '#34d39940'}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: testResult.status === 'BLOCKED' ? '#f87171' : '#34d399', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
                {testResult.status === 'BLOCKED' ? <ShieldAlert size={14}/> : <CheckCircle size={14}/>}
                Transaction {testResult.status}
              </div>
              <p style={{ color: 'var(--text-2)', fontSize: '0.78rem', margin: 0 }}>Reason: {testResult.reason}</p>
              {testResult.status === 'BLOCKED' && aiInsight && (
                <div style={{ marginTop: '0.7rem', paddingTop: '0.7rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: '0.3rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                    <Brain size={12}/> Gemini AI Insight
                  </div>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.76rem', lineHeight: 1.5, margin: 0 }}>
                    {loadingAi ? 'Analyzing...' : aiInsight}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
