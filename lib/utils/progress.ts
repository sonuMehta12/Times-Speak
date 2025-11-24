// lib/utils/progress.ts

import { UserProgress, UnitProgress, LessonProgress, Lesson, ActivityEntry } from "@/lib/types/language";
import { UNITS_DATA } from "@/lib/data/units";

const STORAGE_KEY = "languageLearningProgress";

/**
 * Initialize fresh progress for a new user
 */
export function initializeProgress(): UserProgress {
  return {
    userId: `user_${Date.now()}`,
    units: {
      unit_1_introduction: {
        unitId: "unit_1_introduction",
        lessonsProgress: {
          l1: createEmptyLessonProgress("l1"),
          l2: createEmptyLessonProgress("l2"),
          l3: createEmptyLessonProgress("l3"),
          l4: createEmptyLessonProgress("l4"),
          l5: createEmptyLessonProgress("l5"),
        },
        finalQuizCompleted: false,
        finalRoleplayCompleted: false,
        isCompleted: false,
      },
    },
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString().split("T")[0],
    badges: [],
    activityLog: {},
    dailyGoalMinutes: 10,
    weeklyGoalDays: 7,
  };
}

/**
 * Create an empty lesson progress object
 */
function createEmptyLessonProgress(lessonId: string): LessonProgress {
  return {
    lessonId,
    steps: {
      lesson: false,
      quiz: false,
      roleplay: false,
    },
    completed: false,
    xpEarned: 0,
  };
}

/**
 * Save progress to localStorage
 */
export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

/**
 * Load progress from localStorage
 */
export function loadProgress(): UserProgress | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const progress = JSON.parse(saved) as UserProgress;
    return progress;
  } catch (error) {
    console.error("Failed to load progress:", error);
    return null;
  }
}

/**
 * Check if a lesson is unlocked based on progress
 * Lesson 1 is always unlocked
 * Lesson N unlocks when Lesson N-1 roleplay is complete
 */
export function isLessonUnlocked(
  lessonId: string,
  progress: UserProgress,
  unitId: string = "unit_1_introduction"
): boolean {
  // First lesson is always unlocked
  if (lessonId === "l1") return true;

  const unit = progress.units[unitId];
  if (!unit) return false;

  // Extract lesson number (e.g., "l2" -> 2)
  const lessonNumber = parseInt(lessonId.substring(1));
  const prevLessonId = `l${lessonNumber - 1}`;

  const prevProgress = unit.lessonsProgress[prevLessonId];

  // Previous lesson must have completed roleplay
  return prevProgress?.steps.roleplay === true;
}

/**
 * Get next lesson in sequence
 */
export function getNextLesson(
  currentLessonId: string,
  unitId: string = "unit_1_introduction"
): Lesson | null {
  const unit = UNITS_DATA.find((u) => u.unitId === unitId);
  if (!unit) return null;

  const currentIndex = unit.lessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === unit.lessons.length - 1) {
    return null; // No next lesson
  }

  return unit.lessons[currentIndex + 1];
}

/**
 * Calculate overall progress percentage for a unit
 */
export function calculateProgress(
  unitId: string,
  progress: UserProgress
): number {
  const unit = progress.units[unitId];
  if (!unit) return 0;

  const lessonIds = Object.keys(unit.lessonsProgress);
  const totalLessons = lessonIds.length;
  const completedLessons = lessonIds.filter(
    (id) => unit.lessonsProgress[id].completed
  ).length;

  // Factor in final quiz and roleplay
  let totalSteps = totalLessons + 2; // +2 for final quiz and roleplay
  let completedSteps = completedLessons;

  if (unit.finalQuizCompleted) completedSteps += 1;
  if (unit.finalRoleplayCompleted) completedSteps += 1;

  return Math.round((completedSteps / totalSteps) * 100);
}

/**
 * Check if all lessons in a unit are complete
 */
export function isUnitComplete(
  unitId: string,
  progress: UserProgress
): boolean {
  const unit = progress.units[unitId];
  if (!unit) return false;

  const allLessonsComplete = Object.values(unit.lessonsProgress).every(
    (lesson) => lesson.completed
  );

  return allLessonsComplete && unit.finalQuizCompleted && unit.finalRoleplayCompleted;
}

/**
 * Check if final quiz is unlocked (all 5 lessons complete)
 */
export function isFinalQuizUnlocked(
  progress: UserProgress,
  unitId: string = "unit_1_introduction"
): boolean {
  const unit = progress.units[unitId];
  if (!unit) return false;

  // All 5 lessons must be complete
  return ["l1", "l2", "l3", "l4", "l5"].every(
    (id) => unit.lessonsProgress[id]?.completed === true
  );
}

/**
 * Check if final roleplay is unlocked (final quiz complete)
 */
export function isFinalRoleplayUnlocked(
  progress: UserProgress,
  unitId: string = "unit_1_introduction"
): boolean {
  const unit = progress.units[unitId];
  return unit?.finalQuizCompleted === true;
}

/**
 * Calculate current streak
 * Returns number of consecutive days with activity
 */
export function calculateStreak(progress: UserProgress): number {
  const today = new Date().toISOString().split("T")[0];
  const lastActive = progress.lastActiveDate;

  if (!lastActive) return 0;

  const lastActiveDate = new Date(lastActive);
  const todayDate = new Date(today);

  const diffTime = todayDate.getTime() - lastActiveDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // If more than 1 day has passed, streak is broken
  if (diffDays > 1) {
    return 0;
  }

  // If same day or consecutive day, return current streak
  return progress.currentStreak;
}

