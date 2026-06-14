import { motion } from 'framer-motion';
import { Code2, Cpu, Layout, Database } from 'lucide-react';

const members = [
  {
    name: "Abinivesh M",
    role: "Team Lead & Full Stack",
    desc: "Sri Eshwar College of Engineering",
    icon: <Code2 size={24} color="#050507" />,
    color: "#4285F4" // Google Blue
  },
  {
    name: "Dhana Rithanya K S",
    role: "ML & Backend",
    desc: "Sri Eshwar College of Engineering",
    icon: <Cpu size={24} color="#050507" />,
    color: "#EA4335" // Google Red
  },
  {
    name: "Mehanathan K",
    role: "Frontend & UI",
    desc: "Sri Eshwar College of Engineering",
    icon: <Layout size={24} color="#050507" />,
    color: "#FBBC05" // Google Yellow
  },
  {
    name: "Akshaya Nethra",
    role: "Data & Research",
    desc: "Sri Eshwar College of Engineering",
    icon: <Database size={24} color="#050507" />,
    color: "#34A853" // Google Green
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18
    }
  }
};

export default function Team() {
  return (
    <div className="app-container" style={{ paddingBottom: '6rem' }}>
      <div className="text-center" style={{ marginBottom: '4rem', marginTop: '2rem' }}>
        {/* Eyebrow badge in Wibify style */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.65rem', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            padding: '0.45rem 1.1rem', 
            borderRadius: '99px', 
            fontSize: '0.72rem', 
            color: 'var(--text-2)', 
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
          <span>[01] Leadership Team</span>
          <span style={{ display: 'flex', gap: '3px', marginLeft: '0.5rem' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4285F4' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#EA4335' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FBBC05' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#34A853' }}></span>
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}
        >
          Meet Our <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Team</em>
          </span>
        </motion.h1>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid-4"
      >
        {members.map((member, idx) => (
          <motion.div 
            key={idx} 
            variants={item}
            className="glass-panel text-center hover-glow"
            style={{
              padding: '3rem 1.5rem 2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: `1px solid rgba(255, 255, 255, 0.03)`
            }}
          >
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${member.color}, rgba(255,255,255,0.8))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.75rem',
              boxShadow: `0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${member.color}35`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: '2px',
                borderRadius: '50%',
                background: '#050507',
                zIndex: 1
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: member.color,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `inset 0 2px 5px rgba(255,255,255,0.4)`
              }}>
                {member.icon}
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.25rem', fontFamily: 'var(--font-display)' }}>
              {member.name}
            </h3>
            
            <div style={{
              color: member.color,
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1rem'
            }}>
              {member.role}
            </div>
            
            <p style={{
              color: 'var(--text-2)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              margin: 0
            }}>
              {member.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
