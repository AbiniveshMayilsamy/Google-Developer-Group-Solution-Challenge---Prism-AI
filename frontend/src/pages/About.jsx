import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Brain,
  BarChart3,
  Database,
  Users,
  ArrowRight,
  Code2,
  Cpu,
  Layout,
  FileCheck2,
  Workflow,
} from "lucide-react";

const capabilities = [
  {
    icon: <Database size={22} />,
    title: "Local Data Audits",
    desc: "Perform secure bias calculations on CSV datasets directly in your browser. Raw dataset records are never uploaded to any remote server, preserving absolute data privacy.",
    glow: "#4285F4", // Google Blue
    tag: "Security Focus",
    span: "double"
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Gold-Standard Metrics",
    desc: "Instantly calculate Disparate Impact (DI) ratios and Statistical Parity Differences (SPD) to satisfy US EEOC regulations and EU AI Act frameworks.",
    glow: "#EA4335", // Google Red
    tag: "Regulatory",
    span: "single"
  },
  {
    icon: <Brain size={22} />,
    title: "Gemini AI Mitigation",
    desc: "Leverage Google Gemini 2.5 Flash to automatically interpret complex mathematical disparities and generate actionable plain-language compliance summaries.",
    glow: "#FBBC05", // Google Yellow
    tag: "AI Assisted",
    span: "single"
  },
  {
    icon: <FileCheck2 size={22} />,
    title: "Regulatory Certificates",
    desc: "Generate print-ready, high-fidelity audit reports detailing compliance scores across gender, caste, region, age, and other customized protected classes.",
    glow: "#34A853", // Google Green
    tag: "Compliance",
    span: "double"
  },
  {
    icon: <Users size={22} />,
    title: "Demographic Sandbox",
    desc: "Run interactive what-if scenarios by swapping features on live records to expose direct model bias and evaluate mitigation impacts in real-time.",
    glow: "#00f0ff", // Cyan
    tag: "Interactive Sandbox",
    span: "single"
  },
  {
    icon: <Cpu size={22} />,
    title: "Real-Time Bias Firewall",
    desc: "Deploy a lightweight middleware firewall to intercept biased feature vectors, flag disparities, and execute fail-safe prediction overrides in production.",
    glow: "#fb923c", // Orange
    tag: "Real-time Ops",
    span: "single"
  },
];

const team = [
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
    color: "#34A853" // Google Green
  },
  {
    name: "Akshaya Nethra",
    role: "Data & Research",
    desc: "Sri Eshwar College of Engineering",
    icon: <Database size={24} color="#050507" />,
    color: "#FBBC05" // Google Yellow
  }
];

const techStack = [
  {
    category: "Frontend Core",
    icon: <Layout size={18} color="#4285F4" />,
    color: "#4285F4",
    items: ["React 19", "Vite", "Framer Motion", "Recharts"]
  },
  {
    category: "Backend Engine",
    icon: <Workflow size={18} color="#EA4335" />,
    color: "#EA4335",
    items: ["Node.js", "Express", "MongoDB", "Mongoose"]
  },
  {
    category: "Ethics & AI",
    icon: <Brain size={18} color="#FBBC05" />,
    color: "#FBBC05",
    items: ["Google Gemini 2.5 Flash API", "AIF360 Metrics (DI & SPD)"]
  },
  {
    category: "Security & Ops",
    icon: <ShieldCheck size={18} color="#34A853" />,
    color: "#34A853",
    items: ["JWT Auth", "Google OAuth 2.0", "Local Browser Sandbox"]
  }
];

