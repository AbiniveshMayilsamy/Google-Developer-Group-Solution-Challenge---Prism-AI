import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import ManualDataEntry from '../components/ManualDataEntry';
import AttributeSelector from '../components/AttributeSelector';
import { calculateBiasMetrics } from '../utils/biasMetrics';
import { apiPost } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { indianHiringDataset } from '../utils/indianHiringDataset';

export default function AnalyzeNew() {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [entryMode, setEntryMode] = useState('csv'); // 'csv', 'manual', or 'indian'
  const navigate = useNavigate();

  const { user } = useAuth();

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
      await apiPost('/api/audits/save', {
        datasetName: entryMode === 'csv' ? 'Uploaded CSV' : 'Manual Entry',
        targetAttribute: config.targetAttribute,
        sensitiveAttribute: config.sensitiveAttribute,
        metrics,
        status
      });
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
      style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '4rem' }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>New Bias Analysis</h1>
      
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
