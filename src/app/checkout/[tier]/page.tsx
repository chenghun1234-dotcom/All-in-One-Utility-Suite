"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Zap, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function CheckoutPage() {
  const params = useParams();
  const tier = params.tier as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const price = tier === 'Pro' ? '$19' : (tier === 'Enterprise' ? '$49' : '$0');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('processing');

    try {
      // Simulation: Update user tier in DB
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!res.ok) throw new Error('Subscription failed');
      
      setTimeout(() => {
        setStatus('success');
        setLoading(false);
        setTimeout(() => router.push('/'), 2000);
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Link href="/pricing" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Pricing
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-8 border-white/5">
            <h1 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <CreditCard className="text-primary" /> Secure Checkout
            </h1>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Card Information</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM/YY"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">CVC</label>
                  <input 
                    type="text" 
                    required
                    placeholder="123"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || status === 'success'}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50"
              >
                {status === 'processing' ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} className="fill-white" />}
                {status === 'success' ? 'Payment Successful!' : `Pay ${price} Now`}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
               <div className="flex items-center gap-2 text-xs font-bold tracking-widest"><Shield size={14} /> PCI COMPLIANT</div>
               <div className="flex items-center gap-2 text-xs font-bold tracking-widest"><CheckCircle2 size={14} /> SECURE SSL</div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="glass rounded-3xl p-8 border-white/5 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Webmaster Alpha {tier} Plan</span>
                <span className="font-bold">{price}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Setup Fee</span>
                <span className="text-emerald-500 font-bold">Waived</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="font-bold">Total Due</span>
                <span className="text-2xl font-bold text-primary">{price}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By completing this simulated transaction, you'll be upgraded to the **{tier}** tier instantly. 
                This is a simulation for production-readiness demonstration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {status === 'success' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
        >
          <div className="text-center p-12 glass rounded-3xl border-primary/20 max-w-sm">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 text-white">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Success!</h2>
            <p className="text-muted-foreground mb-8">Your account has been upgraded to **{tier}**. Enjoy your pro features.</p>
            <Loader2 className="mx-auto animate-spin text-primary" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
