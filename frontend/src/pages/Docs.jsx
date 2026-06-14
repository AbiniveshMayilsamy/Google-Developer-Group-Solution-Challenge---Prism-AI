import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Calculator, ArrowRight, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const metrics = [
  {
    name: 'Disparate Impact (DI)',
    formula: 'DI = P(Y=1 | Unprivileged) ÷ P(Y=1 | Privileged)',
    ideal: '1.0',
    threshold: '≥ 0.8 (EEOC 4/5ths Rule)',
    color: 'var(--accent)',
    desc: 'Ratio of the favorable outcome rate of the unprivileged group to the privileged group. A DI of 0.7 means the unprivileged group gets approved at only 70% the rate of the privileged group — that\'s illegal discrimination under US EEOC law.',
    example: 'Female hire rate = 36%, Male hire rate = 72% → DI = 36/72 = 0.5 ❌ BIASED',
  },
  {
    name: 'Statistical Parity Difference (SPD)',
    formula: 'SPD = P(Y=1 | Unprivileged) − P(Y=1 | Privileged)',
    ideal: '0.0',
    threshold: 'Between −0.1 and +0.1',
    color: '#34d399',
    desc: 'The raw difference in selection rates between groups. A perfectly fair system has SPD = 0. Negative means the unprivileged group is disadvantaged; positive means they are over-represented.',
    example: 'Female approval 40%, Male approval 70% → SPD = 0.40 − 0.70 = −0.30 ❌ BIASED',
  },
];

const steps = [
  { step: '1', title: 'Upload Your Dataset', desc: 'Upload a CSV file, paste a Google Sheets link, or load the built-in Indian Hiring dataset. Your data stays in your browser — never uploaded to our servers.', glow: '#4285F4' },
  { step: '2', title: 'Configure Analysis', desc: 'Select your Target Variable (what the model predicts), Favorable Outcome (e.g. "Hired"), Sensitive Attribute (e.g. "Gender"), and the Privileged vs Unprivileged groups.', glow: '#EA4335' },
  { step: '3', title: 'View Results', desc: 'Prism calculates DI and SPD instantly. The results page shows a Fairness Meter gauge, charts, drift monitor, firewall test, What-If sandbox, and Gemini AI recommendations — all in one place.', glow: '#FBBC05' },
  { step: '4', title: 'Mitigate & Export', desc: 'Use the Automated Bias Fixer to synthesize minority records. Download the balanced CSV to retrain your model. Generate a compliance PDF report.', glow: '#34A853' },
];

const TABS = [
  { key: 'guide', label: 'Step-by-Step Guide', icon: <BookOpen size={16} /> },
  { key: 'metrics', label: 'Fairness Metrics', icon: <Calculator size={16} /> },
  { key: 'compliance', label: 'Compliance & Regulations', icon: <ShieldCheck size={16} /> }
];

