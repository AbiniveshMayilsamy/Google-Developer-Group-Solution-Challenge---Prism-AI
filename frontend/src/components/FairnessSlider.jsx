import { motion } from 'framer-motion';
import { ShieldCheck, ShieldX, Users, TrendingDown, Scale, AlertCircle } from 'lucide-react';

const FAIR   = '#34d399';
const WARN   = '#fb923c';
const DANGER = '#f87171';
const PURPLE = 'var(--accent)';

export default function FairnessSlider({ currentMetrics, config }) {
  if (!currentMetrics) return null;

  const di  = currentMetrics.disparateImpact            ?? 0;
  const spd = currentMetrics.statisticalParityDifference ?? 0;
  const privRate   = (currentMetrics.privFavorableRate   ?? 0) * 100;
  const unprivRate = (currentMetrics.unprivFavorableRate ?? 0) * 100;
  const privTotal   = currentMetrics.privTotal   ?? 0;
  const unprivTotal = currentMetrics.unprivTotal ?? 0;
  const privFav     = currentMetrics.privFavorable   ?? 0;
  const unprivFav   = currentMetrics.unprivFavorable ?? 0;

  const priv   = config?.privilegedGroup   || 'Privileged';
  const unpriv = config?.unprivilegedGroup || 'Unprivileged';

  const diIsFair  = di >= 0.8 && di <= 1.25;
  const diIsWarn  = (di >= 0.6 && di < 0.8) || (di > 1.25 && di <= 1.5);
  const spdIsFair = Math.abs(spd) <= 0.1;
  const spdIsWarn = Math.abs(spd) > 0.1 && Math.abs(spd) <= 0.2;

  const diColor  = diIsFair  ? FAIR : diIsWarn  ? WARN : DANGER;
  const spdColor = spdIsFair ? FAIR : spdIsWarn ? WARN : DANGER;

  // How many extra favorable outcomes would be needed to reach DI = 0.8
  const requiredUnprivRate = privRate * 0.8;
  const currentUnprivFav  = unprivFav;
  const neededUnprivFav   = Math.ceil((requiredUnprivRate / 100) * unprivTotal);
  const gapCount          = Math.max(0, neededUnprivFav - currentUnprivFav);

  // Severity label
  const severity = diIsFair && spdIsFair
    ? { label: 'No Bias Detected',   color: FAIR,   Icon: ShieldCheck }
    : diIsWarn || spdIsWarn
    ? { label: 'Mild Bias Detected', color: WARN,   Icon: AlertCircle }
    : { label: 'Severe Bias',        color: DANGER,  Icon: ShieldX    };

  const stats = [
    {
      icon: <Users size={15} />,
      label: `${priv} selection rate`,
      value: `${privRate.toFixed(1)}%`,
      sub: `${privFav} of ${privTotal} selected`,
      color: PURPLE,
    },
    {
      icon: <Users size={15} />,
      label: `${unpriv} selection rate`,
      value: `${unprivRate.toFixed(1)}%`,
      sub: `${unprivFav} of ${unprivTotal} selected`,
      color: diColor,
    },
    {
      icon: <TrendingDown size={15} />,
      label: 'Rate gap',
      value: `${Math.abs(spd * 100).toFixed(1)}%`,
      sub: spd < 0 ? `${unpriv} is disadvantaged` : spd > 0 ? `${priv} is disadvantaged` : 'Equal rates',
      color: spdColor,
    },
    {
      icon: <Scale size={15} />,
      label: 'DI ratio',
      value: di.toFixed(3),
      sub: diIsFair ? 'Within fair range' : `Needs ${gapCount} more ${unpriv} selections to reach 80% rule`,
      color: diColor,
    },
  ];

  const checks = [
    {
      law: 'US EEOC 80% Rule',
      pass: di >= 0.8 && di <= 1.25,
      detail: di >= 0.8 && di <= 1.25
        ? `DI = ${di.toFixed(3)} — passes the four-fifths rule`
        : `DI = ${di.toFixed(3)} — below 0.8 threshold. ${gapCount > 0 ? `${gapCount} additional ${unpriv} selections needed.` : ''}`,
    },
    {
      law: 'EU AI Act ±10% Parity',
      pass: Math.abs(spd) <= 0.1,
      detail: Math.abs(spd) <= 0.1
        ? `SPD = ${(spd * 100).toFixed(1)}% — within ±10% safe margin`
        : `SPD = ${(spd * 100).toFixed(1)}% — exceeds ±10%. Mandatory human oversight required.`,
    },
    {
      law: 'India DPDPA Section 6',
      pass: true,
      detail: 'Sensitive attributes processed for lawful, specified purposes only.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel"
      style={{ marginTop: '2rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <severity.Icon size={18} color={severity.color} />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Bias Impact Summary</h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-2)' }}>
              Derived from your dataset · read-only
            </p>
          </div>
        </div>
        <span style={{
          padding: '0.25rem 0.85rem', borderRadius: '999px',
          fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
          background: `${severity.color}18`, border: `1px solid ${severity.color}50`,
          color: severity.color,
        }}>
          {severity.label}
        </span>
      </div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: `1px solid ${s.color}22`,
              borderTop: `2px solid ${s.color}`,
              borderRadius: '10px',
              padding: '0.85rem 1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-2)', fontSize: '0.72rem', marginBottom: '0.4rem' }}>
              <span style={{ color: s.color }}>{s.icon}</span>
              {s.label}
            </div>
            <div style={{ fontSize: '1.55rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color, lineHeight: 1, marginBottom: '0.3rem' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-2)', lineHeight: 1.4 }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Regulatory checklist */}
      <div style={{
        background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px', padding: '0.9rem 1rem',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          Regulatory Compliance
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {checks.map(c => (
            <div key={c.law} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <div style={{
                flexShrink: 0, marginTop: '1px',
                width: '16px', height: '16px', borderRadius: '4px',
                background: c.pass ? `${FAIR}20` : `${DANGER}20`,
                border: `1px solid ${c.pass ? FAIR : DANGER}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.62rem', fontWeight: 900,
                color: c.pass ? FAIR : DANGER,
              }}>
                {c.pass ? '✓' : '✗'}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-1)' }}>{c.law} </span>
                <span style={{ fontSize: '0.73rem', color: 'var(--text-2)' }}>— {c.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
