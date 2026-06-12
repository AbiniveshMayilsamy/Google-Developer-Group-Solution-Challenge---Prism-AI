import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Brain, BarChart3, Database, Users, ArrowRight } from 'lucide-react';

const features = [
  { icon: <Database size={22} color="var(--accent)"/>, title: 'Local Data Parsing', desc: 'Upload any CSV. All bias calculations happen in your browser — your raw data never leaves your device.' },
  { icon: <BarChart3 size={22} color="var(--accent)"/>, title: 'Disparate Impact & SPD', desc: 'Calculates Disparate Impact (DI) and Statistical Parity Difference (SPD) — the two gold-standard fairness metrics used by EEOC and EU AI Act.' },
  { icon: <Brain size={22} color="var(--accent)"/>, title: 'Gemini AI Mitigation', desc: 'When bias is detected, Google Gemini generates plain-language explanations and actionable pre/post-processing strategies to fix it.' },
  { icon: <ShieldCheck size={22} color="#34d399"/>, title: 'Compliance Reports', desc: 'One-click printable audit certificates referencing EEOC 4/5ths Rule, EU AI Act Title III, and India DPDPA Section 6.' },
  { icon: <Users size={22} color="var(--accent)"/>, title: 'What-If Sandbox', desc: 'Toggle demographic labels on real profiles from your dataset to expose direct model bias in seconds.' },
  { icon: <BarChart3 size={22} color="#fb923c"/>, title: 'Inline Drift & Firewall', desc: 'Every analysis includes a 30-day drift simulation and a real-time bias firewall test — no separate pages needed.' },
];

const team = [
  { name: 'Abinivesh M', role: 'Team Lead & Full Stack', college: 'Sri Eshwar College of Engineering' },
  { name: 'Team Member 2', role: 'ML & Backend', college: 'Sri Eshwar College of Engineering' },
  { name: 'Team Member 3', role: 'Frontend & UI', college: 'Sri Eshwar College of Engineering' },
  { name: 'Team Member 4', role: 'Data & Research', college: 'Sri Eshwar College of Engineering' },
];

export default function About() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="app-container">

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-dim)', border: '1px solid var(--accent)', padding: '0.4rem 1rem', borderRadius: '999px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          🏆 Google Solution Challenge 2026 — Fortune 14, SECE
        </div>
        <h1 style={{ marginBottom: '1rem' }}>About Prism AI</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          Prism AI is an end-to-end AI Fairness and Ethics platform built to detect, visualize, and mitigate hidden bias in machine learning models — before biased decisions impact real people.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/register" className="btn-primary">Get Started <ArrowRight size={16}/></Link>
          <Link to="/docs" className="btn-secondary">Read Docs</Link>
        </div>
      </div>

      {/* Mission */}
      <div className="glass-panel" style={{ marginBottom: '2rem', padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '1rem' }}>
          AI models learn from historical data. If that data contains systemic biases — against gender, caste, region, dialect, or age — the model will replicate and amplify those biases at scale. Without mathematical auditing, your automated decisions in hiring, lending, or healthcare could be violating Equal Opportunity laws without you ever knowing.
        </p>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '1rem', marginTop: '1rem' }}>
          Prism AI gives every data scientist, HR team, compliance officer, and researcher the tools to audit their models — no PhD required.
        </p>
      </div>

      {/* Features */}
      <h2 style={{ marginBottom: '1.5rem' }}>What Prism AI Does</h2>
      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="glass-panel" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
            <div>
              <h4 style={{ marginBottom: '0.4rem' }}>{title}</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="glass-panel" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.25rem' }}>Technology Stack</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {['React 19', 'Vite', 'Framer Motion', 'Node.js', 'Express', 'MongoDB', 'Google Gemini 2.5 Flash', 'JWT Auth', 'Google OAuth 2.0', 'Recharts', 'Leaflet Maps', 'PapaParse', 'bcryptjs'].map(t => (
            <span key={t} style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Team */}
      <h2 style={{ marginBottom: '1.5rem' }}>Our Team — Fortune 14, SECE</h2>
      <div className="grid-2">
        {team.map(({ name, role, college }) => (
          <div key={name} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem', flexShrink: 0 }}>
              {name[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-1)' }}>{name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{role}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-2)' }}>{college}</div>
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
}
