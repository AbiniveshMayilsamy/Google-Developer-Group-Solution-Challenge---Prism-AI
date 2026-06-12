import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Users, ShieldAlert, Sparkles, Scale, Info, RefreshCw } from 'lucide-react';
import { apiPost } from '../../utils/api';

const COLORS = ['var(--accent)', 'var(--accent-2)', '#fb923c', '#f87171', '#34d399'];

// Mock distributions data for HR
const genderData = [
  { name: 'Male', applicants: 85, hired: 62, rate: '72%' },
  { name: 'Female', applicants: 65, hired: 24, rate: '36%' }
];

const languageData = [
  { name: 'Standard Accent', hired: 72, rate: 0.8 },
  { name: 'Regional Accent', hired: 18, rate: 0.25 }
];

const regionData = [
  { name: 'North India', rate: 75, baseline: 70 },
  { name: 'South India', rate: 58, baseline: 70 },
  { name: 'East India', rate: 42, baseline: 70 },
  { name: 'West India', rate: 68, baseline: 70 }
];

export default function Hiring() {
  // Candidate evaluator simulator
  const [candidate, setCandidate] = useState({
    name: 'Ananya Mayil',
    dialectAccent: 'Regional Accent',
    casteCategory: 'Reserved',
    interviewScore: 75
  });

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerEvaluation = async () => {
    setLoading(true);
    try {
      const res = await apiPost('/api/integration/evaluate-hiring', candidate);
      setEvaluation(res);
    } catch (e) {
      console.error(e);
      // Local fallback in case backend is loading
      setEvaluation({
        candidateName: candidate.name,
        score: candidate.interviewScore,
        decision: candidate.interviewScore >= 90 ? 'Hired' : 'Rejected',
        biasRisk: 'High',
        reasons: ['Dialect/Accent Bias (Regional accent detected)', 'Caste Bias (Reserved category detected)'],
        mitigationAlert: true,
        actionRecommended: 'WARNING: The system detected potential bias influencing the outcome. Review candidate blindly without Caste and Dialect attributes.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      
      {/* Title */}
      <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users /> Hiring & Recruitment Portal
          </h1>
          <p style={{ color: 'var(--text-2)' }}>Auditing systemic linguistic, caste, and demographic disparity in candidate screening</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Gender Distribution */}
        <div className="glass-panel" style={{ height: '350px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Gender Approval Rates
          </h3>
          <ResponsiveContainer width="100%" height="82%">
            <BarChart data={genderData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-2)" />
              <YAxis stroke="var(--text-2)" />
              <Tooltip contentStyle={{ background: '#0d0d0f', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="applicants" name="Total Applied" fill="rgba(255,255,255,0.05)" stroke="var(--border)" strokeWidth={1} />
              <Bar dataKey="hired" name="Shortlisted / Hired" fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accent/Dialect Bias Chart */}
        <div className="glass-panel" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Dialect / Accent Disparity (Ratio)</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="hired"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d0d0f', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Bias Chart */}
        <div className="glass-panel" style={{ height: '350px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Regional Diversity Scores (%)</h3>
          <ResponsiveContainer width="100%" height="82%">
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-2)" />
              <YAxis stroke="var(--text-2)" />
              <Tooltip contentStyle={{ background: '#0d0d0f', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="rate" name="Regional Hires" fill="var(--accent-2)" />
              <Bar dataKey="baseline" name="Target Baseline" fill="rgba(255,255,255,0.08)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Interactive Candidate Evaluator Sandbox */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem', border: '1px solid var(--border-hover)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '0.35rem 0.85rem', borderRadius: '100px', width: 'fit-content', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Sparkles size={14} /> Recruitment Integration Simulator
        </div>
        <h2 style={{ marginBottom: '1rem' }}>Algorithmic Screening Evaluator</h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '2rem', maxWidth: '800px', fontSize: '0.92rem' }}>
          Simulate an incoming Zoho People/Keka HR integration request. See how regional accents and reservation categories affect decision boundaries, triggering bias penalties in automated shortlisting.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Candidate Name</label>
              <input type="text" className="text-input" value={candidate.name} onChange={e => setCandidate({ ...candidate, name: e.target.value })} />
            </div>
            
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Caste Category (Demographic proxy)</label>
              <select className="select-input" value={candidate.casteCategory} onChange={e => setCandidate({ ...candidate, casteCategory: e.target.value })}>
                <option value="General">General Category</option>
                <option value="Reserved">Reserved Category</option>
              </select>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Dialect & Accent</label>
              <select className="select-input" value={candidate.dialectAccent} onChange={e => setCandidate({ ...candidate, dialectAccent: e.target.value })}>
                <option value="Standard">Standard / English Accent</option>
                <option value="Regional Accent">Regional / Indian Native Accent</option>
              </select>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Raw Interview/Assessment Score (0-100)</label>
              <input type="number" className="text-input" min="0" max="100" value={candidate.interviewScore} onChange={e => setCandidate({ ...candidate, interviewScore: Number(e.target.value) })} />
            </div>

            <button className="btn-primary" onClick={triggerEvaluation} disabled={loading} style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
              {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Submit Zoho/HR API Inference'}
            </button>
          </div>

          {/* Results Output */}
          <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '260px' }}>
            {evaluation ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex-between">
                  <h3 style={{ color: 'var(--text-1)' }}>{evaluation.candidateName}</h3>
                  <span style={{
                    padding: '0.2rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                    background: evaluation.decision === 'Hired' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                    color: evaluation.decision === 'Hired' ? '#34d399' : 'var(--danger)'
                  }}>
                    {evaluation.decision.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>Bias Risk Rating:</span>
                  <span style={{ fontWeight: 800, color: evaluation.biasRisk === 'High' ? 'var(--danger)' : '#34d399' }}>
                    {evaluation.biasRisk} Risk
                  </span>
                </div>

                {evaluation.reasons && evaluation.reasons.length > 0 && (
                  <div style={{ padding: '0.75rem', background: 'rgba(248,113,113,0.06)', borderRadius: '6px', borderLeft: '3px solid var(--danger)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.25rem' }}>
                      Detected Penalties:
                    </div>
                    {evaluation.reasons.map((r, idx) => (
                      <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>• {r}</div>
                    ))}
                  </div>
                )}

                {evaluation.mitigationAlert && (
                  <div style={{ padding: '0.75rem', background: 'rgba(168,85,247,0.06)', borderRadius: '6px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <Scale size={12} /> Gemini Ethical Recommendation:
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', lineHeight: 1.4 }}>
                      {evaluation.actionRecommended}
                    </div>
                  </div>
                )}

              </motion.div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-3)' }}>
                <Info size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.82rem' }}>Fill in candidate metrics and submit inference to trigger fairness checks.</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </motion.div>
  );
}
