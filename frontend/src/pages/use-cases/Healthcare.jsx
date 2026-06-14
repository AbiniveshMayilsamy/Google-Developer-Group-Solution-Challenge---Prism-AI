import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { HeartPulse, CheckCircle2, AlertCircle, Brain, Info } from 'lucide-react';

const COLORS = ['#34d399', '#f87171', '#fb923c', '#c084fc'];

// Mock diagnostic clinical data
const accuracyData = [
  { cohort: 'Age 18-35', accuracy: 96, errors: 4 },
  { cohort: 'Age 36-50', accuracy: 94, errors: 6 },
  { cohort: 'Age 51-65', accuracy: 91, errors: 9 },
  { cohort: 'Age 65+', accuracy: 78, errors: 22 }
];

const clinicalOutcomes = [
  { name: 'True Positives (Accurate Triage)', value: 85 },
  { name: 'False Negatives (Risk Gaps)', value: 15 }
];

export default function Healthcare() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-container">
      
      {/* Title */}
      <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartPulse /> Healthcare Analytics Portal
          </h1>
          <p style={{ color: 'var(--text-2)' }}>Demographic monitoring of clinical diagnostic algorithms, triage accuracy, and diagnostic bias explainability</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Diagnostic Accuracy Chart */}
        <div className="glass-panel" style={{ height: '360px', minWidth: 0 }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Triage AI Accuracy rate by Age Cohort (%)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="cohort" stroke="var(--text-2)" />
              <YAxis stroke="var(--text-2)" />
              <Tooltip contentStyle={{ background: '#0d0d0f', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="accuracy" name="True Positive Accuracy" fill="#34d399" />
              <Bar dataKey="errors" name="False Negative / Error Rate" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clinical outcomes distribution */}
        <div className="glass-panel" style={{ height: '360px', minWidth: 0 }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Overall Clinical Triage Errors</h3>
          <ResponsiveContainer width="100%" height="82%">
            <PieChart>
              <Pie
                data={clinicalOutcomes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {clinicalOutcomes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d0d0f', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Clinical Explainability Summary */}
      <div className="glass-panel" style={{ padding: '2.5rem', border: '1px solid var(--border-hover)' }}>
        <h2 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Brain color="var(--success-color)" /> Diagnostic AI Explainability Summary
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div style={{ padding: '1.25rem', background: 'rgba(248,113,113,0.06)', borderRadius: '12px', borderLeft: '4px solid #f87171' }}>
            <h4 style={{ color: 'var(--text-1)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={15} color="#f87171" /> Elderly Bias Risk (Age 65+)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.55 }}>
              False negative rates in cardiac triage models increase to 22% for patients over 65. This is due to undersampling of elderly cohorts with co-morbidities during training phases.
            </p>
          </div>

          <div style={{ padding: '1.25rem', background: 'rgba(52,211,153,0.06)', borderRadius: '12px', borderLeft: '4px solid #34d399' }}>
            <h4 style={{ color: 'var(--text-1)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="#34d399" /> Youth Triage Calibration
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.55 }}>
              Triage accuracy remains high (96%) for age groups under 35. Predictive signals are highly correlated with heart rates and blood pressure targets from healthy reference bounds.
            </p>
          </div>

        </div>

        <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '10px', display: 'flex', gap: '0.50rem' }}>
          <Info size={16} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
            <strong>Actionable mitigation recommendation:</strong> Run a browser bias audit in the PRISM AI dashboard using custom thresholds for Age, or utilize the What-If Sandbox to adjust age classification boundaries before clinical deployment.
          </span>
        </div>
      </div>

    </motion.div>
  );
}
