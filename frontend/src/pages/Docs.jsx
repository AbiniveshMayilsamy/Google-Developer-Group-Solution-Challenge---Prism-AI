import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Calculator, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

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
  { step: '1', title: 'Upload Your Dataset', desc: 'Upload a CSV file, paste a Google Sheets link, or load the built-in Indian Hiring dataset. Your data stays in your browser — never uploaded to our servers.' },
  { step: '2', title: 'Configure Analysis', desc: 'Select your Target Variable (what the model predicts), Favorable Outcome (e.g. "Hired"), Sensitive Attribute (e.g. "Gender"), and the Privileged vs Unprivileged groups.' },
  { step: '3', title: 'View Results', desc: 'Prism calculates DI and SPD instantly. The results page shows a Fairness Meter gauge, charts, drift monitor, firewall test, What-If sandbox, and Gemini AI recommendations — all in one place.' },
  { step: '4', title: 'Mitigate & Export', desc: 'Use the Automated Bias Fixer to synthesize minority records. Download the balanced CSV to retrain your model. Generate a compliance PDF report.' },
];

export default function Docs() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="app-container" style={{ paddingBottom: '6rem' }}>

      <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
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
          <span>[01] Technical Guide</span>
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
          fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
          marginBottom: '1.5rem'
        }}>
          Documentation & <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Reference</em>
          </span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '700px' }}>Everything you need to understand and use Prism AI effectively.</p>
      </div>

      {/* How it works */}
      <h2 style={{ marginBottom: '1.25rem' }}>How It Works</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {steps.map(({ step, title, desc }) => (
          <div key={step} className="glass-panel" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.25rem 1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--accent)', flexShrink: 0, fontSize: '0.9rem' }}>
              {step}
            </div>
            <div>
              <h4 style={{ marginBottom: '0.35rem' }}>{title}</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.65 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <h2 style={{ marginBottom: '1.25rem' }}>
        <Calculator size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent)' }}/>
        Fairness Metrics Explained
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {metrics.map(({ name, formula, ideal, threshold, color, desc, example }) => (
          <div key={name} className="glass-panel" style={{ borderLeft: `4px solid ${color}`, padding: '1.5rem 2rem' }}>
            <h3 style={{ color, marginBottom: '0.75rem' }}>{name}</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-1)', marginBottom: '1rem' }}>
              {formula}
            </div>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.88rem' }}>{desc}</p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-2)' }}>Ideal value: </span>
                <strong style={{ color: '#34d399' }}>{ideal}</strong>
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-2)' }}>Fair threshold: </span>
                <strong style={{ color: '#34d399' }}>{threshold}</strong>
              </div>
            </div>
            <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.8rem', color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
              <AlertTriangle size={12} color="#f87171" style={{ display: 'inline', marginRight: '6px' }} />
              Example: {example}
            </div>
          </div>
        ))}
      </div>

      {/* Compliance */}
      <div className="glass-panel" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.25rem' }}>Regulatory Frameworks Covered</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { law: 'US EEOC 4/5ths Rule', check: 'DI ≥ 0.8', desc: 'Employment selection rate ratio must be ≥80% for all demographic groups.' },
            { law: 'EU AI Act (Title III)', check: 'SPD within ±10%', desc: 'High-risk AI systems must maintain demographic parity within 10% tolerance.' },
            { law: 'India DPDPA Section 6', check: 'Audit trail required', desc: 'Processing of personal data must be for specified, lawful purposes with documented bias controls.' },
          ].map(({ law, check, desc }) => (
            <div key={law} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <CheckCircle size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-1)', marginBottom: '0.2rem' }}>{law} <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>({check})</span></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/analyze/new" className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
          Start Your First Audit <ArrowRight size={16}/>
        </Link>
      </div>

    </motion.div>
  );
}
