"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: "Basic",
    price: "Free",
    features: ["10 requests / day", "Standard QR Codes", "Low-res screenshots", "Community support"],
    cta: "Current Plan",
    highlight: false
  },
  {
    name: "Pro",
    price: "$19/mo",
    features: ["200 requests / bulk", "Custom QR Logos", "Full-res screenshots", "Email support", "API Access"],
    cta: "Upgrade to Pro",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "$49/mo",
    features: ["2,000 requests / bulk", "SVG/Vectored QR", "Priority Support", "Dedicated Infrastructure", "Commercial License"],
    cta: "Contact Sales",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-6">Simple, Scalable Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your workflow. From solo developers to global agencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`p-8 rounded-3xl glass border-white/5 flex flex-col ${tier.highlight ? 'ring-2 ring-primary bg-primary/5' : ''}`}
          >
            <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.price !== 'Free' && <span className="text-muted-foreground">/month</span>}
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check size={16} className="text-emerald-500" /> {feature}
                </li>
              ))}
            </ul>

            <Link 
              href={`/checkout/${tier.name}`}
              className={`w-full py-4 rounded-xl font-bold transition-all text-center ${
                tier.highlight ? 'bg-primary text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
