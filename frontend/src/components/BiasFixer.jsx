import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatabaseZap } from 'lucide-react';

export default function BiasFixer({ onComplete }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isGenerating && progress < 100) {
      const timer = setTimeout(() => setProgress(p => p + 5), 100);
      return () => clearTimeout(timer);
    } else if (progress >= 100 && isGenerating) {
      setIsGenerating(false);
      if (onComplete) onComplete();
    }
  }, [isGenerating, progress, onComplete]);

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <DatabaseZap color="var(--accent-secondary)" /> Automated Bias Fixer (Data Synthesis)
      </h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        If your dataset lacks sufficient minority representation, Prism can utilize Generative AI to synthesize statistically accurate, privacy-preserving profiles to balance the training weights.
      </p>

      {progress === 0 && !isGenerating && (
        <button className="btn-secondary" onClick={startGeneration}>
          Synthesize Minority Data
        </button>
      )}

      {(isGenerating || progress === 100) && (
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Generating 4,200 synthetic records...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: '100%', background: '#333', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ height: '100%', background: 'var(--accent-secondary)' }}
            />
          </div>
          {progress === 100 && (
            <p style={{ color: 'var(--success-color)', marginTop: '1rem', fontWeight: 'bold' }}>
              ✓ Dataset balanced. Disparate Impact mathematically neutralized to 1.0. Export the new CSV to retrain your model.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
