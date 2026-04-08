import { useState } from 'react';
import axios from 'axios';

const SUBJECTS = ['DSA', 'SQL', 'JavaScript', 'React', 'Python', 'OS', 'DBMS', 'CN'];

export default function AiTutor() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('DSA');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    setError('');
    try {
      const { data } = await axios.post('/api/ai/ask', { question, subject });
      setAnswer(data.answer);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 720,
      margin: '2rem auto',
      padding: '1.5rem',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ marginBottom: 4 }}>🤖 AI Tutor</h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        Ask anything about your subjects — powered by Gemini AI
      </p>

      {/* Subject Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {SUBJECTS.map(s => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: subject === s ? '#2563eb' : '#ddd',
              background: subject === s ? '#2563eb' : 'transparent',
              color: subject === s ? '#fff' : '#444',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: subject === s ? 600 : 400,
              transition: 'all 0.2s'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Question Input */}
      <textarea
        rows={4}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder={`Ask a ${subject} question... (Press Enter to send)`}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
          }
        }}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: '1.5px solid #ddd',
          fontSize: 14,
          resize: 'vertical',
          boxSizing: 'border-box',
          outline: 'none',
          lineHeight: 1.6
        }}
      />

      {/* Ask Button */}
      <button
        onClick={askQuestion}
        disabled={loading || !question.trim()}
        style={{
          marginTop: 10,
          padding: '10px 28px',
          background: loading ? '#93c5fd' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {loading ? '⏳ Thinking...' : '✨ Ask AI'}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          color: '#dc2626',
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div style={{
          marginTop: 20,
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: 12,
          padding: '20px 24px',
          whiteSpace: 'pre-wrap',
          fontSize: 14,
          lineHeight: 1.8,
          color: '#1e293b'
        }}>
          <div style={{
            fontSize: 12,
            color: '#94a3b8',
            marginBottom: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            {subject} • Gemini AI
          </div>
          {answer}
        </div>
      )}
    </div>
  );
}