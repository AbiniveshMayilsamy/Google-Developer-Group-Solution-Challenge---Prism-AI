import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Log in to access your bias reports.</p>
        
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}

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
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="text-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
          <span style={{ color: '#666', fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
              // In a real app, send token to backend /api/auth/google
              // For demo, we'll just log them in locally
              login("google-user@gmail.com", "google-oauth-bypass");
              navigate('/dashboard');
            }}
            onError={() => {
              setError('Google Login Failed');
            }}
            theme="filled_black"
            shape="pill"
          />
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Demo Access</p>
          <div className="grid-2" style={{ gap: '0.75rem' }}>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.85rem', padding: '0.6rem' }}
              onClick={() => {
                setEmail('user@prismai.com');
                setPassword('user123');
              }}
            >
              Demo User
            </button>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.85rem', padding: '0.6rem', borderColor: 'var(--accent-secondary)' }}
              onClick={() => {
                setEmail('admin@prismai.com');
                setPassword('admin123');
              }}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', textDecoration: 'none', marginRight: '1rem' }}>Forgot Password?</Link>
          <span style={{ color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>Sign Up</Link>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
