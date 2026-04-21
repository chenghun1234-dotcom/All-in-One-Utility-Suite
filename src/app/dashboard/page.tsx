"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon, ExternalLink, Edit2, BarChart3, Clock, Lock, Trash2, Save, X, Search } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (data.links) setLinks(data.links);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, originalUrl: newUrl }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLinks = links.filter(l => 
    l.originalUrl.toLowerCase().includes(search.toLowerCase()) || 
    l.shortId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-outfit mb-2">My Links & Analytics</h1>
          <p className="text-muted-foreground">Manage your dynamic redirects and track engagement.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-6 py-3 rounded-xl glass border-white/10 w-full md:w-64 focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <motion.div 
              layout
              key={link.id}
              className="glass rounded-2xl p-6 border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${link.type === 'dynamic' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                      <LinkIcon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-2">
                        {link.shortId} 
                        {link.password && <Lock size={12} className="text-amber-500" />}
                        {link.expiresAt && <Clock size={12} className="text-orange-500" />}
                      </h3>
                      <p className="text-xs text-muted-foreground">Created {new Date(link.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {editingId === link.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-primary"
                      />
                      <button onClick={() => handleUpdate(link.id)} className="p-2 bg-primary text-white rounded-lg"><Save size={16}/></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-white/5 text-muted-foreground rounded-lg"><X size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/url">
                      <p className="text-sm text-foreground/80 truncate max-w-md">{link.originalUrl}</p>
                      {link.type === 'dynamic' && (
                        <button 
                          onClick={() => { setEditingId(link.id); setNewUrl(link.originalUrl); }}
                          className="p-1.5 opacity-0 group-hover/url:opacity-100 hover:bg-white/10 rounded transition-all"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-center">
                    <p className="text-2xl font-bold font-outfit">{link.clicks}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Clicks</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link 
                      href={link.originalUrl} 
                      target="_blank"
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass rounded-2xl border-dashed border-white/10">
            <p className="text-muted-foreground">No links found. Create your first short link!</p>
          </div>
        )}
      </div>
    </div>
  );
}
