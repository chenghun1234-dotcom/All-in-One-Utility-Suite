"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link as LinkIcon, 
  QrCode, 
  Monitor, 
  LineChart, 
  Zap, 
  Shield, 
  ArrowRight,
  Database
} from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: "URL Shortener & QR",
    description: "Create branded short links and custom QR codes with high-resolution output.",
    icon: LinkIcon,
    href: "/shortener",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Bulk Processor",
    description: "Upload Excel/CSV to process thousands of URLs and generate ZIP archives instantly.",
    icon: Database,
    href: "/bulk",
    color: "from-purple-500 to-indigo-500",
  },
  {
    title: "Website Screenshot",
    description: "Capture high-quality screenshots of any website in multiple resolutions.",
    icon: Monitor,
    href: "/screenshot",
    color: "from-rose-500 to-orange-500",
  },
  {
    title: "Link Security Vault",
    description: "Enterprise-grade security: Password protection, self-destructing links, and precision click limits.",
    icon: Shield,
    href: "/shortener",
    color: "from-indigo-600 to-violet-600",
  }
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 text-xs font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground uppercase tracking-wider">The Ultimate Webkit for Professionals</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6 tracking-tight">
            Scale Your Digital <br />
            <span className="text-gradient">Empire with Webmaster</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            A high-performance suite of professional tools designed for marketers, developers, and agency owners. 
            Integrated, fast, and optimized for RapidAPI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/bulk" className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all flex items-center gap-2">
              Start Building Now <ArrowRight size={18} />
            </Link>
            <Link href="/api-docs" className="px-8 py-4 rounded-xl glass font-bold hover:bg-white/5 transition-all">
              View API Docs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-6 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-outfit mb-4">Professional Utility Suite</h2>
          <p className="text-muted-foreground">Everything you need to streamline your web workflow in one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={tool.href}>
                <div className="h-full p-8 rounded-2xl glass border-white/5 group-hover:border-primary/50 transition-all flex flex-col">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 text-white`}>
                    <tool.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <div className="mt-auto flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Tool <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* API Monetization Callout */}
      <section className="py-20 px-6 w-full max-w-5xl mx-auto">
        <div className="rounded-3xl glass-accent p-12 text-center border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={120} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Ready for RapidAPI</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            All tools are available via high-volume API endpoints. Perfect for bulk operations and agency integrations.
          </p>
          <div className="flex gap-4 justify-center">
            <div className="px-4 py-2 rounded-lg bg-white/5 text-xs font-mono">GET /api/v1/shorten</div>
            <div className="px-4 py-2 rounded-lg bg-white/5 text-xs font-mono">POST /api/v1/bulk</div>
          </div>
        </div>
      </section>
    </div>
  );
}
