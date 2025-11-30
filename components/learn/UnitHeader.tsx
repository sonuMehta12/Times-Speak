"use client";

import React from 'react';
import { CheckCircle2, BookOpen } from 'lucide-react';
import { Unit, UnitProgress } from '@/lib/types/language';

interface UnitHeaderProps {
  unit: Unit;
  unitProgress: UnitProgress | undefined;
  unitNumber: number;
}

export default function UnitHeader({ unit, unitProgress, unitNumber }: UnitHeaderProps) {
  // Calculate progress
  const totalLessons = unit.lessons.length;
  const totalSteps = (totalLessons * 3) + 2; // 3 steps per lesson + 2 final assessments

  // Count completed lesson steps
  const completedLessonSteps = unit.lessons.reduce((acc, lesson) => {
    const progress = unitProgress?.lessonsProgress?.[lesson.id];
    if (!progress) return acc;
    const stepsCompleted = [
      progress.steps.lesson,
      progress.steps.quiz,
      progress.steps.roleplay
    ].filter(Boolean).length;
    return acc + stepsCompleted;
  }, 0);

  // Count completed lessons
  const completedLessons = unit.lessons.filter(
    lesson => unitProgress?.lessonsProgress?.[lesson.id]?.completed
  ).length;

  // Count completed final assessments
  const finalQuizComplete = unitProgress?.finalQuizCompleted ? 1 : 0;
  const finalRoleplayComplete = unitProgress?.finalRoleplayCompleted ? 1 : 0;
  const finalAssessmentsComplete = finalQuizComplete + finalRoleplayComplete;

  // Total progress
  const totalCompleted = completedLessonSteps + finalQuizComplete + finalRoleplayComplete;
  const progressPercent = Math.round((totalCompleted / totalSteps) * 100);

  const isUnitComplete = unitProgress?.isCompleted;

  return (
    <div className="mb-4">
      {/* Unit Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-navy/10">
            <BookOpen className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-navy">
              {unit.title}
            </h2>
            <p className="text-sm text-gray-500">
              Unit {unitNumber}
            </p>
          </div>
        </div>

        {isUnitComplete && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal/10 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-teal" />
            <span className="text-xs font-bold text-teal">Complete</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span className="font-medium">
          {completedLessons}/{totalLessons} Lessons
        </span>
        <span className="text-gray-300">•</span>
        <span className="font-medium">
          {finalAssessmentsComplete}/2 Assessments
        </span>
        <span className="text-gray-300">•</span>
        <span className="font-semibold text-teal">
          {progressPercent}% Complete
        </span>
      </div>
    </div>
  );
}
