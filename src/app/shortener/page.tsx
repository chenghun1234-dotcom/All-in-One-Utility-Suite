"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Settings, 
  Download, 
  Copy, 
  Check, 
  ArrowLeft,
  Palette,
  Maximize,
  Type,
  Shield,
  QrCode,
  RefreshCw,
  Zap,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ShortenerPage() {
  const [url, setUrl] = useState('');
  const [isDynamic, setIsDynamic] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxClicks, setMaxClicks] = useState('');
  
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customization, setCustomization] = useState({
    color: '#8b5cf6',
    bgColor: '#ffffff',
  });

  const generateQR = async () => {
    if (!url) return;
    setIsGenerating(true);
    try {
      // 1. Create the link in DB (Dynamic/Secure or Static)
      const linkRes = await fetch('/api/links/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          originalUrl: url, 
          type: (isDynamic || password || expiresAt || maxClicks) ? 'dynamic' : 'static',
          password,
          expiresAt,
          maxClicks
        }),
      });
      const linkData = await linkRes.json();
      
      if (linkData.error) throw new Error(linkData.error);

      // 2. Generate the QR image based on the display URL
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: linkData.displayUrl, 
          ...customization 
        }),
      });
      const data = await res.json();
      setQrCode(data.qrDataUrl); // API returns qrDataUrl
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold font-outfit mb-4 tracking-tight">URL Shortener & QR Maker</h1>
        <p className="text-muted-foreground text-lg">
          Create high-impact short links and customized QR codes in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-2xl p-8 border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-primary" /> Target Destination
            </h2>
            <div className="relative mb-6">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-awesome-website.com/long-landing-page"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-32 focus:outline-none focus:border-primary transition-all font-medium"
              />
              <button 
                onClick={handleCopy}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-2"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>

            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
            >
              <Settings size={16} /> 
              {showAdvanced ? "Hide Advanced Settings" : "Enable Security & Expiring Links"}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Password Protect</label>
                      <input 
                        type="text" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Expiration Date</label>
                      <input 
                        type="date" 
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Max Clicks</label>
                      <input 
                        type="number" 
                        value={maxClicks}
                        onChange={(e) => setMaxClicks(e.target.value)}
                        placeholder="e.g., 100"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass rounded-2xl p-8 border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette size={20} className="text-primary" /> QR Customization
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-3 block">QR Color</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={customization.color}
                    onChange={(e) => setCustomization({...customization, color: e.target.value})}
                    className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={customization.color}
                    onChange={(e) => setCustomization({...customization, color: e.target.value})}
                    className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-3 block">Background</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={customization.bgColor === '#00000000' ? '#ffffff' : customization.bgColor}
                    onChange={(e) => setCustomization({...customization, bgColor: e.target.value})}
                    className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <button 
                    onClick={() => setCustomization({...customization, bgColor: '#00000000'})}
                    className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Set Transparent
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Maximize size={16} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Resolution</span>
                </div>
                <p className="text-lg font-bold">512 x 512</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Error Correct</span>
                </div>
                <p className="text-lg font-bold">High (30%)</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Type size={16} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Format</span>
                </div>
                <p className="text-lg font-bold">PNG / SVG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5">
          <div className="glass rounded-2xl p-8 border-white/5 sticky top-24 text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">Live QR Preview</h2>
            
            <div className="aspect-square w-full max-w-[300px] mx-auto bg-white rounded-2xl flex items-center justify-center p-4 relative group overflow-hidden shadow-2xl">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-zinc-400 flex flex-col items-center">
                  <QrCode size={48} className="mb-4 opacity-10" />
                  <p className="text-xs font-medium">Enter a URL and click Generate</p>
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="text-primary" size={32} />
                  </motion.div>
                </div>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4">
              <button 
                onClick={generateQR}
                disabled={!url || isGenerating}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:bg-white/5 disabled:text-muted-foreground transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                {isGenerating ? "Generating..." : "Generate Short Link & QR"}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  disabled={!qrCode}
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = qrCode;
                    a.download = 'qrcode.png';
                    a.click();
                  }}
                  className="py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                  <Download size={16} /> PNG
                </button>
                <button className="py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all text-sm disabled:opacity-50" disabled={!qrCode}>
                  SVG
                </button>
              </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Branded links are proven to increase CTR by up to 34%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
