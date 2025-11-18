"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProgress, Lesson, LessonProgress } from "@/lib/types/language";
import { UNITS_DATA } from "@/lib/data/units";
import {
  initializeProgress,
  saveProgress,
  loadProgress,
  isLessonUnlocked as checkLessonUnlocked,
  getNextLesson as getNextLessonUtil,
  isFinalQuizUnlocked as checkFinalQuizUnlocked,
  isFinalRoleplayUnlocked as checkFinalRoleplayUnlocked,
  updateStreak,
  awardXP,
  awardBadge,
  getLessonById,
  calculateProgress,
} from "@/lib/utils/progress";

interface LessonContextType {
  // Current State
  currentLesson: Lesson | null;
  currentUnitId: string;

  // Progress
  userProgress: UserProgress;

  // Setters
  setCurrentLesson: (unitId: string, lessonId: string) => void;

  // Completion Methods
  completeLesson: (lessonId: string, unitId?: string) => void;
  completeQuiz: (lessonId: string, score: number, unitId?: string) => void;
  completeRoleplay: (lessonId: string, unitId?: string) => void;
  completeFinalQuiz: (score: number, unitId?: string) => void;
  completeFinalRoleplay: (unitId?: string) => void;

  // Query Methods
  isLessonUnlocked: (lessonId: string, unitId?: string) => boolean;
  isFinalQuizUnlocked: (unitId?: string) => boolean;
  isFinalRoleplayUnlocked: (unitId?: string) => boolean;
  getLessonProgress: (lessonId: string, unitId?: string) => LessonProgress | null;
  getNextLesson: (lessonId: string, unitId?: string) => Lesson | null;
  getTotalProgress: (unitId?: string) => number;

