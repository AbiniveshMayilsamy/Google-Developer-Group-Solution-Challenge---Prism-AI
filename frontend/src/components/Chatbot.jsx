import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiPost } from '../utils/api';

export default function Chatbot() {
  const { laymanMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    sender: 'bot',
    text: "Hi! I'm Prism AI Assistant powered by Gemini. Ask me anything about bias metrics, fairness, or AI ethics."
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(p => [...p, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);
    try {
      const metrics = localStorage.getItem('current_analysis_metrics');
      const config  = localStorage.getItem('current_analysis_config');
      const data = await apiPost('/api/chat', {
        message: text,
        context: {
          metrics: metrics ? JSON.parse(metrics) : null,
          config:  config  ? JSON.parse(config)  : null
        },
        laymanMode
      });
      setMessages(p => [...p, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(p => [...p, { sender: 'bot', text: `Sorry, I couldn't connect to the AI. Make sure the backend is running. (${err.message})` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem',
              background: 'var(--accent)', color: '#000',
              border: 'none', borderRadius: '50%',
              width: '56px', height: '56px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 1001,
              boxShadow: '0 4px 20px rgba(168,85,247,0.4)'
            }}
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem',
              width: '340px', height: '480px',
              background: 'var(--panel-bg)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              zIndex: 1001, overflow: 'hidden'
            }}
          >
            <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(168,85,247,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={18} color="var(--accent)" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-1)' }}>Prism Assistant</span>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? 'var(--accent)' : 'var(--border)',
                  color: msg.sender === 'user' ? '#000' : 'var(--text-1)',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '14px',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '14px',
                  borderBottomLeftRadius:  msg.sender === 'bot'  ? '4px' : '14px',
                  maxWidth: '86%', fontSize: '0.82rem', lineHeight: 1.55
                }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'var(--border)', padding: '0.65rem 0.9rem', borderRadius: '14px', borderBottomLeftRadius: '4px' }}>
                  <Loader2 size={14} className="animate-spin" color="var(--accent)" />
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={send} style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about bias metrics..."
                style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.5rem 0.9rem', color: 'var(--text-1)', outline: 'none', fontSize: '0.82rem' }}
              />
              <button type="submit" style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
