import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon, Plus } from 'lucide-react';

const GoogleLogo = ({ style = {} }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
    alt="Google" 
    style={{ height: '14px', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block', filter: 'brightness(0) invert(1)', ...style }} 
  />
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { sector, setSector, theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const close = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdmin = ['super_admin', 'org_admin', 'admin'].includes(user?.role);

  return (
    <nav className="navbar">
      <Link to={isAdmin ? "/admin" : "/"} onClick={close} className="navbar-brand" style={{ padding: 0 }}>
        <img src="/prism.png" alt="Prism AI" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
      </Link>

      <div className={`nav-menu ${isOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-links">
          {!isAdmin && (
            <>
              <li><Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={close}>About</Link></li>
              <li><Link to="/use-cases" className={`nav-link ${location.pathname.startsWith('/use-cases') ? 'active' : ''}`} onClick={close}>Use Cases</Link></li>
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
              {user && (
                <li><Link to="/developer" className={`nav-link ${isActive('/developer')}`} onClick={close} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><GoogleLogo style={{ height: '13px' }} /> Tools</Link></li>
              )}
            </>
          )}
        </ul>

        <div className="navbar-right">
          {!isAdmin && (
            <>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="navbar-select">
                <option value="generic">Generic</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="hiring">Hiring</option>
              </select>
            </>
          )}

          <button
            onClick={toggleTheme}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', transition: 'all 0.2s', flexShrink: 0 }}
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className={`nav-link success ${isActive('/admin')}`} onClick={close}>Admin Dashboard</Link>
              ) : (
                <Link to="/dashboard" className={`nav-link success ${isActive('/dashboard')}`} onClick={close}>Dashboard</Link>
              )}
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
