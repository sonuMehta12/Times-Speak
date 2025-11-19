// components/quiz/FinalQuizSummary.tsx
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
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FinalQuizSummaryProps {
  totalCorrect: number;
  totalQuestions: number;
  xpEarned: number;
  unitTitle: string;
  onStartRoleplay: () => void;
  onRetry: () => void;
  onBackHome: () => void;
}

export function FinalQuizSummary({
  totalCorrect,
  totalQuestions,
  xpEarned,
  unitTitle,
  onStartRoleplay,
  onRetry,
  onBackHome,
}: FinalQuizSummaryProps) {
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const isPerfect = percentage === 100;
  const isGreat = percentage >= 80;
  const isGood = percentage >= 60;
  const canProceedToRoleplay = percentage >= 70; // Must score at least 70% to proceed

  // Generate strengths and areas to review based on performance
  const getPerformanceFeedback = () => {
    if (isPerfect) {
      return {
        strengths: "You excelled in all areas! Perfect comprehension, pronunciation, and sentence construction.",
        areasToReview: null,
      };
    } else if (isGreat) {
      return {
        strengths: "You have a strong grasp of introductions and greetings. Your listening skills are excellent!",
        areasToReview: "Review the questions you missed to reinforce your understanding.",
      };
    } else if (isGood) {
      return {
        strengths: "You're making good progress with basic conversation patterns.",
        areasToReview: "Practice listening and speaking more to build confidence before the roleplay.",
      };
    } else {
      return {
        strengths: "You're learning! Every attempt helps you improve.",
        areasToReview: "Review lessons 1-5 again, focusing on listening and pronunciation. Then retry the quiz!",
      };
    }
  };

  const feedback = getPerformanceFeedback();

  return (
    <div className="w-full max-w-3xl mx-auto">
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
              Quiz Complete!
            </h1>
            <p className="text-white/80 text-base font-body">
              {unitTitle} Final Assessment
            </p>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Score Display */}
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

          {/* Performance Feedback */}
          <Card className="bg-gradient-to-br from-teal/5 to-navy/5 rounded-[20px] p-5 mb-6 border-teal/20">
            <h3 className="text-lg font-bold text-navy mb-3 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal" />
              Performance Summary
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-start gap-2 mb-1">
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy font-body">Strengths</p>
                    <p className="text-sm text-text-secondary font-body">{feedback.strengths}</p>
                  </div>
                </div>
              </div>

              {feedback.areasToReview && (
                <div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-navy font-body">Areas to Review</p>
                      <p className="text-sm text-text-secondary font-body">{feedback.areasToReview}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Achievement Badge */}
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
                    {isPerfect ? "Introduction Master" : "Quiz Champion"}
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

          {/* Roleplay Preview */}
          {canProceedToRoleplay && (
            <Card className="bg-gradient-to-br from-coral/10 to-coral/5 rounded-[20px] p-5 mb-6 border-coral/20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-coral rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-md">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1 font-display">
                    You're Ready for the Final Roleplay!
                  </h3>
                  <p className="text-sm text-text-secondary font-body">
                    Put your introduction skills to practice in a real conversation
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-4 mb-4">
                <h4 className="text-sm font-semibold text-navy mb-2 font-body">What you'll practice:</h4>
                <div className="space-y-2">
                  {[
                    "Greet someone appropriately in different contexts",
                    "Introduce yourself with confidence",
                    "Ask and answer questions about work and origin",
                    "Discuss hobbies and interests naturally",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-text-primary font-body">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-text-secondary italic font-body">
                In the roleplay, you'll meet someone new at a networking event. Use everything you've learned!
              </p>
            </Card>
          )}

          {/* Warning if score too low */}
          {!canProceedToRoleplay && (
            <Card className="bg-gradient-to-br from-error/10 to-error/5 rounded-[20px] p-5 mb-6 border-error/20">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-error rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-md">
                  <X className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy mb-1 font-display">
                    Almost There!
                  </h3>
                  <p className="text-sm text-text-secondary font-body">
                    You need at least 70% to unlock the final roleplay. Review the lessons and try again!
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {canProceedToRoleplay && (
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-coral/10 to-teal/10 rounded-[16px] p-3 border border-coral/20">
                  <p className="text-xs font-semibold text-navy mb-1 font-display">
                    🎯 Next Step: Final Roleplay
                  </p>
                  <p className="text-xs text-text-secondary font-body">
                    Apply everything you've learned in a realistic conversation scenario
                  </p>
                </div>
                <Button
                  onClick={onStartRoleplay}
                  className="w-full py-4 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  Continue to Final Roleplay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onRetry}
                className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-medium hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={onBackHome}
                className="flex-1 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-semibold hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
              >
                Back to Learning Path
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
