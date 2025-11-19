// components/quiz/ContextQuiz.tsx
"use client";

import React from "react";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import type { ContextQuestion } from "@/lib/types/quiz";

interface ContextQuizProps {
  question: ContextQuestion;
  selectedAnswer: number | null;
  showFeedback: boolean;
  onSelectAnswer: (index: number) => void;
  disabled?: boolean;
}

export function ContextQuiz({
  question,
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
  disabled = false,
}: ContextQuizProps) {
  return (
    <>
      <div className="bg-gradient-to-br from-coral/10 to-coral/5 rounded-[16px] p-3 mb-3 border border-coral/20">
        <div className="inline-block px-2 py-0.5 bg-coral/20 text-coral text-[10px] font-semibold rounded-[6px] mb-2">
          SCENARIO
        </div>
        <p className="text-sm text-navy leading-snug font-medium font-body">
          {question.scenario}
        </p>
      </div>

      <MultipleChoiceOptions
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={question.correct}
        showFeedback={showFeedback}
        onSelectAnswer={onSelectAnswer}
        disabled={disabled}
      />
    </>
  );
}