  // Utility
  refreshProgress: () => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: React.ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    // Initialize from localStorage or create new
    if (typeof window !== "undefined") {
      const saved = loadProgress();
      return saved || initializeProgress();
    }
    return initializeProgress();
  });

  const [currentLesson, setCurrentLessonState] = useState<Lesson | null>(null);
  const [currentUnitId, setCurrentUnitId] = useState<string>("unit_1_introduction");

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      saveProgress(userProgress);
    }
  }, [userProgress]);

  // Update streak on mount
  useEffect(() => {
    setUserProgress((prev) => updateStreak(prev));
  }, []);

  /**
   * Set current lesson
   */
  const setCurrentLesson = useCallback((unitId: string, lessonId: string) => {
    const lesson = getLessonById(unitId, lessonId);
    if (lesson) {
      setCurrentLessonState(lesson);
      setCurrentUnitId(unitId);
    }
  }, []);

  /**
   * Complete lesson step
   */
  const completeLesson = useCallback((lessonId: string, unitId: string = "unit_1_introduction") => {
    setUserProgress((prev) => {
      const unit = prev.units[unitId];
      if (!unit) return prev;

      const lessonProgress = unit.lessonsProgress[lessonId];
      if (!lessonProgress) return prev;

      // Mark lesson step as complete
      const updatedLesson: LessonProgress = {
        ...lessonProgress,
        steps: {
          ...lessonProgress.steps,
          lesson: true,
        },
      };

      // Award XP for completing lesson
      let updated = {
        ...prev,
        units: {
          ...prev.units,
          [unitId]: {
            ...unit,
            lessonsProgress: {
              ...unit.lessonsProgress,
              [lessonId]: {
                ...updatedLesson,
                xpEarned: updatedLesson.xpEarned + 20, // 20 XP for lesson
              },
            },
          },
        },
      };

      // Award XP
      updated = awardXP(updated, 20);

      // Check for first lesson badge
      if (lessonId === "l1" && !prev.badges.includes("first_lesson")) {
        updated = awardBadge(updated, "first_lesson");
      }

      return updated;
    });
  }, []);

  /**
   * Complete quiz step
   */
  const completeQuiz = useCallback((lessonId: string, score: number, unitId: string = "unit_1_introduction") => {
    setUserProgress((prev) => {
      const unit = prev.units[unitId];
      if (!unit) return prev;

      const lessonProgress = unit.lessonsProgress[lessonId];
      if (!lessonProgress) return prev;

      // Mark quiz step as complete
      const updatedLesson: LessonProgress = {
        ...lessonProgress,
        steps: {
          ...lessonProgress.steps,
          quiz: true,
          quizScore: score,
        },
      };

      // Base XP + bonus for perfect score
      const xpAmount = score === 100 ? 15 : 10;

      let updated = {
        ...prev,
        units: {
          ...prev.units,
          [unitId]: {
            ...unit,
            lessonsProgress: {
              ...unit.lessonsProgress,
              [lessonId]: {
                ...updatedLesson,
                xpEarned: updatedLesson.xpEarned + xpAmount,
              },
            },
          },
        },
      };

      // Award XP
      updated = awardXP(updated, xpAmount);

      // Check for quiz master badge (100% on any quiz)
      if (score === 100 && !prev.badges.includes("quiz_master")) {
        updated = awardBadge(updated, "quiz_master");
      }

      return updated;
    });
  }, []);

  /**
   * Complete roleplay step
   */
  const completeRoleplay = useCallback((lessonId: string, unitId: string = "unit_1_introduction") => {
    setUserProgress((prev) => {
      const unit = prev.units[unitId];
      if (!unit) return prev;

      const lessonProgress = unit.lessonsProgress[lessonId];
      if (!lessonProgress) return prev;

      // Mark roleplay step as complete
      const updatedLesson: LessonProgress = {
        ...lessonProgress,
        steps: {
          ...lessonProgress.steps,
          roleplay: true,
        },
        completed: true, // All steps complete!
        completedAt: new Date().toISOString(),
      };

      let updated = {
        ...prev,
        units: {
          ...prev.units,
          [unitId]: {
            ...unit,
            lessonsProgress: {
              ...unit.lessonsProgress,
              [lessonId]: {
                ...updatedLesson,
                xpEarned: updatedLesson.xpEarned + 20, // 20 XP for roleplay
              },
            },
          },
        },
      };

      // Award XP
      updated = awardXP(updated, 20);

      // Check for conversation starter badge (first roleplay)
      if (lessonId === "l1" && !prev.badges.includes("conversation_starter")) {
        updated = awardBadge(updated, "conversation_starter");
      }

      // Update streak
      updated = updateStreak(updated);

      return updated;
    });
  }, []);

  /**
   * Complete final quiz
   */
  const completeFinalQuiz = useCallback((score: number, unitId: string = "unit_1_introduction") => {
    setUserProgress((prev) => {
      const unit = prev.units[unitId];
      if (!unit) return prev;

      let updated = {
        ...prev,
        units: {
          ...prev.units,
          [unitId]: {
            ...unit,
            finalQuizCompleted: true,
          },
        },
      };

      // Award XP for final quiz
      const xpAmount = score === 100 ? 120 : 100;
      updated = awardXP(updated, xpAmount);

      // Perfect score badge
      if (score === 100 && !prev.badges.includes("perfect_score")) {
        updated = awardBadge(updated, "perfect_score");
      }

      return updated;
    });
  }, []);

  /**
   * Complete final roleplay
   */
  const completeFinalRoleplay = useCallback((unitId: string = "unit_1_introduction") => {
    setUserProgress((prev) => {
      const unit = prev.units[unitId];
      if (!unit) return prev;

      let updated = {
        ...prev,
        units: {
          ...prev.units,
          [unitId]: {
            ...unit,
            finalRoleplayCompleted: true,
            isCompleted: true, // Unit complete!
          },
        },
      };

      // Award XP for final roleplay
      updated = awardXP(updated, 150);

      // Week 1 complete badge
      if (!prev.badges.includes("week_1_complete")) {
        updated = awardBadge(updated, "week_1_complete");
      }

      return updated;
    });
  }, []);

  /**
   * Check if lesson is unlocked
   */
  const isLessonUnlocked = useCallback((lessonId: string, unitId: string = "unit_1_introduction"): boolean => {
    return checkLessonUnlocked(lessonId, userProgress, unitId);
  }, [userProgress]);

  /**
   * Check if final quiz is unlocked
   */
  const isFinalQuizUnlocked = useCallback((unitId: string = "unit_1_introduction"): boolean => {
    return checkFinalQuizUnlocked(userProgress, unitId);
  }, [userProgress]);

  /**
   * Check if final roleplay is unlocked
   */
  const isFinalRoleplayUnlocked = useCallback((unitId: string = "unit_1_introduction"): boolean => {
    return checkFinalRoleplayUnlocked(userProgress, unitId);
  }, [userProgress]);

  /**
   * Get lesson progress
   */
  const getLessonProgress = useCallback((lessonId: string, unitId: string = "unit_1_introduction"): LessonProgress | null => {
    return userProgress.units[unitId]?.lessonsProgress[lessonId] || null;
  }, [userProgress]);

  /**
   * Get next lesson
   */
  const getNextLesson = useCallback((lessonId: string, unitId: string = "unit_1_introduction"): Lesson | null => {
    return getNextLessonUtil(lessonId, unitId);
  }, []);

  /**
   * Get total progress percentage
   */
  const getTotalProgress = useCallback((unitId: string = "unit_1_introduction"): number => {
    return calculateProgress(unitId, userProgress);
  }, [userProgress]);

  /**
   * Refresh progress from localStorage
   */
  const refreshProgress = useCallback(() => {
    const saved = loadProgress();
    if (saved) {
      setUserProgress(saved);
    }
  }, []);

  const value: LessonContextType = {
    currentLesson,
    currentUnitId,
    userProgress,
    setCurrentLesson,
    completeLesson,
    completeQuiz,
    completeRoleplay,
    completeFinalQuiz,
    completeFinalRoleplay,
    isLessonUnlocked,
    isFinalQuizUnlocked,
    isFinalRoleplayUnlocked,
    getLessonProgress,
    getNextLesson,
    getTotalProgress,
    refreshProgress,
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}

/**
 * Hook to use LessonContext
 */
export function useLessonContext() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLessonContext must be used within a LessonProvider");
  }
  return context;
}