export default function Docs() {
  const [activeTab, setActiveTab] = useState('guide');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="app-container" 
      style={{ paddingBottom: '6rem', position: 'relative', overflowX: 'hidden' }}
    >
      
      {/* Background glow auroras */}
      <div style={{
        position: 'absolute', top: '10%', right: '-15%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(66,133,244,0.015) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(100px)'
      }}/>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(52,168,83,0.01) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(100px)'
      }}/>

      <div style={{ marginBottom: '3.5rem', marginTop: '2rem', textAlign: 'center' }}>
        {/* Eyebrow badge in Wibify style */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.65rem', 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          padding: '0.45rem 1.1rem', 
          borderRadius: '99px', 
          fontSize: '0.72rem', 
          color: 'var(--text-2)', 
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
          <span>[01] Documentation Reference</span>
          <span style={{ display: 'flex', gap: '3px', marginLeft: '0.5rem' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4285F4' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#EA4335' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FBBC05' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#34A853' }}></span>
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 800, 
          letterSpacing: '-0.04em', 
          lineHeight: 1.05, 
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          marginBottom: '1.5rem'
        }}>
          Knowledge & <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Technical Reference</em>
          </span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '650px', margin: '0 auto' }}>
          Explore key platform features, understand core mathematical disparity equations, and verify audit compliance boundaries.
        </p>
      </div>

      {/* Modern Centered Tab Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        flexWrap: 'wrap', 
        marginBottom: '3.5rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1.5rem'
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
              color: activeTab === tab.key ? '#050507' : 'var(--text-2)',
              border: `1px solid ${activeTab === tab.key ? 'var(--accent)' : 'var(--border)'}`,
              padding: '0.7rem 1.6rem',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: activeTab === tab.key ? '0 0 25px rgba(66, 133, 244, 0.22)' : 'none'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabbed Bento Grid Content with Spring Transitions */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 15, scale: 0.98 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.6 }}
        >
          {activeTab === 'guide' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem'
            }}>
              {steps.map(({ step, title, desc, glow }) => (
                <motion.div
                  key={step}
                  whileHover={{ scale: 1.015, y: -4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="glass-panel"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1.5rem",
                    padding: "2.25rem",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.035)",
                    background: 'rgba(255, 255, 255, 0.012)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${glow}15 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} />

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '50%', 
                        background: `${glow}12`, 
                        border: `2px solid ${glow}`,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: glow,
                        fontWeight: 800,
                        fontSize: '0.95rem'
                      }}>
                        {step}
                      </div>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontFamily: 'var(--font-mono)', 
                        color: 'var(--text-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Phase 0{step}
                      </span>
                    </div>
                    <h4 style={{ marginBottom: "0.65rem", fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                      {title}
                    </h4>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: 'var(--text-2)', margin: 0 }}>
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'metrics' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem'
            }}>
              {metrics.map(({ name, formula, ideal, threshold, color, desc, example }) => (
                <motion.div 
                  key={name} 
                  whileHover={{ scale: 1.015, y: -4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="glass-panel" 
                  style={{ 
                    padding: '2.5rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.035)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '-40px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} />

                  <h3 style={{ color, marginBottom: '1rem', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{name}</h3>
                  
                  <div style={{ 
                    background: 'rgba(0,0,0,0.4)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px', 
                    padding: '1rem', 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.82rem', 
                    color: 'var(--text-1)', 
                    marginBottom: '1.25rem',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                  }}>
                    {formula}
                  </div>
                  
                  <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.88rem' }}>{desc}</p>
                  
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-3)' }}>Ideal Value: </span>
                      <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{ideal}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-3)' }}>Fairness Margin: </span>
                      <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{threshold}</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '10px', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                    <AlertTriangle size={14} color="#f87171" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', marginTop: '-2px' }} />
                    <strong>Audit Example:</strong> {example}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem'
            }}>
              {[
                { law: 'US EEOC 4/5ths Rule', check: 'DI ≥ 0.8', desc: 'Employment selection rate ratio must be ≥80% for all demographic groups.', glow: '#4285F4' },
                { law: 'EU AI Act (Title III)', check: 'SPD within ±10%', desc: 'High-risk AI systems must maintain demographic parity within 10% tolerance.', glow: '#EA4335' },
                { law: 'India DPDPA Section 6', check: 'Audit trail required', desc: 'Processing of personal data must be for specified, lawful purposes with documented bias controls.', glow: '#34A853' },
              ].map(({ law, check, desc, glow }) => (
                <motion.div 
                  key={law} 
                  whileHover={{ scale: 1.015, y: -4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="glass-panel"
                  style={{ 
                    padding: '2rem', 
                    background: 'rgba(255,255,255,0.01)', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.035)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '180px'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${glow}12 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                      <CheckCircle size={20} color={glow} />
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontFamily: 'var(--font-mono)', 
                        color: glow, 
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: `${glow}12`,
                        border: `1px solid ${glow}30`,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '100px'
                      }}>
                        {check}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>{law}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/analyze/new" className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '0.9rem', borderRadius: '24px' }}>
          Start Your First Audit <ArrowRight size={16}/>
        </Link>
      </div>

    </motion.div>
  );
}
