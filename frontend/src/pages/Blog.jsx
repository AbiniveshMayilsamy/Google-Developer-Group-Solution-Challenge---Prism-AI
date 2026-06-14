import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '800px', paddingBottom: '6rem' }}>
      
      <div className="text-center" style={{ marginBottom: '3rem', marginTop: '2rem' }}>
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
          <span>[01] Platform News</span>
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
          marginBottom: '1rem'
        }}>
          Prism <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Insights</em>
          </span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>Read articles about AI fairness, ethical algorithms, and product updates.</p>
      </div>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Product Update</span>
        <h2 style={{ margin: '0.5rem 0' }}>Announcing the Fairness Meter</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>We have officially launched the highly requested visual Fairness Meter. Auditing your AI models has never been more visceral and immediate.</p>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>January 15, 2026</span>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Research</span>
        <h2 style={{ margin: '0.5rem 0' }}>The Hidden Cost of Proxy Variables</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Even when you exclude sensitive attributes like race or gender, your model might be learning them through proxy variables like zip code. Here is how to stop it.</p>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>December 20, 2025</span>
      </div>
    </motion.div>
  );
}
