"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  Loader2,
  Globe,
  Settings2,
  CheckCircle,
  Eye,
  Camera,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const presets = [
  { id: 'desktop', name: 'Desktop', width: 1920, height: 1080, icon: Monitor },
  { id: 'tablet', name: 'Tablet', width: 1024, height: 768, icon: Tablet },
  { id: 'mobile', name: 'Mobile', width: 375, height: 667, icon: Smartphone },
];

export default function ScreenshotPage() {
  const [url, setUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [loading, setLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const captureScreenshot = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setScreenshotUrl(null);

    try {
      const res = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          width: selectedPreset.width, 
          height: selectedPreset.height,
          format: 'png'
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScreenshotUrl(data.screenshotUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold font-outfit mb-4 tracking-tight">Website Screenshot Tool</h1>
        <p className="text-muted-foreground text-lg">
          Capture pixel-perfect snapshots across any device resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-2xl p-8 border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe size={20} className="text-primary" /> Target URL
            </h2>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., producthunt.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-all font-medium mb-4"
              onKeyDown={(e) => e.key === 'Enter' && captureScreenshot()}
            />
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 mt-4">
              <Settings2 size={20} className="text-primary" /> Resolution
            </h2>
            <div className="space-y-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all group ${
                    selectedPreset.id === preset.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <preset.icon size={20} className={selectedPreset.id === preset.id ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="font-bold">{preset.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{preset.width} x {preset.height}</span>
                </button>
              ))}
            </div>

            <button
              onClick={captureScreenshot}
              disabled={loading || !url}
              className="w-full mt-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all disabled:bg-white/5 disabled:text-muted-foreground"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
              {loading ? "Capturing..." : "Capture Screenshot"}
            </button>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
                <span className="text-xs font-medium">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-8">
          <div className="glass rounded-3xl p-4 border-white/5 relative bg-zinc-900 group">
            {/* Browser Header Shadow */}
            <div className="h-10 w-full mb-2 flex items-center px-4 gap-2 border-b border-white/5 bg-zinc-950/50 rounded-t-2xl">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-rose-500/50 rounded-full" />
                <div className="w-2.5 h-2.5 bg-amber-500/50 rounded-full" />
                <div className="w-2.5 h-2.5 bg-emerald-500/50 rounded-full" />
              </div>
              <div className="flex-grow mx-4 h-6 rounded bg-white/5 flex items-center px-3">
                <p className="text-[10px] text-zinc-500 truncate">{url || 'Enter URL to preview'}</p>
              </div>
            </div>

            <div className="min-h-[400px] max-h-[600px] overflow-auto rounded-b-2xl bg-zinc-950/20 relative custom-scrollbar">
              {screenshotUrl ? (
                <div className="relative group">
                  <img src={screenshotUrl} alt="Capture" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button 
                      onClick={() => window.open(screenshotUrl, '_blank')}
                      className="p-4 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-xl"
                    >
                      <Eye size={24} />
                    </button>
                    <button 
                      onClick={() => {
                         const a = document.createElement('a');
                         a.href = screenshotUrl;
                         a.download = `screenshot_${Date.now()}.png`;
                         a.click();
                      }}
                      className="p-4 rounded-full bg-primary text-white hover:scale-110 transition-transform shadow-xl"
                    >
                      <Download size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 text-center px-12">
                  <Camera size={64} className="mb-6" />
                  <p className="text-xl font-bold font-outfit">Preview Environment</p>
                  <p className="text-sm mt-2">Captured screenshots will appear here in high fidelity.</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Zap className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
                  </div>
                  <p className="mt-6 text-sm font-bold tracking-widest uppercase animate-pulse">Rendering Page...</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Speed</p>
                <p className="font-bold">Avg. 1.2s Processing</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
                <p className="font-bold">Cloud-Edge Rendering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
