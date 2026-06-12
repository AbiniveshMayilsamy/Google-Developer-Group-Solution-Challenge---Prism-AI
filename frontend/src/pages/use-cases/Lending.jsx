import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building, ShieldAlert, CheckCircle2, TrendingUp, Info, HelpCircle, Heart } from 'lucide-react';

// Simulated loan approval index over days (NSE/BSE style)
const loanIndexData = [
  { day: 'Mon', index: 6120, approvals: 84 },
  { day: 'Tue', index: 6180, approvals: 86 },
  { day: 'Wed', index: 5980, approvals: 71 },
  { day: 'Thu', index: 6040, approvals: 78 },
  { day: 'Fri', index: 6290, approvals: 92 }
];

export default function Lending() {
  const [riskTolerance, setRiskTolerance] = useState(0.42);

  // Compute stock style risk meter metrics
  const isHighRisk = riskTolerance > 0.65;
  const isModerateRisk = riskTolerance >= 0.3 && riskTolerance <= 0.65;
  const riskColor = isHighRisk ? '#f87171' : isModerateRisk ? '#fb923c' : '#34d399';
  const riskLabel = isHighRisk ? 'HIGH RISK' : isModerateRisk ? 'MODERATE RISK' : 'SAFE / COMPLIANT';
  const needleRot = (riskTolerance * 180) - 90; // Map 0-1 to -90 to +90

  const rbiGuidelines = [
    { title: 'Explainability', desc: 'Denials must be explained in plain, layman-friendly language (handled via Gemini integration).' },
    { title: 'Audit Trails', desc: 'All incoming credit audits are logged permanently to SQL primary and mirrored to NoSQL standby.' },
    { title: 'Risk Scoring Transparency', desc: 'Proxy metrics (like zip codes) must be separated from actual creditworthiness scores.' },
    { title: 'Human Review Trigger', desc: 'Marginal cases near decision thresholds are flagged for mandatory compliance officer signature.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      
      {/* Title */}
      <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building /> Finance & Lending Audit Portal
          </h1>
          <p style={{ color: 'var(--text-2)' }}>Reserve Bank of India (RBI) AI fairness, algorithmic transparency, and credit compliance controls</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* NSE/BSE loan approval tracker */}
        <div className="glass-panel" style={{ height: '380px' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>BSE/NSE Loan Approval Index</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-2)' }}>Weekly index of algorithmic credit flow</p>
            </div>
            <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <TrendingUp size={14} /> +2.4% Today
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={loanIndexData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="var(--text-2)" />
              <YAxis domain={[5500, 6500]} stroke="var(--text-2)" />
              <Tooltip contentStyle={{ background: '#0d0d0f', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="index" stroke="var(--accent-secondary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stock style Risk Meter */}
        <div className="glass-panel" style={{ height: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', alignSelf: 'flex-start' }}>Algorithmic Risk Meter</h3>
          
          <div style={{ position: 'relative', width: '220px', height: '110px' }}>
            <svg viewBox="0 0 220 110" width="220" height="110" style={{ display: 'block' }}>
              <path d="M 20 100 A 90 90 0 0 1 200 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" strokeLinecap="round"/>
              <path d="M 20 100 A 90 90 0 0 1 74 37" fill="none" stroke="#34d399" strokeWidth="16" />
              <path d="M 74 37 A 90 90 0 0 1 148 27" fill="none" stroke="#fb923c" strokeWidth="16" />
              <path d="M 148 27 A 90 90 0 0 1 200 100" fill="none" stroke="#f87171" strokeWidth="16" />
              
              <g style={{ transformOrigin: '110px 100px', transform: `rotate(${needleRot}deg)`, transition: 'transform 0.3s ease' }}>
                <line x1="110" y1="100" x2="110" y2="25" stroke={riskColor} strokeWidth="3.5" strokeLinecap="round" />
              </g>
              <circle cx="110" cy="100" r="7.5" fill="#0d0d0f" stroke={riskColor} strokeWidth="2" />
            </svg>
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: `${riskColor}18`, border: `1px solid ${riskColor}50`, color: riskColor, padding: '0.1rem 0.75rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800 }}>
              {riskLabel}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: riskColor }}>
              {(riskTolerance * 100).toFixed(0)}% Tolerance
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-2)' }}>Adjust policy limits to model credit risk thresholds</p>
          </div>

          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(parseFloat(e.target.value))}
            style={{ width: '80%', accentColor: 'var(--accent-secondary)', height: '5px', background: 'rgba(255,255,255,0.08)', cursor: 'pointer' }}
          />
        </div>

      </div>

      {/* RBI compliance checkpoints */}
      <div className="glass-panel" style={{ padding: '2.5rem', border: '1px solid var(--border-hover)' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert color="var(--accent-secondary)" /> RBI Algorithmic Compliance Mandates
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {rbiGuidelines.map((guideline, idx) => (
            <div key={idx} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--text-1)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} color="#34d399" /> {guideline.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                {guideline.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
