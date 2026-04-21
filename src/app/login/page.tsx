"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, Zap, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isLogin ? 'login' : 'signup', email, password }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Successfully authenticated
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 md:p-10 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Zap size={100} className="text-primary" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-outfit mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started Free'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to access your tools' : 'Create an account to scale your digital empire'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all disabled:bg-white/10 disabled:text-muted-foreground"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} className="fill-white" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale grayscale-100">
           <div className="flex items-center gap-2 text-xs font-bold tracking-widest"><Shield size={14} /> SECURE LOGIN</div>
           <div className="flex items-center gap-2 text-xs font-bold tracking-widest"><CheckCircle2 size={14} /> 256-BIT AES</div>
        </div>
      </div>
    </div>
  );
}
