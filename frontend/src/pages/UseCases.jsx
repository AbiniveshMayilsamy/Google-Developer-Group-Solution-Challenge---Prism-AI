import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building, HeartPulse, Webcam } from 'lucide-react';
import Hiring from './use-cases/Hiring';
import Lending from './use-cases/Lending';
import Healthcare from './use-cases/Healthcare';
import Vision from './use-cases/Vision';

const TABS = [
  { key: 'hiring',     label: 'HR & Hiring',     icon: <Users size={16}/>,      component: <Hiring /> },
  { key: 'lending',    label: 'Finance',          icon: <Building size={16}/>,   component: <Lending /> },
  { key: 'healthcare', label: 'Healthcare',       icon: <HeartPulse size={16}/>, component: <Healthcare /> },
  { key: 'vision',     label: 'Computer Vision',  icon: <Webcam size={16}/>,     component: <Vision /> },
];

export default function UseCases() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const active = TABS.some(t => t.key === tab) ? tab : 'hiring';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '6rem' }}>
      {/* Tab bar */}
      <div style={{
        position: 'sticky', top: 'var(--navbar-h)', zIndex: 100,
        background: 'rgba(13,13,15,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '0 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
          {TABS.map(({ key, label, icon }) => (
            <button key={key} onClick={() => navigate(`/use-cases/${key}`)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '1rem 1.25rem', border: 'none', background: 'transparent',
              color: active === key ? 'var(--accent)' : 'var(--text-2)',
              fontWeight: active === key ? 700 : 500,
              fontSize: '0.88rem', cursor: 'pointer', whiteSpace: 'nowrap',
              borderBottom: active === key ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.2s'
            }}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          {TABS.find(t => t.key === active)?.component}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
