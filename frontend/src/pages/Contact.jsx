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
      style={{ maxWidth: '600px' }}
    >
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Contact Support</h1>
      
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
