"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLessonContext } from '@/lib/context/LessonContext';
import { UNITS_DATA } from '@/lib/data/units';
import { Lesson } from '@/lib/types/language';

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

export default function DailyLessonCard() {
  const router = useRouter();
  const { isLessonUnlocked } = useLessonContext();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Get all lessons from Unit 1
  const allLessons = UNITS_DATA[0].lessons;
  const unitId = UNITS_DATA[0].unitId;

  // Filter to only unlocked lessons
  const unlockedLessons = useMemo(() => {
    return allLessons.filter(lesson => isLessonUnlocked(lesson.id, unitId));
  }, [allLessons, isLessonUnlocked, unitId]);

  // Current lesson to display
  const currentLesson = unlockedLessons[currentLessonIndex] || allLessons[0];

  // Handle swap to next lesson
  const handleSwap = () => {
    setCurrentLessonIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % unlockedLessons.length;
      return nextIndex;
    });
  };

  // Handle start lesson
  const handleStartLesson = () => {
    router.push(`/${unitId}/${currentLesson.id}/lesson`);
  };

  // Handle view all lessons
  const handleViewAll = () => {
    router.push('/learn');
  };

  if (!currentLesson) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">
        Daily Lesson
      </h2>

      <div className="relative group w-full bg-white rounded-3xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100 transition-transform hover:scale-[1.01] duration-300">

        {/* Lesson Image or Solid Color Background with Emoji */}
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4"
        >
          {currentLesson.imageUrl ? (
            // Display image if available
            <img 
              src={currentLesson.imageUrl} 
              alt={currentLesson.title || 'Daily lesson image'}
              className="w-full h-full object-cover"
            />
          ) : (
            // Fallback to colored background with emoji
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: getCategoryColor(currentLesson.category) }}
            >
              <div className="text-6xl">
                {getCategoryEmoji(currentLesson.category)}
              </div>
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-navy shadow-sm">
            {currentLesson.duration || '5 min'}
          </div>

          {/* Play Icon */}
          <div className="absolute bottom-3 right-3 bg-navy/80 backdrop-blur-sm p-2 rounded-full text-white">
            <Play size={20} fill="currentColor" />
          </div>
        </div>

        {/* Content */}
        <div className="px-1">
          {currentLesson.category && (
            <span className="inline-block px-2 py-1 rounded-lg text-xs font-semibold bg-coral/10 text-coral mb-2">
              {currentLesson.category}
            </span>
          )}
          <h3 className="text-2xl font-bold text-navy leading-tight mb-1">
            {currentLesson.title || currentLesson.phrase}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {currentLesson.subtitle || currentLesson.phraseMeaning}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleStartLesson}
              className="w-full bg-coral hover:bg-coral-hover text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-coral/20 active:scale-95 transition-all h-auto"
            >
              Start Lesson
            </Button>
            
            <div className="flex gap-3">
              <Button
                onClick={handleViewAll}
                variant="outline"
                className="flex-1 border-2 border-navy/20 hover:border-navy/40 hover:bg-navy/5 text-navy font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 h-auto"
              >
                View All
              </Button>
              {unlockedLessons.length > 1 && (
                <Button
                  onClick={handleSwap}
                  className="bg-coral/10 hover:bg-coral/20 text-coral font-semibold py-3 px-5 rounded-xl transition-colors active:scale-95 h-auto"
                >
                  <RefreshCw size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
