import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import ManualDataEntry from '../components/ManualDataEntry';
import AttributeSelector from '../components/AttributeSelector';
import { calculateBiasMetrics } from '../utils/biasMetrics';
import { useAuth } from '../contexts/AuthContext';

export default function AnalyzeNew() {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [entryMode, setEntryMode] = useState('csv'); // 'csv' or 'manual'
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleDataLoaded = (parsedData, parsedColumns) => {
    setData(parsedData);
    setColumns(parsedColumns);
  };

  const handleConfigSubmit = async (config) => {
    const metrics = calculateBiasMetrics(data, config);
    const status = metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25 ? 'Fair' : 'Biased';

    try {
      await fetch('http://127.0.0.1:5001/api/audits/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          datasetName: entryMode === 'csv' ? 'Uploaded CSV' : 'Manual Entry',
          targetAttribute: config.targetAttribute,
          sensitiveAttribute: config.sensitiveAttribute,
          metrics,
          status
        })
      });
    } catch (error) {
      console.error('Failed to save audit history:', error);
    }

    localStorage.setItem('current_analysis_metrics', JSON.stringify(metrics));
    localStorage.setItem('current_analysis_config', JSON.stringify(config));
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
              onClick={() => setEntryMode('csv')}
            >
              Upload CSV
            </button>
            <button 
              className={entryMode === 'manual' ? 'btn-primary' : 'btn-secondary'} 
              onClick={() => setEntryMode('manual')}
            >
              Manual Entry
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
            <h3 style={{ color: 'var(--success-color)' }}>Dataset Loaded Successfully</h3>
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
