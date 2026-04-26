import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '3rem' }}>Prism Insights</h1>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Product Update</span>
        <h2 style={{ margin: '0.5rem 0' }}>Announcing the Fairness Meter</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>We have officially launched the highly requested visual Fairness Meter. Auditing your AI models has never been more visceral and immediate.</p>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>January 15, 2026</span>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Research</span>
        <h2 style={{ margin: '0.5rem 0' }}>The Hidden Cost of Proxy Variables</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Even when you exclude sensitive attributes like race or gender, your model might be learning them through proxy variables like zip code. Here is how to stop it.</p>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>December 20, 2025</span>
      </div>
    </motion.div>
  );
}
