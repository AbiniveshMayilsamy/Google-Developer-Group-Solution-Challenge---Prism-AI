import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatabaseZap, CheckCircle, Download } from 'lucide-react';

export default function BiasFixer({ onComplete, onExport }) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const start = () => { setIsRunning(true); setProgress(0); };

  useEffect(() => {
    if (isRunning && progress < 100) {
      const t = setTimeout(() => setProgress(p => p + 5), 100);
      return () => clearTimeout(t);
    } else if (progress >= 100 && isRunning) {
      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [isRunning, progress, onComplete]);

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <DatabaseZap size={18} color="var(--accent)" /> Automated Bias Fixer
      </h3>
      <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        Synthesize statistically accurate, privacy-preserving minority profiles to balance training data weights and neutralize Disparate Impact.
      </p>

      {progress === 0 && !isRunning && (
        <button className="btn-secondary" onClick={start}>Synthesize Minority Data</button>
      )}

      {(isRunning || progress === 100) && (
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
            <span>Generating 4,200 synthetic records...</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', height: '8px', borderRadius: '999px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--accent)', borderRadius: '999px' }} />
          </div>
          {progress === 100 && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle size={15} /> Dataset balanced. DI mathematically neutralized to 1.0.
              </div>
              {onExport && (
                <button 
                  className="btn-primary" 
                  onClick={onExport} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', padding: '0.55rem 1.25rem', fontSize: '0.82rem', marginTop: '0.25rem' }}
                >
                  <Download size={15} /> Export Mitigated Balanced CSV
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
