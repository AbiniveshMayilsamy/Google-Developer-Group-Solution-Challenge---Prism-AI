import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';

export default function FairnessCharts({ metrics, config }) {
  if (!metrics || !config) return null;

  const truncate = (str, n=20) => (str && str.length > n) ? str.substr(0, n-1) + '...' : str;
  const privLabel = truncate(config.privilegedGroup);
  const unprivLabel = truncate(config.unprivilegedGroup);

  const barData = [
    {
      name: 'Favorable Rate',
      [privLabel]: parseFloat((metrics.privFavorableRate * 100).toFixed(2)),
      [unprivLabel]: parseFloat((metrics.unprivFavorableRate * 100).toFixed(2)),
    }
  ];

  const radarData = [
    {
      subject: 'Favorable Rate',
      A: parseFloat((metrics.privFavorableRate * 100).toFixed(2)),
      B: parseFloat((metrics.unprivFavorableRate * 100).toFixed(2)),
      fullMark: 100,
    },
    {
      subject: 'Representation',
      A: metrics.privTotal,
      B: metrics.unprivTotal,
      fullMark: Math.max(metrics.privTotal, metrics.unprivTotal),
    },
    {
      subject: 'Positive Count',
      A: metrics.privFavorable,
      B: metrics.unprivFavorable,
      fullMark: Math.max(metrics.privFavorable, metrics.unprivFavorable),
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(10,10,12,0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--accent)',
          padding: '1rem',
          borderRadius: '12px',
          color: 'var(--text-1)',
          boxShadow: '0 0 20px rgba(153,255,0,0.15)'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-1)' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: '0.2rem 0', display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
              <span>{entry.name}:</span> <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ marginTop: '3rem' }}
    >
      <motion.h2 variants={itemVariants} style={{ marginBottom: '2rem', textAlign: 'center' }}>Multidimensional Bias Analysis</motion.h2>
      
      <div className="grid-2">
        <motion.div variants={itemVariants} className="glass-panel" style={{ height: '450px', position: 'relative' }}>
          {/* Glowing orb behind chart */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }}></div>
          
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>Disparate Impact (Bar)</h3>
          <ResponsiveContainer width="100%" height="85%" style={{ position: 'relative', zIndex: 1 }}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-2)" tick={{ fill: 'var(--text-2)' }} />
              <YAxis stroke="var(--text-2)" unit="%" tick={{ fill: 'var(--text-2)' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey={privLabel} fill="var(--accent)" radius={[8, 8, 0, 0]} animationDuration={1500} />
              <Bar dataKey={unprivLabel} fill="var(--accent-2)" radius={[8, 8, 0, 0]} animationDuration={1500} animationBegin={500} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ height: '450px', position: 'relative' }}>
           {/* Glowing orb behind chart */}
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'var(--accent-2)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }}></div>
          
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>Representation Radar</h3>
          <ResponsiveContainer width="100%" height="85%" style={{ position: 'relative', zIndex: 1 }}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-1)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'var(--text-2)' }} />
              <Radar name={privLabel} dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} animationDuration={2000} />
              <Radar name={unprivLabel} dataKey="B" stroke="var(--accent-2)" fill="var(--accent-2)" fillOpacity={0.25} animationDuration={2000} animationBegin={500} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
