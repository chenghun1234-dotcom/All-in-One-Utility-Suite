"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, User, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [userData, setUserData] = useState<{email: string, tier: string} | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'me' }),
      });
      const data = await res.json();
      if (data.user) setUserData(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUserData(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight">
            WEBMASTER <span className="text-primary">ALPHA</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/shortener" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Tools</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/api-docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">API Docs</Link>
        </div>

        <div className="flex items-center gap-4">
          {userData ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass border-white/10 hover:bg-white/5 transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <User size={14} />
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">{userData.email}</span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-2xl border-white/10 shadow-2xl overflow-hidden py-2">
                  <div className="px-4 py-2 border-b border-white/5 mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Current Plan</p>
                    <p className="text-sm font-bold text-primary">{userData.tier}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-white/5 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="px-4 py-2 text-sm font-semibold glass-accent text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
