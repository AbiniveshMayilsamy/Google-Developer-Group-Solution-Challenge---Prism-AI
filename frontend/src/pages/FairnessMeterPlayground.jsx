import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Sliders, Calculator, Info } from 'lucide-react';
import FairnessMeter from '../components/FairnessMeter';
import { useTheme } from '../contexts/ThemeContext';

export default function FairnessMeterPlayground() {
  const { laymanMode } = useTheme();
  const [playgroundMode, setPlaygroundMode] = useState('direct');
  const [activeMetricType, setActiveMetricType] = useState('DI');
  const [diScore, setDiScore] = useState(1.0);
  const [spdScore, setSpdScore] = useState(0.0);
  const [privTotal, setPrivTotal] = useState(100);
  const [privFav, setPrivFav] = useState(60);
  const [unprivTotal, setUnprivTotal] = useState(100);
  const [unprivFav, setUnprivFav] = useState(40);

  const handlePrivTotalChange = (val) => { setPrivTotal(val); if (privFav > val) setPrivFav(val); };
  const handleUnprivTotalChange = (val) => { setUnprivTotal(val); if (unprivFav > val) setUnprivFav(val); };

  const simulatorMetrics = useMemo(() => {
    const privRate = privTotal > 0 ? privFav / privTotal : 0;
    const unprivRate = unprivTotal > 0 ? unprivFav / unprivTotal : 0;
    return {
      privRate, unprivRate,
      disparateImpact: privRate > 0 ? unprivRate / privRate : 0,
      statisticalParityDifference: unprivRate - privRate,
      privFavorableRate: privRate
    };
  }, [privTotal, privFav, unprivTotal, unprivFav]);

  const currentMetrics = useMemo(() => {
    if (playgroundMode === 'simulator') return simulatorMetrics;
    return { disparateImpact: diScore, statisticalParityDifference: spdScore, privFavorableRate: 0.5 };
  }, [playgroundMode, simulatorMetrics, diScore, spdScore]);

  const tabBtn = (mode, icon, label) => (
    <button
      onClick={() => setPlaygroundMode(mode)}
      style={{
        background: playgroundMode === mode ? 'var(--text-1)' : 'transparent',
        border: 'none',
        color: playgroundMode === mode ? 'var(--bg)' : 'var(--text-2)',
        padding: '0.6rem 1.8rem', borderRadius: '999px',
        fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '0.5rem'
      }}
    >{icon} {label}</button>
  );

  const metricBtn = (type, label) => (
    <button
      onClick={() => setActiveMetricType(type)}
      className="btn-secondary"
      style={{
        flex: 1, padding: '0.5rem',
        borderColor: activeMetricType === type ? 'var(--accent-2)' : 'var(--border)',
        background: activeMetricType === type ? 'rgba(0,255,170,0.06)' : 'transparent',
        color: activeMetricType === type ? 'var(--accent-2)' : 'var(--text-2)',
        fontSize: '0.85rem'
      }}
    >{label}</button>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container" style={{ maxWidth: '950px', paddingBottom: '6rem' }}>
      
      <div className="text-center" style={{ marginBottom: '3rem', marginTop: '2rem' }}>
        {/* Eyebrow badge in Wibify style */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.65rem', 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          padding: '0.45rem 1.1rem', 
          borderRadius: '99px', 
          fontSize: '0.72rem', 
          color: 'var(--text-2)', 
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
          <span>[01] Interactive Sandbox</span>
          <span style={{ display: 'flex', gap: '3px', marginLeft: '0.5rem' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4285F4' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#EA4335' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FBBC05' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#34A853' }}></span>
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 800, 
          letterSpacing: '-0.04em', 
          lineHeight: 1.05, 
          fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
          marginBottom: '1.5rem'
        }}>
          Fairness Meter <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>{laymanMode ? 'Simulator' : 'Playground'}</em>
          </span>
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto' }}>
          {laymanMode
            ? 'Learn how we measure and fix bias. Experiment with sliders or simulate populations to see fairness change in real-time.'
            : 'Experiment with scores directly, or simulate demographic populations to see metrics recalculate in real-time.'}
        </p>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(20,20,25,0.6)', border: '1px solid var(--border)', padding: '5px', borderRadius: '999px' }}>
          {tabBtn('direct', <Sliders size={16} />, 'Direct Adjustment')}
          {tabBtn('simulator', <Calculator size={16} />, 'Population Simulator')}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Controls */}
        <div>
          <AnimatePresence mode="wait">
            {playgroundMode === 'direct' ? (
              <motion.div key="direct" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                  <Sliders size={20} /> Score Simulator
                </h3>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                  {metricBtn('DI', laymanMode ? 'Fairness Balance' : 'Disparate Impact')}
                  {metricBtn('SPD', laymanMode ? 'Demographic Equality' : 'Statistical Parity')}
                </div>

                {activeMetricType === 'DI' ? (
                  <div>
                    <label className="flex-between" style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>
                      <span>{laymanMode ? 'Fairness Balance Score' : 'Disparate Impact Score'}</span>
                      <strong style={{ color: 'var(--accent-2)', fontSize: '1.1rem' }}>
                        {laymanMode ? `${(Math.min(diScore, 1 / (diScore || 1)) * 100).toFixed(0)}% Balanced` : diScore.toFixed(2)}
                      </strong>
                    </label>
                    <input type="range" min="0" max="2" step="0.01" value={diScore}
                      onChange={(e) => setDiScore(parseFloat(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-2)' }} />
                    <div className="flex-between" style={{ marginTop: '0.5rem', color: 'var(--text-2)', fontSize: '0.75rem' }}>
                      <span>Biased (0.0)</span><span>Perfect (1.0)</span><span>Reversed (2.0)</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="flex-between" style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>
                      <span>{laymanMode ? 'Demographic Equality Score' : 'Statistical Parity Difference'}</span>
                      <strong style={{ color: 'var(--accent-2)', fontSize: '1.1rem' }}>
                        {laymanMode ? `${((1 - Math.abs(spdScore)) * 100).toFixed(0)}% Equal` : `${(spdScore * 100).toFixed(1)}%`}
                      </strong>
                    </label>
                    <input type="range" min="-1" max="1" step="0.01" value={spdScore}
                      onChange={(e) => setSpdScore(parseFloat(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-2)' }} />
                    <div className="flex-between" style={{ marginTop: '0.5rem', color: 'var(--text-2)', fontSize: '0.75rem' }}>
                      <span>-100%</span><span>Perfect (0%)</span><span>+100%</span>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', gap: '0.6rem' }}>
                  <Info size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
                    {activeMetricType === 'DI'
                      ? (laymanMode ? 'Checks if both groups get approved at similar rates. The 80% rule: disadvantaged group\'s rate should be ≥80% of the other.' : 'Disparate Impact ratio. The 80% Rule (≥0.8) is a US regulatory standard for adverse impact in employment and lending.')
                      : (laymanMode ? 'Measures the approval rate gap between two groups. A perfectly equal system has a 0% gap.' : 'Statistical Parity Difference. Ideal value is 0 — equal selection rates across groups.')}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="simulator" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                  <Users size={20} /> Demographic Selection Rates
                </h3>

                {/* Privileged Group */}
                <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <strong>Privileged Group (e.g. Male)</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-2)', fontWeight: 700 }}>
                      {((privTotal > 0 ? privFav / privTotal : 0) * 100).toFixed(0)}% selected
                    </span>
                  </div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label className="input-label">Total: {privTotal}</label>
                    <input type="range" min="10" max="200" value={privTotal} onChange={(e) => handlePrivTotalChange(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--text-1)' }} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Approved: {privFav}</label>
                    <input type="range" min="0" max={privTotal} value={privFav} onChange={(e) => setPrivFav(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }} />
                  </div>
                </div>

                {/* Unprivileged Group */}
                <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <strong>Unprivileged Group (e.g. Female)</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-2)', fontWeight: 700 }}>
                      {((unprivTotal > 0 ? unprivFav / unprivTotal : 0) * 100).toFixed(0)}% selected
                    </span>
                  </div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label className="input-label">Total: {unprivTotal}</label>
                    <input type="range" min="10" max="200" value={unprivTotal} onChange={(e) => handleUnprivTotalChange(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--text-1)' }} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Approved: {unprivFav}</label>
                    <input type="range" min="0" max={unprivTotal} value={unprivFav} onChange={(e) => setUnprivFav(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Meter */}
        <div>
          <FairnessMeter
            score={playgroundMode === 'direct' && activeMetricType === 'DI' ? diScore : (playgroundMode === 'direct' ? spdScore : undefined)}
            metricName={playgroundMode === 'direct' && activeMetricType === 'SPD' ? 'Statistical Parity Difference' : 'Disparate Impact'}
            metrics={playgroundMode === 'simulator' ? currentMetrics : undefined}
          />

          {playgroundMode === 'simulator' && (
            <div className="glass-panel" style={{ marginTop: '1.25rem', padding: '1.25rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Formulas Applied</h4>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-2)' }}>
                <div>
                  <span style={{ color: 'var(--accent-2)' }}>DI</span> = Rate(Unpriv) / Rate(Priv)<br />
                  = {(unprivTotal > 0 ? unprivFav / unprivTotal : 0).toFixed(2)} / {(privTotal > 0 ? privFav / privTotal : 0).toFixed(2)} = <strong style={{ color: 'var(--text-1)' }}>{currentMetrics.disparateImpact.toFixed(3)}</strong>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <span style={{ color: 'var(--accent-2)' }}>SPD</span> = Rate(Unpriv) − Rate(Priv)<br />
                  = {(unprivTotal > 0 ? unprivFav / unprivTotal : 0).toFixed(2)} − {(privTotal > 0 ? privFav / privTotal : 0).toFixed(2)} = <strong style={{ color: 'var(--text-1)' }}>{(currentMetrics.statisticalParityDifference * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
