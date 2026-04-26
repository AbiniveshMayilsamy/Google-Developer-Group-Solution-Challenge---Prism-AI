import { motion } from 'framer-motion';

export default function Team() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      <div className="text-center" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Meet the Minds Behind Prism</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>We are engineers, ethicists, and designers.</p>
      </div>

      <div className="grid-2">
        <div className="glass-panel text-center">
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--accent-color)', margin: '0 auto 1.5rem auto' }}></div>
          <h2>Lead Engineer</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Architect of the Prism engine.</p>
        </div>
        <div className="glass-panel text-center">
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--accent-secondary)', margin: '0 auto 1.5rem auto' }}></div>
          <h2>AI Ethicist</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Ensuring mathematical fairness aligns with human equity.</p>
        </div>
      </div>
    </motion.div>
  );
}
