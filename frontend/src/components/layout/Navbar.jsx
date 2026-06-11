import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { sector, setSector, laymanMode, setLaymanMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const close = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdmin = user?.role === 'admin' && location.pathname !== '/';

  return (
    <nav className={`navbar ${isAdmin ? 'admin-sidebar' : ''}`}>
      <Link to="/" onClick={close} className="navbar-brand">
        <img src="/logo.png" alt="Prism AI" />
        PRISM AI
      </Link>

      <ul className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
        <li><Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={close}>About</Link></li>
        <li><Link to="/use-cases/hiring" className={`nav-link ${isActive('/use-cases/hiring')}`} onClick={close}>Use Cases</Link></li>
        <li><Link to="/fairness-meter" className={`nav-link ${isActive('/fairness-meter')}`} onClick={close}>Fairness Meter</Link></li>
        <li><Link to="/drift-monitor" className={`nav-link ${isActive('/drift-monitor')}`} onClick={close}>Drift Monitor</Link></li>
        <li><Link to="/firewall" className={`nav-link danger ${isActive('/firewall')}`} onClick={close}>Bias Firewall</Link></li>
        <li><Link to="/docs" className={`nav-link ${isActive('/docs')}`} onClick={close}>Docs</Link></li>
      </ul>

      <div className={`navbar-right ${isOpen ? 'mobile-open' : ''}`}>
        <div id="google_translate_element" style={{ display: 'flex', alignItems: 'center' }}></div>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="navbar-select"
        >
          <option value="generic">Generic</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="hiring">Hiring</option>
        </select>

        <label className={`navbar-toggle-label ${laymanMode ? 'active' : ''}`}>
          <input type="checkbox" checked={laymanMode} onChange={(e) => setLaymanMode(e.target.checked)} />
          💡 ELI5
        </label>

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className={`nav-link danger ${isActive('/admin')}`} onClick={close}>Admin</Link>
            )}
            <Link to="/dashboard" className={`nav-link success ${isActive('/dashboard')}`} onClick={close}>Dashboard</Link>
            <button onClick={() => { logout(); close(); }} className="btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={close}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={close}>Get Started</Link>
          </>
        )}
      </div>

      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </nav>
  );
}