export default function About() {
  return (
    <div className="app-container" style={{ paddingBottom: '8rem', position: 'relative', overflowX: 'hidden' }}>
      
      {/* BACKGROUND GLOWING DECORATIONS (Neutral & Subtle Google Accents, No Yellow-Green Mesh) */}
      <div style={{
        position: 'absolute', top: '20%', right: '-15%',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(66,133,244,0.02) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(120px)'
      }}/>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(234,67,53,0.015) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(100px)'
      }}/>

      {/* ── HERO SECTION ── */}
      <div style={{ textAlign: "center", maxWidth: "900px", margin: "5rem auto 7rem auto" }}>
        {/* Eyebrow badge in Wibify style */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.65rem', 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          padding: '0.45rem 1rem', 
          borderRadius: '99px', 
          fontSize: '0.72rem', 
          color: 'var(--text-2)', 
          marginBottom: '2rem',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
          <span>[01] Platform Overview</span>
          <span style={{ display: 'flex', gap: '3px', marginLeft: '0.5rem' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4285F4' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#EA4335' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FBBC05' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#34A853' }}></span>
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 800, 
          letterSpacing: '-0.04em', 
          lineHeight: 1.05, 
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          marginBottom: '2rem'
        }}>
          Democratizing <br/>
          <span className="gradient-text" style={{ 
            background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            fontWeight: 800 
          }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>AI Fairness</em>
          </span> Globally.
        </h1>

        <p style={{
          color: "var(--text-2)",
          fontSize: "1.15rem",
          lineHeight: 1.8,
          marginBottom: '3rem',
          maxWidth: '680px',
          margin: '0 auto 3rem auto'
        }}>
          Prism AI is a premium governance framework engineered to detect, audit, and mitigate systemic disparities in automated decisions before they affect real lives.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '0.85rem', borderRadius: '24px' }}>
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/docs" className="btn-secondary" style={{ padding: '0.9rem 2.25rem', fontSize: '0.85rem', borderRadius: '24px' }}>
            Technical Docs
          </Link>
        </div>
      </div>

      {/* ── BENTO MISSION BOXES ── */}
      <div className="glass-panel" style={{ marginBottom: "6rem", padding: "3.5rem", borderRadius: '24px' }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--accent)', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '1rem' 
            }}>
              <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
              <span>[02] Our Mission</span>
            </div>
            <h2 style={{ fontSize: "2.3rem", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
              Ensuring algorithms serve humanity with <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>equal equity</em>.
            </h2>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '3rem' }}>
            <p style={{ color: "var(--text-2)", lineHeight: 1.8, fontSize: "1.05rem", margin: 0 }}>
              AI models mirror their training data. If historical files contain systemic bias—against gender, caste, age, or dialect—algorithms replicate and amplify these disparities at scale. Prism AI bridges the gap between complex statistical formulas and actual compliance workflows, enabling developers and risk officers to audit deployments seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* ── PLATFORM CAPABILITIES BENTO GRID ── */}
      <div style={{ marginBottom: "6rem" }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--accent)', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.72rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            marginBottom: '1rem' 
          }}>
            <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
            <span>[03] Capabilities</span>
          </div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: '-0.02em' }}>Platform Features</h2>
        </div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          gridAutoFlow: 'dense'
        }}>
          {capabilities.map((item, idx) => {
            const isDouble = item.span === "double";
            return (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.015, y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="glass-panel"
                style={{
                  gridColumn: isDouble ? 'span 2' : 'span 1',
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  padding: "2.25rem",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.035)",
                  background: 'rgba(255, 255, 255, 0.012)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glow aura inside card on hover */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${item.glow}15 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '12px', 
                      background: `${item.glow}12`, 
                      border: `1px solid ${item.glow}20`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: item.glow
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      fontFamily: 'var(--font-mono)', 
                      color: 'var(--text-3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {item.tag}
                    </span>
                  </div>
                  <h4 style={{ marginBottom: "0.65rem", fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: 'var(--text-2)', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── TECH STACK UPGRADE ── */}
      <div className="glass-panel" style={{ marginBottom: "6rem", padding: "3.5rem", borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--accent)', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.72rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            marginBottom: '1rem' 
          }}>
            <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
            <span>[04] Architecture</span>
          </div>
          <h2 style={{ fontSize: "2.3rem", fontWeight: 800 }}>Technology Stack</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {techStack.map((stack) => (
            <div 
              key={stack.category} 
              style={{ 
                background: 'rgba(255, 255, 255, 0.01)', 
                border: '1px solid rgba(255, 255, 255, 0.03)', 
                padding: '2rem 1.5rem', 
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {stack.icon}
                <h4 style={{ 
                  fontSize: '0.85rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em', 
                  color: 'var(--text-1)',
                  fontWeight: 800
                }}>
                  {stack.category}
                </h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {stack.items.map((item) => (
                  <span 
                    key={item} 
                    style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-2)', 
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '99px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TEAM GRID SECTION ── */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--accent)', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.72rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            marginBottom: '1rem' 
          }}>
            <span style={{ width: '8px', height: '1px', background: 'var(--accent)' }}></span>
            <span>[05] Leadership</span>
          </div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: '-0.02em' }}>Meet Our Team</h2>
        </div>

        <div className="grid-4">
          {team.map((member, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="glass-panel text-center"
              style={{
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.035)',
                background: 'rgba(255, 255, 255, 0.01)'
              }}
            >
              {/* Outer Avatar Glowing frame */}
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${member.color}, rgba(255,255,255,0.7))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.75rem',
                boxShadow: `0 8px 20px rgba(0, 0, 0, 0.4), 0 0 15px ${member.color}20`,
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
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: member.color,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `inset 0 2px 6px rgba(255,255,255,0.4)`
                }}>
                  {member.icon}
                </div>
              </div>
              
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 800, 
                color: 'var(--text-1)', 
                marginBottom: '0.35rem', 
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em'
              }}>
                {member.name}
              </h3>
              
              <div style={{
                color: member.color,
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.85rem'
              }}>
                {member.role}
              </div>
              
              <p style={{
                color: 'var(--text-3)',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                margin: 0,
                fontWeight: 500
              }}>
                {member.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
