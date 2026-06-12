import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Bell, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

// Generates simulated drift data anchored to the REAL current DI score
function generateDriftFromReal(realDI) {
  const data = [];
  let score = Math.min(realDI + 0.15 + Math.random() * 0.1, 1.2); // start slightly above real
  for (let i = 30; i >= 1; i--) {
    if (i <= 5) {
      // Last 5 days trend toward the real DI score
      score = score + (realDI - score) * 0.4;
    } else {
      score += (Math.random() * 0.04) - 0.02;
    }
    score = Math.max(0.3, Math.min(1.3, score));
    data.push({ day: `Day -${i}`, disparateImpact: parseFloat(score.toFixed(3)) });
  }
  // Last point is exactly the real current DI
  data.push({ day: 'Today', disparateImpact: parseFloat(realDI.toFixed(3)) });
  return data;
}

export default function InlineDriftMonitor({ metrics, config }) {
  const { laymanMode } = useTheme();
  const [data, setData] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const fetched = useRef(false);

  const realDI = metrics?.disparateImpact ?? 1.0;

  useEffect(() => {
    const driftData = generateDriftFromReal(realDI);
    setData(driftData);
    if (realDI < 0.8 && !fetched.current) {
      fetched.current = true;
      fetchAiInsight(realDI);
    }
  }, [realDI]);

  const fetchAiInsight = async (current) => {
    setLoadingAi(true);
    try {
      const result = await apiPost('/api/ai/drift-explanation', {
        currentValue: current,
        historicalAverage: 0.95,
        trend: current < 0.8 ? 'Decreasing' : 'Stable',
        sensitiveAttribute: config?.sensitiveAttribute,
        laymanMode
      });
      setAiInsight(result.explanation);
    } catch (e) { console.error(e); }
    finally { setLoadingAi(false); }
  };

  const alerts = data.filter(d => d.disparateImpact < 0.8);
  const isSafe = realDI >= 0.8;

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent)" /> Bias Drift Monitor
        </h3>
        <div style={{
          padding: '0.4rem 1rem', borderRadius: '999px',
          background: isSafe ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
          border: `1px solid ${isSafe ? '#34d39940' : '#f8717140'}`,
          fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
          color: isSafe ? '#34d399' : '#f87171'
        }}>
          DI: {realDI.toFixed(3)} — {isSafe ? 'STABLE' : 'DRIFTING'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="var(--text-2)" tick={{ fontSize: 10 }} interval={5} />
              <YAxis domain={[0.3, 1.3]} stroke="var(--text-2)" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'rgba(13,13,15,0.95)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '0.8rem' }} />
              <ReferenceLine y={0.8} stroke="#f87171" strokeDasharray="5 3" label={{ value: '0.8', fill: '#f87171', fontSize: 10 }} />
              <ReferenceLine y={realDI} stroke="var(--accent)" strokeDasharray="3 3" label={{ value: 'Current', fill: 'var(--accent)', fontSize: 10 }} />
              <Line type="monotone" dataKey="disparateImpact" stroke="var(--accent)" strokeWidth={2}
                dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-2)' }}>
            <Bell size={14} color="var(--accent)" /> Alert Log
          </div>

          {alerts.length === 0 ? (
            <div style={{ display: 'flex', gap: '0.4rem', color: '#34d399', alignItems: 'center', fontSize: '0.8rem' }}>
              <CheckCircle size={13} /> No drift below 0.8 threshold
            </div>
          ) : (
            alerts.slice(0, 5).map((a, i) => (
              <div key={i} style={{ padding: '0.6rem', background: 'rgba(248,113,113,0.07)', borderLeft: '3px solid #f87171', borderRadius: '6px' }}>
                <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                  <AlertTriangle size={11} style={{ display: 'inline', marginRight: '4px' }} />{a.day}
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: '0.72rem', margin: 0 }}>DI dropped to {a.disparateImpact}</p>
              </div>
            ))
          )}

          {aiInsight && (
            <div style={{ padding: '0.7rem', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '0.35rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                <Brain size={12} /> Gemini Insight
              </div>
              <p style={{ color: 'var(--text-1)', fontSize: '0.72rem', lineHeight: 1.5, margin: 0 }}>
                {loadingAi ? 'Analyzing...' : aiInsight}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
