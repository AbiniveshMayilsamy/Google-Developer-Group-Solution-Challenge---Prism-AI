import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Gauge, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const FAIR   = '#34d399';
const WARN   = '#fb923c';
const DANGER = '#f87171';
const PURPLE = '#a855f7';

const zoneColor = (isFair, isWarn) => isFair ? FAIR : isWarn ? WARN : DANGER;

export default function FairnessMeter({ score, metricName = 'Disparate Impact', metrics }) {
  const { laymanMode } = useTheme();
  const hasMultiple = !!metrics;
  const defaultMetric = (metricName.toLowerCase().includes('parity') || (metrics && !metrics.disparateImpact)) ? 'SPD' : 'DI';
  const [activeMetric, setActiveMetric] = useState(defaultMetric);

  useEffect(() => {
    if (!hasMultiple) setActiveMetric(defaultMetric);
  }, [defaultMetric, hasMultiple]);

  const isDI = activeMetric === 'DI';
  const currentScore = hasMultiple
    ? (isDI ? metrics.disparateImpact : metrics.statisticalParityDifference)
    : (score ?? (isDI ? 1 : 0));

  const isFair = isDI
    ? (currentScore >= 0.8 && currentScore <= 1.25)
    : Math.abs(currentScore) <= 0.1;
  const isWarn = isDI
    ? ((currentScore >= 0.6 && currentScore < 0.8) || (currentScore > 1.25 && currentScore <= 1.5))
    : (Math.abs(currentScore) > 0.1 && Math.abs(currentScore) <= 0.2);

  const color = zoneColor(isFair, isWarn);

  // Map score to needle rotation in degrees (-90 = left, 0 = top, +90 = right)
  const needleRot = isDI
    ? ((Math.min(Math.max(currentScore, 0), 2) / 2) * 180) - 90
    : (((Math.min(Math.max(currentScore, -1), 1) + 1) / 2) * 180) - 90;

  const displayValue = isDI ? currentScore.toFixed(3) : `${(currentScore * 100).toFixed(1)}%`;
  const statusLabel  = isFair ? 'FAIR' : isWarn ? 'CAUTION' : 'BIASED';
  const label = isDI
    ? (laymanMode ? 'Fairness Balance Score' : 'Disparate Impact (DI)')
    : (laymanMode ? 'Demographic Equality Score' : 'Stat. Parity Diff (SPD)');

  const getInfo = () => {
    if (isDI) {
      if (isFair) return {
        title: laymanMode ? 'Everything looks balanced ✓' : 'Model Passed — 80% Rule',
        body: laymanMode ? `Both groups get approved at similar rates.` : `DI = ${currentScore.toFixed(3)} — within fair range 0.8–1.25.`,
        tip: laymanMode ? 'No action needed.' : 'Maintain thresholds and log for audit.'
      };
      if (currentScore < 0.8) return {
        title: laymanMode ? 'One group is disadvantaged ⚠' : 'Bias Detected',
        body: laymanMode ? `For every 10 approvals in one group, the other gets ~${Math.round(currentScore * 10)}.` : `DI = ${currentScore.toFixed(3)} — below the 0.8 threshold.`,
        tip: laymanMode ? 'Adjust the slider to improve balance.' : 'Apply data reweighing or adjust threshold.'
      };
      return {
        title: laymanMode ? 'Over-compensation detected ℹ' : 'Reverse Bias',
        body: laymanMode ? `The comparison group gets more approvals than the main group.` : `DI = ${currentScore.toFixed(3)} — exceeds 1.25.`,
        tip: laymanMode ? 'Balance your training data weights.' : 'Review sampling weights to bring DI to 1.0.'
      };
    }
    const p = Math.abs(currentScore * 100).toFixed(1);
    if (isFair) return {
      title: laymanMode ? 'Groups treated equally ✓' : 'Demographic Parity Passed',
      body: laymanMode ? `Only a ${p}% gap — nearly equal.` : `SPD = ${p}% — within ±10%.`,
      tip: laymanMode ? 'No action needed.' : 'Retain configuration.'
    };
    return {
      title: laymanMode ? 'Large gap detected ⚠' : 'Parity Violation',
      body: laymanMode ? `There is a ${p}% approval gap.` : `SPD = ${p}% — exceeds ±10% zone.`,
      tip: laymanMode ? 'Use the threshold slider.' : 'Apply post-processing adjustment.'
    };
  };

  const info = getInfo();

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}35`,
      borderRadius: '20px',
      padding: '2rem 1.5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
      transition: 'border-color 0.5s'
    }}>
      {/* bg glow */}
      <motion.div animate={{ background: color }} transition={{ duration: 0.7 }} style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '300px', height: '200px', filter: 'blur(80px)',
        opacity: 0.1, pointerEvents: 'none', borderRadius: '50%'
      }}/>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Toggle */}
        {hasMultiple && (
          <div style={{
            display: 'inline-flex', background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border)', borderRadius: '999px',
            padding: '3px', marginBottom: '1.5rem'
          }}>
            {[['DI', <Gauge size={12} key="g"/>, laymanMode ? 'Balance' : 'Disparate Impact'],
              ['SPD', <Scale size={12} key="s"/>, laymanMode ? 'Equality' : 'Stat. Parity']
            ].map(([key, icon, txt]) => (
              <button key={key} onClick={() => setActiveMetric(key)} style={{
                background: activeMetric === key ? PURPLE : 'transparent',
                border: 'none', cursor: 'pointer',
                color: activeMetric === key ? '#fff' : 'var(--text-2)',
                padding: '0.38rem 0.9rem', borderRadius: '999px',
                fontSize: '0.78rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                transition: 'all 0.2s'
              }}>{icon}{txt}</button>
            ))}
          </div>
        )}

        {/* ── GAUGE ── */}
        <div style={{ position: 'relative', width: '280px', height: '150px', margin: '0 auto 1rem' }}>
          <svg viewBox="0 0 280 150" width="280" height="150" style={{ display: 'block' }}>
            <defs>
              <filter id="glow-fm">
                <feGaussianBlur stdDeviation="2.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* 
              Semicircle centered at (140, 140), radius 110
              Starts at left (30, 140) sweeps to right (250, 140)
              Arc angle: left = 180°, right = 0°
              score 0% → left, score 100% → right
            */}

            {/* Track bg */}
            <path d="M 30 140 A 110 110 0 0 1 250 140"
              fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="20" strokeLinecap="round"/>

            {/* DI zones: total arc = 180deg. Map 0-2 to 0%-100% of arc */}
            {isDI ? <>
              {/* danger  0 – 0.6  = 0%–30% */}
              <path d="M 30 140 A 110 110 0 0 1 86.7 42.3"
                fill="none" stroke={DANGER} strokeWidth="20" strokeLinecap="round" filter="url(#glow-fm)" opacity="0.9"/>
              {/* warn  0.6 – 0.8  = 30%–40% */}
              <path d="M 86.7 42.3 A 110 110 0 0 1 107.4 32.4"
                fill="none" stroke={WARN} strokeWidth="20" filter="url(#glow-fm)" opacity="0.9"/>
              {/* fair  0.8 – 1.25 = 40%–62.5% */}
              <path d="M 107.4 32.4 A 110 110 0 0 1 172.6 32.4"
                fill="none" stroke={FAIR} strokeWidth="20" filter="url(#glow-fm)" opacity="0.9"/>
              {/* warn  1.25 – 1.5 = 62.5%–75% */}
              <path d="M 172.6 32.4 A 110 110 0 0 1 193.3 42.3"
                fill="none" stroke={WARN} strokeWidth="20" filter="url(#glow-fm)" opacity="0.9"/>
              {/* danger 1.5 – 2.0 = 75%–100% */}
              <path d="M 193.3 42.3 A 110 110 0 0 1 250 140"
                fill="none" stroke={DANGER} strokeWidth="20" strokeLinecap="round" filter="url(#glow-fm)" opacity="0.9"/>
            </> : <>
              {/* SPD: -1 to +1, 0% to 100% */}
              {/* danger -1 – -0.2 = 0%–40% */}
              <path d="M 30 140 A 110 110 0 0 1 107.4 32.4"
                fill="none" stroke={DANGER} strokeWidth="20" strokeLinecap="round" filter="url(#glow-fm)" opacity="0.9"/>
              {/* warn -0.2 – -0.1 = 40%–45% */}
              <path d="M 107.4 32.4 A 110 110 0 0 1 118 30.3"
                fill="none" stroke={WARN} strokeWidth="20" filter="url(#glow-fm)" opacity="0.9"/>
              {/* fair -0.1 – +0.1 = 45%–55% */}
              <path d="M 118 30.3 A 110 110 0 0 1 162 30.3"
                fill="none" stroke={FAIR} strokeWidth="20" filter="url(#glow-fm)" opacity="0.9"/>
              {/* warn +0.1 – +0.2 = 55%–60% */}
              <path d="M 162 30.3 A 110 110 0 0 1 172.6 32.4"
                fill="none" stroke={WARN} strokeWidth="20" filter="url(#glow-fm)" opacity="0.9"/>
              {/* danger +0.2 – +1 = 60%–100% */}
              <path d="M 172.6 32.4 A 110 110 0 0 1 250 140"
                fill="none" stroke={DANGER} strokeWidth="20" strokeLinecap="round" filter="url(#glow-fm)" opacity="0.9"/>
            </>}

            {/* Needle — rotates around pivot (140,140) */}
            <motion.g
              style={{ transformOrigin: '140px 140px' }}
              animate={{ rotate: needleRot }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            >
              {/* shaft toward arc */}
              <line x1="140" y1="140" x2="140" y2="38"
                stroke={color} strokeWidth="3" strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 5px ${color})` }}/>
              {/* counterweight */}
              <line x1="140" y1="140" x2="140" y2="158"
                stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
            </motion.g>

            {/* Pivot */}
            <circle cx="140" cy="140" r="11" fill="#0d0d0f" stroke={color} strokeWidth="2.5"/>
            <circle cx="140" cy="140" r="4.5" fill={color}
              style={{ filter: `drop-shadow(0 0 5px ${color})` }}/>
          </svg>

          {/* Status pill below pivot */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            background: `${color}18`, border: `1px solid ${color}50`,
            borderRadius: '999px', padding: '0.18rem 0.85rem',
            fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
            color: color, whiteSpace: 'nowrap'
          }}>
            ● {statusLabel}
          </div>
        </div>

        {/* Score number */}
        <motion.div
          key={activeMetric + displayValue}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          <div style={{
            fontSize: '3rem', fontWeight: 800,
            fontFamily: 'var(--font-mono)', color,
            filter: `drop-shadow(0 0 14px ${color}70)`,
            lineHeight: 1, marginBottom: '0.3rem'
          }}>
            {displayValue}
          </div>
          <div style={{
            fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: 'var(--text-2)', marginBottom: '1rem'
          }}>
            {label}
          </div>
        </motion.div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
          {[[DANGER,'Biased'],[WARN,'Caution'],[FAIR,'Fair']].map(([c,t]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-2)' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}` }}/>
              {t}
            </div>
          ))}
        </div>

        {/* Info card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMetric + statusLabel}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: `${color}0d`, border: `1px solid ${color}22`,
              borderRadius: '12px', padding: '0.9rem 1rem', textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              {isFair ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>}
              {info.title}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 0.55rem 0' }}>
              {info.body}
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', borderTop: `1px solid ${color}18`, paddingTop: '0.55rem' }}>
              <TrendingUp size={12} color={PURPLE} style={{ flexShrink: 0, marginTop: '2px' }}/>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-1)', lineHeight: 1.5 }}>{info.tip}</span>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
