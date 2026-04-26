import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function FairnessSlider({ currentMetrics, onMetricsUpdate }) {
  const [threshold, setThreshold] = useState(0.5);
  const { terms } = useTheme();

  const handleSliderChange = (e) => {
    const newThreshold = parseFloat(e.target.value);
    setThreshold(newThreshold);
    
    // Simulate re-calculating Disparate Impact based on the slider threshold
    // If threshold decreases, more people get positive outcomes, potentially shifting DI closer to 1.0
    // This is a dynamic simulation of a real probability threshold adjustment
    
    // Base disparate impact is what was passed in
    const baseDI = currentMetrics?.disparateImpact || 0.6; 
    
    // Create a mathematical curve where 0.5 is the base, moving it shifts DI
    // E.g., if threshold goes down, DI goes up (improves fairness but maybe lowers overall accuracy)
    const shift = (0.5 - newThreshold) * 0.8; 
    let simulatedDI = baseDI + shift;
    
    // Clamp between 0.1 and 1.5
    simulatedDI = Math.max(0.1, Math.min(1.5, simulatedDI));

    if (onMetricsUpdate) {
      onMetricsUpdate({
        ...currentMetrics,
        disparateImpact: simulatedDI
      });
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <SlidersHorizontal color="var(--accent-color)" /> Human-in-the-Loop Threshold
      </h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Adjust the classification threshold for the model. Lowering the threshold means more {terms.population} will receive a {terms.positive} outcome, but it may increase the False Positive Rate.
      </p>
      
      <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>More Restrictive (0.9)</span>
          <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>Current: {threshold.toFixed(2)}</span>
          <span>More Permissive (0.1)</span>
        </div>
        
        <input 
          type="range" 
          min="0.1" 
          max="0.9" 
          step="0.05" 
          value={threshold} 
          onChange={handleSliderChange}
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-color)' }}
        />
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Adjusting this slider updates the <strong>Disparate Impact Score</strong> across the dashboard in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
