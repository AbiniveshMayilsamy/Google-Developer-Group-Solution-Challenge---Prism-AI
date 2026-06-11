import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Sparkles, ShieldCheck, Database, Zap, Lock, BarChart3, AlertTriangle, Layers } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';
    fetch(`${BASE_URL}/api/health`).catch(() => {});
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>

      {/* ── HERO ── */}
      <div className="app-container hero-section" style={{ paddingTop: '2rem' }}>
        <motion.div variants={container} initial="hidden" animate="show" className="hero-content">

          <motion.div variants={item} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
            padding: '0.5rem 1rem', borderRadius: '999px',
            color: 'var(--accent)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600
          }}>
            <Sparkles size={16} /> Welcome to the future of AI Ethics
          </motion.div>

          <motion.h1 variants={item} className="hero-title">
            Reveal The Hidden <span style={{ color: 'var(--accent)' }}>Spectrum</span> Of Data Bias.
          </motion.h1>

          <motion.p variants={item} className="hero-subtitle" style={{ marginTop: '1.25rem' }}>
            Prism AI is an end-to-end platform designed to detect, analyze, and mitigate hidden biases in your machine learning models before they impact the real world.
          </motion.p>

          <motion.div variants={item} style={{ display: 'flex', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-2)' }}>
              <ShieldCheck size={18} color="#a855f7" /> SOC2 Compliant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-2)' }}>
              <Lock size={18} color="#a855f7" /> Local Processing
            </div>
          </motion.div>

          <motion.div variants={item} style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Enter Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                  Learn More
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ── THE PROBLEM ── */}
      <div className="app-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}
          className="glass-panel" style={{ padding: '3rem' }}
        >
          <h2 style={{ marginBottom: '1.25rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={32} /> The Black Box Problem
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.85, maxWidth: '780px' }}>
            AI models learn from historical data. If that data contains systemic biases against specific genders, races, or ages, the AI will confidently replicate and amplify those biases.
            Without deep mathematical auditing, your algorithmic decisions in hiring, lending, or healthcare might be actively violating Equal Opportunity compliance without you ever knowing.
          </p>
        </motion.div>
      </div>

      {/* ── FEATURES ── */}
      <div className="app-container" style={{ paddingTop: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Enterprise-Grade <span style={{ color: 'var(--accent)' }}>Auditing</span>
        </h2>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {[
            { icon: <Database size={36} color="#a855f7" />, title: 'Local Data Parsing', desc: 'We never upload your raw CSV data. All mathematical parsing, including Disparate Impact calculations, happens locally in your browser.' },
            { icon: <Zap size={36} color="#c084fc" />, title: 'Gemini AI Mitigation', desc: 'Once bias is detected, our backend interfaces with Google Gemini to generate human-readable, actionable strategies to fix the root cause.' },
            { icon: <BarChart3 size={36} color="#a855f7" />, title: 'Interactive Visualizations', desc: 'Experience your data through animated WebGL gauges, Radar charts, and custom Disparate Impact meters.' },
            { icon: <Layers size={36} color="#c084fc" />, title: 'Industry Specific', desc: 'Pre-built templates and thresholds for HR recruitment, financial lending, and clinical trial outcomes.' },
          ].map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-panel" style={{ padding: '2.5rem' }}
            >
              <div style={{ marginBottom: '1.25rem' }}>{icon}</div>
              <h3 style={{ marginBottom: '0.75rem' }}>{title}</h3>
              <p style={{ lineHeight: 1.7 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="app-container" style={{ marginTop: '7rem', marginBottom: '4rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel text-center"
          style={{
            padding: '5rem 2rem',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.05))',
            border: '1px solid rgba(168,85,247,0.2)'
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '1rem' }}>Ready to See the Unseen?</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem auto' }}>
            Join hundreds of ethical AI researchers and data scientists ensuring fairness in automated decisions.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '1.1rem 3rem', fontSize: '1.1rem' }}>
            Start Auditing For Free
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
