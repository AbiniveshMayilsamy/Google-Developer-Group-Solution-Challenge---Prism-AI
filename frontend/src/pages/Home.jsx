import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, Sparkles, ShieldCheck, Database, Zap, Lock, 
  BarChart3, AlertTriangle, Layers, Gauge, Cpu, CheckCircle2, ChevronRight, MessageSquareCode,
  Terminal, ShieldAlert, BookOpen, Info, HelpCircle
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [demoValue, setDemoValue] = useState(0.76);
  const [laymanMode, setLaymanMode] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
  
  // Chat Simulator State
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [simulatedReply, setSimulatedReply] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';
    fetch(`${BASE_URL}/api/health`).catch(() => {});
  }, []);

  // Sandbox calculations
  const privRate = 82; 
  const unprivRate = Math.min(100, privRate * demoValue);
  const demoIsFair = demoValue >= 0.8 && demoValue <= 1.25;
  const demoRotation = ((Math.min(Math.max(demoValue, 0.1), 1.9) - 0.1) / 1.8) * 180 - 90;
  const demoStatus = demoIsFair ? 'FAIR' : demoValue > 1.25 ? 'REVERSE BIAS' : 'BIASED';
  const demoColor = demoIsFair ? '#9eff00' : demoValue < 0.6 ? '#f87171' : '#fb923c';
  const spd = (unprivRate - privRate) / 100;

  // Preset replies for chat simulator
  const promptReplies = {
    rbi: `💡 **Local Demo Mode**: Previewing AI Ethics Officer

Regulations like the **EU AI Act** and **RBI guidelines** mandate that automated scoring systems do not discriminate against protected classes. Specifically, they enforce:
* **The 80% (Four-Fifths) Rule**: Unprivileged selection rates must be at least 80% of privileged rates.
* **Audit Trails**: Systems must trace model weights, training data provenance, and bias mitigation metrics.
* **Explanations**: Reject decisions must provide understandable reasons. Prism AI automates all three checks instantly.`,
    metrics: `💡 **Local Demo Mode**: Previewing AI Ethics Officer

Here is the quick breakdown of core metrics:
* **Disparate Impact (DI)**: A ratio of selection rates.
  $$\\text{DI} = \\frac{P(\\text{Selected} \\mid \\text{Unprivileged})}{P(\\text{Selected} \\mid \\text{Privileged})}$$
  Ideal = 1.0. Fair range = 0.80 to 1.25.
* **Statistical Parity Difference (SPD)**: The absolute difference in selection rates.
  $$\\text{SPD} = P(\\text{Selected} \\mid \\text{Unprivileged}) - P(\\text{Selected} \\mid \\text{Privileged})$$
  Ideal = 0%. Fair range = -10% to +10%.`,
    firewall: `💡 **Local Demo Mode**: Previewing AI Ethics Officer

The **Real-Time Bias Firewall** intercepts upstream API requests before they reach your machine learning inference engine:
1. **Inspects**: It scans input features for sensitive attributes.
2. **Verifies**: It checks prediction parameters against safety thresholds.
3. **Shields**: If a request violates fairness constraints, the Firewall triggers an alert, blocks the decision, and generates an audit log to prevent discriminatory predictions from leaking into production.`
  };

  const handlePromptClick = (key) => {
    if (isTyping) return;
    setSelectedPrompt(key);
    setIsTyping(true);
    setSimulatedReply("");
    
    const text = promptReplies[key];
    let index = 0;
    
    // Quick typing simulation
    const interval = setInterval(() => {
      if (index < text.length) {
        setSimulatedReply((prev) => prev + text.charAt(index));
        index += 2; // type two letters at once for readability speed
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 12);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  const showcaseTabs = [
    {
      id: 'audit',
      label: 'Local Auditing',
      title: 'Privacy-First Dataset Audits',
      desc: 'Perform local bias analysis instantly in your browser. Calculate Disparate Impact and Statistical Parity Difference across sensitive groups without exposing your raw CSV data to third-party servers.',
      icon: <Database size={18} />
    },
    {
      id: 'firewall',
      label: 'Bias Firewall',
      title: 'Real-time Prediction Protection',
      desc: 'Deploy a middleware layer that sits directly in front of your production endpoints. Automatically intercept biased feature vectors, override discriminating decisions, and audit predictions in real time.',
      icon: <Lock size={18} />
    },
    {
      id: 'drift',
      label: 'Continuous Monitor',
      title: 'Bias Performance Observability',
      desc: 'Track model drift over time with real-time alerting systems. Visualize how changes in incoming candidate data affect selection rates and receive immediate notifications when bias thresholds are crossed.',
      icon: <BarChart3 size={18} />
    },
    {
      id: 'ethicist',
      label: 'Ethics Chatbot',
      title: 'Gemini-Powered Assistant',
      desc: 'Resolve complex compliance dilemmas using our integrated chat system. The chatbot explains mathematical disparity equations, interprets regulatory requirements, and suggests post-processing fixes.',
      icon: <MessageSquareCode size={18} />
    }
  ];

  return (
    <div style={{ paddingBottom: '6rem', color: 'var(--text-1)', overflowX: 'hidden' }}>

      {/* ── BACKGROUND AURAS ── */}
      <div style={{
        position: 'absolute', top: '5%', left: '10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(158,255,0,0.06) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(80px)'
      }}/>
      <div style={{
        position: 'absolute', top: '40%', right: '5%',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(173,255,47,0.04) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(100px)'
      }}/>

      {/* ── HERO SECTION ── */}
      <div className="container hero-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '85vh', textAlign: 'center', position: 'relative', padding: '2rem 1rem' }}>
        <motion.div variants={container} initial="hidden" animate="show" className="hero-content" style={{ margin: '0 auto', maxWidth: '1000px' }}>
          
          <motion.div variants={item} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(158,255,0,0.06)', border: '1px solid rgba(158,255,0,0.18)',
            padding: '0.45rem 1.15rem', borderRadius: '999px',
            color: 'var(--accent)', marginBottom: '2rem', fontSize: '0.82rem', fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase', backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(158,255,0,0.05)'
          }}>
            <Sparkles size={13} className="animate-pulse" /> Google Developer Group Solution Challenge 2026
          </motion.div>

          <motion.h1 variants={item} className="hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, fontSize: 'clamp(2.5rem, 6vw, 4.8rem)' }}>
            Govern & Secure <br/>
            <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 20%, #fff 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic', fontWeight: 700 }}>
              Fair Decisions
            </span> in Production AI
          </motion.h1>

          <motion.p variants={item} className="hero-subtitle" style={{ margin: '1.75rem auto 2.5rem auto', fontSize: '1.2rem', color: 'var(--text-2)', maxWidth: '750px', lineHeight: 1.7 }}>
            PRISM AI is a layman-friendly, multi-tenant governance platform. Audit dataset bias, monitor real-time inference drift, and deploy automated firewalls using high-fidelity local AI diagnostics.
          </motion.p>

          <motion.div variants={item} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-2)', background: 'rgba(255,255,255,0.03)', padding: '0.45rem 1.1rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <ShieldCheck size={14} color="var(--accent)" /> RBI & EU AI Act Guardrails
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-2)', background: 'rgba(255,255,255,0.03)', padding: '0.45rem 1.1rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <Cpu size={14} color="var(--accent)" /> Local Mock Fail-Safe Dispatch
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-2)', background: 'rgba(255,255,255,0.03)', padding: '0.45rem 1.1rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <Zap size={14} color="var(--accent)" /> Under 15ms Middlewares
            </span>
          </motion.div>

          <motion.div variants={item} style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn-primary-glow" style={{ textDecoration: 'none' }}>
                Open Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary-glow" style={{ textDecoration: 'none' }}>
                  Register Tenant <ArrowRight size={18} />
                </Link>
                <Link to="/use-cases" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.95rem 2.25rem' }}>
                  Explore Industry Use-Cases
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ── CORE COMPATIBILITY SECTION ── */}
      <div className="container" style={{ padding: '2rem 1.5rem 5rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h5 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '2.5rem' }}>
          Seamless Integration with Modern AI Pipelines
        </h5>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', alignItems: 'center', opacity: 0.75 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Google Gemini</span>
            <span style={{ fontSize: '0.62rem', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(158,255,0,0.3)', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>CORE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            🤗 Hugging Face
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
            Anthropic Claude
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
            OpenAI GPT
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE BIAS WORKBENCH SANDBOX ── */}
      <div className="container" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid rgba(158,255,0,0.15)', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Gauge size={13} /> Fairness Sandbox
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Simulate AI Decisions in Real-Time
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Slide the controller to adjust selection rates between demographic groups. Toggle **ELI5 Mode** to preview how the governance engine translates statistical parity difference algorithms into user-friendly explanations.
            </p>
            
            {/* Interactive Stats Grid */}
            <div className="grid-2" style={{ gap: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Privileged Rate (Male)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>{privRate}%</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unprivileged Rate (Female)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: demoColor, fontFamily: 'var(--font-mono)' }}>{unprivRate.toFixed(1)}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-2)' }}>
              <CheckCircle2 size={16} color="var(--accent)" />
              <span>Neutralize disparities using automated Reweighing.</span>
            </div>
          </div>

          <div className="glass-panel hover-glow" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem', border: `1px solid ${demoColor}22` }}>
            
            {/* Semicircle Gauge Visual */}
            <div style={{ position: 'relative', width: '240px', height: '120px' }}>
              <svg viewBox="0 0 220 110" width="240" height="120" style={{ display: 'block' }}>
                <path d="M 20 100 A 90 90 0 0 1 200 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" strokeLinecap="round"/>
                
                {/* Red/Yellow/Green zones */}
                <path d="M 20 100 A 90 90 0 0 1 74 37" fill="none" stroke="#f87171" strokeWidth="16" />
                <path d="M 74 37 A 90 90 0 0 1 92 27" fill="none" stroke="#fb923c" strokeWidth="16" />
                <path d="M 92 27 A 90 90 0 0 1 148 27" fill="none" stroke="#9eff00" strokeWidth="16" />
                <path d="M 148 27 A 90 90 0 0 1 166 37" fill="none" stroke="#fb923c" strokeWidth="16" />
                <path d="M 166 37 A 90 90 0 0 1 200 100" fill="none" stroke="#f87171" strokeWidth="16" />

                {/* Needle */}
                <g style={{ transformOrigin: '110px 100px', transform: `rotate(${demoRotation}deg)`, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <line x1="110" y1="100" x2="110" y2="22" stroke={demoColor} strokeWidth="3" strokeLinecap="round" />
                </g>
                <circle cx="110" cy="100" r="7" fill="#050507" stroke={demoColor} strokeWidth="2.5" />
              </svg>
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: `${demoColor}12`, border: `1px solid ${demoColor}35`, color: demoColor, padding: '0.2rem 0.85rem', borderRadius: '100px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {demoStatus}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: demoColor, textShadow: `0 0 20px ${demoColor}30`, lineHeight: 1.1 }}>
                {demoValue.toFixed(3)}
              </div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-2)', marginTop: '0.25rem' }}>
                Simulated Disparate Impact (DI)
              </div>
            </div>

            {/* Explanatory Panel with Layman Toggle */}
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Info size={13} color="var(--accent)" /> Explanation Output
                </span>
                <button 
                  onClick={() => setLaymanMode(!laymanMode)}
                  style={{
                    background: laymanMode ? 'var(--accent-dim)' : 'transparent',
                    border: laymanMode ? '1px solid var(--accent)' : '1px solid var(--border)',
                    color: laymanMode ? 'var(--accent)' : 'var(--text-2)',
                    fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '999px', cursor: 'pointer', transition: 'all 0.25s'
                  }}
                >
                  💡 ELI5 Mode
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6, minHeight: '65px' }}>
                {laymanMode ? (
                  demoIsFair 
                    ? `🍰 Sharing treats: We're giving Male and Female groups almost equal portions of resources. Parity is satisfied, meaning everyone has a fair chance.` 
                    : `⚖️ Unequal splits: Males are receiving ${privRate} portions of selections, whereas Females are only getting ${unprivRate.toFixed(0)} portions. This violates structural balance guidelines!`
                ) : (
                  demoIsFair 
                    ? `Disparate Impact ratio satisfies the legal 80% boundary framework. The statistical parity gap (SPD = ${(spd * 100).toFixed(1)}%) is within the equity threshold.` 
                    : `Bias alert flagged. Selection index of ${demoValue.toFixed(3)} fails standard criteria (SPD = ${(spd * 100).toFixed(1)}%). Apply pre-processing sample reweighing.`
                )}
              </p>
            </div>

            {/* Slider control */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-2)', marginBottom: '0.6rem' }}>
                <span>Severe Disparity (0.1)</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Parity (1.0)</span>
                <span>Disproportion (1.9)</span>
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
                  accentColor: 'var(--accent)',
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

      {/* ── DYNAMIC FEATURE SHOWCASE ── */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
          Platform Feature Architecture
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {showcaseTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
                color: activeTab === tab.id ? '#050507' : 'var(--text-2)',
                border: `1px solid ${activeTab === tab.id ? 'var(--accent)' : 'var(--border)'}`,
                padding: '0.65rem 1.4rem',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: activeTab === tab.id ? '0 0 20px rgba(158,255,0,0.2)' : 'none'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-panel hover-glow" style={{ padding: '3.5rem', minHeight: '250px', background: 'rgba(255,255,255,0.01)' }}>
          <AnimatePresence mode="wait">
            {showcaseTabs.filter(t => t.id === activeTab).map(tab => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', color: 'var(--accent)' }}>
                  <div style={{ padding: '0.6rem', background: 'var(--accent-dim)', border: '1px solid rgba(158,255,0,0.2)', borderRadius: '10px' }}>{tab.icon}</div>
                  <h3 style={{ fontSize: '1.65rem', color: 'var(--text-1)', fontWeight: 800, margin: 0 }}>{tab.title}</h3>
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '850px', margin: 0 }}>
                  {tab.desc}
                </p>
                <div style={{ marginTop: '2.5rem' }}>
                  <Link to="/register" style={{ color: 'var(--accent)', fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                    Configure {tab.label} Workspace <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── LIVE INTERACTIVE AI CHAT SIMULATOR ── */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid rgba(158,255,0,0.15)', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Terminal size={13} /> Interactive Ethicist Preview
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Consult the AI Ethics Officer
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Select a regulatory or mathematical topic below to simulate a conversational query. Watch the integrated ethics module calculate mitigation templates instantly.
            </p>
            
            {/* Quick Prompt Selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => handlePromptClick('rbi')}
                className="btn-secondary" 
                style={{ 
                  justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '12px', fontSize: '0.88rem', 
                  border: selectedPrompt === 'rbi' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: selectedPrompt === 'rbi' ? 'var(--text-1)' : 'var(--text-2)'
                }}
              >
                <span>Does the platform meet EU AI Act & RBI checks?</span>
                <ArrowRight size={16} color={selectedPrompt === 'rbi' ? 'var(--accent)' : 'var(--text-3)'} />
              </button>
              <button 
                onClick={() => handlePromptClick('metrics')}
                className="btn-secondary" 
                style={{ 
                  justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '12px', fontSize: '0.88rem', 
                  border: selectedPrompt === 'metrics' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: selectedPrompt === 'metrics' ? 'var(--text-1)' : 'var(--text-2)'
                }}
              >
                <span>Explain Disparate Impact vs Statistical Parity</span>
                <ArrowRight size={16} color={selectedPrompt === 'metrics' ? 'var(--accent)' : 'var(--text-3)'} />
              </button>
              <button 
                onClick={() => handlePromptClick('firewall')}
                className="btn-secondary" 
                style={{ 
                  justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '12px', fontSize: '0.88rem', 
                  border: selectedPrompt === 'firewall' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: selectedPrompt === 'firewall' ? 'var(--text-1)' : 'var(--text-2)'
                }}
              >
                <span>How does the Real-Time Firewall shield models?</span>
                <ArrowRight size={16} color={selectedPrompt === 'firewall' ? 'var(--accent)' : 'var(--text-3)'} />
              </button>
            </div>
          </div>

          {/* Chat Panel Mock Window */}
          <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column', background: 'rgba(5,5,7,0.95)', border: '1px solid var(--border)' }}>
            {/* Header bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', padding: '1rem 1.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-1)' }}>Prism Assistant</strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', background: 'rgba(255,255,255,0.03)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: 'auto' }}>MOCK API Fallback</span>
            </div>

            {/* Chat output */}
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.82rem', lineHeight: 1.6 }}>
              {!selectedPrompt ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-3)' }}>
                  <HelpCircle size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.3 }} />
                  <p style={{ margin: 0 }}>Select a prompt on the left to simulate a conversation.</p>
                </div>
              ) : (
                <>
                  {/* User bubble */}
                  <div style={{ alignSelf: 'flex-end', background: 'var(--accent-dim)', border: '1px solid rgba(158,255,0,0.2)', color: 'var(--text-1)', padding: '0.6rem 1rem', borderRadius: '14px 14px 2px 14px', maxWidth: '85%' }}>
                    {selectedPrompt === 'rbi' ? "Does the platform meet EU AI Act & RBI checks?" : selectedPrompt === 'metrics' ? "Explain Disparate Impact vs Statistical Parity" : "How does the Real-Time Firewall shield models?"}
                  </div>

                  {/* AI Response bubble */}
                  <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-2)', padding: '0.75rem 1rem', borderRadius: '14px 14px 14px 2px', maxWidth: '90%', whiteSpace: 'pre-line' }}>
                    {simulatedReply}
                    {isTyping && (
                      <span className="typing-dot" style={{ display: 'inline-flex', gap: '2px', marginLeft: '3px' }}>
                        <span style={{ width: '4px', height: '4px', background: 'var(--text-3)', borderRadius: '50%', animation: 'pulse 1s infinite alternate' }} />
                        <span style={{ width: '4px', height: '4px', background: 'var(--text-3)', borderRadius: '50%', animation: 'pulse 1s infinite alternate 0.2s' }} />
                        <span style={{ width: '4px', height: '4px', background: 'var(--text-3)', borderRadius: '50%', animation: 'pulse 1s infinite alternate 0.4s' }} />
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Input bar mockup */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Ask about compliance or ethics algorithms..." 
                disabled 
                style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-3)', outline: 'none' }}
              />
              <button disabled style={{ background: 'var(--border)', border: 'none', color: 'var(--text-3)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'not-allowed', fontSize: '0.78rem', fontWeight: 600 }}>Send</button>
            </div>
          </div>

        </div>
      </div>

      {/* ── CALL TO ACTION ── */}
      <div className="container" style={{ padding: '0 1rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel text-center hover-glow"
          style={{
            padding: '5rem 2rem',
            background: 'linear-gradient(135deg, rgba(158,255,0,0.08), rgba(173,255,47,0.03))',
            border: '1px solid rgba(158,255,0,0.18)',
            borderRadius: '24px'
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.25rem', letterSpacing: '-0.02em', fontWeight: 800 }}>
            Govern Your <em>Machine Learning</em> Pipeline Today
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto 2.5rem auto', color: 'var(--text-2)', lineHeight: 1.6 }}>
            Join risk management teams, HR compliance officers, and AI developers auditing models globally. Build transparent automation platforms.
          </p>
          <Link to="/register" className="btn-primary-glow" style={{ padding: '1rem 3rem', fontSize: '1.05rem', textDecoration: 'none' }}>
            Get Started For Free
          </Link>
        </motion.div>
      </div>

      {/* Embedded keyframe styling */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.2; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(-2px); }
        }
        .btn-primary-glow {
          background: var(--accent);
          color: #050507 !important;
          border: 1px solid var(--accent);
          border-radius: 999px;
          padding: 0.95rem 2.25rem;
          font-size: 1rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 20px rgba(158,255,0,0.25);
        }
        .btn-primary-glow:hover {
          background: #fff;
          border-color: #fff;
          box-shadow: 0 0 35px rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }
        .code-tab-button {
          background: transparent;
          border: none;
          color: var(--text-2);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .code-tab-button.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
      `}</style>

    </div>
  );
}
