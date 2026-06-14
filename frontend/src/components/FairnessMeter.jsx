import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, Info, Brain,
  Loader2, Sparkles, ChevronDown, ChevronUp, TrendingDown, TrendingUp, Minus
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';
import ReactMarkdown from 'react-markdown';

const C = {
  fair:   '#34d399',
  warn:   '#fb923c',
  danger: '#f87171',
  purple: 'var(--accent)',
};

function statusOf(isFair, isWarn) {
  return isFair ? 'FAIR' : isWarn ? 'CAUTION' : 'BIASED';
}
function colorOf(isFair, isWarn) {
  return isFair ? C.fair : isWarn ? C.warn : C.danger;
}

// ─── Radial ring for Disparate Impact ─────────────────────────────────────────
// DI ideal = 1.0, range we display = 0 → 2
// Ring fills from 0 to DI/2 fraction, coloured by zone
function DIRing({ di, color }) {
  const SIZE   = 160;
  const STROKE = 14;
  const R      = (SIZE - STROKE) / 2;
  const CIRC   = 2 * Math.PI * R;

  // fraction of full circle that represents this DI value (capped at 1)
  const fraction = Math.min(di / 2, 1);
  const dash     = fraction * CIRC;

  // fair zone arc: 0.8/2 → 1.25/2 of the circle
  const fairStart = (0.8  / 2) * CIRC;
  const fairEnd   = (1.25 / 2) * CIRC;
  const fairDash  = fairEnd - fairStart;

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE, margin: '0 auto' }}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        {/* track */}
        <circle cx={SIZE/2} cy={SIZE/2} r={R}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />

        {/* fair zone marker (always shown, faint) */}
        <circle cx={SIZE/2} cy={SIZE/2} r={R}
          fill="none" stroke={C.fair} strokeWidth={STROKE}
          strokeDasharray={`${fairDash} ${CIRC - fairDash}`}
          strokeDashoffset={-fairStart}
          opacity="0.18"
          strokeLinecap="butt"
        />

        {/* actual value arc */}
        <motion.circle
          cx={SIZE/2} cy={SIZE/2} r={R}
          fill="none" stroke={color} strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC - dash }}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}90)` }}
        />
      </svg>

      {/* centre text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '2px'
      }}>
        <span style={{
          fontSize: '1.75rem', fontWeight: 800,
          fontFamily: 'var(--font-mono)', color,
          lineHeight: 1,
          textShadow: `0 0 20px ${color}80`
        }}>{di.toFixed(3)}</span>
        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          disp. impact
        </span>
      </div>
    </div>
  );
}

// ─── Segmented threshold bar for SPD ──────────────────────────────────────────
// Range: –1 → +1, zero = center, fair = ±0.1, warn = ±0.2
function SPDBar({ spd, color }) {
  // Map spd (-1..+1) to 0..100%
  const pct = ((spd + 1) / 2) * 100;
  const centerPct = 50;

  const segments = [
    { from: 0,  to: 30, c: C.danger },
    { from: 30, to: 40, c: C.warn   },
    { from: 40, to: 45, c: `${C.warn}99`  },
    { from: 45, to: 55, c: C.fair   },
    { from: 55, to: 60, c: `${C.warn}99`  },
    { from: 60, to: 70, c: C.warn   },
    { from: 70, to: 100,c: C.danger },
  ];

  return (
    <div style={{ width: '100%', padding: '0 0.5rem' }}>
      {/* Segmented track */}
      <div style={{ position: 'relative', height: '12px', borderRadius: '999px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
        {segments.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${s.from}%`, width: `${s.to - s.from}%`,
            background: s.c, opacity: 0.35,
          }} />
        ))}

        {/* Animated fill from center */}
        <motion.div style={{
          position: 'absolute', top: 0, bottom: 0,
          background: color,
          borderRadius: '999px',
          boxShadow: `0 0 8px ${color}`,
          ...(spd >= 0
            ? { left: `${centerPct}%`, width: 0 }
            : { right: `${100 - centerPct}%`, width: 0 }
          ),
        }}
          animate={spd >= 0
            ? { width: `${Math.abs(pct - centerPct)}%` }
            : { width: `${Math.abs(pct - centerPct)}%` }
          }
          initial={spd >= 0
            ? { left: `${centerPct}%`, width: 0 }
            : { right: `${100 - centerPct}%`, width: 0 }
          }
          transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Needle marker */}
        <motion.div
          style={{
            position: 'absolute', top: '-2px', bottom: '-2px',
            width: '3px', borderRadius: '2px',
            background: '#fff',
            boxShadow: `0 0 6px ${color}`,
            transform: 'translateX(-50%)',
          }}
          initial={{ left: '50%' }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      {/* Axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
        <span>-100%</span>
        <span style={{ color: C.warn }}>-20%</span>
        <span style={{ color: C.fair, fontWeight: 700 }}>0</span>
        <span style={{ color: C.warn }}>+20%</span>
        <span>+100%</span>
      </div>
    </div>
  );
}

// ─── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ title, subtitle, color, status, children }) {
  const Icon = status === 'FAIR' ? CheckCircle : AlertTriangle;
  return (
    <div style={{
      background: 'rgba(0,0,0,0.22)',
      border: `1px solid ${color}28`,
      borderTop: `2px solid ${color}`,
      borderRadius: '14px',
      padding: '1.5rem 1.25rem 1.25rem',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-1)' }}>{title}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-2)', marginTop: '1px' }}>{subtitle}</div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
          background: `${color}18`, border: `1px solid ${color}45`,
          borderRadius: '999px', padding: '0.22rem 0.7rem',
          fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color,
        }}>
          <Icon size={9} /> {status}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Explanation panel ─────────────────────────────────────────────────────────
function ExplanationPanel({ metrics, config }) {
  const privRate   = (metrics?.privFavorableRate   ?? 0) * 100;
  const unprivRate = (metrics?.unprivFavorableRate ?? 0) * 100;
  const priv   = config?.privilegedGroup   || 'Privileged';
  const unpriv = config?.unprivilegedGroup || 'Unprivileged';
  const di  = metrics?.disparateImpact ?? 0;
  const spd = metrics?.statisticalParityDifference ?? 0;

  const diColor  = (di  >= 0.8 && di  <= 1.25)  ? C.fair : (di  >= 0.6 ? C.warn : C.danger);
  const spdColor = Math.abs(spd) <= 0.1 ? C.fair : (Math.abs(spd) <= 0.2 ? C.warn : C.danger);

  const groups = [
    { label: priv,   rate: privRate,   color: C.purple, count: metrics?.privFavorable   ?? 0, total: metrics?.privTotal   ?? 0 },
    { label: unpriv, rate: unprivRate, color: diColor,  count: metrics?.unprivFavorable ?? 0, total: metrics?.unprivTotal ?? 0 },
  ];

  const maxRate = Math.max(privRate, unprivRate, 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem' }}>

      {/* How DI is calculated */}
      <div style={{
        background: 'rgba(0,0,0,0.22)', borderLeft: `3px solid ${diColor}`,
        border: `1px solid ${diColor}22`, borderRadius: '10px', padding: '1rem 1.1rem',
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: diColor, marginBottom: '0.6rem' }}>
          How Disparate Impact is calculated
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem', alignItems: 'center', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.55rem', borderRadius: '5px' }}>
            P(✓ | {unpriv})
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>÷</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.55rem', borderRadius: '5px' }}>
            P(✓ | {priv})
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>=</span>
          <span style={{ background: `${diColor}18`, border: `1px solid ${diColor}40`, color: diColor, padding: '0.2rem 0.55rem', borderRadius: '5px', fontWeight: 700 }}>
            {unprivRate.toFixed(1)}% ÷ {privRate.toFixed(1)}% = {di.toFixed(4)}
          </span>
        </div>
        <p style={{ fontSize: '0.77rem', color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
          {di < 0.8
            ? `The ${unpriv} group is selected at only ${(di * 100).toFixed(1)}% the rate of ${priv}. For every 10 approvals ${priv} receives, ${unpriv} gets ~${(di * 10).toFixed(1)}. This falls below the EEOC 80% threshold — bias is legally significant.`
            : di > 1.25
            ? `The ${unpriv} group is favoured — selected ${(di * 100).toFixed(1)}% as often as ${priv}. This indicates reverse bias (DI > 1.25).`
            : `Both groups are selected at comparable rates. DI = ${di.toFixed(3)} is within the fair range of 0.8 – 1.25.`
          }
        </p>
        <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', marginTop: '0.5rem' }}>
          Ideal = 1.0 · Fair: 0.8 – 1.25 · Industry: EEOC 80% Rule
        </div>
      </div>

      {/* How SPD is calculated */}
      <div style={{
        background: 'rgba(0,0,0,0.22)', borderLeft: `3px solid ${spdColor}`,
        border: `1px solid ${spdColor}22`, borderRadius: '10px', padding: '1rem 1.1rem',
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: spdColor, marginBottom: '0.6rem' }}>
          How Statistical Parity Difference is calculated
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem', alignItems: 'center', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.55rem', borderRadius: '5px' }}>
            P(✓ | {unpriv})
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>−</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.55rem', borderRadius: '5px' }}>
            P(✓ | {priv})
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>=</span>
          <span style={{ background: `${spdColor}18`, border: `1px solid ${spdColor}40`, color: spdColor, padding: '0.2rem 0.55rem', borderRadius: '5px', fontWeight: 700 }}>
            {unprivRate.toFixed(1)}% − {privRate.toFixed(1)}% = {(spd * 100).toFixed(2)}%
          </span>
        </div>
        <p style={{ fontSize: '0.77rem', color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
          {spd < -0.1
            ? `The ${unpriv} group has a ${Math.abs(spd * 100).toFixed(1)}% lower selection rate — they are clearly disadvantaged.`
            : spd > 0.1
            ? `The ${unpriv} group has a ${(spd * 100).toFixed(1)}% higher selection rate than ${priv}.`
            : `The gap is ${Math.abs(spd * 100).toFixed(1)}% — within the ±10% fair zone.`
          }
        </p>
        <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', marginTop: '0.5rem' }}>
          Ideal = 0% · Fair: −10% to +10% · EU AI Act threshold
        </div>
      </div>

      {/* Side-by-side selection rate bars */}
      <div style={{
        background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px', padding: '1rem 1.1rem',
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-2)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Selection Rate Comparison
        </div>
        {groups.map(g => (
          <div key={g.label} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-2)' }}>
                {g.label}
                <span style={{ marginLeft: '0.4rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
                  {g.count}/{g.total}
                </span>
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: g.color }}>
                {g.rate.toFixed(1)}%
              </span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(g.rate / maxRate) * 100}%` }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
                style={{
                  height: '100%', background: g.color,
                  borderRadius: '999px',
                  boxShadow: `0 0 10px ${g.color}70`,
                }}
              />
            </div>
          </div>
        ))}

        {/* 80% rule line annotation */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginTop: '0.4rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
          borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.6rem',
        }}>
          <div style={{ width: '20px', height: '2px', background: C.warn, borderRadius: '1px', flexShrink: 0 }} />
          80% Rule: {unpriv} minimum required rate = {(privRate * 0.8).toFixed(1)}%
          {unprivRate >= privRate * 0.8
            ? <span style={{ color: C.fair, fontWeight: 700, marginLeft: '0.3rem' }}>✓ Passes</span>
            : <span style={{ color: C.danger, fontWeight: 700, marginLeft: '0.3rem' }}>✗ Fails</span>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function FairnessMeter({ score, metrics, config }) {
  const { laymanMode } = useTheme();
  const [showExplain, setShowExplain] = useState(true);
  const [aiAnalysis, setAiAnalysis]   = useState(null);
  const [aiLoading,  setAiLoading]    = useState(false);
  const [aiError,    setAiError]      = useState('');

  const di  = metrics?.disparateImpact            ?? score ?? 1;
  const spd = metrics?.statisticalParityDifference ?? 0;

  const diIsFair  = di  >= 0.8 && di  <= 1.25;
  const diIsWarn  = (di >= 0.6 && di < 0.8) || (di > 1.25 && di <= 1.5);
  // anything outside fair+warn = danger (covers DI=2.0, DI=0.3, etc.)
  const spdIsFair = Math.abs(spd) <= 0.1;
  const spdIsWarn = Math.abs(spd) >  0.1 && Math.abs(spd) <= 0.2;

  const diColor   = colorOf(diIsFair,  diIsWarn);
  const spdColor  = colorOf(spdIsFair, spdIsWarn);
  const diStatus  = statusOf(diIsFair,  diIsWarn);
  const spdStatus = statusOf(spdIsFair, spdIsWarn);

  const overallFair   = diIsFair && spdIsFair;
  const overallIsWarnOnly = (diIsWarn || spdIsWarn) && diIsFair && spdIsFair === false && (Math.abs(spd) <= 0.2);
  const overallColor  = overallFair ? C.fair : (overallIsWarnOnly ? C.warn : C.danger);
  const overallLabel  = overallFair
    ? '✓ FAIR'
    : di > 1.25
    ? '⚠ REVERSE BIAS'
    : di < 0.6 || Math.abs(spd) > 0.2
    ? '⚠ BIAS DETECTED'
    : '⚠ CAUTION';

  const spdTrendIcon = spd < -0.1
    ? <TrendingDown size={13} color={C.danger} />
    : spd > 0.1
    ? <TrendingUp   size={13} color={C.warn}   />
    : <Minus        size={13} color={C.fair}   />;

  const fetchAiAnalysis = async () => {
    setAiLoading(true); setAiError(''); setAiAnalysis(null);
    try {
      const data = await apiPost('/api/ai/bias-analysis', { metrics, config, laymanMode });
      setAiAnalysis(data.analysis);
    } catch (err) { setAiError(err.message); }
    finally { setAiLoading(false); }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${overallColor}28`,
      borderRadius: '20px',
      padding: '1.75rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ambient glow */}
      <motion.div
        animate={{ background: overallColor }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute', top: '-100px', left: '50%',
          transform: 'translateX(-50%)',
          width: '500px', height: '300px',
          filter: 'blur(120px)', opacity: 0.055,
          pointerEvents: 'none', borderRadius: '50%',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: '1.5rem',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Fairness Meter</h3>
              <span style={{
                padding: '0.18rem 0.65rem', borderRadius: '999px',
                fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                background: `${overallColor}18`, border: `1px solid ${overallColor}50`,
                color: overallColor,
              }}>{overallLabel}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-2)' }}>
              {laymanMode
                ? 'How fairly does the model treat different groups?'
                : 'Disparate Impact (DI) · Statistical Parity Difference (SPD) · EEOC 80% Rule'
              }
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowExplain(p => !p)} style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-2)', borderRadius: '999px', padding: '0.35rem 0.8rem',
              fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
            }}>
              <Info size={11} />
              {showExplain ? 'Hide' : 'Show'} How it works
              {showExplain ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>

            {!aiAnalysis && (
              <button onClick={fetchAiAnalysis} disabled={aiLoading} style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                background: 'var(--accent-dim)', border: '1px solid var(--accent)',
                color: 'var(--accent)', borderRadius: '999px', padding: '0.35rem 0.8rem',
                fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
              }}>
                {aiLoading
                  ? <><Loader2 size={11} className="animate-spin" /> Analyzing…</>
                  : <><Brain size={11} /> Analyze with AI</>
                }
              </button>
            )}
          </div>
        </div>

        {/* ── Two metric cards ── */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>

          {/* DI card */}
          <MetricCard
            title="Disparate Impact"
            subtitle={laymanMode ? 'Approval rate ratio between groups' : 'Unprivileged rate ÷ Privileged rate'}
            color={diColor}
            status={diStatus}
          >
            <DIRing di={di} color={diColor} />

            {/* threshold ticks */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { label: '< 0.6',    desc: 'Severe bias',    c: C.danger },
                { label: '0.6–0.8',  desc: 'Caution',        c: C.warn   },
                { label: '0.8–1.25', desc: 'Fair ✓',         c: C.fair   },
                { label: '1.25–1.5', desc: 'Reverse caution',c: C.warn   },
                { label: '> 1.5',    desc: 'Reverse bias',   c: C.danger },
              ].map(t => (
                <div key={t.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  background: di >= parseFloat(t.label) || t.label === '0.8–1.25'
                    ? `${t.c}18` : `${t.c}08`,
                  border: `1px solid ${t.c}${di > 1.5 && t.label === '> 1.5' ? '80' : di < 0.6 && t.label === '< 0.6' ? '80' : '30'}`,
                  borderRadius: '7px', padding: '0.3rem 0.5rem', minWidth: '52px',
                }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: t.c, fontFamily: 'var(--font-mono)' }}>{t.label}</span>
                  <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </MetricCard>

          {/* SPD card */}
          <MetricCard
            title="Statistical Parity Difference"
            subtitle={laymanMode ? 'Approval rate gap between groups' : 'Unprivileged rate − Privileged rate'}
            color={spdColor}
            status={spdStatus}
          >
            {/* Big value */}
            <div style={{ textAlign: 'center', padding: '0.5rem 0 0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                {spdTrendIcon}
                <span style={{
                  fontSize: '2.5rem', fontWeight: 800,
                  fontFamily: 'var(--font-mono)', color: spdColor,
                  lineHeight: 1, textShadow: `0 0 20px ${spdColor}80`
                }}>
                  {(spd * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                parity gap
              </div>
            </div>

            {/* Threshold bar */}
            <SPDBar spd={spd} color={spdColor} />

            {/* threshold legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {[
                { label: '< −20%', c: C.danger },
                { label: '±10–20%', c: C.warn },
                { label: '±10%', c: C.fair, bold: true },
                { label: '> +20%', c: C.danger },
              ].map(t => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.62rem', color: t.c, fontFamily: 'var(--font-mono)',
                  fontWeight: t.bold ? 700 : 400,
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.c, boxShadow: `0 0 4px ${t.c}` }} />
                  {t.label}
                </div>
              ))}
            </div>
          </MetricCard>
        </div>

        {/* ── Explanation panel ── */}
        <AnimatePresence>
          {showExplain && metrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              style={{ overflow: 'hidden' }}
            >
              <ExplanationPanel metrics={metrics} config={config} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI panel ── */}
        <AnimatePresence>
          {(aiLoading || aiAnalysis || aiError) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                marginTop: '1.25rem',
                background: 'rgba(168,85,247,0.06)',
                border: '1px solid rgba(168,85,247,0.25)',
                borderRadius: '12px', padding: '1rem 1.1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: C.purple, fontWeight: 700, fontSize: '0.78rem' }}>
                  <Sparkles size={13} /> Gemini AI Deep Analysis
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 5px #34d399' }} />
                </div>
                {(aiAnalysis || aiError) && (
                  <button onClick={() => { setAiAnalysis(null); setAiError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: '0.7rem' }}>
                    ✕ close
                  </button>
                )}
              </div>

              {aiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.8rem' }}>
                  <Loader2 size={14} className="animate-spin" color={C.purple} />
                  Analyzing your bias metrics…
                </div>
              )}

              {aiError && (
                <div style={{ color: C.danger, fontSize: '0.78rem', lineHeight: 1.5 }}>
                  <strong>AI unavailable:</strong> {aiError}
                  <button onClick={fetchAiAnalysis} style={{
                    display: 'block', marginTop: '0.5rem', background: 'none',
                    border: `1px solid ${C.danger}`, color: C.danger,
                    borderRadius: '6px', padding: '0.25rem 0.6rem',
                    fontSize: '0.72rem', cursor: 'pointer',
                  }}>Retry</button>
                </div>
              )}

              {aiAnalysis && (
                <div style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--text-2)' }}>
                  <ReactMarkdown components={{
                    strong: ({ ...p }) => <strong style={{ color: 'var(--text-1)', fontWeight: 700 }} {...p} />,
                    p:  ({ ...p }) => <p  style={{ margin: '0 0 0.55rem 0' }} {...p} />,
                    ul: ({ ...p }) => <ul style={{ paddingLeft: '1.1rem', margin: '0 0 0.5rem 0' }} {...p} />,
                    li: ({ ...p }) => <li style={{ marginBottom: '0.28rem' }} {...p} />,
                    h2: ({ ...p }) => <h2 style={{ color: C.purple, fontSize: '0.82rem', margin: '0.7rem 0 0.3rem', fontWeight: 700 }} {...p} />,
                    h3: ({ ...p }) => <h3 style={{ color: 'var(--text-1)', fontSize: '0.8rem', margin: '0.55rem 0 0.2rem' }} {...p} />,
                  }}>{aiAnalysis}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
