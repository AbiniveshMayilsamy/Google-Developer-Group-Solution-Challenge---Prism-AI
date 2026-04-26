import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { sector, setSector } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '2px' }}>
        <img src="/logo.png" alt="Prism AI Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
        PRISM AI
      </Link>

      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
        <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={closeMenu}>About</Link>
        <Link to="/use-cases/hiring" className={`nav-link ${isActive('/use-cases/hiring')}`} onClick={closeMenu}>Use Cases</Link>
        <Link to="/fairness-meter" className={`nav-link ${isActive('/fairness-meter')}`} onClick={closeMenu}>Fairness Meter</Link>
        <Link to="/drift-monitor" className={`nav-link ${isActive('/drift-monitor')}`} onClick={closeMenu}>Drift Monitor</Link>
        <Link to="/firewall" className={`nav-link ${isActive('/firewall')}`} style={{ color: 'var(--danger-color)' }} onClick={closeMenu}>Bias Firewall</Link>
        <Link to="/pricing" className={`nav-link ${isActive('/pricing')}`} onClick={closeMenu}>Pricing</Link>
        <Link to="/docs" className={`nav-link ${isActive('/docs')}`} onClick={closeMenu}>Docs</Link>

        {/* Sector Skin Selector */}
        <select 
          value={sector} 
          onChange={(e) => {
            setSector(e.target.value);
            closeMenu();
          }}
          style={{ background: '#111', color: 'var(--text-primary)', border: '1px solid #333', padding: '0.4rem', borderRadius: '4px', marginLeft: '1rem', cursor: 'pointer' }}
        >
          <option value="generic">Generic Mode</option>
          <option value="finance">Finance Mode</option>
          <option value="healthcare">Healthcare Mode</option>
          <option value="hiring">Hiring Mode</option>
        </select>

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className={`nav-link ${isActive('/admin')}`} style={{ color: 'var(--danger-color)' }} onClick={closeMenu}>Admin Panel</Link>
            )}
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} style={{ color: 'var(--accent-secondary)' }} onClick={closeMenu}>Dashboard</Link>
            <button onClick={() => { logout(); closeMenu(); }} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={closeMenu}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
