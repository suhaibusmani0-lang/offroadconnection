'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Credentials check
    if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
      try {
        localStorage.setItem('offroad_admin_logged_in', 'true');
        document.cookie = 'offroad_admin_session=authenticated; path=/; max-age=86400';
      } catch (err) {}
      router.push('/admin/crm');
    } else {
      setError('Invalid admin credentials. Please use admin / admin123.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-body relative overflow-hidden" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Background Subtle Vignette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#121212] border border-[#27272A] rounded-3xl p-8 sm:p-10 shadow-2xl">
        {/* Brand Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center font-black text-2xl mx-auto shadow-xl mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>
            OR
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>Admin & CRM Portal</h1>
          <p className="text-[#A1A1AA] text-xs mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            Off Road Connection Parts • Enterprise Management Suite
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#27272A] border border-[#3F3F46] text-white text-xs flex items-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-white" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-black text-sm tracking-wider shadow-lg hover:bg-[#E4E4E7] active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              <span>{loading ? 'Authenticating...' : 'Access Enterprise Portal'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#27272A] text-center text-xs text-[#71717A]" style={{ fontFamily: "'Lato', sans-serif" }}>
          <div>Protected with 256-bit TLS encryption</div>
          <div className="mt-1">Default credentials: <span className="text-white font-mono font-bold">admin / admin123</span></div>
        </div>
      </div>
    </div>
  );
}
