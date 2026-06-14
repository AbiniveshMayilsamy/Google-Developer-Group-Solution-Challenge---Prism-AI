import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, Activity, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

export default function InlineFirewall({ metrics, config }) {
  const { laymanMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Build test fields dynamically from the actual sensitive attribute
  const sensitiveAttr = config?.sensitiveAttribute || 'Attribute';
  const privGroup = config?.privilegedGroup || 'Group A';
  const unprivGroup = config?.unprivilegedGroup || 'Group B';
  const [testGroup, setTestGroup] = useState(privGroup);
  const [testScore, setTestScore] = useState(75);

  const isBiased = metrics?.disparateImpact < 0.8;

  // Simulate background traffic — AI insight only called on manual test, not auto-logs
  useEffect(() => {
    const interval = setInterval(() => {
      const biasChance = isBiased ? 0.6 : 0.2;
      const isBlocked = Math.random() < biasChance;
      const reason = isBlocked
        ? `DI = ${metrics?.disparateImpact?.toFixed(3)} < 0.8 (${sensitiveAttr} bias)`
        : 'Compliant';
      const log = {
        id: Math.random().toString(36).substr(2, 6),
        time: new Date().toLocaleTimeString(),
        group: [privGroup, unprivGroup][Math.floor(Math.random() * 2)],
        status: isBlocked ? 'BLOCKED' : 'PASSED',
        reason
      };
      if (isBlocked) setBlockedCount(p => p + 1);
      // do NOT call fetchInsight here — only call on manual test button
      setLogs(prev => [log, ...prev].slice(0, 8));
    }, 5000);
    return () => clearInterval(interval);
  }, [isBiased, metrics, sensitiveAttr, privGroup, unprivGroup]);

  const fetchInsight = async (reason) => {
    setLoadingAi(true);
    try {
      const data = await apiPost('/api/ai/firewall-insight', {
        blockedReason: reason,
        endpoint: config?.targetAttribute || 'prediction',
        sensitiveAttribute: sensitiveAttr,
        disparateImpact: metrics?.disparateImpact,
        laymanMode
      });
      setAiInsight(data.insight);
    } catch (e) { console.error(e); }
    finally { setLoadingAi(false); }
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTestResult(null);

    // Use real DI to determine block threshold
    const di = metrics?.disparateImpact ?? 1.0;
    const isUnpriv = testGroup === unprivGroup;
    // If group is unprivileged and DI < 0.8, apply a higher bar (simulating bias)
    const threshold = isUnpriv && di < 0.8 ? 80 : 65;
    const isBlocked = testScore < threshold;
    const reason = isBlocked
      ? `Score ${testScore} below threshold ${threshold} for ${testGroup} (DI-adjusted)`
      : 'Compliant — score meets threshold';

    const log = {
      id: 'test_' + Date.now(), time: new Date().toLocaleTimeString(),
      group: testGroup, status: isBlocked ? 'BLOCKED' : 'PASSED', reason
    };
    setLogs(prev => [log, ...prev].slice(0, 8));
    if (isBlocked) { setBlockedCount(p => p + 1); await fetchInsight(reason); }
    else setAiInsight('');
    setTestResult({ status: isBlocked ? 'BLOCKED' : 'PASSED', reason, threshold });
    setSubmitting(false);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isBiased ? '#f87171' : 'var(--text-1)' }}>
          <ShieldAlert size={18} /> Bias Firewall
        </h3>
        <div style={{
          padding: '0.4rem 1rem', borderRadius: '999px',
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
          fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#f87171'
        }}>
          {blockedCount} Blocked
        </div>
      </div>

      <div className="grid-2" style={{ gap: '1.25rem' }}>
        {/* Live traffic */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Activity size={12} color="var(--accent)" /> Live Traffic
          </div>
          <div style={{ background: '#080810', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', height: '200px', overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            <AnimatePresence>
              {logs.length === 0 && <div style={{ color: 'var(--text-2)', padding: '0.4rem' }}>Waiting for traffic...</div>}
              {logs.map(log => (
                <motion.div key={log.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '0.35rem 0.4rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
                >
                  <span style={{ color: 'var(--text-2)' }}>[{log.time}] {log.group}</span>
                  <span style={{ fontWeight: 700, color: log.status === 'BLOCKED' ? '#f87171' : '#34d399', flexShrink: 0 }}>{log.status}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Test panel */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldAlert size={12} color="var(--accent)" /> Test a Decision
          </div>
          <form onSubmit={handleTest} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">{sensitiveAttr}</label>
              <select className="select-input" style={{ padding: '0.5rem' }} value={testGroup} onChange={e => setTestGroup(e.target.value)}>
                <option value={privGroup}>{privGroup}</option>
                <option value={unprivGroup}>{unprivGroup}</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Score <span style={{ color: 'var(--accent)' }}>{testScore}</span>
              </label>
              <input type="range" min="0" max="100" value={testScore} onChange={e => setTestScore(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', padding: '0.6rem', fontSize: '0.82rem' }}>
              {submitting ? 'Checking...' : 'Test Decision'}
            </button>
          </form>

          {testResult && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '0.75rem', padding: '0.7rem', borderRadius: '8px', background: testResult.status === 'BLOCKED' ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.08)', border: `1px solid ${testResult.status === 'BLOCKED' ? '#f8717140' : '#34d39940'}`, fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 700, color: testResult.status === 'BLOCKED' ? '#f87171' : '#34d399', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {testResult.status === 'BLOCKED' ? <ShieldAlert size={12}/> : <CheckCircle size={12}/>}
                {testResult.status}
              </div>
              <div style={{ color: 'var(--text-2)' }}>{testResult.reason}</div>
              {aiInsight && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.7rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Brain size={10}/> Gemini
                  </div>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.7rem', lineHeight: 1.5, margin: 0 }}>
                    {loadingAi ? 'Analyzing...' : aiInsight}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
