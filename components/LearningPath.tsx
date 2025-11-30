"use client";

import React, { useState, useEffect } from 'react';
import { useLessonContext } from '@/lib/context/LessonContext';
import { UNITS_DATA } from '@/lib/data/units';
import UnitSection from './learn/UnitSection';
import ComingSoonUnit from './learn/ComingSoonUnit';

export default function LearningPath() {
  const {
    userProgress,
    isFinalQuizUnlocked,
    isFinalRoleplayUnlocked
  } = useLessonContext();

  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  // Auto-scroll to first incomplete lesson on mount
  useEffect(() => {
    // Find first incomplete lesson
    for (const unit of UNITS_DATA) {
      for (const lesson of unit.lessons) {
        const lessonProgress = userProgress.units[unit.unitId]?.lessonsProgress?.[lesson.id];
        const incomplete = !lessonProgress?.completed;

        if (incomplete) {
          // Auto-expand first incomplete lesson
          setExpandedLessonId(lesson.id);

          // Scroll to it after a brief delay to ensure DOM is ready
          setTimeout(() => {
            const element = document.getElementById(`lesson-${lesson.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);

          return; // Stop after finding first
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {UNITS_DATA.map((unit, index) => {
          // Check if unit is locked (previous unit not complete)
          const previousUnit = UNITS_DATA[index - 1];
          const isLocked = previousUnit
            ? !userProgress.units[previousUnit.unitId]?.isCompleted
            : false;

          return (
            <UnitSection
              key={unit.unitId}
              unit={unit}
              unitNumber={index + 1}
              unitProgress={userProgress.units[unit.unitId]}
              isLocked={isLocked}
              expandedLessonId={expandedLessonId}
              onLessonExpand={setExpandedLessonId}
              isFinalQuizUnlocked={isFinalQuizUnlocked}
              isFinalRoleplayUnlocked={isFinalRoleplayUnlocked}
            />
          );
        })}

        {/* Coming Soon Section */}
        <ComingSoonUnit title="Unit 3: Business Communication" />
      </div>
    </div>
  );
}
