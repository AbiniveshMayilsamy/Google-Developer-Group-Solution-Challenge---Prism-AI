import { motion } from 'framer-motion';

export default function FairnessMeter({ score, metricName = "Disparate Impact" }) {
  // Assuming score is between 0 and 1.5, where 1 is perfect.
  // 0.8 to 1.25 is generally considered "Fair" (Green).
  // Below 0.8 or above 1.25 is "Biased" (Red).
  
  const clampScore = Math.min(Math.max(score, 0), 2); // Clamp for visualization (0 to 2)
  const isFair = score >= 0.8 && score <= 1.25;
  
  // Calculate needle rotation (-90deg to +90deg mapped from 0 to 2 score)
  const rotation = (clampScore - 1) * 90;

  return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        background: isFair ? 'var(--success-color)' : 'var(--danger-color)',
        filter: 'blur(120px)',
        opacity: 0.15,
        zIndex: 0,
        transition: 'background 1s ease'
      }}></div>

      <h2 style={{ position: 'relative', zIndex: 1, marginBottom: '2rem', color: 'var(--text-primary)' }}>
        Overall Fairness Meter
      </h2>

      <div style={{ position: 'relative', zIndex: 1, width: '300px', height: '150px', margin: '0 auto', overflow: 'hidden' }}>
        {/* Gauge Arch (SVG) */}
        <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
          {/* Red Zone (Left) */}
          <path d="M 10 100 A 90 90 0 0 1 50 20" fill="none" stroke="var(--danger-color)" strokeWidth="15" strokeLinecap="round" opacity="0.8" />
          {/* Green Zone (Center) */}
          <path d="M 50 20 A 90 90 0 0 1 150 20" fill="none" stroke="var(--success-color)" strokeWidth="15" strokeLinecap="round" opacity="0.8" />
          {/* Red Zone (Right) */}
          <path d="M 150 20 A 90 90 0 0 1 190 100" fill="none" stroke="var(--danger-color)" strokeWidth="15" strokeLinecap="round" opacity="0.8" />
        </svg>

        {/* Needle */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            width: '4px',
            height: '110px',
            background: 'var(--text-primary)',
            transformOrigin: 'bottom center',
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        >
          {/* Needle Base */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24px',
            height: '24px',
            background: 'var(--text-primary)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}></div>
        </motion.div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: isFair ? 'var(--success-color)' : 'var(--danger-color)',
            textShadow: `0 0 20px ${isFair ? 'var(--success-color)' : 'var(--danger-color)'}`
          }}
        >
          {score.toFixed(3)}
        </motion.div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          {metricName}
        </p>
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 600, color: isFair ? 'var(--success-color)' : 'var(--danger-color)' }}>
          {isFair ? "Model is Fair (Passed 80% Rule)" : "Bias Detected (Failed 80% Rule)"}
        </p>
      </div>
    </div>
  );
}
