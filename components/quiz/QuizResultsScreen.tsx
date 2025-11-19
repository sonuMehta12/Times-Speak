// components/quiz/QuizResultsScreen.tsx
"use client";

import React from "react";
import {
  Trophy,
  Award,
  Sparkles,
  Check,
  X,
  Zap,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizResultsScreenProps {
  totalCorrect: number;
  totalQuestions: number;
  xpEarned: number;
  onContinue: () => void;
  onRetry: () => void;
  onBackToLessons?: () => void;
  showRoleplayButton?: boolean;
}

export function QuizResultsScreen({
  totalCorrect,
  totalQuestions,
  xpEarned,
  onContinue,
  onRetry,
  onBackToLessons,
  showRoleplayButton = true,
}: QuizResultsScreenProps) {
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const isPerfect = percentage === 100;
  const isGreat = percentage >= 80;
  const isGood = percentage >= 60;

  return (
    <div className="w-full">
      <Card className="border-gray-200 rounded-[24px] shadow-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-navy p-8 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>

          {/* Confetti Effect */}
          {isPerfect && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ["#D4AF37", "#FF6B6B", "#06B6D4", "#0A2463", "#10B981"][
                      Math.floor(Math.random() * 5)
                    ],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
          )}

          <div className="relative">
            <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gold/30">
              {isPerfect ? (
                <Trophy className="w-12 h-12 text-gold" />
              ) : isGreat ? (
                <Award className="w-12 h-12 text-gold" />
              ) : (
                <Sparkles className="w-12 h-12 text-white" />
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-2 font-display">
              {isPerfect
                ? "Perfect Score!"
                : isGreat
                ? "Excellent Work!"
                : isGood
                ? "Well Done!"
                : "Keep Practicing!"}
            </h1>
            <p className="text-white/80 text-base font-body">
              {isPerfect
                ? "You've mastered all the concepts!"
                : isGreat
                ? "You're doing great! Keep it up!"
                : isGood
                ? "Good progress! A bit more practice will help."
                : "Don't worry, practice makes perfect!"}
            </p>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Progress Bar with Percentage */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-secondary font-body">Your Score</span>
              <span className="text-2xl font-bold text-teal font-display">{percentage}%</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-200">
              <div
                className="absolute top-0 left-0 h-full bg-teal rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-text-secondary mt-2 font-body">
              {totalCorrect} of {totalQuestions} correct
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="bg-gradient-to-br from-success/10 to-success/5 rounded-[20px] p-4 text-center border-success/20">
              <div className="w-10 h-10 bg-success rounded-[16px] flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-navy mb-0.5 font-display">
                {totalCorrect}
              </div>
              <div className="text-xs text-text-secondary font-body">Correct</div>
            </Card>

            <Card className="bg-gradient-to-br from-error/10 to-error/5 rounded-[20px] p-4 text-center border-error/20">
              <div className="w-10 h-10 bg-error rounded-[16px] flex items-center justify-center mx-auto mb-2 shadow-sm">
                <X className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-navy mb-0.5 font-display">
                {totalQuestions - totalCorrect}
              </div>
              <div className="text-xs text-text-secondary font-body">Incorrect</div>
            </Card>

            <Card className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-[20px] p-4 text-center border-gold/20">
              <div className="w-10 h-10 bg-gold rounded-[16px] flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-navy mb-0.5 font-display">
                +{xpEarned}
              </div>
              <div className="text-xs text-text-secondary font-body">XP</div>
            </Card>
          </div>

          {/* Rewards */}
          {isGreat && (
            <Card className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-[20px] p-5 mb-6 border-2 border-gold/20">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gold rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-navy mb-1 font-display">
                    Achievement Unlocked!
                  </div>
                  <div className="text-gold font-medium mb-1 font-body text-sm">
                    {isPerfect ? "Perfect Score Master" : "Quiz Champion"}
                  </div>
                  <p className="text-xs text-text-primary font-body">
                    {isPerfect
                      ? "You answered all questions correctly!"
                      : "You scored over 80% - excellent work!"}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {showRoleplayButton && (
              <Button
                onClick={onContinue}
                className="w-full py-4 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Practice Role-Play
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}

            {!showRoleplayButton && (
              <Button
                onClick={onContinue}
                className="w-full py-4 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onRetry}
                className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-medium hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              {onBackToLessons && (
                <Button
                  variant="outline"
                  onClick={onBackToLessons}
                  className="flex-1 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-semibold hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
                >
                  Back to Lessons
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
