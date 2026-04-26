import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserMinus, UserCheck, Sliders } from 'lucide-react';

export default function WhatIfSandbox({ config }) {
  const sensitiveLabel = config?.sensitiveAttribute || 'Sensitive Attribute';
  const targetLabel = config?.targetAttribute || 'Outcome';
  const unprivileged = config?.unprivilegedGroup || 'Unprivileged';
  const privileged = config?.privilegedGroup || 'Privileged';

  const [isPrivileged, setIsPrivileged] = useState(false);
  const [featureScore, setFeatureScore] = useState(50);
  
  // Simulate the model flipping its decision based on sensitive traits
  const wouldApprove = isPrivileged || featureScore > 75;

  return (
    <div className="glass-panel" style={{ marginTop: '3rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Sliders color="var(--accent-color)" /> Interactive What-If Analysis
      </h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Select a rejected individual and toggle their sensitive attributes. If the decision changes when only the sensitive attribute changes, the model is exhibiting direct bias at the individual level.
      </p>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'center' }}>
        {/* Controls */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Rejected Profile #4892</h4>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              {sensitiveLabel}: {isPrivileged ? privileged : unprivileged}
            </label>
            <input 
              type="range" 
              min="0" max="1" step="1" 
              value={isPrivileged ? 1 : 0} 
              onChange={(e) => setIsPrivileged(e.target.value === '1')}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Other Features Score: {featureScore}
            </label>
            <input 
              type="range" 
              min="0" max="100" 
              value={featureScore} 
              onChange={(e) => setFeatureScore(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Simulated Outcome */}
        <div className="text-center">
          <motion.div 
            key={wouldApprove ? 'approved' : 'rejected'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              width: '150px', height: '150px', 
              borderRadius: '50%', 
              margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: wouldApprove ? 'rgba(0, 255, 204, 0.2)' : 'rgba(255, 68, 68, 0.2)',
              border: `2px solid ${wouldApprove ? 'var(--success-color)' : 'var(--danger-color)'}`,
              boxShadow: `0 0 30px ${wouldApprove ? 'var(--success-color)' : 'var(--danger-color)'}`
            }}
          >
            {wouldApprove ? <UserCheck size={60} color="var(--success-color)" /> : <UserMinus size={60} color="var(--danger-color)" />}
          </motion.div>
          <h3 style={{ marginTop: '1.5rem', color: wouldApprove ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {targetLabel}: {wouldApprove ? 'Approved' : 'Rejected'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {wouldApprove && isPrivileged === true ? `Warning: Flipped decision based solely on ${sensitiveLabel}.` : "Decision holds across this feature state."}
          </p>
        </div>
      </div>
    </div>
  );
}
