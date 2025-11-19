// components/quiz/ComprehensionQuiz.tsx
"use client";

import React from "react";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import type { ComprehensionQuestion } from "@/lib/types/quiz";

interface ComprehensionQuizProps {
  question: ComprehensionQuestion;
  selectedAnswer: number | null;
  showFeedback: boolean;
  onSelectAnswer: (index: number) => void;
  disabled?: boolean;
}

export function ComprehensionQuiz({
  question,
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
  disabled = false,
}: ComprehensionQuizProps) {
  return (
    <>
      <div className="bg-navy/5 rounded-[16px] p-3 mb-3 border border-gray-200">
        <p className="text-sm text-navy leading-snug font-medium italic font-body text-center">
          "{question.sentence}"
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
