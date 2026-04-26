import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, AlertTriangle } from 'lucide-react';

export default function AttributeSelector({ columns, data, onConfigSubmit }) {
  const [targetAttribute, setTargetAttribute] = useState('');
  const [favorableOutcome, setFavorableOutcome] = useState('');
  const [sensitiveAttribute, setSensitiveAttribute] = useState('');
  const [privilegedGroup, setPrivilegedGroup] = useState('');
  const [unprivilegedGroup, setUnprivilegedGroup] = useState('');

  const [targetUniqueValues, setTargetUniqueValues] = useState([]);
  const [sensitiveUniqueValues, setSensitiveUniqueValues] = useState([]);

  // Extract unique values for Target Attribute
  useEffect(() => {
    if (targetAttribute && data) {
      const uniqueVals = [...new Set(data.map(row => row[targetAttribute]?.toString().trim()).filter(Boolean))];
      setTargetUniqueValues(uniqueVals);
      if (uniqueVals.length > 0) setFavorableOutcome(uniqueVals[0]);
    } else {
      setTargetUniqueValues([]);
      setFavorableOutcome('');
    }
  }, [targetAttribute, data]);

  // Extract unique values for Sensitive Attribute
  useEffect(() => {
    if (sensitiveAttribute && data) {
      const uniqueVals = [...new Set(data.map(row => row[sensitiveAttribute]?.toString().trim()).filter(Boolean))];
      setSensitiveUniqueValues(uniqueVals);
      if (uniqueVals.length > 0) {
        setPrivilegedGroup(uniqueVals[0]);
        setUnprivilegedGroup(uniqueVals[1] || uniqueVals[0]);
      }
    } else {
      setSensitiveUniqueValues([]);
      setPrivilegedGroup('');
      setUnprivilegedGroup('');
    }
  }, [sensitiveAttribute, data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfigSubmit({
      targetAttribute,
      favorableOutcome,
      sensitiveAttribute,
      privilegedGroup,
      unprivilegedGroup
    });
  };

  const isSameAttribute = targetAttribute && sensitiveAttribute && targetAttribute === sensitiveAttribute;

  return (
    <motion.div 
      className="glass-panel animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Settings color="var(--accent-color)" /> 
        Configure Analysis
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          {/* Target Variable Section */}
          <div>
            <div className="input-group">
              <label className="input-label">Target Variable (Prediction)</label>
              <select 
                className="select-input" 
                value={targetAttribute} 
                onChange={(e) => setTargetAttribute(e.target.value)}
                required
              >
                <option value="" disabled>Select Target Column</option>
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>

            {targetAttribute && (
              <div className="input-group">
                <label className="input-label">Favorable Outcome (e.g., Granted, &gt;50K)</label>
                <select 
                  className="select-input" 
                  value={favorableOutcome} 
                  onChange={(e) => setFavorableOutcome(e.target.value)}
                  required
                >
                  {targetUniqueValues.map(val => <option key={val} value={val}>{val}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Sensitive Attribute Section */}
          <div>
            <div className="input-group">
              <label className="input-label">Sensitive Attribute (e.g., Gender, Race)</label>
              <select 
                className="select-input" 
                value={sensitiveAttribute} 
                onChange={(e) => setSensitiveAttribute(e.target.value)}
                required
              >
                <option value="" disabled>Select Sensitive Column</option>
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>

            {sensitiveAttribute && (
              <>
                <div className="input-group">
                  <label className="input-label">Privileged Group</label>
                  <select 
                    className="select-input" 
                    value={privilegedGroup} 
                    onChange={(e) => setPrivilegedGroup(e.target.value)}
                    required
                  >
                    {sensitiveUniqueValues.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Unprivileged Group</label>
                  <select 
                    className="select-input" 
                    value={unprivilegedGroup} 
                    onChange={(e) => setUnprivilegedGroup(e.target.value)}
                    required
                  >
                    {sensitiveUniqueValues.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {isSameAttribute && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid var(--danger-color)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle color="var(--danger-color)" size={18} />
            <span style={{ color: 'var(--danger-color)' }}>Target Variable and Sensitive Attribute cannot be the same column. Please select distinct columns.</span>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={!targetAttribute || !favorableOutcome || !sensitiveAttribute || !privilegedGroup || !unprivilegedGroup || isSameAttribute}
        >
          Calculate Bias Metrics
        </button>
      </form>
    </motion.div>
  );
}
