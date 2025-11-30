"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Target, Trophy, Lock, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Unit, UnitProgress } from '@/lib/types/language';

interface UnitFinalAssessmentProps {
  unit: Unit;
  unitProgress: UnitProgress | undefined;
  allLessonsComplete: boolean;
  isFinalQuizUnlocked: boolean;
  isFinalRoleplayUnlocked: boolean;
  unitId: string;
}

export default function UnitFinalAssessment({
  unit,
  unitProgress,
  allLessonsComplete,
  isFinalQuizUnlocked,
  isFinalRoleplayUnlocked,
  unitId
}: UnitFinalAssessmentProps) {
  const router = useRouter();

  const finalQuizComplete = unitProgress?.finalQuizCompleted || false;
  const finalRoleplayComplete = unitProgress?.finalRoleplayCompleted || false;

  const handleQuizClick = () => {
    if (isFinalQuizUnlocked) {
      router.push(`/${unitId}/final/quiz`);
    }
  };

  const handleRoleplayClick = () => {
    if (isFinalRoleplayUnlocked) {
      router.push(`/${unitId}/final/roleplay`);
    }
  };

  return (
    <div className="mt-6">
      {/* Section Title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-navy mb-1">Unit Assessment</h3>
        <p className="text-sm text-gray-500">
          Complete both assessments to unlock the next unit
        </p>
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Final Quiz Card */}
        <div
          className={`relative rounded-2xl border-2 p-5 transition-all duration-300 ${
            finalQuizComplete
              ? 'bg-teal/5 border-teal'
              : isFinalQuizUnlocked
              ? 'bg-white border-gray-200 hover:shadow-lg cursor-pointer'
              : 'bg-gray-50 border-gray-300 opacity-60'
          }`}
          onClick={handleQuizClick}
        >
          {/* Lock Overlay */}
          {!isFinalQuizUnlocked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-2xl">
              <div className="flex flex-col items-center gap-2">
                <Lock size={24} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Complete all lessons</span>
              </div>
            </div>
          )}

          {/* Icon */}
          <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
            finalQuizComplete
              ? 'bg-teal/20'
              : 'bg-navy/10'
          }`}>
            {finalQuizComplete ? (
              <CheckCircle2 className="w-7 h-7 text-teal" />
            ) : (
              <Target className="w-7 h-7 text-navy" />
            )}
          </div>

          {/* Title */}
          <h4 className={`text-base font-bold mb-1 ${
            finalQuizComplete ? 'text-teal' : 'text-navy'
          }`}>
            Final Quiz
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-3">
            Test your knowledge across all lessons
          </p>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-gold">+100 XP</span>
          </div>

          {/* Button */}
          {isFinalQuizUnlocked && !finalQuizComplete && (
            <Button
              className="w-full bg-coral hover:bg-coral-hover text-white font-semibold py-2 rounded-xl transition-all active:scale-95 h-auto text-sm"
            >
              Start Final Quiz
            </Button>
          )}

          {finalQuizComplete && (
            <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-teal/10 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-teal" />
              <span className="text-sm font-bold text-teal">Completed</span>
            </div>
          )}
        </div>

        {/* Final Roleplay Card */}
        <div
          className={`relative rounded-2xl border-2 p-5 transition-all duration-300 ${
            finalRoleplayComplete
              ? 'bg-teal/5 border-teal'
              : isFinalRoleplayUnlocked
              ? 'bg-white border-gray-200 hover:shadow-lg cursor-pointer'
              : 'bg-gray-50 border-gray-300 opacity-60'
          }`}
          onClick={handleRoleplayClick}
        >
          {/* Lock Overlay */}
          {!isFinalRoleplayUnlocked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-2xl">
              <div className="flex flex-col items-center gap-2">
                <Lock size={24} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Complete final quiz first</span>
              </div>
            </div>
          )}

          {/* Icon */}
          <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
            finalRoleplayComplete
              ? 'bg-teal/20'
              : 'bg-navy/10'
          }`}>
            {finalRoleplayComplete ? (
              <CheckCircle2 className="w-7 h-7 text-teal" />
            ) : (
              <Trophy className="w-7 h-7 text-navy" />
            )}
          </div>

          {/* Title */}
          <h4 className={`text-base font-bold mb-1 ${
            finalRoleplayComplete ? 'text-teal' : 'text-navy'
          }`}>
            Final Roleplay
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-3">
            Master a comprehensive conversation
          </p>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-gold">+150 XP</span>
          </div>

          {/* Button */}
          {isFinalRoleplayUnlocked && !finalRoleplayComplete && (
            <Button
              className="w-full bg-coral hover:bg-coral-hover text-white font-semibold py-2 rounded-xl transition-all active:scale-95 h-auto text-sm"
            >
              Start Final Roleplay
            </Button>
          )}

          {finalRoleplayComplete && (
            <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-teal/10 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-teal" />
              <span className="text-sm font-bold text-teal">Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
