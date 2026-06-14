import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-container"
      style={{ maxWidth: '600px', paddingBottom: '6rem' }}
    >
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
          <span>[01] Contact Us</span>
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
          Contact <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Support</em>
          </span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>Send a message to our developers and AI ethicists.</p>
      </div>
      
      <div className="glass-panel">
        {submitted ? (
          <div className="text-center" style={{ padding: '2rem 0' }}>
            <h3 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>Message Sent!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Our team will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Name</label>
              <input type="text" className="text-input" required />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="text-input" required />
            </div>
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea className="text-input" rows="5" required style={{ resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Send Message</button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
