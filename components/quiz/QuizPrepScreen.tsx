// components/quiz/QuizPrepScreen.tsx
"use client";

import React from "react";
import { Target, Sparkles, Zap, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizPrepScreenProps {
  totalQuestions: number;
  estimatedMinutes: number;
  totalPoints: number;
  onStart: () => void;
}

export function QuizPrepScreen({
  totalQuestions,
  estimatedMinutes,
  totalPoints,
  onStart,
}: QuizPrepScreenProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center px-4">
      <div className="border-gray-200 rounded-[20px] shadow-md overflow-hidden bg-white">
        {/* Compact Header */}
        <div className="relative bg-navy p-6 text-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>

          <div className="relative">
            <div className="w-16 h-16 bg-gold/20 rounded-[16px] flex items-center justify-center mx-auto mb-3 shadow-md border border-gold/30">
              <Target className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1.5 font-display">
              Ready to Practice?
            </h1>
            <p className="text-white/80 text-sm font-body">
              Test your knowledge with {totalQuestions} quick questions
            </p>
          </div>
        </div>

        {/* Compact Stats Grid */}
        <div className="p-5">
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className="text-center">
              <div className="w-10 h-10 bg-navy/10 rounded-[14px] flex items-center justify-center mx-auto mb-1.5 border border-gray-200">
                <Sparkles className="w-5 h-5 text-navy" />
              </div>
              <div className="text-lg font-bold text-navy mb-0.5 font-display">{totalQuestions}</div>
              <div className="text-[10px] text-text-secondary font-body uppercase tracking-wide">Questions</div>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-coral/10 rounded-[14px] flex items-center justify-center mx-auto mb-1.5 border border-gray-200">
                <Zap className="w-5 h-5 text-coral" />
              </div>
              <div className="text-lg font-bold text-navy mb-0.5 font-display">{estimatedMinutes}</div>
              <div className="text-[10px] text-text-secondary font-body uppercase tracking-wide">Minutes</div>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-gold/10 rounded-[14px] flex items-center justify-center mx-auto mb-1.5 border border-gray-200">
                <Trophy className="w-5 h-5 text-gold" />
              </div>
              <div className="text-lg font-bold text-navy mb-0.5 font-display">{totalPoints}</div>
              <div className="text-[10px] text-text-secondary font-body uppercase tracking-wide">Points</div>
            </div>
          </div>

          <Button
            onClick={onStart}
            className="w-full bg-coral text-white hover:bg-coral-hover py-3.5 rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
          >
            Start Quiz
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-xs text-text-secondary mt-3 font-body">
            Take your time — there&apos;s no rush!
          </p>
        </div>
      </div>
    </div>
  );
}
