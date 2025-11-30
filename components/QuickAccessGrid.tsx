"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bot, MessageSquare, GraduationCap } from 'lucide-react';

export default function QuickAccessGrid() {
  const router = useRouter();

  const actions = [
    {
      label: 'Role Play',
      icon: MessageSquare,
      color: 'bg-coral/10 text-coral',
      route: '/explore'
    },
    {
      label: 'AI Tutor',
      icon: Bot,
      color: 'bg-teal/10 text-teal',
      route: '/aditi'
    },
    {
      label: 'Learn',
      icon: GraduationCap,
      color: 'bg-gold/10 text-gold',
      route: '/learn'
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => router.push(action.route)}
          className="flex flex-col items-center justify-center gap-3 bg-white p-4 py-6 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition-colors hover:shadow-md"
        >
          <div className={`p-3 rounded-xl ${action.color}`}>
            <action.icon size={24} />
          </div>
          <span className="font-semibold text-navy text-sm">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
