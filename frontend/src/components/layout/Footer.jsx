import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ 
      background: 'rgba(5, 5, 5, 0.95)', 
      borderTop: '1px solid var(--panel-border)', 
      padding: '4rem 2rem 2rem 2rem', 
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="app-container grid-2" style={{ gap: '4rem', marginBottom: '3rem' }}>
        
        {/* Contact & Brand Section */}
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', borderRadius: '4px', display: 'inline-block' }}></span>
            PRISM AI
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
            Revealing the hidden spectrums of data bias. We empower organizations to build fair, transparent, and equitable automated decision systems.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={18} color="var(--accent-color)" /> support@prismai.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Phone size={18} color="var(--accent-secondary)" /> +1 (555) 123-4567
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MapPin size={18} color="#ff00cc" /> FORTUNE 14, SRI ESHWAR COLLEGE OF ENGINEERING, COIMBATORE
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/analyze/new" className="footer-link">Run Audit</Link>
              <Link to="/fairness-meter" className="footer-link">Fairness Meter</Link>
              <Link to="/drift-monitor" className="footer-link">Bias Drift Monitor</Link>
              <Link to="/firewall" className="footer-link">Real-Time Firewall</Link>
              <Link to="/pricing" className="footer-link">Pricing</Link>
              <Link to="/docs" className="footer-link">Documentation</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Use Cases</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/use-cases/hiring" className="footer-link">HR & Recruiting</Link>
              <Link to="/use-cases/lending" className="footer-link">Financial Lending</Link>
              <Link to="/use-cases/healthcare" className="footer-link">Healthcare AI</Link>
              <Link to="/use-cases/vision" className="footer-link">Computer Vision & IoT</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/team" className="footer-link">Team</Link>
              <Link to="/blog" className="footer-link">Blog</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="app-container flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <div>
          &copy; {new Date().getFullYear()} Prism AI Inc. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <a href="#" className="footer-link">Twitter</a>
            <a href="#" className="footer-link">GitHub</a>
            <a href="#" className="footer-link">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <style>{`
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .footer-link:hover {
          color: var(--accent-color);
          transform: translateX(5px);
        }
        .hover-glow:hover {
          color: var(--accent-secondary);
        }
      `}</style>
    </footer>
  );
}
