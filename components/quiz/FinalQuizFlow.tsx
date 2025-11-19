// components/quiz/FinalQuizFlow.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Check, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizPrepScreen } from "./QuizPrepScreen";
import { ListeningQuiz } from "./ListeningQuiz";
import { ContextQuiz } from "./ContextQuiz";
import { ComprehensionQuiz } from "./ComprehensionQuiz";
import { ArrangeQuiz } from "./ArrangeQuiz";
import { SpeakingQuiz } from "./SpeakingQuiz";
import type {
  QuizQuestion,
  PronunciationFeedback,
  ListeningQuestion,
  GrammarQuestion,
  PatternQuestion,
  AudioStressQuestion,
  ComprehensionQuestion,
  ContextQuestion
} from "@/lib/types/quiz";
import type { FinalQuizContent } from "@/lib/types/language";

interface FinalQuizFlowProps {
  finalQuiz: FinalQuizContent;
  unitId: string;
  unitTitle: string;
  onComplete: (score: number, xpEarned: number) => void;
  onProgressUpdate?: (current: number, total: number, percent: number) => void;
}

type QuizState = "prep" | "quiz";

interface UserAnswer {
  answer: number | string | PronunciationFeedback;
  correct: boolean;
}

export function FinalQuizFlow({
  finalQuiz,
  unitId,
  unitTitle,
  onComplete,
  onProgressUpdate,
}: FinalQuizFlowProps) {
  const [quizState, setQuizState] = useState<QuizState>("prep");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});

  const questions = finalQuiz.questions;
  const totalQuestions = finalQuiz.totalQuestions;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Notify parent of progress updates
  useEffect(() => {
    if (quizState === "quiz" && onProgressUpdate) {
      onProgressUpdate(currentQuestion + 1, totalQuestions, progress);
    }
  }, [currentQuestion, quizState, totalQuestions, progress, onProgressUpdate]);
  const question = questions[currentQuestion];
  const totalCorrect = Object.values(userAnswers).filter((a) => a.correct).length;
  const xpEarned = totalCorrect * 10; // 10 XP per correct answer

  // Type guard for questions with numeric correct answers
  const hasCorrectNumber = (
    q: QuizQuestion
  ): q is ListeningQuestion | GrammarQuestion | PatternQuestion | AudioStressQuestion | ComprehensionQuestion | ContextQuestion => {
    return 'correct' in q && typeof q.correct === 'number';
  };

  const handleMultipleChoiceAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    const isCorrect = hasCorrectNumber(question) ? index === question.correct : false;
    setUserAnswers({
      ...userAnswers,
      [question.id]: { answer: index, correct: isCorrect },
    });
  };

  const handleArrangeAnswer = (answer: string, isCorrect: boolean) => {
    setSelectedAnswer(isCorrect ? 1 : 0); // For UI feedback
    setShowFeedback(true);
    setUserAnswers({
      ...userAnswers,
      [question.id]: { answer, correct: isCorrect },
    });
  };

  const handleSpeakingAnswer = (feedback: PronunciationFeedback, isCorrect: boolean) => {
    setSelectedAnswer(1); // For UI feedback
    setShowFeedback(true);
    setUserAnswers({
      ...userAnswers,
      [question.id]: { answer: feedback, correct: isCorrect },
    });
  };

  const handleNext = () => {
    if (currentQuestion === totalQuestions - 1) {
      // Last question - complete the quiz directly without intermediate results screen
      const percentage = (totalCorrect / totalQuestions) * 100;
      onComplete(percentage, xpEarned);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  // Render Prep Screen
  if (quizState === "prep") {
    return (
      <QuizPrepScreen
        totalQuestions={totalQuestions}
        estimatedMinutes={7}
        totalPoints={100}
        onStart={() => setQuizState("quiz")}
      />
    );
  }

  // Render Quiz Screen
  const isCorrect = hasCorrectNumber(question) ? selectedAnswer === question.correct : false;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Flexible Content Area - Scrollable if needed */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Question Header - Compact */}
        <div className="flex-shrink-0 bg-gradient-to-br from-teal/10 to-navy/10 px-4 py-3 border-b border-gray-200 rounded-t-[20px]">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-navy/10 text-navy hover:bg-navy/10 border-0 rounded-[10px] capitalize text-[10px] px-2 py-0.5">
              {question.type.replace("-", " ")}
            </Badge>
          </div>
          <h2 className="text-base font-bold text-navy leading-tight font-display">
            {question.question}
          </h2>
        </div>

        {/* Scrollable Question Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 bg-white rounded-b-[20px]">
          {/* Render Question Type */}
          {question.type === "listening" && (
            <ListeningQuiz
              question={question}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              onSelectAnswer={handleMultipleChoiceAnswer}
            />
          )}

          {question.type === "context" && (
            <ContextQuiz
              question={question}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              onSelectAnswer={handleMultipleChoiceAnswer}
            />
          )}

          {question.type === "comprehension" && (
            <ComprehensionQuiz
              question={question}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              onSelectAnswer={handleMultipleChoiceAnswer}
            />
          )}

          {question.type === "arrange" && (
            <ArrangeQuiz
              question={question}
              showFeedback={showFeedback}
              onSubmitAnswer={handleArrangeAnswer}
            />
          )}

          {question.type === "speaking" && (
            <SpeakingQuiz
              question={question}
              showFeedback={showFeedback}
              onSubmitAnswer={handleSpeakingAnswer}
            />
          )}

          {/* Compact Feedback Section for Multiple Choice */}
          {showFeedback && selectedAnswer !== null && question.type !== "speaking" && question.type !== "arrange" && (
            <div
              className={`mt-3 p-3 rounded-[16px] border-2 ${
                isCorrect
                  ? "bg-success/10 border-success/30"
                  : "bg-error/10 border-error/30"
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-7 h-7 rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-bold mb-1 font-display ${
                      isCorrect ? "text-success" : "text-error"
                    }`}
                  >
                    {isCorrect ? "Excellent!" : "Not quite right"}
                  </div>
                  <p className="text-xs leading-relaxed font-body text-text-primary">
                    {isCorrect
                      ? (question.correctFeedback || "Great job!")
                      : (question.incorrectFeedback || "Try again!")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Compact Feedback Section for Arrange Question */}
          {showFeedback && question.type === "arrange" && (
            <div
              className={`mt-3 p-3 rounded-[16px] border-2 ${
                userAnswers[question.id]?.correct
                  ? "bg-success/10 border-success/30"
                  : "bg-error/10 border-error/30"
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-7 h-7 rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                    userAnswers[question.id]?.correct ? "bg-success" : "bg-error"
                  }`}
                >
                  {userAnswers[question.id]?.correct ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-bold mb-1 font-display ${
                      userAnswers[question.id]?.correct ? "text-success" : "text-error"
                    }`}
                  >
                    {userAnswers[question.id]?.correct ? "Excellent!" : "Not quite right"}
                  </div>
                  <p className="text-xs leading-relaxed font-body text-text-primary">
                    {userAnswers[question.id]?.correct
                      ? (question.correctFeedback || "Great job!")
                      : (question.incorrectFeedback || "Try again!")}
                  </p>
                  {!userAnswers[question.id]?.correct && (
                    <div className="mt-2 p-2 bg-white rounded-[10px]">
                      <p className="text-[10px] text-text-secondary mb-0.5">Correct answer:</p>
                      <p className="text-xs font-medium text-navy">{question.correct}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      {showFeedback && (
        <div className="flex-shrink-0 pt-3 pb-2 px-4 bg-white border-t border-gray-200">
          <Button
            onClick={handleNext}
            className="w-full py-3 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            {currentQuestion === totalQuestions - 1 ? "See Results" : "Next Question"}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}
