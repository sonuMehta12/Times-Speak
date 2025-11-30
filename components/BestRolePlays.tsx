"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Play } from 'lucide-react';
import { getFeaturedScenarios } from '@/lib/data/roleplay-scenarios';

export default function BestRolePlays() {
  const router = useRouter();
  const scenarios = getFeaturedScenarios().slice(0, 5); // Get top 5 featured scenarios

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-bold text-navy text-lg">Best Role Plays</h3>
        <button
          onClick={() => router.push('/explore')}
          className="text-coral text-sm font-semibold flex items-center hover:underline"
        >
          Explore all <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => router.push(`/role/${scenario.id}`)}
            className="snap-start shrink-0 w-60 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* Image Thumbnail */}
            <div className="h-32 w-full relative overflow-hidden">
              <img
                src={scenario.image}
                alt={scenario.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm p-1.5 rounded-full text-white">
                <Play size={12} fill="currentColor" />
              </div>
              <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-navy">
                {scenario.difficulty}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="font-bold text-navy leading-snug mb-1">
                {scenario.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2">
                {scenario.description}
              </p>
              {scenario.duration && (
                <p className="text-xs text-teal font-semibold mt-2">
                  {scenario.duration}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
