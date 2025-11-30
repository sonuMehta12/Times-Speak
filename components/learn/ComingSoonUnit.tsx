"use client";

import React from 'react';
import { Lock, Sparkles, Rocket } from 'lucide-react';

interface ComingSoonUnitProps {
  title?: string;
}

export default function ComingSoonUnit({ title = "Unit 3: Business Communication" }: ComingSoonUnitProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-hover p-8 text-center text-white shadow-xl">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-teal opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-coral opacity-20 blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Lock Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal to-teal-hover shadow-lg">
          <Lock className="h-10 w-10 text-white" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Coming Soon</span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-2xl font-bold">{title}</h3>

        {/* Description */}
        <p className="mb-8 max-w-md text-sm text-white/80">
          Complete all previous units and assessments to unlock the next level of your journey. Great things are coming!
        </p>

        {/* Stats Grid */}
        <div className="grid w-full max-w-sm grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
            <Sparkles className="mb-2 h-6 w-6 text-gold" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">Next Reward</span>
            <span className="font-bold text-white">Gold Badge</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
            <Rocket className="mb-2 h-6 w-6 text-teal" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">Skill Up</span>
            <span className="font-bold text-white">Business Talk</span>
          </div>
        </div>

        {/* Notify Button */}
        <button className="rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95">
          Notify Me When Available
        </button>
      </div>
    </div>
  );
}
