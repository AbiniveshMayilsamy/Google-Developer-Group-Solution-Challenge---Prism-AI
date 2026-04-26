import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Reset Password</h2>
        
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h3 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>Email Sent!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>If an account exists for {email}, you will receive a reset link shortly.</p>
            <Link to="/login" className="btn-secondary">Return to Login</Link>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input 
                  type="email" 
                  className="text-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Send Reset Link
              </button>
            </form>
            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>&larr; Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
