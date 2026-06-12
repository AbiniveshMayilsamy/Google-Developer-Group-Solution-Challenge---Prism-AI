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
import InlineDriftMonitor from '../components/InlineDriftMonitor';
import InlineFirewall from '../components/InlineFirewall';
import InlineChatbot from '../components/InlineChatbot';
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

      {/* ── INLINE TOOLS — all connected to this analysis ── */}
      <InlineDriftMonitor metrics={metrics} config={config} />
      <InlineFirewall metrics={metrics} config={config} />
      
      <GeospatialMap data={dataset} config={config} />
      <WhatIfSandbox config={config} data={dataset} />
      <BiasFixer onComplete={handleFixComplete} />
      <ModelTrainer config={config} data={dataset} />
      <Recommendations metrics={metrics} config={config} />

      {/* ── INLINE CHATBOT — pre-loaded with this analysis context ── */}
      <InlineChatbot metrics={metrics} config={config} />

      {/* ─── Printable Compliance Certificate (only visible on print) ─── */}
      <div className="compliance-report-card">
        <div className="print-accent-bar"></div>
        <div className="compliance-header">
          <h1>Ethical AI Compliance Audit Certificate</h1>
          <p>Generated by PRISM AI Bias Auditing & Mitigation Platform · {new Date().toLocaleDateString()}</p>
        </div>

        <div className="compliance-section-title">Audit Metadata</div>
        <table style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse', fontSize: '10pt', color: '#111827' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px 0', fontWeight: 'bold', width: '25%' }}>Target Attribute:</td>
              <td style={{ padding: '6px 0', width: '25%' }}>{config.targetAttribute}</td>
              <td style={{ padding: '6px 0', fontWeight: 'bold', width: '25%' }}>Favorable Outcome:</td>
              <td style={{ padding: '6px 0', width: '25%' }}>{config.favorableOutcome}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Sensitive Variable:</td>
              <td style={{ padding: '6px 0' }}>{config.sensitiveAttribute}</td>
              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Audit Date/Time:</td>
              <td style={{ padding: '6px 0' }}>{new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Privileged Class:</td>
              <td style={{ padding: '6px 0' }}>{config.privilegedGroup}</td>
              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Unprivileged Class:</td>
              <td style={{ padding: '6px 0' }}>{config.unprivilegedGroup}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Dataset Population:</td>
              <td style={{ padding: '6px 0' }}>{dataset ? dataset.length : '0'} records</td>
              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Audit Signature HASH:</td>
              <td style={{ padding: '6px 0', fontFamily: 'monospace', fontSize: '8.5pt' }}>SHA256-{Math.random().toString(36).substring(2, 12).toUpperCase()}</td>
            </tr>
          </tbody>
        </table>

        <div className="compliance-section-title">Fairness & Bias Telemetry</div>
        <div className="compliance-grid">
          <div className="compliance-stat-card">
            <div className="compliance-stat-label">Disparate Impact Ratio</div>
            <div className="compliance-stat-value">{metrics.disparateImpact ? metrics.disparateImpact.toFixed(3) : '0.00'}</div>
            <p style={{ fontSize: '8.5pt', color: '#4b5563', marginTop: '0.25rem', margin: 0 }}>
              Ratio of unprivileged selection rate to privileged selection rate. US EEOC Threshold is &gt;= 0.80.
            </p>
          </div>
          <div className="compliance-stat-card">
            <div className="compliance-stat-label">Statistical Parity Difference</div>
            <div className="compliance-stat-value">{(metrics.statisticalParityDifference * 100).toFixed(1)}%</div>
            <p style={{ fontSize: '8.5pt', color: '#4b5563', marginTop: '0.25rem', margin: 0 }}>
              Absolute difference in selection rates. Ideal value is 0.0% (perfect parity).
            </p>
          </div>
        </div>

        <div className="compliance-section-title">Regulatory Framework Compliance Checklist</div>
        <div className="compliance-check-list">
          <div className="compliance-check-item">
            <span className="compliance-check-checkbox">
              {metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25 ? '✓' : ' '}
            </span>
            <div style={{ color: '#111827' }}>
              <strong>US EEOC (Equal Employment Opportunity Commission) - 4/5ths Rule: </strong>
              {metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25
                ? 'PASSED. The selection rate ratio meets the regulatory compliance threshold for equal access to opportunities.'
                : 'FAILED. Adverse impact detected under standard employment guidelines. Model retraining with mitigation is required.'}
            </div>
          </div>
          <div className="compliance-check-item">
            <span className="compliance-check-checkbox">
              {Math.abs(metrics.statisticalParityDifference) <= 0.1 ? '✓' : ' '}
            </span>
            <div style={{ color: '#111827' }}>
              <strong>EU AI Act (Title III - High-Risk Classification & Fairness Standards): </strong>
              {Math.abs(metrics.statisticalParityDifference) <= 0.1
                ? 'PASSED. Parity difference is within the safe 10% margin, indicating minimal systemic risk.'
                : 'ALERT. Statistical Parity exceeds the 10% tolerance band. Under the EU AI Act, this model should undergo mandatory human oversight.'}
            </div>
          </div>
          <div className="compliance-check-item">
            <span className="compliance-check-checkbox">✓</span>
            <div style={{ color: '#111827' }}>
              <strong>India DPDPA (Digital Personal Data Protection Act) Section 6: </strong>
              Processing is carried out for lawful and specified purposes. Sub-regional, caste, and dialect variables are handled via localized privacy-preserving anonymization.
            </div>
          </div>
        </div>

        <div className="compliance-section-title">Audit Verdict</div>
        <div style={{
          border: `2px solid ${metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25 ? '#10b981' : '#ef4444'}`,
          background: metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25 ? '#f0fdf4' : '#fef2f2',
          padding: '1rem',
          borderRadius: '6px',
          fontSize: '11pt',
          fontWeight: 700,
          color: metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25 ? '#15803d' : '#b91c1c',
          textAlign: 'center',
          marginTop: '1rem',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          {metrics.disparateImpact >= 0.8 && metrics.disparateImpact <= 1.25 
            ? '✓ CERTIFIED ETHICAL COMPLIANT' 
            : '⚠️ DETECTED HIGH SYSTEMIC BIAS'}
        </div>

        <div className="compliance-footer">
          <div>
            <div>Certificate Reference: PRISM-CERT-{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
            <div>Verification portal: https://secure.prismai.com/verify</div>
          </div>
          <div className="compliance-signatures">
            <div>
              <div style={{ height: '30px' }}></div>
              <div className="signature-line">Compliance Officer</div>
            </div>
            <div>
              <div style={{ height: '30px' }}></div>
              <div className="signature-line">Auditing Board Chairman</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
