import { useCallback, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { UserMinus, UserCheck, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';

export default function WhatIfSandbox({ config, data = [] }) {
  const { laymanMode } = useTheme();
  const sensitiveLabel   = config?.sensitiveAttribute || 'Sensitive Attribute';
  const unprivileged     = config?.unprivilegedGroup  || 'Unprivileged';
  const privileged       = config?.privilegedGroup    || 'Privileged';
  const favorableOutcome = config?.favorableOutcome   || 'Approved';

  const featureProbabilities = useMemo(() => {
    if (!data || data.length === 0) return {};
    const probs = {};
    const cols = Object.keys(data[0]).filter(c => c !== config.targetAttribute);
    cols.forEach(col => {
      probs[col] = {};
      const counts = {}, favCounts = {};
      data.forEach(row => {
        const val = row[col]?.toString().trim();
        if (!val) return;
        counts[val] = (counts[val] || 0) + 1;
        if (row[config.targetAttribute]?.toString().trim() === favorableOutcome)
          favCounts[val] = (favCounts[val] || 0) + 1;
      });
      Object.keys(counts).forEach(val => {
        probs[col][val] = favCounts[val] ? favCounts[val] / counts[val] : 0;
      });
    });
    return probs;
  }, [data, config, favorableOutcome]);

  const [profileIndex, setProfileIndex] = useState(0);
  const [modifiedProfile, setModifiedProfile] = useState(null);
  const [modelThreshold, setModelThreshold] = useState(0.5);

  const originalProfile = data?.length > 0 ? data[profileIndex % data.length] : null;

  useEffect(() => {
    if (originalProfile) setModifiedProfile({ ...originalProfile });
  }, [originalProfile]);

  const calcScore = useCallback((profile) => {
    if (!profile || !featureProbabilities) return 0.5;
    const cols = Object.keys(profile).filter(c => c !== config.targetAttribute && c !== '_synthetic');
    if (!cols.length) return 0.5;
    let total = 0, count = 0;
    cols.forEach(col => {
      const val = profile[col]?.toString().trim();
      const cp = featureProbabilities[col];
      if (cp && val !== undefined) { total += cp[val] ?? 0.5; count++; }
    });
    return count > 0 ? total / count : 0.5;
  }, [config, featureProbabilities]);

  const score         = useMemo(() => calcScore(modifiedProfile), [modifiedProfile, calcScore]);
  const originalScore = useMemo(() => calcScore(originalProfile), [originalProfile, calcScore]);

  const wouldApprove   = score >= modelThreshold;
  const originalApprove = originalScore >= modelThreshold;

  const toggleSensitive = () => {
    if (!modifiedProfile) return;
    const cur = modifiedProfile[config.sensitiveAttribute]?.toString().trim();
    setModifiedProfile(p => ({
      ...p,
      [config.sensitiveAttribute]: cur === privileged ? unprivileged : privileged
    }));
  };

  if (!data || data.length === 0) return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Sliders size={18} color="var(--accent)" /> What-If Sandbox
      </h3>
      <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>
        Upload a dataset first to use the What-If Sandbox.
      </p>
    </div>
  );

  const otherFeatures = modifiedProfile
    ? Object.keys(modifiedProfile).filter(c =>
        c !== config.targetAttribute && c !== config.sensitiveAttribute && c !== '_synthetic')
    : [];

  const isModified = originalProfile && modifiedProfile &&
    originalProfile[config.sensitiveAttribute] !== modifiedProfile[config.sensitiveAttribute];

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Sliders size={18} color="var(--accent)" /> Interactive What-If Sandbox
      </h3>
      <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
        {laymanMode
          ? "Browse profiles and toggle group labels. If the decision changes only because of the group label — that's bias."
          : "Toggle sensitive attributes or adjust the threshold. If prediction flips based purely on the demographic tag, it reveals direct model bias."}
      </p>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>

        {/* Controls */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-1)' }}>
              Profile {profileIndex + 1} of {data.length}
            </h4>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn-secondary"
                onClick={() => setProfileIndex(p => (p - 1 + data.length) % data.length)}
                style={{ padding: '0.3rem 0.5rem', minWidth: 0 }}>
                <ChevronLeft size={15}/>
              </button>
              <button className="btn-secondary"
                onClick={() => setProfileIndex(p => (p + 1) % data.length)}
                style={{ padding: '0.3rem 0.5rem', minWidth: 0 }}>
                <ChevronRight size={15}/>
              </button>
            </div>
          </div>

          {modifiedProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              {/* Sensitive toggle */}
              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <div className="flex-between">
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                      {sensitiveLabel}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1rem' }}>
                      {modifiedProfile[config.sensitiveAttribute]}
                    </div>
                  </div>
                  <button className="btn-secondary" onClick={toggleSensitive}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
                    Toggle
                  </button>
                </div>
              </div>

              {/* Feature list */}
              <div style={{ maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {otherFeatures.map(feat => (
                  <div key={feat} className="flex-between"
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'var(--text-2)' }}>{feat}:</span>
                    <strong style={{ color: 'var(--text-1)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {modifiedProfile[feat]}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Threshold */}
              <div>
                <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.4rem' }}>
                  <span>{laymanMode ? 'Score to Pass' : 'Decision Threshold'}</span>
                  <strong style={{ color: 'var(--accent)' }}>{modelThreshold.toFixed(2)}</strong>
                </div>
                <input type="range" min="0.1" max="0.9" step="0.05"
                  value={modelThreshold}
                  onChange={e => setModelThreshold(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Outcome */}
        <div className="text-center">
          <motion.div
            key={wouldApprove ? 'y' : 'n'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              width: '130px', height: '130px', borderRadius: '50%',
              margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: wouldApprove ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
              border: `2px solid ${wouldApprove ? '#34d399' : '#f87171'}`,
              boxShadow: `0 0 28px ${wouldApprove ? '#34d39930' : '#f8717130'}`,
              transition: 'all 0.35s ease'
            }}
          >
            {wouldApprove
              ? <UserCheck size={52} color="#34d399"/>
              : <UserMinus size={52} color="#f87171"/>}
          </motion.div>

          <h3 style={{ marginTop: '1.25rem', color: wouldApprove ? '#34d399' : '#f87171', fontSize: '1.1rem' }}>
            {wouldApprove ? favorableOutcome : `Not ${favorableOutcome}`}
          </h3>

          <div style={{ margin: '0.75rem auto 0', padding: '0.4rem 0.85rem', borderRadius: '999px', background: 'rgba(0,0,0,0.2)', display: 'inline-block', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-2)' }}>Score: </span>
            <strong style={{ color: 'var(--text-1)' }}>{(score * 100).toFixed(1)}%</strong>
          </div>

          <p style={{ color: 'var(--text-2)', marginTop: '1rem', fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.6 }}>
            {isModified
              ? (wouldApprove !== originalApprove
                  ? `⚠️ Bias detected! Decision changed from "${originalApprove ? favorableOutcome : 'Rejected'}" to "${wouldApprove ? favorableOutcome : 'Rejected'}" only due to "${sensitiveLabel}".`
                  : `✓ No bias — decision stays the same regardless of group.`)
              : `Click "Toggle" to test if changing the group label changes the outcome.`}
          </p>
        </div>
      </div>
    </div>
  );
}
