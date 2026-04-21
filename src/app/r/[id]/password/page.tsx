"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function PasswordPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`/api/r/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      const data = await res.json();
      if (data.success && data.originalUrl) {
        window.location.href = data.originalUrl;
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zinc-950">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-10 border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ShieldCheck size={100} className="text-primary" />
          </div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold font-outfit mb-2">Password Protected</h1>
            <p className="text-muted-foreground text-sm">
              This link is secured. Please enter the password to access the destination.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="password" 
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter link password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 focus:outline-none focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold"
              >
                <AlertCircle size={14} /> Incorrect password. Please try again.
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Unlock Content <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Encrypted by Webmaster Alpha Security Engine
          </p>
        </motion.div>
      </div>
    </div>
  );
}
