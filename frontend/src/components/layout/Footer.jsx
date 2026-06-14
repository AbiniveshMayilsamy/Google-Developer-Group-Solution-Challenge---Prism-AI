import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--footer-bg)', 
      borderTop: '1px solid var(--border)', 
      padding: '4rem 2rem 2rem 2rem', 
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="app-container grid-2" style={{ gap: '4rem', marginBottom: '3rem' }}>
        
        {/* Contact & Brand Section */}
        <div>
          <h2 style={{ color: 'var(--text-1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/prism.png" alt="Prism AI" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
            Revealing the hidden spectrums of data bias. We empower organizations to build fair, transparent, and equitable automated decision systems.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={18} color="var(--accent)" /> support@prismai.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Phone size={18} color="var(--accent)" /> +1 (555) 123-4567
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <MapPin size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>CENTRE FOR INNOVATION, SRI ESHWAR COLLEGE OF ENGINEERING, COIMBATORE</div>
                <img 
                  src="https://sece.ac.in/wp-content/uploads/2024/05/clg-logo2-2048x584.webp" 
                  alt="Sri Eshwar College of Engineering Logo" 
                  style={{ height: '65px', objectFit: 'contain', marginTop: '0.65rem', display: 'block' }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid-3" style={{ gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-1)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/analyze/new" className="footer-link">Run Audit</Link>
              <Link to="/fairness-meter" className="footer-link">Fairness Meter</Link>
              <Link to="/history" className="footer-link">Bias Drift Monitor</Link>
              <Link to="/developer" className="footer-link">Real-Time Firewall</Link>
              <Link to="/docs" className="footer-link">Documentation</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-1)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Use Cases</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/use-cases/hiring" className="footer-link">HR & Recruiting</Link>
              <Link to="/use-cases/lending" className="footer-link">Financial Lending</Link>
              <Link to="/use-cases/healthcare" className="footer-link">Healthcare AI</Link>
              <Link to="/use-cases/vision" className="footer-link">Computer Vision & IoT</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-1)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/team" className="footer-link">Team</Link>
              <Link to="/blog" className="footer-link">Blog</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="app-container" style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', opacity: 0.55 }}>
          <img 
            src="https://sece.ac.in/wp-content/uploads/2024/05/clg-logo2-2048x584.webp" 
            alt="Sri Eshwar College of Engineering Logo" 
            style={{ height: '35px', objectFit: 'contain' }} 
          />
          <img 
            src="https://hacktoskill.com/homePageH2s/assets/h2slogo.png" 
            alt="Hack2skill" 
            style={{ height: '30px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} 
          />
          <img 
            src="https://res.cloudinary.com/startup-grind/image/upload/dpr_2.0,fl_sanitize/v1/gcs/platform-data-goog/contentbuilder/GDG-Lockup-1Line-White_YJOeW4C.png" 
            alt="Google Developer Groups" 
            style={{ height: '30px', objectFit: 'contain' }} 
          />
          <img 
            src="https://www.gstatic.com/devrel-devsite/prod/v8b2f8e7f8a7704cc38c0519ef05e8f889c427cc26f7c8f743e84df2a01b1dee7/developers/images/lockup-new.svg" 
            alt="Google for Developers" 
            style={{ height: '30px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} 
          />
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--text-2);
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .footer-link:hover {
          color: var(--accent);
          transform: translateX(5px);
        }
        .hover-glow:hover {
          color: var(--accent);
        }
      `}</style>
    </footer>
  );
}
