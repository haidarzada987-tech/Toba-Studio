import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, Lock, LogIn, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageProvider';
import { fetchJson } from '../lib/api';

export default function Login() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson<{ token: string; admin: { email: string; name: string } }>('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_profile', JSON.stringify(data.admin));
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10 glass rounded-[32px] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary mb-6">
            <LogIn className="w-4 h-4" /> Admin Access
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Admin Login</h1>
          <p className="text-gray-400 mb-8">Use your private admin email and password to manage services, text, settings, and orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-4 focus:border-primary focus:outline-none" placeholder="admin@example.com" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-4 focus:border-primary focus:outline-none" placeholder="••••••••" />
            </div>
          </div>
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <button disabled={loading} className="w-full rounded-2xl bg-primary py-4 font-black text-dark transition-transform hover:scale-[1.01] disabled:opacity-60">
            {loading ? 'Signing in...' : 'Open Admin Panel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
