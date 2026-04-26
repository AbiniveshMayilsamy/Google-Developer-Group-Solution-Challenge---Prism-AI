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
import { ArrowLeft, FileText } from 'lucide-react';

export default function AnalyzeResults() {
  const [metrics, setMetrics] = useState(null);
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMetrics = localStorage.getItem('current_analysis_metrics');
    const storedConfig = localStorage.getItem('current_analysis_config');

    if (storedMetrics && storedConfig) {
      setMetrics(JSON.parse(storedMetrics));
      setConfig(JSON.parse(storedConfig));
    } else {
      navigate('/analyze/new');
    }
  }, [navigate]);

  if (!metrics || !config) return null;

  const handleFixComplete = () => {
    setMetrics(prev => ({
      ...prev,
      disparateImpact: 1.0,
      statisticalParity: 0
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-container"
    >
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <Link to="/analyze/new" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Config
          </Link>
          <h1 style={{ color: 'var(--accent-color)' }}>Analysis Results</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Target: {config.targetAttribute} | Sensitive: {config.sensitiveAttribute}</p>
        </div>
        <button className="btn-secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} /> Generate Compliance Report
        </button>
      </div>

      <DashboardCards metrics={metrics} />
      <div style={{ marginTop: '3rem' }}>
        <FairnessMeter score={metrics.disparateImpact} metricName="Disparate Impact (DI)" />
      </div>
      <FairnessCharts metrics={metrics} config={config} />
      
      <FairnessSlider currentMetrics={metrics} onMetricsUpdate={setMetrics} />
      
      <GeospatialMap />

      <WhatIfSandbox config={config} />
      <BiasFixer onComplete={handleFixComplete} />
      
      <Recommendations metrics={metrics} config={config} />
    </motion.div>
  );
}
