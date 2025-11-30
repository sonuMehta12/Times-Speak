"use client";

import React from 'react';
import LearningPath from '@/components/LearningPath';

export default function LearnPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-navy mb-1">Your Learning Path</h1>
        <p className="text-sm text-gray-500">Continue your journey to English mastery</p>
      </div>

      {/* Learning Path */}
      <LearningPath />
    </div>
  );
}
