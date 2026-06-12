import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import GoogleAuthSection from '../components/GoogleAuthSection';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const data = await register(name, email, password);
      const isAdmin = ['super_admin', 'org_admin', 'admin'].includes(data?.role);
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleGoogle = async (credentialResponse) => {
    setLoading(true); setError('');
    try {
      const data = await googleLogin(credentialResponse.credential);
      const isAdmin = ['super_admin', 'org_admin', 'admin'].includes(data?.role);
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - var(--navbar-h))', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.4rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.88rem' }}>Start auditing AI bias for free</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        {/* Google first — most users prefer this */}
        <GoogleAuthSection text="signup_with" onSuccess={handleGoogle} onError={() => setError('Google Sign-Up failed. Try again.')} />

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>OR SIGN UP WITH EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input type="text" className="text-input" value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe" required disabled={loading} />
          </div>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="text-input" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required disabled={loading} />
          </div>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Password</label>
            <input type="password" className="text-input" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters" required disabled={loading} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
