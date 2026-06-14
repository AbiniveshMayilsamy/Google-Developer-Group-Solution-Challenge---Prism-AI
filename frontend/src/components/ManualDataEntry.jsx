import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ManualDataEntry({ onDataLoaded }) {
  const { terms } = useTheme();
  const [preset, setPreset] = useState('custom');
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Male', total: 100, approved: 70, isPrivileged: true },
    { id: 2, name: 'Female', total: 100, approved: 40, isPrivileged: false }
  ]);

  const handlePresetChange = (presetName) => {
    setPreset(presetName);
    switch(presetName) {
      case 'gender':
        setCategories([
          { id: 1, name: 'Male', total: 120, approved: 84, isPrivileged: true },
          { id: 2, name: 'Female', total: 120, approved: 48, isPrivileged: false }
        ]);
        break;
      case 'caste':
        setCategories([
          { id: 1, name: 'General Category', total: 100, approved: 70, isPrivileged: true },
          { id: 2, name: 'Reserved Category (SC/ST/OBC)', total: 100, approved: 35, isPrivileged: false }
        ]);
        break;
      case 'region':
        setCategories([
          { id: 1, name: 'North Indian', total: 110, approved: 77, isPrivileged: true },
          { id: 2, name: 'South Indian (Migrants)', total: 110, approved: 44, isPrivileged: false }
        ]);
        break;
      case 'dialect':
        setCategories([
          { id: 1, name: 'Standard Accent', total: 100, approved: 75, isPrivileged: true },
          { id: 2, name: 'Regional Accent', total: 100, approved: 30, isPrivileged: false }
        ]);
        break;
      default:
        break;
    }
  };

  const addCategory = () => {
    setPreset('custom');
    setCategories([
      ...categories,
      { id: Date.now(), name: `Group ${String.fromCharCode(65 + categories.length)}`, total: 100, approved: 50, isPrivileged: false }
    ]);
  };

  const removeCategory = (id) => {
    setPreset('custom');
    if (categories.length > 2) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const updateCategory = (id, field, value) => {
    setPreset('custom');
    setCategories(categories.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const setPrivileged = (id) => {
    setCategories(categories.map(c => 
      ({ ...c, isPrivileged: c.id === id })
    ));
  };

  const handleAnalyze = () => {
    const generatedData = [];
    
    categories.forEach(cat => {
      for (let i = 0; i < cat.total; i++) {
        generatedData.push({
          'Demographic': cat.name,
          'Outcome': i < cat.approved ? 'Approved' : 'Rejected'
        });
      }
    });

    onDataLoaded(generatedData, ['Demographic', 'Outcome']);
  };

  return (
    <motion.div 
      className="glass-panel animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Calculator color="var(--accent-secondary)" /> 
          Advanced Demographic Builder
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Define multiple demographic categories, their population sizes, and success rates. Select the radio button to designate the Privileged (Baseline) group.
        </p>
      </div>

      <div className="input-group" style={{ marginBottom: '2rem', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
        <label className="input-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.5rem' }}>Select Local Bias Scenario</label>
        <select 
          className="select-input" 
          value={preset} 
          onChange={(e) => handlePresetChange(e.target.value)}
          style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.2)' }}
        >
          <option value="custom">Custom (Manually Edit Categories)</option>
          <option value="gender">Gender Equity Scenario (Male vs Female)</option>
          <option value="caste">Caste Discrimination Scenario (General vs Reserved)</option>
          <option value="region">Regional Bias Scenario (North vs South Indian)</option>
          <option value="dialect">Dialect/Accent Bias Scenario (Standard vs Regional Accent)</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ 
                background: cat.isPrivileged ? 'rgba(0, 255, 204, 0.05)' : 'rgba(255, 255, 255, 0.02)', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                border: `1px solid ${cat.isPrivileged ? 'rgba(0, 255, 204, 0.2)' : 'rgba(255,255,255,0.1)'}`,
                marginBottom: '1rem',
                position: 'relative'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="radio" 
                    name="privilegedGroup" 
                    checked={cat.isPrivileged}
                    onChange={() => setPrivileged(cat.id)}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-color)' }}
                  />
                  <span style={{ color: cat.isPrivileged ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                    {cat.isPrivileged ? 'Privileged Group (Baseline)' : 'Unprivileged Group'}
                  </span>
                </div>
                
                <button 
                  onClick={() => removeCategory(cat.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: categories.length > 2 ? 'pointer' : 'not-allowed', opacity: categories.length > 2 ? 1 : 0.3 }}
                  disabled={categories.length <= 2}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid-3" style={{ gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Category Name</label>
                  <input 
                    type="text" 
                    className="text-input" 
                    value={cat.name}
                    onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total {terms.population}</label>
                  <input 
                    type="number" 
                    className="text-input" 
                    value={cat.total}
                    onChange={(e) => updateCategory(cat.id, 'total', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{terms.positive} Outcomes</label>
                  <input 
                    type="number" 
                    className="text-input" 
                    value={cat.approved}
                    onChange={(e) => updateCategory(cat.id, 'approved', parseInt(e.target.value) || 0)}
                    max={cat.total}
                    min="0"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          className="btn-secondary" 
          onClick={addCategory} 
          style={{ width: '100%', padding: '1rem', borderStyle: 'dashed', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <button className="btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }} onClick={handleAnalyze}>
        Generate & Analyze Data
      </button>
    </motion.div>
  );
}
