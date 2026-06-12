import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Webcam, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const detectionData = [
  { group: 'Light Skin', accuracy: 97, fnr: 3 },
  { group: 'Medium Skin', accuracy: 91, fnr: 9 },
  { group: 'Dark Skin', accuracy: 71, fnr: 29 },
  { group: 'Female', accuracy: 83, fnr: 17 },
  { group: 'Male', accuracy: 94, fnr: 6 },
  { group: 'Age 60+', accuracy: 76, fnr: 24 },
];

const systems = [
  { name: 'Face Recognition (Security)', di: 0.73, status: 'BIASED' },
  { name: 'Retail Person Counter', di: 0.88, status: 'FAIR' },
  { name: 'Medical Imaging AI', di: 0.65, status: 'BIASED' },
  { name: 'HR Video Interview AI', di: 0.58, status: 'BIASED' },
];

export default function Vision() {
  const [selectedSkin, setSelectedSkin] = useState('Dark Skin');
  const [selectedGender, setSelectedGender] = useState('Female');
  const [confidence, setConfidence] = useState(72);

  const skinPenalty = selectedSkin === 'Dark Skin' ? 0.78 : selectedSkin === 'Medium Skin' ? 0.91 : 0.97;
  const genderPenalty = selectedGender === 'Female' ? 0.85 : 0.94;
  const adjustedConf = Math.min(confidence * skinPenalty * genderPenalty, 99).toFixed(1);
  const isBiased = adjustedConf < 80;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">

      <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Webcam size={28} color="var(--accent)" /> Computer Vision & IoT Bias
          </h1>
          <p style={{ color: 'var(--text-2)' }}>Auditing facial recognition, person detection, and edge AI systems for demographic accuracy gaps</p>
        </div>
      </div>

      {/* Detection accuracy chart */}
      <div className="glass-panel" style={{ height: '360px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Face Detection Accuracy by Demographic Group (%)</h3>
        <ResponsiveContainer width="100%" height="82%">
          <BarChart data={detectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="group" stroke="var(--text-2)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-2)" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0d0d0f', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)' }} />
            <Legend />
            <Bar dataKey="accuracy" name="Detection Accuracy %" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="fnr" name="False Negative Rate %" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive simulator */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-hover)' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Live Bias Simulator</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Simulate how demographic attributes affect AI detection confidence scores in real-time.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Skin Tone</label>
              <select className="select-input" value={selectedSkin} onChange={e => setSelectedSkin(e.target.value)}>
                <option>Light Skin</option>
                <option>Medium Skin</option>
                <option>Dark Skin</option>
              </select>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Gender</label>
              <select className="select-input" value={selectedGender} onChange={e => setSelectedGender(e.target.value)}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Base Confidence Score <span style={{ color: 'var(--accent)' }}>{confidence}%</span>
              </label>
              <input type="range" min="50" max="99" value={confidence} onChange={e => setConfidence(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
          </div>

          <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isBiased ? '#f87171' : '#34d399', filter: `drop-shadow(0 0 16px ${isBiased ? '#f87171' : '#34d399'}70)` }}>
              {adjustedConf}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Adjusted Confidence</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: isBiased ? '#f87171' : '#34d399', fontSize: '0.85rem' }}>
              {isBiased ? <><AlertTriangle size={15}/> BIASED — Below 80% threshold</> : <><CheckCircle size={15}/> Within acceptable range</>}
            </div>
            {isBiased && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.5 }}>
                Demographic penalty applied: Skin ({(skinPenalty * 100).toFixed(0)}%) × Gender ({(genderPenalty * 100).toFixed(0)}%)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* System audit table */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} color="var(--accent)" /> Real-World Vision Systems Audit
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {systems.map(({ name, di, status }) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-1)' }}>{name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-2)' }}>DI: {di}</span>
                <span style={{ padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, background: status === 'FAIR' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: status === 'FAIR' ? '#34d399' : '#f87171' }}>
                  {status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}>
        <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          Run a full bias audit on your own computer vision dataset to get DI scores, charts, AI recommendations, and a compliance certificate.
        </p>
        <Link to="/analyze/new" className="btn-primary" style={{ fontSize: '0.88rem' }}>Run Vision Bias Audit</Link>
      </div>

    </motion.div>
  );
}
