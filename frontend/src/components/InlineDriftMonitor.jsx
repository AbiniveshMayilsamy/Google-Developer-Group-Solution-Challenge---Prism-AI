import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import { Activity, Brain, Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

const FAIR   = '#34d399';
const WARN   = '#fb923c';
const DANGER = '#f87171';
const PURPLE = 'var(--accent)';

function diColor(v)  { return v >= 0.8 && v <= 1.25 ? FAIR : v >= 0.6 ? WARN : DANGER; }
function spdColor(v) { return Math.abs(v) <= 0.1 ? FAIR : Math.abs(v) <= 0.2 ? WARN : DANGER; }

// ─── Custom tooltip for recharts ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(13,13,15,0.97)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.78rem',
    }}>
      <div style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.3rem' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill, fontFamily: 'var(--font-mono)' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(4) : p.value}
        </div>
      ))}
    </div>
  );
}

// ─── What "Bias Drift Monitor" actually means — explained ────────────────────
// In a real production ML system, drift = the model's fairness metrics changing
// over time as new data flows in. Since this is an audit tool (not a live model),
// we show something genuinely useful: how each mitigation step you apply in this
// session changes DI and SPD — a "mitigation impact tracker".

export default function InlineDriftMonitor({ metrics, config }) {
  const { laymanMode } = useTheme();
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError,   setAiError]   = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const initialised = useRef(false);

  const realDI  = metrics?.disparateImpact            ?? 0;
  const realSPD = metrics?.statisticalParityDifference ?? 0;

  // Build snapshot timeline from real metrics changes in this session
  useEffect(() => {
    if (!metrics) return;

    // Always start with the original audit result (first load)
    if (!initialised.current) {
      initialised.current = true;
      const original = {
        label: 'Original',
        di:  realDI,
        spd: realSPD,
        diAbs:  parseFloat(realDI.toFixed(4)),
        spdAbs: parseFloat(Math.abs(realSPD).toFixed(4)),
        step: 'Raw dataset audit result',
        ts: Date.now(),
      };
      setSnapshots([original]);
      return;
    }

    // When metrics change (e.g. after BiasFixer runs), add a new snapshot
    setSnapshots(prev => {
      const last = prev[prev.length - 1];
      // Only add if values actually changed
      if (last && Math.abs(last.di - realDI) < 0.0001 && Math.abs(last.spd - realSPD) < 0.0001) {
        return prev;
      }
      const stepNames = ['Original', 'After Reweighing', 'After Balancing', 'After Threshold Adj.', 'After Re-audit'];
      const label = stepNames[Math.min(prev.length, stepNames.length - 1)];
      return [...prev, {
        label,
        di:     realDI,
        spd:    realSPD,
        diAbs:  parseFloat(realDI.toFixed(4)),
        spdAbs: parseFloat(Math.abs(realSPD).toFixed(4)),
        step:   'Metrics updated after mitigation',
        ts:     Date.now(),
      }];
    });
  }, [metrics, realDI, realSPD]);

  const fetchAiInsight = async () => {
    setAiLoading(true); setAiError(''); setAiInsight('');
    try {
      const first = snapshots[0];
      const last  = snapshots[snapshots.length - 1];
      const result = await apiPost('/api/ai/drift-explanation', {
        currentValue:      last?.di  ?? realDI,
        historicalAverage: first?.di ?? realDI,
        trend: snapshots.length > 1
          ? (last.di > first.di ? 'Improving' : last.di < first.di ? 'Worsening' : 'Stable')
          : (realDI < 0.8 ? 'Below threshold' : 'Stable'),
        sensitiveAttribute: config?.sensitiveAttribute,
        laymanMode,
      });
      setAiInsight(result.explanation);
    } catch (e) {
      setAiError(e.message);
    } finally { setAiLoading(false); }
  };

  const isFair     = realDI >= 0.8 && realDI <= 1.25 && Math.abs(realSPD) <= 0.1;
  const statusColor = isFair ? FAIR : realDI >= 0.6 ? WARN : DANGER;
  const statusLabel = isFair ? 'FAIR' : realDI >= 0.6 ? 'CAUTION' : 'BIASED';

  const improved = snapshots.length > 1 && snapshots[snapshots.length - 1].di > snapshots[0].di;
  const diImprovement = snapshots.length > 1
    ? ((snapshots[snapshots.length - 1].di - snapshots[0].di) * 100).toFixed(1)
    : null;

  // DI bar chart data — each snapshot as a bar
  const diChartData = snapshots.map(s => ({
    name: s.label,
    DI:   s.diAbs,
    fill: diColor(s.diAbs),
  }));

  // SPD chart data
  const spdChartData = snapshots.map(s => ({
    name: s.label,
    'SPD (abs)': s.spdAbs,
    fill: spdColor(s.spd),
  }));

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Activity size={18} color="var(--accent)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Bias Drift Monitor</h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-2)' }}>
              Tracks how DI &amp; SPD change each time you apply a mitigation step
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            padding: '0.25rem 0.8rem', borderRadius: '999px',
            fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)',
            background: `${statusColor}15`, border: `1px solid ${statusColor}45`, color: statusColor,
          }}>
            DI {realDI.toFixed(3)} · {statusLabel}
          </span>
          {!aiInsight && (
            <button onClick={fetchAiInsight} disabled={aiLoading} style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              background: 'var(--accent-dim)', border: '1px solid var(--accent)',
              color: 'var(--accent)', borderRadius: '999px', padding: '0.3rem 0.75rem',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
            }}>
              {aiLoading ? <><Loader2 size={11} className="animate-spin" /> Analyzing…</> : <><Brain size={11} /> AI Insight</>}
            </button>
          )}
        </div>
      </div>

      {/* ── What this means ── */}
      <div style={{
        display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
        background: 'rgba(66, 133, 244, 0.05)', border: '1px solid rgba(66, 133, 244, 0.18)',
        borderRadius: '8px', padding: '0.65rem 0.85rem', marginBottom: '1.25rem',
        fontSize: '0.75rem', color: 'var(--text-2)', lineHeight: 1.6,
      }}>
        <Info size={13} color={PURPLE} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          {laymanMode
            ? 'This chart shows whether your fairness score is getting better or worse after each fix you apply. If a bar gets taller and turns green, it means the fix worked.'
            : 'Each bar represents a snapshot of your Disparate Impact (DI) and Statistical Parity Difference (SPD) taken after a mitigation step — Original audit, then after Reweighing, Balancing, etc. Use this to verify that each action actually improved fairness.'
          }
        </span>
      </div>

      {/* ── Charts ── */}
      {snapshots.length > 0 ? (
        <div className="grid-2" style={{ gap: '1.5rem' }}>

          {/* DI bar chart */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PURPLE, display: 'inline-block' }} />
              Disparate Impact over steps
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>ideal = 1.0</span>
            </div>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diChartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 1.4]} tick={{ fontSize: 10, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  {/* Fair zone band */}
                  <ReferenceLine y={0.8}  stroke={DANGER} strokeDasharray="4 3" strokeWidth={1}
                    label={{ value: '0.8 min', fill: DANGER, fontSize: 9, position: 'insideTopRight' }} />
                  <ReferenceLine y={1.0}  stroke={FAIR}   strokeDasharray="4 3" strokeWidth={1}
                    label={{ value: '1.0 ideal', fill: FAIR, fontSize: 9, position: 'insideTopRight' }} />
                  <ReferenceLine y={1.25} stroke={WARN}   strokeDasharray="4 3" strokeWidth={1}
                    label={{ value: '1.25 max', fill: WARN, fontSize: 9, position: 'insideTopRight' }} />
                  <Bar dataKey="DI" name="Disparate Impact" radius={[4, 4, 0, 0]}>
                    {diChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} style={{ filter: `drop-shadow(0 0 4px ${entry.fill}80)` }} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SPD bar chart */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PURPLE, display: 'inline-block' }} />
              |SPD| over steps
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>ideal = 0 · lower is fairer</span>
            </div>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spdChartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 0.6]} tick={{ fontSize: 10, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <ReferenceLine y={0.1} stroke={FAIR}   strokeDasharray="4 3" strokeWidth={1}
                    label={{ value: '±10% fair', fill: FAIR, fontSize: 9, position: 'insideTopRight' }} />
                  <ReferenceLine y={0.2} stroke={WARN}   strokeDasharray="4 3" strokeWidth={1}
                    label={{ value: '±20% warn', fill: WARN, fontSize: 9, position: 'insideTopRight' }} />
                  <Bar dataKey="SPD (abs)" name="|SPD|" radius={[4, 4, 0, 0]}>
                    {spdChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} style={{ filter: `drop-shadow(0 0 4px ${entry.fill}80)` }} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>
          Loading audit data…
        </div>
      )}

      {/* ── Snapshot timeline ── */}
      {snapshots.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
            Step Log
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {snapshots.map((s, i) => {
              const prev = snapshots[i - 1];
              const diDelta = prev ? s.di - prev.di : null;
              const isImproved = diDelta !== null && diDelta > 0.005;
              const isWorse    = diDelta !== null && diDelta < -0.005;
              return (
                <motion.div
                  key={s.ts}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.55rem 0.85rem',
                    background: 'rgba(0,0,0,0.18)',
                    border: `1px solid ${diColor(s.di)}22`,
                    borderLeft: `3px solid ${diColor(s.di)}`,
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    {isImproved
                      ? <CheckCircle size={13} color={FAIR} />
                      : isWorse
                      ? <AlertTriangle size={13} color={DANGER} />
                      : <Activity size={13} color={PURPLE} />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-1)' }}>{s.label}</span>
                    {diDelta !== null && (
                      <span style={{
                        marginLeft: '0.5rem', fontSize: '0.68rem',
                        color: isImproved ? FAIR : isWorse ? DANGER : 'var(--text-2)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {isImproved ? '▲' : isWorse ? '▼' : '—'} {Math.abs(diDelta * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: diColor(s.di) }}>
                      DI {s.di.toFixed(3)}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>·</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: spdColor(s.spd) }}>
                      SPD {(s.spd * 100).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Improvement summary ── */}
      {snapshots.length > 1 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: improved ? 'rgba(52,211,153,0.07)' : 'rgba(248,113,113,0.07)',
          border: `1px solid ${improved ? FAIR : DANGER}30`,
          borderRadius: '8px',
          fontSize: '0.78rem',
          color: improved ? FAIR : DANGER,
          fontWeight: 600,
        }}>
          {improved
            ? `✓ DI improved by ${diImprovement}% after mitigation (${snapshots[0].di.toFixed(3)} → ${snapshots[snapshots.length - 1].di.toFixed(3)})`
            : `⚠ DI has not improved since the original audit. Apply BiasFixer or Reweighing to reduce bias.`
          }
        </div>
      )}

      {/* ── AI insight ── */}
      <AnimatePresence>
        {(aiLoading || aiInsight || aiError) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              marginTop: '1rem',
              background: 'rgba(66, 133, 244, 0.05)',
              border: '1px solid rgba(66, 133, 244, 0.25)',
              borderRadius: '10px', padding: '0.85rem 1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: PURPLE, fontWeight: 700, fontSize: '0.75rem' }}>
                <Brain size={12} /> Gemini Analysis
              </div>
              {(aiInsight || aiError) && (
                <button onClick={() => { setAiInsight(''); setAiError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: '0.68rem' }}>
                  ✕
                </button>
              )}
            </div>
            {aiLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.78rem' }}>
                <Loader2 size={13} className="animate-spin" color={PURPLE} /> Analyzing drift pattern…
              </div>
            )}
            {aiError && (
              <div style={{ color: DANGER, fontSize: '0.75rem' }}>
                {aiError}
                <button onClick={fetchAiInsight} style={{ marginLeft: '0.5rem', background: 'none', border: `1px solid ${DANGER}`, color: DANGER, borderRadius: '4px', padding: '0.15rem 0.4rem', fontSize: '0.68rem', cursor: 'pointer' }}>Retry</button>
              </div>
            )}
            {aiInsight && (
              <p style={{ fontSize: '0.77rem', color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
                {aiInsight}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
