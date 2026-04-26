import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const { setMockUser } = useAuth();
  const navigate = useNavigate();

  // INSTANT BYPASS: Any click goes directly to dashboard
  const handleInstantLogin = (role = 'admin') => {
    setMockUser(role);
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel">
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome to Prism AI</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Click any button below to enter instantly — no password needed.
        </p>

        {/* INSTANT LOGIN — no form, no API */}
        <button
          className="btn-primary"
          style={{ width: '100%', marginBottom: '1rem', padding: '0.9rem', fontSize: '1rem' }}
          onClick={() => handleInstantLogin('user')}
        >
          🚀 Enter as User
        </button>

        <button
          className="btn-secondary"
          style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderColor: 'var(--accent-secondary)' }}
          onClick={() => handleInstantLogin('admin')}
        >
          🛡️ Enter as Admin
        </button>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Demo Mode — Full access, no sign-up required.</span>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            New here? <Link to="/register" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>Create Account</Link>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
