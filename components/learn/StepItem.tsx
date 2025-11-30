"use client";

import React from 'react';
import { BookOpen, Brain, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface StepItemProps {
  type: 'lesson' | 'quiz' | 'roleplay';
  stepNumber: number;
  isCompleted: boolean;
  onClick: () => void;
}

const stepConfig = {
  lesson: {
    label: 'Theory & Concept',
    icon: BookOpen,
    description: 'Learn the core phrases'
  },
  quiz: {
    label: 'Quick Quiz',
    icon: Brain,
    description: 'Test your understanding'
  },
  roleplay: {
    label: 'Role-play Scenario',
    icon: MessageCircle,
    description: 'Practice real dialogue'
  }
};

export default function StepItem({ type, stepNumber, isCompleted, onClick }: StepItemProps) {
  const config = stepConfig[type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
    >
      {/* Icon Circle */}
      <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
        isCompleted
          ? 'bg-teal text-white'
          : 'bg-navy/10 text-navy'
      }`}>
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <h4 className={`text-sm font-semibold ${
            isCompleted ? 'text-teal' : 'text-navy'
          }`}>
            {config.label}
          </h4>
          {!isCompleted && (
            <span className="px-2 py-0.5 text-xs font-bold bg-coral/10 text-coral rounded-full">
              Step {stepNumber}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
      </div>

      {/* Arrow */}
      <ChevronRight className={`w-5 h-5 transition-all ${
        isCompleted ? 'text-teal' : 'text-gray-400 group-hover:text-navy group-hover:translate-x-0.5'
      }`} />
    </button>
  );
}
