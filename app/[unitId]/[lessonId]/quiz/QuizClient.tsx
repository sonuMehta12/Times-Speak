"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useLessonContext } from "@/lib/context/LessonContext";
import { Lesson, Unit } from "@/lib/types/language";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MoreVertical, Check, X } from 'lucide-react';
import { FinalQuizFlow } from '@/components/quiz/FinalQuizFlow';
import { FinalQuizSummary } from '@/components/quiz/FinalQuizSummary';

interface IndividualQuizProps {
  type: "individual";
  unitId: string;
  lesson: Lesson;
  lessonNumber: number;
  totalLessons: number;
  unit?: never;
}

interface FinalQuizProps {
  type: "final";
  unitId: string;
  unit: Unit;
  lesson?: never;
  lessonNumber?: never;
  totalLessons?: never;
}

type Props = IndividualQuizProps | FinalQuizProps;

export default function QuizClient(props: Props) {
  const router = useRouter();
  const { completeQuiz, completeFinalQuiz } = useLessonContext();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showRoleplayCard, setShowRoleplayCard] = useState(false);

  // Final Quiz state
  const [finalQuizState, setFinalQuizState] = useState<'quiz' | 'summary'>('quiz');
  const [finalQuizScore, setFinalQuizScore] = useState(0);
  const [finalQuizXP, setFinalQuizXP] = useState(0);
  const [quizProgress, setQuizProgress] = useState({ current: 0, total: 0, percent: 0 });

  if (props.type === "individual") {
    const { lesson, unitId, lessonNumber, totalLessons } = props;
    const quiz = lesson.cueQuestion;
    const unitInfo = `Unit 1 • Lesson ${lessonNumber} of ${totalLessons}`;
    const progress = 50; // Lesson complete (50%), quiz in progress

    const handleSubmit = () => {
      if (selectedAnswer === null) return;

      const isCorrect = selectedAnswer === quiz.correctIndex;
      const score = isCorrect ? 100 : 0;

      setShowResult(true);

      // Complete quiz in context
      completeQuiz(lesson.id, score, unitId);

      // Show roleplay card after delay
      setTimeout(() => {
        setShowRoleplayCard(true);
      }, 2000);
    };

    const handleContinueRoleplay = () => {
      router.push(`/${unitId}/${lesson.id}/roleplay`);
    };

    const handleSkipRoleplay = () => {
      router.push('/');
    };

    const isCorrectAnswer = selectedAnswer === quiz.correctIndex;

    return (
      <div className="w-full -mt-4 -mx-4">
        <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
          {/* Header */}
          <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex-1 mx-4">
                <div className="text-xs font-semibold text-text-secondary mb-1 font-body">
                  {unitInfo}
                </div>
                <h1 className="text-base font-bold text-navy truncate font-display">
                  {lesson.title || `Lesson ${lessonNumber}`} - Quiz
                </h1>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pb-3">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal to-teal-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1.5 text-center font-medium">
                Step 2 of 3: Quiz
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-bg-card min-h-0 pb-20">
            <div className="p-6 pb-8 space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-navy font-display">Quiz Time! 📝</h2>

              {/* Question Card */}
              <Card className="bg-gray-50 border-gray-200 rounded-[20px] shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <p className="text-base font-semibold text-navy font-body">
                    {quiz.question}
                  </p>

                  <div className="space-y-3">
                    {quiz.options.map((option: string, index: number) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === quiz.correctIndex;

                      let buttonClass = '';
                      let icon = null;

                      if (showResult) {
                        if (isCorrect) {
                          buttonClass = 'border-success bg-success/10 text-success';
                          icon = <Check className="h-5 w-5 text-success" />;
                        } else if (isSelected && !isCorrect) {
                          buttonClass = 'border-error bg-error/10 text-error';
                          icon = <X className="h-5 w-5 text-error" />;
                        } else {
                          buttonClass = 'border-gray-200 bg-gray-100 text-gray-500';
                        }
                      } else {
                        buttonClass = isSelected
                          ? 'border-navy bg-navy/5 text-navy'
                          : 'border-gray-200 bg-white text-text-primary hover:border-navy/30 hover:bg-navy/5';
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => !showResult && setSelectedAnswer(index)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-[16px] border-2 text-left transition-all text-sm font-medium font-body flex items-center justify-between ${buttonClass} ${
                            showResult ? 'cursor-default' : 'cursor-pointer active:scale-95'
                          }`}
                        >
                          <span>{option}</span>
                          {icon}
                        </button>
                      );
                    })}
                  </div>

                  {!showResult ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedAnswer === null}
                      className="w-full mt-4 py-4 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <div className="mt-4 text-center py-4">
                      <p className="text-lg font-semibold mb-2">
                        {isCorrectAnswer ? "🎉 Correct!" : "❌ Incorrect"}
                      </p>
                      <p className="text-sm text-text-secondary">Moving to roleplay practice...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>

          {/* Roleplay Transition Card */}
          {showRoleplayCard && (
            <div className="fixed inset-0 bg-white z-[60] flex flex-col max-w-[393px] mx-auto left-0 right-0 animate-fade-in">
              {/* Content Container */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                {/* Thumbnail Image */}
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-teal/20 shadow-xl mb-6 bg-gradient-to-br from-teal-100 to-teal-200">
                  <Image
                    src="/imgs/Aditi.png"
                    alt="Roleplay Practice"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-navy mb-3 font-display text-center">
                  Ready for Roleplay? 🎭
                </h2>

                {/* Description */}
                <p className="text-base text-text-secondary font-body text-center mb-6 leading-relaxed max-w-sm">
                  You're meeting a friend. Greet them casually using the phrase you learned.
                </p>

                {/* Phrase Preview Card */}
                <Card className="bg-white border-gray-200 rounded-[20px] shadow-sm w-full max-w-sm mb-8">
                  <CardContent className="p-5">
                    <div className="bg-gradient-to-br from-navy/5 to-teal/5 p-4 rounded-xl border border-navy/10">
                      <p className="text-sm text-text-secondary mb-2 font-medium text-center">You'll practice:</p>
                      <p className="text-lg font-bold text-navy font-display text-center">
                        "{lesson.phrase}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Buttons */}
              <div className="flex-shrink-0 px-6 pb-8 space-y-3">
                <Button
                  onClick={handleContinueRoleplay}
                  className="w-full bg-gradient-to-r from-coral to-coral-hover hover:from-coral-hover hover:to-coral-active text-white font-bold py-4 rounded-[16px] transition-all active:scale-95 shadow-lg shadow-coral/30"
                >
                  Continue to Roleplay
                </Button>
                <Button
                  onClick={handleSkipRoleplay}
                  variant="ghost"
                  className="w-full text-text-secondary hover:text-navy hover:bg-gray-100 font-semibold py-3 rounded-[16px] transition-all"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .animate-fade-in-up {
            animation: fade-in 0.5s ease-out;
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  // Final Quiz
  const { unit, unitId } = props;

  // Check if unit has final quiz data
  if (!unit.finalQuiz) {
    return (
      <div className="w-full -mt-4 -mx-4">
        <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
          <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 mx-4">
                <h1 className="text-base font-bold text-navy truncate font-display">
                  Final Quiz Not Available
                </h1>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-bg-card min-h-0 p-6">
            <p className="text-text-secondary font-body">
              The final quiz for this unit is not yet available.
            </p>
          </main>
        </div>
      </div>
    );
  }

  // Handlers for final quiz
  const handleFinalQuizComplete = (score: number, xpEarned: number) => {
    setFinalQuizScore(score);
    setFinalQuizXP(xpEarned);
    setFinalQuizState('summary');
  };

  const handleStartRoleplay = () => {
    completeFinalQuiz(finalQuizScore, unitId);
    router.push(`/${unitId}/final/roleplay`);
  };

  const handleRetryQuiz = () => {
    setFinalQuizState('quiz');
    setFinalQuizScore(0);
    setFinalQuizXP(0);
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="w-full -mt-4 -mx-4">
      <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 mx-4">
              <div className="text-xs font-semibold text-text-secondary mb-1 font-body">
                Final Assessment
              </div>
              <h1 className="text-base font-bold text-navy truncate font-display">
                {unit.title}
              </h1>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar - Only show during quiz */}
          {finalQuizState === 'quiz' && quizProgress.total > 0 && (
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-text-secondary font-body">
                  Question {quizProgress.current} of {quizProgress.total}
                </span>
                <span className="text-xs font-bold text-teal font-display">
                  {Math.round(quizProgress.percent)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal to-teal-hover rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${quizProgress.percent}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-bg-card min-h-0 p-6">
          {finalQuizState === 'quiz' ? (
            <FinalQuizFlow
              finalQuiz={unit.finalQuiz}
              unitId={unitId}
              unitTitle={unit.title}
              onComplete={handleFinalQuizComplete}
              onProgressUpdate={(current, total, percent) => {
                setQuizProgress({ current, total, percent });
              }}
            />
          ) : (
            <FinalQuizSummary
              totalCorrect={Math.round((finalQuizScore / 100) * unit.finalQuiz.totalQuestions)}
              totalQuestions={unit.finalQuiz.totalQuestions}
              xpEarned={finalQuizXP}
              unitTitle={unit.title}
              onStartRoleplay={handleStartRoleplay}
              onRetry={handleRetryQuiz}
              onBackHome={handleBackHome}
            />
          )}
        </main>
      </div>
    </div>
  );
}
