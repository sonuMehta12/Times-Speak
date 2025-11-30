"use client";

import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Clock, Play } from 'lucide-react';
import { Lesson, LessonProgress } from '@/lib/types/language';
import LessonStepsAccordion from './LessonStepsAccordion';

// Category to solid color mapping
const getCategoryColor = (category?: string): string => {
  const colorMap: Record<string, string> = {
    'Conversation': '#E8F5F3',      // Light teal
    'Professional': '#E8EDF5',      // Light navy
    'Introduction': '#FFE8E8',      // Light coral
    'Personal': '#FFF4E8',          // Light orange
    'Workplace': '#F0E8FF',         // Light purple
  };
  return colorMap[category || 'Conversation'] || '#E8F5F3';
};

// Category to emoji mapping
const getCategoryEmoji = (category?: string): string => {
  const emojiMap: Record<string, string> = {
    'Conversation': '💬',
    'Professional': '💼',
    'Introduction': '👋',
    'Personal': '🙂',
    'Workplace': '🏢',
  };
  return emojiMap[category || 'Conversation'] || '📚';
};

interface LessonCardProps {
  lesson: Lesson;
  lessonNumber: number;
  lessonProgress: LessonProgress | undefined;
  isExpanded: boolean;
  onToggleExpand: () => void;
  unitId: string;
}

export default function LessonCard({
  lesson,
  lessonNumber,
  lessonProgress,
  isExpanded,
  onToggleExpand,
  unitId
}: LessonCardProps) {
  // Calculate step completion
  const steps = lessonProgress?.steps || { lesson: false, quiz: false, roleplay: false };
  const stepsCompleted = [steps.lesson, steps.quiz, steps.roleplay].filter(Boolean).length;
  const isCompleted = lessonProgress?.completed || false;
  const hasProgress = stepsCompleted > 0;

  // Determine card state
  const getCardStyles = () => {
    if (isCompleted) {
      return 'bg-teal/5 border-teal hover:shadow-lg';
    }
    if (hasProgress) {
      return 'bg-white border-gold hover:shadow-lg';
    }
    return 'bg-white border-gray-200 hover:shadow-lg';
  };

  return (
    <div
      id={`lesson-${lesson.id}`}
      className={`relative rounded-2xl border-2 shadow-md transition-all duration-300 overflow-hidden ${getCardStyles()} ${
        isExpanded ? 'ring-2 ring-navy/10' : ''
      }`}
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={onToggleExpand}
        className="w-full text-left transition-transform duration-200 hover:scale-[1.01]"
      >
        <div className="p-4">
          {/* Solid Color Background with Emoji */}
          <div
            className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-3 shadow-sm flex items-center justify-center"
            style={{ backgroundColor: getCategoryColor(lesson.category) }}
          >
            {/* Lesson Number Badge */}
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-navy shadow-sm">
              #{lessonNumber}
            </div>

            {/* Category Emoji */}
            <div className="text-5xl opacity-70">
              {getCategoryEmoji(lesson.category)}
            </div>

            {/* Duration Badge */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-navy shadow-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.duration || '5 min'}
            </div>

            {/* Completed Overlay */}
            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center bg-teal/80 text-white backdrop-blur-[1px]">
                <CheckCircle2 size={32} />
              </div>
            )}

            {/* Play Icon for Available Lessons */}
            {!isCompleted && (
              <div className="absolute bottom-2 right-2 bg-navy/80 backdrop-blur-sm p-1.5 rounded-full text-white">
                <Play size={16} fill="currentColor" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Lesson Number & Category */}
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block px-2 py-0.5 rounded-md text-xs font-bold bg-coral/10 text-coral">
                  Lesson {lessonNumber}
                </span>
                {lesson.category && (
                  <span className="text-xs text-gray-500 font-medium">
                    {lesson.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold leading-tight mb-1 text-navy">
                {lesson.title}
              </h3>

              {/* Subtitle */}
              <p className="text-sm text-gray-500 line-clamp-2">
                {lesson.subtitle || lesson.phraseMeaning}
              </p>

              {/* Progress Indicator */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        step <= stepsCompleted ? 'bg-teal' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {stepsCompleted}/3 steps
                </span>
              </div>
            </div>

            {/* Expand/Collapse Icon */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              isExpanded ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-400'
            }`}>
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>
      </button>

      {/* Expandable Section - Lesson Steps Accordion */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <LessonStepsAccordion
          unitId={unitId}
          lessonId={lesson.id}
          lessonProgress={lessonProgress}
        />
      </div>
    </div>
  );
}
