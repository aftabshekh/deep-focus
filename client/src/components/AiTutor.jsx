import { useState, useRef, useEffect, useCallback } from 'react';

const SUBJECTS = ['DSA', 'SQL', 'JavaScript', 'React', 'Python', 'OS', 'DBMS', 'CN'];

const SUGGESTIONS = [
  { emoji: '🌲', text: 'Explain Binary Search Tree with an example' },
  { emoji: '🔗', text: 'What is the difference between SQL JOINs?' },
  { emoji: '⚛️', text: 'How does useEffect dependency array work?' },
  { emoji: '🧵', text: 'Explain process vs thread in OS' },
];

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Small helper: render **bold**, `code`, and fenced ```code``` blocks ──
function FormattedText({ text }) {
  const blocks = text.split(/```/g);
  return (
    <>
      {blocks.map((block, i) => {
        if (i % 2 === 1) {
          const lines = block.split('\n');
          const maybeLang = lines[0].trim();
          const code = /^[a-zA-Z]*$/.test(maybeLang) && lines.length > 1
            ? lines.slice(1).join('\n')
            : block;
          return (
            <pre key={i} style={{
              background: '#0a1a12', color: '#c8f5dc', padding: '14px 16px',
              borderRadius: 10, overflowX: 'auto', fontSize: '.82rem',
              fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6,
              margin: '10px 0',
            }}>
              <code>{code}</code>
            </pre>
          );
        }
        const parts = block.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
        return (
          <span key={i} style={{ whiteSpace: 'pre-wrap' }}>
            {parts.map((p, j) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return <strong key={j} style={{ color: '#0a1a12' }}>{p.slice(2, -2)}</strong>;
              }
              if (p.startsWith('`') && p.endsWith('`')) {
                return (
                  <code key={j} style={{
                    background: '#e6f7ee', color: '#0a6e3f', padding: '2px 6px',
                    borderRadius: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: '.85em',
                  }}>{p.slice(1, -1)}</code>
                );
              }
              return <span key={j}>{p}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 2px' }}>
      <style>{`@keyframes dotBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}`}</style>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: '#12a05c',
          animation: `dotBounce 1s ${i * 0.15}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg, onCopy, copied }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        display: 'grid', placeItems: 'center', fontSize: '.9rem',
        background: isUser ? '#0a6e3f' : 'linear-gradient(135deg,#0a6e3f,#12a05c)',
        color: '#fff',
      }}>
        {isUser ? '🙂' : '🤖'}
      </div>

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {!isUser && msg.subject && (
          <div style={{
            fontSize: '.68rem', color: '#7a9a88', fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px',
          }}>
            {msg.subject} · Deep Focus AI
          </div>
        )}

        <div className="ai-bubble" style={{
          position: 'relative',
          background: isUser ? '#0a6e3f' : '#fff',
          color: isUser ? '#fff' : '#1e2b23',
          border: isUser ? 'none' : '1.5px solid #e0f5ea',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          padding: '12px 16px',
          fontSize: '.9rem', lineHeight: 1.7,
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: isUser ? '0 4px 14px rgba(10,110,63,.18)' : '0 2px 10px rgba(10,110,63,.06)',
        }}>
          {msg.error ? (
            <span style={{ color: '#cc0000' }}>⚠️ {msg.text}</span>
          ) : msg.text ? (
            <FormattedText text={msg.text} />
          ) : (
            <TypingDots />
          )}
          {msg.streaming && msg.text && (
            <span style={{
              display: 'inline-block', width: 6, height: 14, background: '#12a05c',
              marginLeft: 3, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite',
            }} />
          )}
        </div>

        {!isUser && msg.text && !msg.streaming && !msg.error && (
          <button onClick={() => onCopy(msg.id, msg.text)} style={{
            alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '.72rem', color: '#8aab98', fontFamily: "'DM Sans',sans-serif",
            padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {copied === msg.id ? '✅ Copied' : '📋 Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AiTutor() {
  const [subject, setSubject] = useState('DSA');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(null);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);
  const idCounter = useRef(0);
  const nextId = () => `m${++idCounter.current}`;

  useEffect(() => {
    console.log('[AiTutor] component MOUNTED');
    return () => console.log('[AiTutor] component UNMOUNTED');
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [input]);

  const buildHistory = (upToIndex) =>
    messages.slice(0, upToIndex).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text,
    }));

  const streamAnswer = useCallback(async (question, historyForApi, aiMsgId) => {
    console.log('[AiTutor] streamAnswer() called for aiMsgId:', aiMsgId, 'question:', question);
    const controller = new AbortController();
    abortRef.current = controller;
    controller.signal.addEventListener('abort', () => {
      console.log('[AiTutor] AbortController fired for aiMsgId:', aiMsgId, new Error().stack);
    });
    const token = localStorage.getItem('accessToken');

    try {
      const res = await fetch(`${BASE_URL}/api/ai/ask-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ question, subject, history: historyForApi }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error('stream-unavailable');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let gotAnyChunk = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const lines = evt.split('\n');
          let eventType = 'message';
          let dataStr = '';
          for (const line of lines) {
            if (line.startsWith('event:')) eventType = line.slice(6).trim();
            if (line.startsWith('data:')) dataStr += line.slice(5).trim();
          }
          if (!dataStr) continue;
          let payload;
          try { payload = JSON.parse(dataStr); } catch { continue; }

          if (eventType === 'chunk') {
            gotAnyChunk = true;
            setMessages((prev) => prev.map((m) =>
              m.id === aiMsgId ? { ...m, text: m.text + payload.text } : m
            ));
          } else if (eventType === 'error') {
            const explicitErr = new Error(payload.message || 'AI service failed');
            explicitErr.explicit = true; // server already told us exactly what's wrong — no point retrying via /ask
            throw explicitErr;
          } else if (eventType === 'done') {
            setMessages((prev) => prev.map((m) =>
              m.id === aiMsgId ? { ...m, text: payload.text || m.text, streaming: false } : m
            ));
          }
        }
      }

      if (!gotAnyChunk) throw new Error('stream-empty');
      setMessages((prev) => prev.map((m) =>
        m.id === aiMsgId && m.streaming ? { ...m, streaming: false } : m
      ));
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages((prev) => prev.map((m) =>
          m.id === aiMsgId ? { ...m, streaming: false } : m
        ));
        return;
      }

      // The server already told us exactly what went wrong (e.g. invalid
      // API key) — retrying the same broken setup via /ask would just fail
      // identically, so show the real error immediately instead of hanging.
      if (err.explicit) {
        setMessages((prev) => prev.map((m) =>
          m.id === aiMsgId ? { ...m, text: err.message, streaming: false, error: true } : m
        ));
        setIsStreaming(false);
        abortRef.current = null;
        return;
      }

      // Fallback to non-streaming endpoint
      try {
        const token2 = localStorage.getItem('accessToken');
        const res2 = await fetch(`${BASE_URL}/api/ai/ask`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token2 ? { Authorization: `Bearer ${token2}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({ question, subject, history: historyForApi }),
        });
        const data = await res2.json();
        if (!res2.ok) throw new Error(data.error || 'AI service failed');
        setMessages((prev) => prev.map((m) =>
          m.id === aiMsgId ? { ...m, text: data.answer, streaming: false } : m
        ));
      } catch (err2) {
        setMessages((prev) => prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, text: 'Something went wrong. Please try again.', streaming: false, error: true }
            : m
        ));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [subject]);

  const send = useCallback((questionOverride) => {
    console.log('[AiTutor] send() called, questionOverride:', questionOverride, 'isStreaming:', isStreaming);
    const question = (questionOverride ?? input).trim();
    if (!question || isStreaming) {
      console.log('[AiTutor] send() blocked — empty question or already streaming');
      return;
    }

    // Build history from current messages BEFORE adding the new ones —
    // computed here (not inside setMessages) because React can invoke a
    // setState updater function more than once, which would fire the
    // network request twice. Side effects must never live inside an updater.
    const historyForApi = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text,
    })).filter((m) => m.text);

    const userMsg = { id: nextId(), role: 'user', text: question };
    const aiMsgId = nextId();
    const aiMsg = { id: aiMsgId, role: 'model', text: '', streaming: true, subject };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
    setIsStreaming(true);

    streamAnswer(question, historyForApi, aiMsgId);
  }, [input, isStreaming, subject, streamAnswer, messages]);

  const stopGenerating = () => {
    abortRef.current?.abort();
  };

  const clearChat = () => {
    if (isStreaming) abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '540px', maxHeight: '68vh',
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <style>{`
        @keyframes blink{50%{opacity:0}}
        .ai-scroll::-webkit-scrollbar{width:5px}
        .ai-scroll::-webkit-scrollbar-thumb{background:#c6ead8;border-radius:99px}
        .ai-scroll::-webkit-scrollbar-track{background:transparent}
        .ai-chip{transition:all .15s}
        .ai-chip:hover{border-color:#0a6e3f !important}
        .ai-suggest:hover{background:#e6f7ee !important;border-color:#0a6e3f !important}
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0a1a12', display: 'flex', alignItems: 'center', gap: 8 }}>
            🤖 AI Tutor
            <span style={{
              fontSize: '.62rem', background: '#e6f7ee', color: '#0a6e3f', padding: '2px 8px',
              borderRadius: 50, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1ec97a' }} />
              LIVE
            </span>
          </div>
          <p style={{ color: '#5a7a68', fontSize: '.8rem', marginTop: 2 }}>
            Real-time answers, powered by Gemini
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} style={{
            background: 'none', border: '1.5px solid #e0f5ea', color: '#5a7a68',
            padding: '6px 14px', borderRadius: 50, cursor: 'pointer', fontSize: '.78rem',
            fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
          }}>
            🗑 Clear
          </button>
        )}
      </div>

      {/* SUBJECT CHIPS */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, flexShrink: 0 }}>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            className="ai-chip"
            onClick={() => setSubject(s)}
            style={{
              padding: '6px 15px', borderRadius: 50, border: '1.5px solid',
              borderColor: subject === s ? '#0a6e3f' : '#e0f5ea',
              background: subject === s ? '#0a6e3f' : 'transparent',
              color: subject === s ? '#fff' : '#5a7a68',
              cursor: 'pointer', fontSize: '.78rem', fontWeight: subject === s ? 700 : 500,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* MESSAGES / EMPTY STATE */}
      <div ref={scrollRef} className="ai-scroll" style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18,
        padding: '4px 4px 10px',
      }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', gap: 14 }}>
            <div style={{ textAlign: 'center', color: '#5a7a68', fontSize: '.85rem', marginBottom: 4 }}>
              Ask a <strong style={{ color: '#0a6e3f' }}>{subject}</strong> question and get an instant, streamed answer 👇
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="ai-suggest"
                  onClick={() => send(s.text)}
                  style={{
                    textAlign: 'left', background: '#fff', border: '1.5px solid #e0f5ea',
                    borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                    fontSize: '.8rem', color: '#1e2b23', fontFamily: "'DM Sans',sans-serif",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ marginRight: 6 }}>{s.emoji}</span>{s.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onCopy={handleCopy} copied={copied} />
          ))
        )}
      </div>

      {/* INPUT BAR */}
      <div style={{ flexShrink: 0, marginTop: 12 }}>
        {isStreaming && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <button onClick={stopGenerating} style={{
              background: '#fff', border: '1.5px solid #e0f5ea', color: '#5a7a68',
              padding: '6px 16px', borderRadius: 50, cursor: 'pointer', fontSize: '.78rem',
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ⏹ Stop generating
            </button>
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 10, background: '#fff',
          border: '1.5px solid #c6ead8', borderRadius: 16, padding: '8px 8px 8px 16px',
          boxShadow: '0 2px 12px rgba(10,110,63,.06)',
        }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a ${subject} question... (Enter to send)`}
            style={{
              flex: 1, border: 'none', outline: 'none', resize: 'none',
              fontFamily: "'DM Sans',sans-serif", fontSize: '.88rem', lineHeight: 1.5,
              color: '#0a1a12', padding: '8px 0', background: 'transparent', maxHeight: 140,
            }}
          />
          <button
            onClick={() => send()}
            disabled={isStreaming || !input.trim()}
            style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0, border: 'none',
              background: (isStreaming || !input.trim()) ? '#a8f0cc' : '#0a6e3f',
              color: '#fff', cursor: (isStreaming || !input.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem', display: 'grid', placeItems: 'center', transition: 'background .2s',
            }}
            aria-label="Send question"
          >
            {isStreaming ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}