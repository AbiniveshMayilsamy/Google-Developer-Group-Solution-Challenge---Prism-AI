import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardCards from '../components/Dashboard';
import FairnessCharts from '../components/FairnessCharts';
import FairnessMeter from '../components/FairnessMeter';
import WhatIfSandbox from '../components/WhatIfSandbox';
import BiasFixer from '../components/BiasFixer';
import FairnessSlider from '../components/FairnessSlider';
import GeospatialMap from '../components/GeospatialMap';
import Recommendations from '../components/Recommendations';
import ModelTrainer from '../components/ModelTrainer';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { calculateBiasMetrics, balanceDataset } from '../utils/biasMetrics';
import Papa from 'papaparse';

export default function AnalyzeResults() {
  const [metrics, setMetrics] = useState(null);
  const [config, setConfig] = useState(null);
  const [dataset, setDataset] = useState([]);
  const [hasBalanced, setHasBalanced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMetrics = localStorage.getItem('current_analysis_metrics');
    const storedConfig = localStorage.getItem('current_analysis_config');
    const storedData = sessionStorage.getItem('current_analysis_data');

    if (storedMetrics && storedConfig) {
      setMetrics(JSON.parse(storedMetrics));
      setConfig(JSON.parse(storedConfig));
      if (storedData) {
        setDataset(JSON.parse(storedData));
      }
    } else {
      navigate('/analyze/new');
    }
  }, [navigate]);

  if (!metrics || !config) return null;

  const handleFixComplete = () => {
    // Balance dataset in memory
    const balancedData = balanceDataset(dataset, config);
    // Recalculate true metrics
    const balancedMetrics = calculateBiasMetrics(balancedData, config);

    // Save balanced dataset in sessionStorage
    setDataset(balancedData);
    sessionStorage.setItem('current_analysis_data', JSON.stringify(balancedData));

    // Save balanced metrics to state & localStorage
    setMetrics(balancedMetrics);
    localStorage.setItem('current_analysis_metrics', JSON.stringify(balancedMetrics));

    setHasBalanced(true);
  };

  const handleDownload = () => {
    // Remove temporary flags
    const cleanData = dataset.map(({ _synthetic, ...rest }) => rest);
    const csv = Papa.unparse(cleanData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prism_mitigated_${config.sensitiveAttribute}_${config.targetAttribute}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <Link to="/analyze/new" style={{ color: 'var(--text-2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Config
          </Link>
          <h1>Analysis Results</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.88rem' }}>Target: <strong style={{color:'var(--text-1)'}}>{config.targetAttribute}</strong> · Sensitive: <strong style={{color:'var(--text-1)'}}>{config.sensitiveAttribute}</strong></p>
        </div>
        <button className="btn-secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} /> Generate Compliance Report
        </button>
      </div>

      <DashboardCards metrics={metrics} />
      <div style={{ marginTop: '3rem' }}>
        <FairnessMeter metrics={metrics} />
      </div>

      {hasBalanced && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
        >
          <button className="btn-primary" onClick={handleDownload} style={{ fontSize: '1rem', padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Download size={22} /> Export Mitigated Balanced CSV
          </button>
        </motion.div>
      )}

      <FairnessCharts metrics={metrics} config={config} />
      
      <FairnessSlider currentMetrics={metrics} onMetricsUpdate={(updated) => {
        setMetrics(updated);
        localStorage.setItem('current_analysis_metrics', JSON.stringify(updated));
      }} />
      
      <GeospatialMap />

      <WhatIfSandbox config={config} data={dataset} />
      <BiasFixer onComplete={handleFixComplete} />
      <ModelTrainer config={config} data={dataset} />
      <Recommendations metrics={metrics} config={config} />
    </motion.div>
  );
}
