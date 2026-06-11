import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Cpu, ShieldCheck, AlertTriangle, ArrowRight, Activity, Percent, Cloud, Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { apiPost } from '../utils/api';

export default function ModelTrainer({ config, data }) {
  const [algorithm, setAlgorithm] = useState('none');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);
  const [results, setResults] = useState(null);

  // Dynamic GCP Vertex State
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'gcp'
  const [gcpCode, setGcpCode] = useState('');
  const [loadingGcp, setLoadingGcp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gcpError, setGcpError] = useState('');

  const calculateBaseBias = () => {
    if (!data || data.length === 0 || !config) return { di: 0.65, spd: -0.25 };
    
    // Calculate current dataset disparate impact and statistical parity difference
    const { targetAttribute, favorableOutcome, sensitiveAttribute, privilegedGroup, unprivilegedGroup } = config;
    
    let privTotal = 0, privFav = 0, unprivTotal = 0, unprivFav = 0;
    
    data.forEach(row => {
      const sensitiveVal = row[sensitiveAttribute]?.toString().trim();
      const targetVal = row[targetAttribute]?.toString().trim();
      const isFav = targetVal === favorableOutcome;
      
      if (sensitiveVal === privilegedGroup) {
        privTotal++;
        if (isFav) privFav++;
      } else if (sensitiveVal === unprivilegedGroup) {
        unprivTotal++;
        if (isFav) unprivFav++;
      }
    });
    
    const privRate = privTotal > 0 ? privFav / privTotal : 0.6;
    const unprivRate = unprivTotal > 0 ? unprivFav / unprivTotal : 0.35;
    
    return {
      di: privRate > 0 ? unprivRate / privRate : 0.6,
      spd: unprivRate - privRate
    };
  };

  const runTraining = () => {
    setIsTraining(true);
    setTrainingStep(0);
  };

  useEffect(() => {
    if (!isTraining) return;

    if (trainingStep < 3) {
      const timer = setTimeout(() => {
        setTrainingStep(s => s + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsTraining(false);
      const baseBias = calculateBaseBias();
      
      // Calculate outputs based on selected mitigation algorithm
      let accuracy, di, spd, tradeOffRating;
      
      const rand = (min, max) => Math.random() * (max - min) + min;
      
      switch (algorithm) {
        case 'pre': // Reweighing
          accuracy = 86.8 - rand(0.5, 1.5);
          di = Math.min(1.02, baseBias.di + rand(0.25, 0.35));
          spd = baseBias.spd + rand(0.18, 0.23);
          tradeOffRating = 'Balanced (Optimal)';
          break;
        case 'in': // Adversarial
          accuracy = 84.2 - rand(1.0, 2.5);
          di = Math.min(1.05, baseBias.di + rand(0.32, 0.42));
          spd = baseBias.spd + rand(0.22, 0.28);
          tradeOffRating = 'High Fairness (Accuracy Penalty)';
          break;
        case 'post': // Reject Option Classification
          accuracy = 85.5 - rand(0.8, 2.0);
          di = Math.min(1.00, baseBias.di + rand(0.28, 0.38));
          spd = baseBias.spd + rand(0.20, 0.25);
          tradeOffRating = 'Fair Outcomes (Slight Loss in Precision)';
          break;
        default: // No mitigation
          accuracy = 88.4;
          di = baseBias.di;
          spd = baseBias.spd;
          tradeOffRating = 'Unmitigated (Highly Biased)';
          break;
      }
      
      setResults({
        algorithm,
        accuracy: accuracy.toFixed(1),
        di: di.toFixed(2),
        spd: (spd * 100).toFixed(1),
        tradeOffRating
      });
    }
  }, [isTraining, trainingStep, algorithm, data]);

  const handleGenerateGCP = async () => {
    setLoadingGcp(true);
    setGcpError('');
    try {
      const baseBias = calculateBaseBias();
      const res = await apiPost('/api/ai/vertex-pipeline', {
        metrics: { disparateImpact: baseBias.di, statisticalParityDifference: baseBias.spd },
        config
      });
      setGcpCode(res.code);
    } catch (err) {
      setGcpError(err.message || 'Failed to generate Vertex AI code pipeline.');
    } finally {
      setLoadingGcp(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gcpCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    let cleanCode = gcpCode;
    if (cleanCode.includes('```python')) {
      cleanCode = cleanCode.split('```python')[1].split('```')[0].trim();
    } else if (cleanCode.includes('```')) {
      cleanCode = cleanCode.split('```')[1].split('```')[0].trim();
    }
    const blob = new Blob([cleanCode], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vertex_fair_pipeline.py`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const steps = [
    'Vectorizing data attributes...',
    'Fitting model Decision Tree weights...',
    'Optimizing fairness regularization constraints...',
    'Done!'
  ];

  return (
    <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
          <BrainCircuit size={22} color="var(--accent-secondary)" /> Dedicated AI Model Training & Mitigation MLOps
        </h3>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`code-tab-button ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Cpu size={14} /> Training Simulator
          </button>
          <button 
            className={`code-tab-button ${activeTab === 'gcp' ? 'active' : ''}`}
            onClick={() => setActiveTab('gcp')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Cloud size={14} /> GCP Vertex AI Pipeline
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'simulator' ? (
          <motion.div 
            key="simulator" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Transition from data inspection to active model creation. Train a simulated classification model (e.g. Logistic Regression/Random Forest) on this dataset and apply mathematical fairness constraints to evaluate the trade-off.
            </p>

            <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
              {/* Model Configuration Form */}
              <div>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Select Mitigation Algorithm</label>
                  <select 
                    className="select-input"
                    value={algorithm}
                    onChange={(e) => {
                      setAlgorithm(e.target.value);
                      setResults(null); // clear results when algorithm changes
                    }}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)' }}
                  >
                    <option value="none">No Mitigation (Baseline Classifier)</option>
                    <option value="pre">Pre-processing (Sample Reweighing)</option>
                    <option value="in">In-processing (Adversarial Fair Constraint)</option>
                    <option value="post">Post-processing (Reject Option Threshold Classifier)</option>
                  </select>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--panel-border)', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  {algorithm === 'none' && (
                    <p>Trains a standard classifier maximizing accuracy. This replicates historical bias patterns since it does not penalize discrimination on <strong>{config.sensitiveAttribute}</strong>.</p>
                  )}
                  {algorithm === 'pre' && (
                    <p>Calculates statistical weights for each sample in the dataset before training. Increases weights for unprivileged positive outcomes and privileged rejections to enforce statistical parity during model fit.</p>
                  )}
                  {algorithm === 'in' && (
                    <p>Adds a secondary neural predictor that acts as an adversary, penalizing the main model whenever it predicts outcomes correlating with <strong>{config.sensitiveAttribute}</strong>. Enforces independence.</p>
                  )}
                  {algorithm === 'post' && (
                    <p>Creates a "reject option boundary" around the decision threshold (e.g., probability of 0.45 to 0.55). Flips the outcomes for underprivileged candidates within this zone to equalize selection rates.</p>
                  )}
                </div>

                <button 
                  className="btn-primary" 
                  onClick={runTraining} 
                  disabled={isTraining}
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Cpu size={16} /> {isTraining ? 'Training in Progress...' : 'Train & Fit Model'}
                </button>
              </div>

              {/* Model Results / Simulator Terminal */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '1.5rem', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                  {isTraining ? (
                    <motion.div 
                      key="training" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ textAlign: 'center' }}
                    >
                      <RefreshCw className="animate-spin" size={36} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Fitting Classifier...</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{steps[trainingStep]}</p>
                    </motion.div>
                  ) : results ? (
                    <motion.div 
                      key="results" 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
                    >
                      <div className="flex-between" style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
                          <ShieldCheck size={16} /> Model Fitted Successfully
                        </h4>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(0, 255, 204, 0.1)', color: 'var(--accent)', fontWeight: 600 }}>
                          {results.tradeOffRating}
                        </span>
                      </div>

                      <div className="grid-3" style={{ gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Accuracy</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)' }}>{results.accuracy}%</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Disparate Impact</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: Number(results.di) >= 0.8 ? '#34d399' : '#f87171' }}>{results.di}</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Parity Difference</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: Math.abs(Number(results.spd)) <= 10 ? '#34d399' : '#f87171' }}>{results.spd}%</div>
                        </div>
                      </div>

                      {results.algorithm !== 'none' && (
                        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0, 255, 204, 0.03)', border: '1px dashed rgba(0, 255, 204, 0.2)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-secondary)' }}>
                          <Activity size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ margin: 0 }}>
                            Compared to the Baseline model, applying this constraint has adjusted outcomes for <strong>{config.unprivilegedGroup}</strong>. Disparate Impact improved to <strong>{results.di}</strong> (closer to perfectly fair 1.0) with an accuracy trade-off of only <strong>{Math.abs(88.4 - Number(results.accuracy)).toFixed(1)}%</strong>.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <Cpu size={36} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
                      <p style={{ fontSize: '0.88rem' }}>Select an algorithm on the left and click <strong>"Train & Fit Model"</strong> to compile results.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="gcp" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Scale up to Google Cloud. Generate production-ready Python pipelines to set up Vertex AI dataset ingestion, apply bias-aware model constraints, register models to the Vertex Registry, deploy model endpoints, and track real-time telemetry using Google Cloud Logging.
            </p>

            {gcpError && (
              <div style={{ color: '#f87171', padding: '0.85rem', background: 'rgba(248,113,113,0.08)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {gcpError}
              </div>
            )}

            {!gcpCode && !loadingGcp && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px dashed var(--panel-border)' }}>
                <Cloud size={48} color="var(--accent-secondary)" style={{ margin: '0 auto 1.5rem', opacity: 0.6 }} />
                <h4 style={{ marginBottom: '0.5rem' }}>Generate GCP Vertex AI Training Pipeline</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem' }}>
                  Analyze target column <strong>{config?.targetAttribute}</strong> and sensitive column <strong>{config?.sensitiveAttribute}</strong> to generate a custom, deployable cloud pipeline script.
                </p>
                <button className="btn-primary" onClick={handleGenerateGCP}>
                  <Sparkles size={16} /> Compile Vertex AI Code Pipeline
                </button>
              </div>
            )}

            {loadingGcp && (
              <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
                <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1.25rem', color: 'var(--accent)' }} />
                <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Invoking Gemini AI Agent...</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gemini is designing a custom Google Vertex AI pipeline and Google Cloud Logging configurations...</p>
              </div>
            )}

            {gcpCode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.9rem', fontWeight: 600 }}>
                    <ShieldCheck size={16} /> Production Script Generated
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={copyToClipboard} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                      {copied ? <Check size={12} color="var(--accent)" /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy Code'}
                    </button>
                    <button className="btn-secondary" onClick={handleDownloadCode} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                      <Download size={12} /> Download .py Script
                    </button>
                  </div>
                </div>

                <pre className="code-block" style={{ maxHeight: '380px', overflowY: 'auto', margin: 0 }}>
                  <code>{gcpCode}</code>
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline Spinner replacement
function RefreshCw({ className, size, style }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      style={style} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}
