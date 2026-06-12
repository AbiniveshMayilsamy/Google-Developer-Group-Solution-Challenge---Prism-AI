import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, Sparkles, ShieldCheck, Database, Zap, Lock, 
  BarChart3, AlertTriangle, Layers, Gauge, Cpu, CheckCircle2, ChevronRight, MessageSquareCode
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [demoValue, setDemoValue] = useState(0.68);
  const [activeTab, setActiveTab] = useState('audit');

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';
    fetch(`${BASE_URL}/api/health`).catch(() => {});
  }, []);

  // Compute stats for landing page interactive sandbox
  const demoIsFair = demoValue >= 0.8 && demoValue <= 1.25;
  const demoRotation = ((Math.min(Math.max(demoValue, 0), 2) / 2) * 180) - 90;
  const demoStatus = demoIsFair ? 'FAIR' : 'BIASED';
  const demoColor = demoIsFair ? '#34d399' : demoValue < 0.8 ? '#f87171' : '#fb923c';

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 35 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } }
  };

  const showcaseTabs = [
    {
      id: 'audit',
      label: 'Bias Auditing',
      title: 'Browser-Local Bias Audits',
      desc: 'Process enterprise datasets safely in the browser client. Calculates Disparate Impact (DI) and Statistical Parity Difference (SPD) instantaneously without sending raw data to remote endpoints.',
      icon: <Database size={18} />
    },
    {
      id: 'firewall',
      label: 'AI Firewall',
      title: 'Real-time Inference Protection',
      desc: 'Interceptions sit between downstream API requests and model predictions. Automatically blocks biased decisions in production and provides Gemini explanations.',
      icon: <Lock size={18} />
    },
    {
      id: 'drift',
      label: 'Drift Monitor',
      title: 'Continuous Fairness Observability',
      desc: 'Enabled only in production pipelines. Watches DI/SPD performance metrics over time and triggers automated warnings when bias thresholds are breached.',
      icon: <BarChart3 size={18} />
    },
    {
      id: 'ethicist',
      label: 'AI Chatbot',
      title: 'Gemini-Powered Ethics Officer',
      desc: 'Ask the ethics assistant anything. Translates statistical equations, provides GDPR or DPDPA regulatory summaries, and recommends context-specific mitigation.',
      icon: <MessageSquareCode size={18} />
    }
  ];

  return (
    <div style={{ paddingBottom: '7rem', color: 'var(--text-1)' }}>

      {/* ── HERO SECTION ── */}
      <div className="container hero-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '85vh', textAlign: 'center', position: 'relative' }}>
        
        {/* Glow behind title */}
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '50vw', height: '30vh', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          zIndex: -1, pointerEvents: 'none', filter: 'blur(50px)'
        }}/>

        <motion.div variants={container} initial="hidden" animate="show" className="hero-content" style={{ margin: '0 auto', maxWidth: '950px' }}>
          
          <motion.div variants={item} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
            padding: '0.45rem 1.1rem', borderRadius: '999px',
            color: 'var(--accent)', marginBottom: '1.75rem', fontSize: '0.85rem', fontWeight: 600,
            backdropFilter: 'blur(8px)'
          }}>
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} /> Google Developer Group Solution Challenge 2026
          </motion.div>

          <motion.h1 variants={item} className="hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Govern and Secure <br/>
            <span style={{ background: 'linear-gradient(135deg, #a855f7 30%, #c084fc 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Fair Decisions
            </span> in Enterprise AI
          </motion.h1>

          <motion.p variants={item} className="hero-subtitle" style={{ margin: '1.5rem auto 2.2rem auto', fontSize: '1.15rem', color: 'var(--text-2)', maxWidth: '680px', lineHeight: 1.75 }}>
            PRISM AI is a layman-friendly, multi-tenant governance platform. Analyze dataset bias, monitor prediction drift over time, and deploy real-time firewalls powered by Gemini 2.5.
          </motion.p>

          <motion.div variants={item} style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-2)', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <ShieldCheck size={16} color="#34d399" /> RBI & EU AI Act Compliant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-2)', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <Cpu size={16} color="#a855f7" /> Multi-Model Architecture
            </div>
          </motion.div>

          <motion.div variants={item} style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ padding: '0.95rem 2.25rem', fontSize: '1rem' }}>
                Open Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary" style={{ padding: '0.95rem 2.25rem', fontSize: '1rem' }}>
                  Register Tenant <ArrowRight size={18} />
                </Link>
                <Link to="/use-cases/hiring" className="btn-secondary" style={{ padding: '0.95rem 2.25rem', fontSize: '1rem' }}>
                  Explore Industry Domains
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ── MODEL PROVIDERS CAROUSEL / GRID ── */}
      <div className="container" style={{ padding: '2rem 2rem 5rem 2rem' }}>
        <h4 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: '2rem' }}>
          Compatible with Industry-Leading LLMs & Models
        </h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', opacity: 0.65 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>Google Gemini</span>
            <span style={{ fontSize: '0.65rem', background: 'var(--accent-dim)', color: 'var(--accent)', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 600 }}>Primary</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            🤗 HuggingFace
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Anthropic Claude
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE BIAS SANDBOX WORKBENCH ── */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              <Gauge size={14} /> Interactive Sandbox
            </div>
            <h2 style={{ marginBottom: '1rem', lineHeight: 1.2 }}>Test AI Fairness in Real-Time</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.98rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              Adjust the slider on the right to simulate demographic approval imbalances. See how PRISM AI translates disparate selection rates into visual status indicators and mathematical outcomes instantly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Green indicates compliance with the US EEOC 80% rule.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Auto-adapts to ELI5 (layman mode) explanations.</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: `1px solid ${demoColor}30` }}>
            
            {/* Semicircle Gauge */}
            <div style={{ position: 'relative', width: '220px', height: '110px' }}>
              <svg viewBox="0 0 220 110" width="220" height="110" style={{ display: 'block' }}>
                <path d="M 20 100 A 90 90 0 0 1 200 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" strokeLinecap="round"/>
                
                {/* Red/Yellow/Green zones */}
                <path d="M 20 100 A 90 90 0 0 1 74 37" fill="none" stroke="#f87171" strokeWidth="16" />
                <path d="M 74 37 A 90 90 0 0 1 92 27" fill="none" stroke="#fb923c" strokeWidth="16" />
                <path d="M 92 27 A 90 90 0 0 1 148 27" fill="none" stroke="#34d399" strokeWidth="16" />
                <path d="M 148 27 A 90 90 0 0 1 166 37" fill="none" stroke="#fb923c" strokeWidth="16" />
                <path d="M 166 37 A 90 90 0 0 1 200 100" fill="none" stroke="#f87171" strokeWidth="16" />

                {/* Needle */}
                <g style={{ transformOrigin: '110px 100px', transform: `rotate(${demoRotation}deg)`, transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <line x1="110" y1="100" x2="110" y2="25" stroke={demoColor} strokeWidth="3" strokeLinecap="round" />
                </g>
                <circle cx="110" cy="100" r="8" fill="#0d0d0f" stroke={demoColor} strokeWidth="2" />
              </svg>
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: `${demoColor}18`, border: `1px solid ${demoColor}50`, color: demoColor, padding: '0.1rem 0.75rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800 }}>
                {demoStatus}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: demoColor, textShadow: `0 0 15px ${demoColor}35` }}>
                {demoValue.toFixed(3)}
              </div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-2)' }}>
                Simulated Disparate Impact (DI)
              </div>
            </div>

            {/* Slider control */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>
                <span>Severe Bias (0.1)</span>
                <span>Perfect Parity (1.0)</span>
                <span>Hyper Bias (1.9)</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.9" 
                step="0.01" 
                value={demoValue} 
                onChange={(e) => setDemoValue(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#a855f7',
                  background: 'rgba(255,255,255,0.08)',
                  height: '6px',
                  borderRadius: '100px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── PLATFORM MODULE FEATURE TABS ── */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Core System Architecture</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {showcaseTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
                color: activeTab === tab.id ? '#000' : 'var(--text-2)',
                border: `1px solid ${activeTab === tab.id ? 'var(--accent)' : 'var(--border)'}`,
                padding: '0.6rem 1.25rem',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '3rem', minHeight: '220px', background: 'rgba(255,255,255,0.015)' }}>
          <AnimatePresence mode="wait">
            {showcaseTabs.filter(t => t.id === activeTab).map(tab => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                  <div style={{ padding: '0.5rem', background: 'var(--accent-dim)', borderRadius: '8px' }}>{tab.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-1)' }}>{tab.title}</h3>
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '800px' }}>
                  {tab.desc}
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <Link to="/register" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    Sign up to configure this module <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CALL TO ACTION ── */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel text-center"
          style={{
            padding: '5rem 2rem',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.04))',
            border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: '24px'
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
            Ready to Govern Your AI Models?
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem auto', color: 'var(--text-2)' }}>
            Join compliance teams, HR executives, and ethics officers audits globally. Secure your classification endpoints today.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            Get Started For Free
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
