"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLessonContext } from "@/lib/context/LessonContext";
import { UNITS_DATA } from "@/lib/data/units";
import { useEffect, useState } from "react";
import { Lesson } from "@/lib/types/language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Flame, Trophy, RotateCcw, ArrowRight } from "lucide-react";

export default function LessonCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type"); // "roleplay", "finalQuiz", "finalRoleplay"
  const lessonId = searchParams.get("lessonId");
  const unitId = searchParams.get("unitId") || "unit_1_introduction";

  const { getLessonProgress, getNextLesson, userProgress } = useLessonContext();

  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (lessonId && type === "roleplay") {
      const next = getNextLesson(lessonId, unitId);
      setNextLesson(next);
    }
  }, [lessonId, type, getNextLesson, unitId]);

  const lessonProgress = lessonId ? getLessonProgress(lessonId, unitId) : null;

  // Calculate overall score based on all three steps
  const calculateOverallScore = () => {
    if (!lessonProgress) return 0;

    const lessonScore = lessonProgress.steps.lesson ? 33 : 0;
    const quizScore = lessonProgress.steps.quizScore ? Math.round((lessonProgress.steps.quizScore / 100) * 33) : 0;
    const roleplayScore = lessonProgress.steps.roleplay ? 34 : 0;

    return lessonScore + quizScore + roleplayScore;
  };

  const overallScore = calculateOverallScore();

  // Get current lesson data
  const getCurrentLesson = () => {
    const unit = UNITS_DATA.find(u => u.unitId === unitId);
    if (!unit || !lessonId) return null;
    return unit.lessons.find(l => l.id === lessonId);
  };

  const currentLesson = getCurrentLesson();

  // Get title based on type
  const getTitle = () => {
    if (type === "finalQuiz") return "Final Quiz Complete!";
    if (type === "finalRoleplay") return "Unit Complete!";
    return "Lesson Complete!";
  };

  // Get XP earned
  const getXP = () => {
    if (type === "finalQuiz") return 100;
    if (type === "finalRoleplay") return 150;
    return lessonProgress?.xpEarned || 50;
  };

  // Handle retake
  const handleRetake = () => {
    if (lessonId && currentLesson) {
      router.push(`/${unitId}/${lessonId}/lesson`);
    }
  };

  // Handle continue to next lesson
  const handleContinueNext = () => {
    if (nextLesson) {
      router.push(`/${unitId}/${nextLesson.id}/lesson`);
    } else {
      router.push('/');
    }
  };

  // Handle rating submission
  const handleRatingClick = (stars: number) => {
    setRating(stars);
    setHasRated(true);
    // TODO: Save rating to backend/context
  };

  // Create fill-in-the-blank style phrase (every 3rd word as ___)
  const getFillInBlankPhrase = (phrase: string) => {
    const words = phrase.split(' ');
    return words.map((word, i) => (i % 3 === 0 ? '___' : word)).join(' ');
  };

  return (
    <div className="w-full -mt-4 -mx-4">
      <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 overflow-hidden">
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto min-h-0 pb-24">
          <div className="flex flex-col p-5 space-y-3 pb-4">
            {/* Hero Section - Celebration Icon */}
            <div className="flex flex-col items-center pt-2 pb-1">
              <div className="text-5xl mb-2 animate-bounce">🎉</div>
              <h1 className="text-xl font-bold text-navy mb-1 font-display text-center">
                {getTitle()}
              </h1>
              <p className="text-xs text-text-secondary font-body text-center">
                Great job! You're making excellent progress.
              </p>
            </div>

            {/* Overall Score - HIGHLIGHTED */}
            <Card className="bg-gradient-to-br from-success/10 to-teal/10 border-2 border-success/30 rounded-[20px] shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-success fill-success" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Overall Score</p>
                      <p className="text-sm text-text-secondary font-body">Lesson + Quiz + Roleplay</p>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-success font-display">
                    {overallScore}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid - XP & Streak */}
            <div className="grid grid-cols-2 gap-3">
              {/* XP Earned */}
              <Card className="bg-white border-gray-200 rounded-[20px] shadow-sm">
                <CardContent className="p-3 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gold/20 flex items-center justify-center">
                    <Star className="h-5 w-5 text-gold fill-gold" />
                  </div>
                  <div className="text-2xl font-bold text-gold font-display">{getXP()}</div>
                  <div className="text-xs text-text-secondary font-body">XP Earned</div>
                </CardContent>
              </Card>

              {/* Day Streak */}
              <Card className="bg-white border-gray-200 rounded-[20px] shadow-sm">
                <CardContent className="p-3 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-error/20 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-error fill-error" />
                  </div>
                  <div className="text-2xl font-bold text-error font-display">
                    {userProgress.currentStreak}
                  </div>
                  <div className="text-xs text-text-secondary font-body">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Rewards Unlocked */}
            {(userProgress.badges.includes("first_lesson") || userProgress.currentStreak >= 3) && (
              <Card className="bg-white border-gray-200 rounded-[20px] shadow-sm">
                <CardContent className="p-3">
                  <h2 className="text-sm font-bold text-navy mb-3 font-display flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gold fill-gold" />
                    Rewards Unlocked!
                  </h2>
                  <div className="space-y-2">
                    {userProgress.badges.includes("first_lesson") && (
                      <div className="flex items-center gap-2 p-2 bg-teal/5 rounded-xl">
                        <span className="text-lg">🎖️</span>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-navy">First Lesson Badge</div>
                          <div className="text-xs text-text-secondary">Journey started!</div>
                        </div>
                      </div>
                    )}

                    {userProgress.currentStreak >= 3 && (
                      <div className="flex items-center gap-2 p-2 bg-error/5 rounded-xl">
                        <span className="text-lg">🔥</span>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-navy">Streak Master</div>
                          <div className="text-xs text-text-secondary">{userProgress.currentStreak} days in a row!</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rating Section */}
            <Card className="bg-white border-gray-200 rounded-[20px] shadow-sm">
              <CardContent className="p-3">
                <p className="text-sm font-semibold text-navy mb-3 text-center font-body">
                  How was this lesson?
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => handleRatingClick(stars)}
                      className={`transition-all ${
                        hasRated && rating === stars
                          ? 'scale-110'
                          : hasRated
                          ? 'opacity-40'
                          : 'hover:scale-110'
                      }`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          stars <= rating
                            ? 'text-gold fill-gold'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                {hasRated && (
                  <p className="text-xs text-success text-center mt-2 font-body animate-fade-in">
                    Thanks for your feedback! 🎉
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Next Lesson Preview */}
            {nextLesson && (
              <Card className="bg-gradient-to-br from-navy/5 to-teal/5 border-navy/10 rounded-[20px] shadow-sm">
                <CardContent className="p-3">
                  <p className="text-xs text-text-secondary mb-2 font-semibold uppercase tracking-wide">Up Next</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-navy font-display mb-1">
                        {getFillInBlankPhrase(nextLesson.phrase)}
                      </p>
                      <p className="text-xs text-text-secondary font-body">{nextLesson.phraseMeaning}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-navy ml-2 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTAs - Part of scrollable content */}
            <div className="space-y-3 pt-2">
              {/* Primary CTA - Continue/Next Lesson */}
              {nextLesson ? (
                <Button
                  onClick={handleContinueNext}
                  className="w-full bg-gradient-to-r from-coral to-coral-hover hover:from-coral-hover hover:to-coral-active text-white font-bold py-4 rounded-[16px] transition-all active:scale-95 shadow-lg shadow-coral/30"
                >
                  Continue to Next Lesson
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-coral to-coral-hover hover:from-coral-hover hover:to-coral-active text-white font-bold py-4 rounded-[16px] transition-all active:scale-95 shadow-lg shadow-coral/30"
                >
                  Back to Home
                </Button>
              )}

              {/* Secondary CTAs */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="flex-1 py-3 rounded-[16px] border-2 border-navy text-navy hover:bg-navy/5 font-semibold transition-all active:scale-95"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="ghost"
                  className="flex-1 py-3 rounded-[16px] text-text-secondary hover:text-navy hover:bg-gray-100 font-semibold transition-all"
                >
                  Home
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
