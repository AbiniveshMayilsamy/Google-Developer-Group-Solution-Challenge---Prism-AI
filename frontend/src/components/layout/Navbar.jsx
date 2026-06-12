import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon, Plus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { sector, setSector, laymanMode, setLaymanMode, theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const close = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdmin = user?.role === 'admin' && location.pathname !== '/';

  return (
    <nav className={`navbar ${isAdmin ? 'admin-sidebar' : ''}`}>
      <Link to="/" onClick={close} className="navbar-brand">
        <img src="/logo.png" alt="Prism AI" />
        PRISM AI
      </Link>

      <div className={`nav-menu ${isOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={close}>About</Link></li>
          <li><Link to="/use-cases/hiring" className={`nav-link ${isActive('/use-cases/hiring')}`} onClick={close}>Use Cases</Link></li>
          <li><Link to="/fairness-meter" className={`nav-link ${isActive('/fairness-meter')}`} onClick={close}>Fairness Meter</Link></li>
          <li><Link to="/docs" className={`nav-link ${isActive('/docs')}`} onClick={close}>Docs</Link></li>
          {user && (
            <li>
              <Link to="/analyze/new" className={`nav-link ${isActive('/analyze/new')}`} onClick={close}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontWeight: 700 }}>
                <Plus size={14} /> New Analysis
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-right">
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="navbar-select">
            <option value="generic">Generic</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="hiring">Hiring</option>
          </select>

          <label className={`navbar-toggle-label ${laymanMode ? 'active' : ''}`}>
            <input type="checkbox" checked={laymanMode} onChange={(e) => setLaymanMode(e.target.checked)} />
            💡 ELI5
          </label>

          <button
            onClick={toggleTheme}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', transition: 'all 0.2s', flexShrink: 0 }}
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link danger ${isActive('/admin')}`} onClick={close}>Admin</Link>
              )}
              <Link to="/dashboard" className={`nav-link success ${isActive('/dashboard')}`} onClick={close}>Dashboard</Link>
              <button onClick={() => { logout(); close(); navigate('/'); }} className="btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={close}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={close}>Get Started</Link>
            </>
          )}
        </div>
      </div>

      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </nav>
  );
}
