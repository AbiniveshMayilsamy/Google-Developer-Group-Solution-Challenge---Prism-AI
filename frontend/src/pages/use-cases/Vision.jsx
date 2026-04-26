import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Webcam, ShieldAlert } from 'lucide-react';

export default function Vision() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '800px' }}>
      <h1 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Webcam /> Edge Processing & Vision
      </h1>
      <p className="hero-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>Auditing physical IoT systems and computer vision for demographic accuracy.</p>
      
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h2>The Challenge in Physical Systems</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: 1.8 }}>
          Algorithmic bias isn't just in spreadsheets. Retail person-counters, security robotics (ROS 2), and facial recognition systems frequently demonstrate higher False Negative rates for individuals with darker skin tones or specific gender presentations.
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert /> Hardware Integration
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>• Containerized Docker deployments</li>
            <li>• Runs on Raspberry Pi & Jetson Nano</li>
            <li>• Validates bounding box confidence scores across demographics</li>
          </ul>
        </div>
        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>Deploy to Edge</h3>
          <Link to="/docs" className="btn-secondary" style={{ marginTop: '1rem' }}>View Architecture</Link>
        </div>
      </div>
    </motion.div>
  );
}
