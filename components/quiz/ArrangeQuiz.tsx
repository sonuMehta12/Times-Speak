// components/quiz/ArrangeQuiz.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ArrangeQuestion } from "@/lib/types/quiz";

interface ArrangeQuizProps {
  question: ArrangeQuestion;
  showFeedback: boolean;
  onSubmitAnswer: (answer: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

export function ArrangeQuiz({
  question,
  showFeedback,
  onSubmitAnswer,
  disabled = false,
}: ArrangeQuizProps) {
  const [dragWords, setDragWords] = useState<string[]>([]);

  // Reset when question changes
  useEffect(() => {
    setDragWords([]);
  }, [question.id]);

  const handleCheckAnswer = () => {
    const userAnswer = dragWords.join(" ");
    const isCorrect = userAnswer === question.correct;
    onSubmitAnswer(userAnswer, isCorrect);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card className="bg-teal/5 rounded-[20px] p-5 min-h-28 border-2 border-dashed border-teal/30">
        {dragWords.length === 0 ? (
          <p className="text-text-tertiary text-center py-3 font-medium font-body text-sm">
            Tap words below to build your sentence
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {dragWords.map((word, index) => (
              <Button
                key={index}
                onClick={() =>
                  !showFeedback &&
                  !disabled &&
                  setDragWords(dragWords.filter((_, i) => i !== index))
                }
                disabled={showFeedback || disabled}
                className="px-3 py-2 bg-teal hover:bg-teal-hover text-white rounded-[12px] font-medium cursor-pointer hover:scale-105 transition-all shadow-sm text-sm disabled:opacity-50"
              >
                {word}
              </Button>
            ))}
          </div>
        )}
      </Card>

      {/* Available Words */}
      <div className="flex flex-wrap gap-2">
        {question.words
          .filter((word) => !dragWords.includes(word))
          .map((word, index) => (
            <Button
              key={index}
              onClick={() =>
                !showFeedback && !disabled && setDragWords([...dragWords, word])
              }
              disabled={showFeedback || disabled}
              variant="outline"
              className="px-3 py-2 bg-white border-2 border-gray-200 text-navy rounded-[12px] font-medium hover:border-teal hover:bg-teal/5 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {word}
            </Button>
          ))}
      </div>

      {/* Action Buttons */}
      {!showFeedback && (
        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => setDragWords([])}
            disabled={disabled}
            className="px-5 py-2.5 text-teal hover:text-teal-hover font-semibold transition-colors hover:bg-teal/10 rounded-[12px]"
          >
            Reset
          </Button>
          <Button
            onClick={handleCheckAnswer}
            disabled={dragWords.length === 0 || disabled}
            className="flex-1 px-5 py-3 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            Check Answer
          </Button>
        </div>
      )}
    </div>
  );
}
