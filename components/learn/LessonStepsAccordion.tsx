"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import StepItem from './StepItem';
import { LessonProgress } from '@/lib/types/language';

interface LessonStepsAccordionProps {
  unitId: string;
  lessonId: string;
  lessonProgress: LessonProgress | undefined;
}

export default function LessonStepsAccordion({
  unitId,
  lessonId,
  lessonProgress
}: LessonStepsAccordionProps) {
  const router = useRouter();

  // Get step completion status
  const steps = lessonProgress?.steps || { lesson: false, quiz: false, roleplay: false };

  // Smart navigation: find first incomplete step
  const getNextStep = (): 'lesson' | 'quiz' | 'roleplay' => {
    if (!steps.lesson) return 'lesson';
    if (!steps.quiz) return 'quiz';
    if (!steps.roleplay) return 'roleplay';
    return 'lesson'; // All complete, return to lesson for review
  };

  const handleStepClick = (step: 'lesson' | 'quiz' | 'roleplay') => {
    router.push(`/${unitId}/${lessonId}/${step}`);
  };

  const handleStartLearning = () => {
    const nextStep = getNextStep();
    router.push(`/${unitId}/${lessonId}/${nextStep}`);
  };

  return (
    <div className="border-t border-gray-100 bg-white px-5 py-4">
      {/* Step List */}
      <div className="space-y-1 mb-4">
        <StepItem
          type="lesson"
          stepNumber={1}
          isCompleted={steps.lesson}
          onClick={() => handleStepClick('lesson')}
        />
        <StepItem
          type="quiz"
          stepNumber={2}
          isCompleted={steps.quiz}
          onClick={() => handleStepClick('quiz')}
        />
        <StepItem
          type="roleplay"
          stepNumber={3}
          isCompleted={steps.roleplay}
          onClick={() => handleStepClick('roleplay')}
        />
      </div>

      {/* CTA Button */}
      <Button
        onClick={handleStartLearning}
        className="w-full bg-coral hover:bg-coral-hover text-white font-semibold py-3 rounded-xl shadow-lg shadow-coral/20 transition-all active:scale-95 h-auto"
      >
        {lessonProgress?.completed ? 'Review Lesson' : 'Start Learning'}
      </Button>
    </div>
  );
}