/**
 * Update streak based on activity
 */
export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  const lastActive = progress.lastActiveDate;

  if (!lastActive || lastActive === today) {
    // Same day, no streak change
    return progress;
  }

  const lastActiveDate = new Date(lastActive);
  const todayDate = new Date(today);

  const diffTime = todayDate.getTime() - lastActiveDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = progress.currentStreak;

  if (diffDays === 1) {
    // Consecutive day, increment streak
    newStreak += 1;
  } else if (diffDays > 1) {
    // Streak broken, reset to 1
    newStreak = 1;
  }

  return {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, progress.longestStreak),
    lastActiveDate: today,
  };
}

/**
 * Award XP for completing a step
 */
export function awardXP(
  progress: UserProgress,
  amount: number
): UserProgress {
  return {
    ...progress,
    totalXP: progress.totalXP + amount,
  };
}

/**
 * Award a badge
 */
export function awardBadge(
  progress: UserProgress,
  badgeId: string
): UserProgress {
  if (progress.badges.includes(badgeId)) {
    return progress; // Already has this badge
  }

  return {
    ...progress,
    badges: [...progress.badges, badgeId],
  };
}

/**
 * Get lesson by ID
 */
export function getLessonById(
  unitId: string,
  lessonId: string
): Lesson | null {
  const unit = UNITS_DATA.find((u) => u.unitId === unitId);
  if (!unit) return null;

  return unit.lessons.find((l) => l.id === lessonId) || null;
}

/**
 * Check if a specific step is complete
 */
export function isStepComplete(
  progress: UserProgress,
  unitId: string,
  lessonId: string,
  step: 'lesson' | 'quiz' | 'roleplay'
): boolean {
  const lessonProgress = progress.units[unitId]?.lessonsProgress[lessonId];
  return lessonProgress?.steps[step] === true;
}
/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get activity entry for a specific date
 */
export function getActivityForDate(
  progress: UserProgress,
  date: string
): ActivityEntry | null {
  return progress.activityLog[date] || null;
}

/**
 * Get today's activity
 */
export function getTodayActivity(progress: UserProgress): ActivityEntry {
  const today = getTodayDate();
  return progress.activityLog[today] || {
    date: today,
    minutesSpent: 0,
    activitiesCompleted: [],
    lessonsCount: 0,
    quizzesCount: 0,
    roleplaysCount: 0,
    xpEarned: 0,
  };
}

/**
 * Record activity for today
 */
export function recordActivity(
  progress: UserProgress,
  activityId: string,
  activityType: 'lesson' | 'quiz' | 'roleplay',
  minutesSpent: number,
  xpEarned: number
): UserProgress {
  const today = getTodayDate();
  const currentActivity = getTodayActivity(progress);

  const updatedActivity: ActivityEntry = {
    ...currentActivity,
    minutesSpent: currentActivity.minutesSpent + minutesSpent,
    activitiesCompleted: [...currentActivity.activitiesCompleted, activityId],
    lessonsCount: currentActivity.lessonsCount + (activityType === 'lesson' ? 1 : 0),
    quizzesCount: currentActivity.quizzesCount + (activityType === 'quiz' ? 1 : 0),
    roleplaysCount: currentActivity.roleplaysCount + (activityType === 'roleplay' ? 1 : 0),
    xpEarned: currentActivity.xpEarned + xpEarned,
  };

  return {
    ...progress,
    activityLog: {
      ...progress.activityLog,
      [today]: updatedActivity,
    },
  };
}

/**
 * Get last 7 days of activity
 */
export function getLast7Days(progress: UserProgress): ActivityEntry[] {
  const days: ActivityEntry[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const activity = progress.activityLog[dateStr] || {
      date: dateStr,
      minutesSpent: 0,
      activitiesCompleted: [],
      lessonsCount: 0,
      quizzesCount: 0,
      roleplaysCount: 0,
      xpEarned: 0,
    };

    days.push(activity);
  }

  return days;
}

/**
 * Get weekly goal progress (days with activity in last 7 days)
 */
export function getWeeklyGoalProgress(progress: UserProgress): {
  current: number;
  target: number;
  percentage: number;
} {
  const last7Days = getLast7Days(progress);
  const daysWithActivity = last7Days.filter(day => day.minutesSpent > 0).length;

  return {
    current: daysWithActivity,
    target: progress.weeklyGoalDays,
    percentage: Math.round((daysWithActivity / progress.weeklyGoalDays) * 100),
  };
}

/**
 * Get daily goal progress (minutes spent today)
 */
export function getDailyGoalProgress(progress: UserProgress): {
  current: number;
  target: number;
  percentage: number;
  isComplete: boolean;
} {
  const todayActivity = getTodayActivity(progress);
  const percentage = Math.min(
    Math.round((todayActivity.minutesSpent / progress.dailyGoalMinutes) * 100),
    100
  );

  return {
    current: todayActivity.minutesSpent,
    target: progress.dailyGoalMinutes,
    percentage,
    isComplete: todayActivity.minutesSpent >= progress.dailyGoalMinutes,
  };
}

/**
 * Migrate old progress to include new fields
 */
export function migrateProgress(progress: UserProgress): UserProgress {
  if (!progress.activityLog) {
    progress.activityLog = {};
  }
  if (!progress.dailyGoalMinutes) {
    progress.dailyGoalMinutes = 10;
  }
  if (!progress.weeklyGoalDays) {
    progress.weeklyGoalDays = 7;
  }
  return progress;
}
