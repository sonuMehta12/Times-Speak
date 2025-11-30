"use client";

import React from 'react';
import { Lock } from 'lucide-react';
import { Unit, UnitProgress } from '@/lib/types/language';
import UnitHeader from './UnitHeader';
import LessonCard from './LessonCard';
import UnitFinalAssessment from './UnitFinalAssessment';

interface UnitSectionProps {
  unit: Unit;
  unitNumber: number;
  unitProgress: UnitProgress | undefined;
  isLocked: boolean;
  expandedLessonId: string | null;
  onLessonExpand: (lessonId: string | null) => void;
  isFinalQuizUnlocked: (unitId: string) => boolean;
  isFinalRoleplayUnlocked: (unitId: string) => boolean;
}

export default function UnitSection({
  unit,
  unitNumber,
  unitProgress,
  isLocked,
  expandedLessonId,
  onLessonExpand,
  isFinalQuizUnlocked,
  isFinalRoleplayUnlocked
}: UnitSectionProps) {
  // Check if all lessons are complete
  const allLessonsComplete = unit.lessons.every(
    lesson => unitProgress?.lessonsProgress?.[lesson.id]?.completed
  );

  const handleLessonToggle = (lessonId: string) => {
    if (expandedLessonId === lessonId) {
      onLessonExpand(null); // Collapse if already expanded
    } else {
      onLessonExpand(lessonId); // Expand this lesson
    }
  };

  return (
    <div className="relative">
      {/* Unit Header */}
      <UnitHeader
        unit={unit}
        unitProgress={unitProgress}
        unitNumber={unitNumber}
      />

      {/* Lock Overlay for Entire Unit */}
      {isLocked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-xl border-2 border-gray-200">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
              <Lock size={28} className="text-gray-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-navy mb-1">Unit Locked</h3>
              <p className="text-sm text-gray-500">
                Complete Unit {unitNumber - 1} to unlock this unit
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Cards */}
      <div className="space-y-4 mb-6">
        {unit.lessons.map((lesson, index) => {
          const lessonProgress = unitProgress?.lessonsProgress?.[lesson.id];

          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              lessonNumber={index + 1}
              lessonProgress={lessonProgress}
              isExpanded={expandedLessonId === lesson.id}
              onToggleExpand={() => handleLessonToggle(lesson.id)}
              unitId={unit.unitId}
            />
          );
        })}
      </div>

      {/* Unit Final Assessment */}
      {unit.finalQuiz && (
        <UnitFinalAssessment
          unit={unit}
          unitProgress={unitProgress}
          allLessonsComplete={allLessonsComplete}
          isFinalQuizUnlocked={isFinalQuizUnlocked(unit.unitId)}
          isFinalRoleplayUnlocked={isFinalRoleplayUnlocked(unit.unitId)}
          unitId={unit.unitId}
        />
      )}
    </div>
  );
}
