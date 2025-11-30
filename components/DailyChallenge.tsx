"use client";

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface QuizData {
  question: string;
}

// Simple daily quiz data
const DAILY_QUIZZES: QuizData[] = [
  {
    question: "What's another way to say 'Hello'?",
  },
  {
    question: "Nice to ____ you.",
  },
  {
    question: "I'm ____ India. (from/at/to)",
  },
  {
    question: "What ____ you do? (are/do/is)",
  },
  {
    question: "My hobby ____ reading. (is/are/am)",
  },
];

export default function DailyChallenge() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>('Level 1');

  useEffect(() => {
    // Select a random quiz for the day
    const randomIndex = Math.floor(Math.random() * DAILY_QUIZZES.length);
    setQuiz(DAILY_QUIZZES[randomIndex]);

    // Load user level from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setCurrentLevel(parsedData.level || 'Level 1');
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  if (!quiz) {
    return (
      <div className="w-full bg-coral/5 rounded-3xl p-6 mb-6 relative overflow-hidden border border-coral/10">
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="animate-spin text-coral" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-coral/5 rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden border border-coral/10">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-coral/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <BrainCircuit className="text-coral" size={20} />
            </div>
            <h3 className="font-bold text-navy">Daily Challenge</h3>
          </div>
          
          {/* Current Level Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-coral/20">
            <Zap size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-navy">{currentLevel}</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-medium text-navy font-display italic">
            "{quiz.question}"
          </h3>
        </div>

        {/* CTA to Full Quiz */}
        <Link 
          href="/unit_1_introduction/final/quiz"
          className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-coral to-coral-hover rounded-xl shadow-md hover:shadow-lg transition-all group"
        >
          <span className="text-white font-bold text-base">Start Quiz</span>
        </Link>
      </div>
    </div>
  );
}
