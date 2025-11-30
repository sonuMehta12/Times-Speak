"use client";

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Mic, CheckCircle2, XCircle, ArrowRight, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';

interface QuizData {
  question: string;
  answer: string;
  context: string;
}

// Simple daily quiz data
const DAILY_QUIZZES: QuizData[] = [
  {
    question: "What's another way to say 'Hello'?",
    answer: "Hi",
    context: "Casual Greeting"
  },
  {
    question: "Complete: Nice to ____ you.",
    answer: "meet",
    context: "First Meeting"
  },
  {
    question: "I'm ____ India. (from/at/to)",
    answer: "from",
    context: "Origin"
  },
  {
    question: "What ____ you do? (are/do/is)",
    answer: "do",
    context: "Profession"
  },
  {
    question: "My hobby ____ reading. (is/are/am)",
    answer: "is",
    context: "Hobbies"
  },
];

export default function DailyChallenge() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
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

  const handleCheck = () => {
    if (!quiz || !userAnswer.trim()) return;

    // Simple case-insensitive check
    if (userAnswer.trim().toLowerCase() === quiz.answer.trim().toLowerCase()) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextQuestion = () => {
    const randomIndex = Math.floor(Math.random() * DAILY_QUIZZES.length);
    setQuiz(DAILY_QUIZZES[randomIndex]);
    setUserAnswer('');
    setFeedback('none');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      handleCheck();
    }
  };

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
          <h3 className="text-xl font-medium text-navy mb-2 font-display italic">
            "{quiz.question}"
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {quiz.context}
          </p>
        </div>

        {/* Input Area */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-coral/10 flex items-center gap-2 mb-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setFeedback('none');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer..."
            className="flex-1 bg-transparent border-none outline-none text-navy font-medium px-2 text-sm placeholder:text-gray-300"
            disabled={feedback === 'correct'}
          />
          <button
            onClick={handleCheck}
            disabled={!userAnswer}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              userAnswer
                ? 'bg-coral text-white shadow-md hover:bg-coral-hover'
                : 'bg-gray-100 text-gray-300'
            }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Feedback Message */}
        {feedback !== 'none' && (
          <div
            className={`flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300 mb-4 ${
              feedback === 'correct' ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 size={18} />
                <span>Correct! Well done.</span>
              </>
            ) : (
              <>
                <XCircle size={18} />
                <span>Not quite. Answer: {quiz.answer}</span>
              </>
            )}

            {feedback === 'correct' && (
              <button
                onClick={handleNextQuestion}
                className="ml-auto text-xs text-coral underline hover:text-coral-hover"
              >
                Next Question
              </button>
            )}
          </div>
        )}

        {/* CTA to Full Quiz */}
        <div className="pt-4 border-t border-coral/10">
          <Link 
            href="/unit_1_introduction/unit_1_final_quiz/quiz"
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-coral to-coral-hover rounded-xl shadow-md hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Trophy className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Start Full Quiz</p>
                <p className="text-white/80 text-xs">Unit 1 - Final Assessment</p>
              </div>
            </div>
            <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
