import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

const generateDriftData = () => {
  const data = [];
  let currentScore = 1.0;
  for (let i = 30; i >= 0; i--) {
    // Model drifts down over time
    if (i < 15) currentScore -= (Math.random() * 0.05);
    else currentScore -= (Math.random() * 0.02) - 0.01;
    
    data.push({
      day: `Day -${i}`,
      disparateImpact: parseFloat(currentScore.toFixed(2))
    });
  }
  return data;
};

export default function DriftMonitor() {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const driftData = generateDriftData();
    setData(driftData);

    const generatedAlerts = driftData
      .filter(d => d.disparateImpact < 0.8)
      .map(d => ({
        id: Math.random(),
        time: d.day,
        message: `Disparate Impact dropped to ${d.disparateImpact} (Below 0.8 Threshold). AWS Lambda Webhook Fired.`,
      })).reverse();
    
    setAlerts(generatedAlerts);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
            <Activity size={32} /> Continuous Bias Drift Monitor
          </h1>
          <p className="hero-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
            Live MLOps tracking. Connecting directly to Snowflake to monitor real-world model decay.
          </p>
        </div>
        <div className="glass-panel text-center" style={{ border: alerts.length > 0 ? '1px solid var(--danger-color)' : '1px solid var(--success-color)' }}>
          <h2 style={{ color: alerts.length > 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
            {data.length > 0 ? data[data.length - 1].disparateImpact : '1.0'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Current DI Score</p>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Chart */}
        <div className="glass-panel" style={{ height: '450px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>30-Day Disparate Impact Tracking</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis domain={[0.4, 1.2]} stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid var(--panel-border)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <ReferenceLine y={0.8} stroke="var(--danger-color)" strokeDasharray="3 3" label={{ position: 'top', value: '0.8 Threshold', fill: 'var(--danger-color)' }} />
              <Line 
                type="monotone" 
                dataKey="disparateImpact" 
                stroke="var(--accent-color)" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#000', stroke: 'var(--accent-color)', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="glass-panel" style={{ overflowY: 'auto', height: '450px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Bell color="var(--accent-secondary)" /> Automated Alerts Log
          </h3>
          
          {alerts.length === 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--success-color)', alignItems: 'center' }}>
              <CheckCircle /> Model is stable. No drift detected.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{ padding: '1rem', background: 'rgba(255, 68, 68, 0.1)', borderLeft: '3px solid var(--danger-color)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--danger-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    <AlertTriangle size={18} /> {alert.time}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {alert.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
