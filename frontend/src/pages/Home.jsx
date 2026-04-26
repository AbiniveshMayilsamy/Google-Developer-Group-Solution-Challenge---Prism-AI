import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Sparkles, ShieldCheck, Database, Zap, Lock, BarChart3, AlertTriangle, Layers } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* SECTION 1: HERO */}
      <div className="app-container hero-section">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="hero-content"
        >
          <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 204, 0, 0.1)', border: '1px solid rgba(255, 204, 0, 0.3)', padding: '0.5rem 1rem', borderRadius: '100px', color: 'var(--accent-color)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <Sparkles size={16} /> Welcome to the future of AI Ethics
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="hero-title">
            Reveal The Hidden <span style={{ color: 'var(--accent-color)' }}>Spectrum</span> Of Data Bias.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-subtitle">
            Prism AI is an end-to-end, psychologically immersive platform designed to detect, analyze, and mitigate hidden biases in your machine learning models before they impact the real world.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={20} color="var(--success-color)" /> SOC2 Compliant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <Lock size={20} color="var(--success-color)" /> Local Processing
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
                Enter Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
                  Start Free Trial <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="btn-secondary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
                  Learn More
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* SECTION 2: THE PROBLEM */}
      <div className="app-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="glass-panel"
          style={{ padding: '4rem', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <AlertTriangle size={40} /> The Black Box Problem
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                AI models learn from historical data. If that data contains systemic biases against specific genders, races, or ages, the AI will confidently replicate and amplify those biases. 
                <br/><br/>
                Without deep mathematical auditing, your algorithmic decisions in hiring, lending, or healthcare might be actively violating Equal Opportunity compliance without you ever knowing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 3: CORE FEATURES */}
      <div className="app-container" style={{ minHeight: '80vh', paddingTop: '5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem' }}>Enterprise-Grade <span style={{ color: 'var(--accent-secondary)' }}>Auditing</span></h2>
        
        <div className="grid-2" style={{ gap: '2rem' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{ padding: '3rem' }}
          >
            <Database size={40} color="var(--accent-color)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Local Data Parsing</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>We never upload your raw CSV data to our servers. All mathematical parsing, including Disparate Impact calculations, happens locally in your browser to maintain strict privacy.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{ padding: '3rem' }}
          >
            <Zap size={40} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Gemini AI Mitigation</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Once bias is mathematically detected, our backend interfaces with Google Gemini to generate human-readable, actionable strategies to fix the root cause of the bias.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{ padding: '3rem' }}
          >
            <BarChart3 size={40} color="var(--success-color)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Interactive Visualizations</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Ditch the static Python plots. Experience your data through massive, animated WebGL gauges, Radar charts, and custom Disparate Impact meters.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{ padding: '3rem' }}
          >
            <Layers size={40} color="#ff00cc" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Industry Specific</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Pre-built templates and thresholds designed specifically for HR recruitment, financial lending, and clinical trial outcomes.</p>
          </motion.div>
        </div>
      </div>

      {/* SECTION 4: CALL TO ACTION */}
      <div className="app-container" style={{ marginTop: '10rem', marginBottom: '5rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel text-center"
          style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(255,204,0,0.1), rgba(0,255,204,0.1))', border: '1px solid rgba(255,204,0,0.3)' }}
        >
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Ready to See the Unseen?</h2>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Join hundreds of ethical AI researchers and data scientists ensuring fairness in automated decisions.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.3rem', fontWeight: 'bold' }}>
            Start Auditing For Free
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
