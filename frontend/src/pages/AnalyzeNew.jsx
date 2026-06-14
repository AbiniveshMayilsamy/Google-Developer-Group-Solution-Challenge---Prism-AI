import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import ManualDataEntry from '../components/ManualDataEntry';
import AttributeSelector from '../components/AttributeSelector';
import { calculateBiasMetrics } from '../utils/biasMetrics';
import { apiPost } from '../utils/api';
import { indianHiringDataset } from '../utils/indianHiringDataset';

export default function AnalyzeNew() {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [entryMode, setEntryMode] = useState('csv'); // 'csv', 'manual', or 'indian'
  const navigate = useNavigate();

  const handleDataLoaded = (parsedData, parsedColumns) => {
    setData(parsedData);
    setColumns(parsedColumns);
  };

  const handleLoadIndianDataset = () => {
    setEntryMode('indian');
    const cols = ['Candidate_ID', 'Name', 'State_of_Origin', 'Caste_Category', 'Dialect_Accent', 'Experience_Years', 'Assessment_Score', 'Outcome'];
    handleDataLoaded(indianHiringDataset, cols);
  };

  const handleConfigSubmit = async (config) => {
    const metrics = calculateBiasMetrics(data, config);
    const status = metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25 ? 'Fair' : 'Biased';

    try {
      const saved = await apiPost('/api/audits/save', {
        datasetName: entryMode === 'csv' ? 'Uploaded CSV' : entryMode === 'indian' ? 'Indian Hiring Dataset' : 'Manual Entry',
        targetAttribute: config.targetAttribute,
        sensitiveAttribute: config.sensitiveAttribute,
        metrics,
        status
      });
      if (saved?._id) {
        sessionStorage.setItem('current_analysis_audit_id', saved._id);
      }
    } catch (error) {
      console.error('Failed to save audit:', error.message);
    }

    localStorage.setItem('current_analysis_metrics', JSON.stringify(metrics));
    localStorage.setItem('current_analysis_config', JSON.stringify(config));
    sessionStorage.setItem('current_analysis_data', JSON.stringify(data));
    sessionStorage.setItem('current_analysis_columns', JSON.stringify(columns));
    navigate('/analyze/results');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-container"
      style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '6rem' }}
    >
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
          <span>[01] Dataset Audit</span>
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
          marginBottom: '1rem'
        }}>
          New Bias <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Analysis</em>
          </span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>Upload or select a dataset to simulate automated fairness and disparity indexes.</p>
      </div>
      
      {!data ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              className={entryMode === 'csv' ? 'btn-primary' : 'btn-secondary'} 
              onClick={() => { setEntryMode('csv'); setData(null); }}
            >
              Upload CSV
            </button>
            <button 
              className={entryMode === 'manual' ? 'btn-primary' : 'btn-secondary'} 
              onClick={() => { setEntryMode('manual'); setData(null); }}
            >
              Manual Entry
            </button>
            <button 
              className={entryMode === 'indian' ? 'btn-primary' : 'btn-secondary'} 
              onClick={handleLoadIndianDataset}
            >
              🇮🇳 Load Indian Dataset
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {entryMode === 'csv' ? (
              <motion.div key="csv" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <FileUpload onDataLoaded={handleDataLoaded} />
              </motion.div>
            ) : (
              <motion.div key="manual" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ManualDataEntry onDataLoaded={handleDataLoaded} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#34d399' }}>Dataset Loaded Successfully ✓</h3>
            <button className="btn-secondary" onClick={() => setData(null)}>Change File</button>
          </div>
          <AttributeSelector 
            columns={columns} 
            data={data} 
            onConfigSubmit={handleConfigSubmit} 
          />
        </div>
      )}
    </motion.div>
  );
}
