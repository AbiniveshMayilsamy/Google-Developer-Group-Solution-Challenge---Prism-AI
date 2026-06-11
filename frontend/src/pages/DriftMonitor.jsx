import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Bell, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

const generateDriftData = () => {
  const data = [];
  let score = 1.0;
  for (let i = 30; i >= 0; i--) {
    score -= i < 15 ? Math.random() * 0.05 : Math.random() * 0.02 - 0.01;
    data.push({ day: `Day -${i}`, disparateImpact: parseFloat(score.toFixed(2)) });
  }
  return data;
};

export default function DriftMonitor() {
  const { laymanMode } = useTheme();
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const driftData = generateDriftData();
    setData(driftData);
    const latestDI = driftData[driftData.length - 1].disparateImpact;
    const generatedAlerts = driftData
      .filter(d => d.disparateImpact < 0.8)
      .map(d => ({ id: Math.random(), time: d.day, message: `Disparate Impact dropped to ${d.disparateImpact} — below 0.8 threshold.` }))
      .reverse();
    setAlerts(generatedAlerts);
    if (latestDI < 0.8) fetchAiInsight(latestDI, 0.95);
  }, []);

  const fetchAiInsight = async (current, avg) => {
    setLoadingAi(true);
    try {
      const result = await apiPost('/api/ai/drift-explanation', { currentValue: current, historicalAverage: avg, trend: 'Decreasing', laymanMode });
      setAiInsight(result.explanation);
    } catch (err) { console.error(err); }
    finally { setLoadingAi(false); }
  };

  const latestDI = data.length > 0 ? data[data.length - 1].disparateImpact : 1.0;
  const isSafe = latestDI >= 0.8;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Activity size={28} color="var(--accent)" /> Bias Drift Monitor
          </h1>
          <p style={{ color: 'var(--text-2)' }}>
            {laymanMode ? 'Watch how fair your AI stays over time as new data comes in.' : 'Continuous MLOps tracking of Disparate Impact across time.'}
          </p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1rem 1.5rem', border: `1px solid ${isSafe ? '#34d399' : '#f87171'}40` }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isSafe ? '#34d399' : '#f87171' }}>{latestDI}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current DI</div>
        </div>
      </div>

      <div className="drift-grid">
        <div className="glass-panel" style={{ height: '420px' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>30-Day Disparate Impact Trend</h3>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="var(--text-2)" tick={{ fontSize: 11 }} interval={4} />
              <YAxis domain={[0.4, 1.2]} stroke="var(--text-2)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(13,13,15,0.95)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-1)' }} />
              <ReferenceLine y={0.8} stroke="#f87171" strokeDasharray="5 3" label={{ value: '0.8 Threshold', fill: '#f87171', fontSize: 11 }} />
              <Line type="monotone" dataKey="disparateImpact" stroke="var(--accent)" strokeWidth={2.5}
                dot={{ r: 3, fill: '#0d0d0f', stroke: 'var(--accent)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ overflowY: 'auto', height: '420px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Bell size={16} color="var(--accent)" /> Alert Log
          </h3>
          {alerts.length === 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', color: '#34d399', alignItems: 'center', fontSize: '0.85rem' }}>
              <CheckCircle size={15} /> Model stable. No drift detected.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aiInsight && (
                <div style={{ padding: '0.85rem', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '10px', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', color: 'var(--accent)', fontWeight: 700, alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                    <Brain size={14} /> Gemini AI Insight
                  </div>
                  <p style={{ color: 'var(--text-1)', fontSize: '0.8rem', lineHeight: 1.55, margin: 0 }}>
                    {loadingAi ? 'Analyzing drift patterns...' : aiInsight}
                  </p>
                </div>
              )}
              {alerts.map(alert => (
                <div key={alert.id} style={{ padding: '0.8rem', background: 'rgba(248,113,113,0.08)', borderLeft: '3px solid #f87171', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', color: '#f87171', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                    <AlertTriangle size={13} /> {alert.time}
                  </div>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
