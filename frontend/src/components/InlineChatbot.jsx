import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

const SUGGESTIONS = [
  'Why is there bias in my data?',
  'How do I fix this bias?',
  'What does Disparate Impact mean?',
  'Is my model legally compliant?',
];

export default function InlineChatbot({ metrics, config }) {
  const { laymanMode } = useTheme();
  const [messages, setMessages] = useState([{
    sender: 'bot',
    text: `Hi! I've analyzed your dataset. ${
      metrics?.disparateImpact < 0.8
        ? `⚠️ I detected bias — DI = ${metrics?.disparateImpact?.toFixed(3)} for ${config?.sensitiveAttribute}. Ask me anything about it.`
        : `✅ Your model looks fair — DI = ${metrics?.disparateImpact?.toFixed(3)}. Ask me anything to understand the results.`
    }`
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(p => [...p, { sender: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const data = await apiPost('/api/chat', {
        message: msg,
        context: { metrics, config },
        laymanMode
      });
      setMessages(p => [...p, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(p => [...p, { sender: 'bot', text: `Error: ${err.message}` }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Bot size={18} color="var(--accent)" /> AI Ethics Assistant
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 6px #34d399' }}/> 
          Gemini powered · Knows your data
        </span>
      </h3>

      {/* Suggestion chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} style={{
            background: 'var(--accent-dim)', border: '1px solid var(--accent)',
            color: 'var(--accent)', borderRadius: '999px', padding: '0.3rem 0.8rem',
            fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ height: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem', padding: '0.25rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            background: msg.sender === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
            color: msg.sender === 'user' ? '#000' : 'var(--text-1)',
            padding: '0.6rem 0.85rem',
            borderRadius: '12px',
            borderBottomRightRadius: msg.sender === 'user' ? '3px' : '12px',
            borderBottomLeftRadius: msg.sender === 'bot' ? '3px' : '12px',
            maxWidth: '85%', fontSize: '0.82rem', lineHeight: 1.55
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.06)', padding: '0.6rem 0.85rem', borderRadius: '12px', borderBottomLeftRadius: '3px' }}>
            <Loader2 size={14} className="animate-spin" color="var(--accent)" />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); send(); }} style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask about your bias results..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.55rem 1rem', color: 'var(--text-1)', outline: 'none', fontSize: '0.82rem' }}
        />
        <button type="submit" disabled={loading} style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
