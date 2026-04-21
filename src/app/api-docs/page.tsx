"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, ArrowLeft, Copy, Zap } from 'lucide-react';
import Link from 'next/link';

const endpoints = [
  {
    method: "POST",
    path: "/api/shorten",
    desc: "Shorten a single URL.",
    body: '{"url": "https://example.com"}'
  },
  {
    method: "POST",
    path: "/api/qr",
    desc: "Generate a custom QR code.",
    body: '{"url": "https://example.com", "color": "#8b5cf6"}'
  },
  {
    method: "POST",
    path: "/api/bulk-process",
    desc: "Process Excel/CSV for bulk QR/Shortening.",
    body: "formData: { file: File }"
  }
];

export default function ApiDocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12">
      {/* Sidebar */}
      <aside className="lg:w-64 space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-4">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Introduction</h3>
          <ul className="space-y-3">
            <li className="text-sm font-medium text-primary">Getting Started</li>
            <li className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Authentication</li>
            <li className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Rate Limits</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Endpoints</h3>
          <ul className="space-y-3">
            {endpoints.map(e => (
              <li key={e.path} className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                {e.method} {e.path}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Book size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-outfit">API Documentation</h1>
            <p className="text-muted-foreground">Version 1.0.0 Alpha</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Webmaster Alpha API allows you to programmatically access our suite of tools. 
              Our API is RESTful and organized around resource-oriented URLs. We use standard HTTP response codes, 
              authentication, and verbs.
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
            {endpoints.map((e) => (
              <div key={e.path} className="glass rounded-2xl p-8 border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-primary/20 text-primary text-xs font-bold">{e.method}</span>
                  <span className="font-mono text-sm">{e.path}</span>
                </div>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
                <div className="bg-zinc-950 rounded-xl p-4 relative group">
                  <pre className="text-xs font-mono text-zinc-400 overflow-x-auto">
                    {e.body}
                  </pre>
                  <button className="absolute right-4 top-4 p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
