import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchJson } from '../lib/api';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'denied'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setStatus('denied');
      return;
    }

    fetchJson<{ admin: { email: string; name: string } }>('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setStatus('ok'))
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
