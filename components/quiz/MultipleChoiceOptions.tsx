// components/quiz/MultipleChoiceOptions.tsx
"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultipleChoiceOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showFeedback: boolean;
  onSelectAnswer: (index: number) => void;
  disabled?: boolean;
  labelType?: "letter" | "number" | "text";
}

export function MultipleChoiceOptions({
  options,
  selectedAnswer,
  correctAnswer,
  showFeedback,
  onSelectAnswer,
  disabled = false,
  labelType = "letter",
}: MultipleChoiceOptionsProps) {
  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = index === correctAnswer;
        const showResult = showFeedback && isSelected;

        return (
          <Button
            key={index}
            onClick={() => !disabled && !showFeedback && onSelectAnswer(index)}
            disabled={disabled || showFeedback}
            variant="outline"
            className={`w-full p-3 h-auto rounded-[16px] border-2 text-left transition-all ${
              showResult
                ? isCorrect
                  ? "border-success bg-success/10 shadow-sm hover:bg-success/10"
                  : "border-error bg-error/10 shadow-sm hover:bg-error/10"
                : isSelected
                ? "border-teal bg-teal/10 shadow-sm hover:bg-teal/10"
                : "border-gray-200 hover:border-teal hover:bg-teal/5"
            } ${showFeedback || disabled ? "cursor-default" : "cursor-pointer"}`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 flex-1">
                <div
                  className={`w-7 h-7 rounded-[10px] flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                    showResult
                      ? isCorrect
                        ? "bg-success text-white shadow-sm"
                        : "bg-error text-white shadow-sm"
                      : isSelected
                      ? "bg-teal text-white shadow-sm"
                      : "bg-gray-100 text-text-secondary"
                  }`}
                >
                  {labelType === "letter"
                    ? String.fromCharCode(65 + index)
                    : labelType === "number"
                    ? (index + 1).toString()
                    : option}
                </div>
                <span className="text-sm text-text-primary font-medium leading-snug font-body text-left">
                  {option}
                </span>
              </div>
              {showResult && (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
