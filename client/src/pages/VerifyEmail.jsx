import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setTimeout(() => navigate('/'), 3000);
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        background: '#1e293b',
        padding: '48px',
        borderRadius: '16px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
      }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ color: '#94a3b8', fontSize: '20px' }}>Verifying your email...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#22c55e', fontSize: '24px', marginBottom: '8px' }}>Email Verified!</h2>
            <p style={{ color: '#94a3b8' }}>Redirecting to login in 3 seconds...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h2 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '8px' }}>Invalid Link</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Link invalid ya expire ho gaya hai.</p>
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Register Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}