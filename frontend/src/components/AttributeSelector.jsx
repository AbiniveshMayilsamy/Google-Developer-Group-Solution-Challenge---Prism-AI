import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, AlertTriangle, ChevronDown, Search, Check, Target, ShieldAlert, Star, Users } from 'lucide-react';

// ─── Reusable custom dropdown ─────────────────────────────────────────────────
function Dropdown({ label, icon: Icon, placeholder, options, value, onChange, disabled, color = 'var(--accent)' }) {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState('');
  const ref                 = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: '1rem' }}>
      {/* Label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-2)',
        textTransform: 'uppercase', letterSpacing: '0.07em',
        fontFamily: 'var(--font-mono)', marginBottom: '0.4rem',
      }}>
        {Icon && <Icon size={11} color={color} />}
        {label}
      </div>

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(o => !o); setQuery(''); } }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '0.5rem', padding: '0.75rem 1rem',
          background: open ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${open ? color : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.18s', outline: 'none',
          boxShadow: open ? `0 0 0 3px ${color}18` : 'none',
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <span style={{
          fontSize: '0.875rem', fontWeight: selected ? 600 : 400,
          color: selected ? 'var(--text-1)' : 'var(--text-2)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left',
        }}>
          {selected ? selected.label : placeholder}
        </span>
        {selected?.sub && (
          <span style={{
            fontSize: '0.65rem', color: 'var(--text-2)', fontFamily: 'var(--font-mono)',
            background: 'rgba(255,255,255,0.07)', padding: '0.1rem 0.45rem',
            borderRadius: '4px', flexShrink: 0,
          }}>
            {selected.sub}
          </span>
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={14} color="var(--text-2)" />
        </motion.div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -6, scale: 0.98  }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              zIndex: 100,
              background: '#13131a',
              border: `1px solid ${color}40`,
              borderRadius: '12px',
              boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${color}18`,
              overflow: 'hidden',
            }}
          >
            {/* Search */}
            {options.length > 5 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>
                <Search size={12} color="var(--text-2)" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: 'var(--text-1)', fontSize: '0.82rem',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
            )}

            {/* Options */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '0.35rem' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-2)', textAlign: 'center' }}>
                  No match
                </div>
              ) : filtered.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); setQuery(''); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none',
                      background: isSelected ? `${color}18` : 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '0.83rem', fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? color : 'var(--text-1)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {opt.label}
                      </div>
                      {opt.sub && (
                        <div style={{ fontSize: '0.67rem', color: 'var(--text-2)', marginTop: '1px', fontFamily: 'var(--font-mono)' }}>
                          {opt.sub}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check size={13} color={color} style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AttributeSelector({ columns, data, onConfigSubmit }) {
  const [targetAttribute,    setTargetAttribute]    = useState('');
  const [favorableOutcome,   setFavorableOutcome]   = useState('');
  const [sensitiveAttribute, setSensitiveAttribute] = useState('');
  const [privilegedGroup,    setPrivilegedGroup]    = useState('');
  const [unprivilegedGroup,  setUnprivilegedGroup]  = useState('');

  const [targetValues,    setTargetValues]    = useState([]);
  const [sensitiveValues, setSensitiveValues] = useState([]);

  // Build column options with unique-value preview
  const colOptions = columns.map(col => {
    const uniq = [...new Set(data.map(r => r[col]?.toString().trim()).filter(Boolean))];
    return {
      value: col,
      label: col,
      sub: uniq.slice(0, 3).join(', ') + (uniq.length > 3 ? ` +${uniq.length - 3}` : ''),
    };
  });

  useEffect(() => {
    if (!targetAttribute || !data) { setTargetValues([]); setFavorableOutcome(''); return; }
    const vals = [...new Set(data.map(r => r[targetAttribute]?.toString().trim()).filter(Boolean))];
    setTargetValues(vals);
    setFavorableOutcome(vals[0] ?? '');
  }, [targetAttribute, data]);

  useEffect(() => {
    if (!sensitiveAttribute || !data) { setSensitiveValues([]); setPrivilegedGroup(''); setUnprivilegedGroup(''); return; }
    const vals = [...new Set(data.map(r => r[sensitiveAttribute]?.toString().trim()).filter(Boolean))];
    setSensitiveValues(vals);
    setPrivilegedGroup(vals[0] ?? '');
    setUnprivilegedGroup(vals[1] ?? vals[0] ?? '');
  }, [sensitiveAttribute, data]);

  const valueOptions = (vals) => vals.map(v => {
    const count = data.filter(r => r[sensitiveAttribute]?.toString().trim() === v || r[targetAttribute]?.toString().trim() === v).length;
    return { value: v, label: v, sub: `${count} rows` };
  });

  const targetValOptions = targetValues.map(v => {
    const count = data.filter(r => r[targetAttribute]?.toString().trim() === v).length;
    return { value: v, label: v, sub: `${count} rows` };
  });

  const sensitiveValOptions = sensitiveValues.map(v => {
    const count = data.filter(r => r[sensitiveAttribute]?.toString().trim() === v).length;
    return { value: v, label: v, sub: `${count} rows` };
  });

  const isSameAttr = targetAttribute && sensitiveAttribute && targetAttribute === sensitiveAttribute;
  const canSubmit  = targetAttribute && favorableOutcome && sensitiveAttribute &&
                     privilegedGroup && unprivilegedGroup && !isSameAttr;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onConfigSubmit({ targetAttribute, favorableOutcome, sensitiveAttribute, privilegedGroup, unprivilegedGroup });
  };

  return (
    <motion.div
      className="glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem' }}>
        <Settings size={18} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Configure Analysis</h2>
          <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-2)' }}>
            {data?.length?.toLocaleString()} rows · {columns.length} columns detected
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>

          {/* ── Left column ── */}
          <div>
            <div style={{
              fontSize: '0.68rem', fontWeight: 700, color: ACCENT_PURPLE,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}>
              <Target size={10} /> Outcome
            </div>

            <Dropdown
              label="Target Variable"
              icon={Target}
              placeholder="Which column is the prediction?"
              options={colOptions}
              value={targetAttribute}
              onChange={setTargetAttribute}
              color="var(--accent)"
            />

            <AnimatePresence>
              {targetAttribute && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Dropdown
                    label="Favorable Outcome"
                    icon={Star}
                    placeholder="Which value is the positive result?"
                    options={targetValOptions}
                    value={favorableOutcome}
                    onChange={setFavorableOutcome}
                    color="#34d399"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right column ── */}
          <div>
            <div style={{
              fontSize: '0.68rem', fontWeight: 700, color: '#f87171',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}>
              <ShieldAlert size={10} /> Fairness
            </div>

            <Dropdown
              label="Sensitive Attribute"
              icon={ShieldAlert}
              placeholder="Which column holds the protected group?"
              options={colOptions.filter(c => c.value !== targetAttribute)}
              value={sensitiveAttribute}
              onChange={setSensitiveAttribute}
              color="#f87171"
            />

            <AnimatePresence>
              {sensitiveAttribute && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Dropdown
                    label="Privileged Group"
                    icon={Users}
                    placeholder="Historically advantaged group"
                    options={sensitiveValOptions}
                    value={privilegedGroup}
                    onChange={setPrivilegedGroup}
                    color="var(--accent)"
                  />
                  <Dropdown
                    label="Unprivileged Group"
                    icon={Users}
                    placeholder="Group being audited for bias"
                    options={sensitiveValOptions.filter(o => o.value !== privilegedGroup)}
                    value={unprivilegedGroup}
                    onChange={setUnprivilegedGroup}
                    color="#fb923c"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {isSameAttr && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem', marginBottom: '1rem',
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '8px', color: '#f87171', fontSize: '0.82rem',
              }}
            >
              <AlertTriangle size={15} />
              Target Variable and Sensitive Attribute cannot be the same column.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Config summary preview */}
        <AnimatePresence>
          {canSubmit && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
                padding: '0.75rem 1rem', marginBottom: '1.25rem',
                background: 'rgba(158,255,0,0.05)', border: '1px solid rgba(158,255,0,0.2)',
                borderRadius: '10px',
              }}
            >
              {[
                { k: 'Target',      v: targetAttribute    },
                { k: 'Outcome',     v: favorableOutcome   },
                { k: 'Sensitive',   v: sensitiveAttribute },
                { k: 'Privileged',  v: privilegedGroup    },
                { k: 'Audit group', v: unprivilegedGroup  },
              ].map(item => (
                <div key={item.k} style={{
                  display: 'flex', gap: '0.3rem', alignItems: 'center',
                  fontSize: '0.72rem',
                }}>
                  <span style={{ color: 'var(--text-2)' }}>{item.k}:</span>
                  <span style={{
                    color: 'var(--text-1)', fontWeight: 700,
                    background: 'rgba(255,255,255,0.07)', padding: '0.1rem 0.45rem',
                    borderRadius: '4px', fontFamily: 'var(--font-mono)',
                  }}>{item.v}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', fontSize: '0.95rem', padding: '0.85rem' }}
          disabled={!canSubmit}
        >
          Run Bias Analysis →
        </button>
      </form>
    </motion.div>
  );
}

const ACCENT_PURPLE = 'var(--accent)';
