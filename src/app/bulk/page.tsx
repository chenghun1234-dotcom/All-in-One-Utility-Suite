"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function BulkProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [extractMeta, setExtractMeta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus('processing');
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('extractMeta', extractMeta.toString());

    try {
      const response = await fetch('/api/bulk-process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      // Download the ZIP
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk_results_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setStatus('success');
      setProgress(100);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold font-outfit mb-4 tracking-tight">Bulk URL Processor</h1>
        <p className="text-muted-foreground text-lg">
          Process thousands of URLs for shortening and QR generation in a single batch.
        </p>
      </div>

      <div className="glass rounded-3xl p-8 md:p-12 border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Instructions */}
          <div>
            <h2 className="text-xl font-bold mb-6">How it works</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold mb-1">Prepare your file</p>
                  <p className="text-sm text-muted-foreground">Create an Excel (.xlsx) or CSV file with a column named "url" containing your links.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold mb-1">Upload & Process</p>
                  <p className="text-sm text-muted-foreground">Our engine will generate custom QR codes and tracking links for each URL.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold mb-1">Download Results</p>
                  <p className="text-sm text-muted-foreground">Download a single .ZIP file containing all your QR images and a summary report.</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
              <Link href="#" className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                <Download size={16} /> Download Sample Template
              </Link>
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex flex-col justify-center">
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                file ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".xlsx, .csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Upload className={file ? "text-primary" : "text-muted-foreground"} size={32} />
                </div>
                <p className="font-bold text-lg mb-2">{file ? file.name : "Drag & drop file here"}</p>
                <p className="text-sm text-muted-foreground">Supports XLSX, CSV (Max 10MB)</p>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-3 mt-8 mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <input 
                type="checkbox" 
                id="extractMeta" 
                checked={extractMeta} 
                onChange={(e) => setExtractMeta(e.target.checked)}
                className="w-5 h-5 rounded accent-primary border-white/20 bg-transparent"
              />
              <label htmlFor="extractMeta" className="text-sm font-medium cursor-pointer">
                Enable SEO Metadata Extraction (Title, Description, Images)
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !file || loading 
                ? 'bg-white/5 text-muted-foreground cursor-not-allowed' 
                : 'bg-primary text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-white" /> Start Bulk Process
                </>
              )}
            </button>

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3"
              >
                <CheckCircle2 size={20} />
                <span className="text-sm font-medium">Processing complete! ZIP downloaded.</span>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3"
              >
                <AlertCircle size={20} />
                <span className="text-sm font-medium">An error occurred. Please try again.</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
