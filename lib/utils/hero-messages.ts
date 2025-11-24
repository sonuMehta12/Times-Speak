// lib/utils/hero-messages.ts

import { UserProgress } from "@/lib/types/language";
import { getTodayActivity, getDailyGoalProgress } from "./progress";

/**
 * User states for contextual messaging
 */
export type UserState =
  | "brand_new" // 0 XP, no completions
  | "just_activated" // Completed 1st activity, streak = 1
  | "active_streaker" // 2-6 day streak
  | "week_warrior" // 7+ day streak
  | "returning_user" // Missed days, streak reset/broken
  | "goal_complete"; // Today's goal met (>= dailyGoalMinutes)

/**
 * Determine user's current state for messaging
 */
export function getUserState(progress: UserProgress): UserState {
  const todayActivity = getTodayActivity(progress);
  const dailyGoal = getDailyGoalProgress(progress);

  // Check if daily goal is complete today
  if (dailyGoal.isComplete) {
    return "goal_complete";
  }

  // Brand new user (no XP earned)
  if (progress.totalXP === 0) {
    return "brand_new";
  }

  // Just activated (very first activities)
  if (progress.currentStreak === 1 && progress.totalXP < 50) {
    return "just_activated";
  }

  // Returning user (had a streak before, but it broke)
  if (progress.longestStreak > progress.currentStreak && progress.currentStreak <= 1) {
    return "returning_user";
  }

  // Week warrior (7+ days)
  if (progress.currentStreak >= 7) {
    return "week_warrior";
  }

  // Active streaker (2-6 days)
  if (progress.currentStreak >= 2) {
    return "active_streaker";
  }

  // Default to just activated
  return "just_activated";
}

/**
 * Get hero message based on user state (13-15 words max, no subtitle needed)
 */
export function getHeroMessage(
  progress: UserProgress,
  userName: string = "there"
): string {
  const state = getUserState(progress);
  const streak = progress.currentStreak;

  switch (state) {
    case "brand_new":
      return "Start your first lesson today and begin building your learning streak!";

    case "just_activated":
      return `Great start ${userName}! Complete another lesson to grow your streak.`;

    case "active_streaker":
      return `${streak} day streak and counting! Keep the momentum alive today.`;

    case "week_warrior":
      return `Amazing ${streak} day streak ${userName}! You're building a powerful habit.`;

    case "returning_user":
      if (progress.longestStreak > 0) {
        return `Welcome back ${userName}! Your best was ${progress.longestStreak} days. Beat it!`;
      }
      return `Welcome back ${userName}! Today is perfect to start fresh.`;

    case "goal_complete":
      return `Daily goal crushed! You're on fire. Ready for bonus learning?`;

    default:
      return "Every day of learning brings you closer to fluency!";
  }
}

/**
 * Get subtitle message with more context
 */
export function getHeroSubtitle(progress: UserProgress): string {
  const state = getUserState(progress);
  const dailyGoal = getDailyGoalProgress(progress);

  switch (state) {
    case "brand_new":
      return "Complete any lesson, quiz, or roleplay to get started";

    case "just_activated":
      return `${dailyGoal.current}/${dailyGoal.target} min today - keep it up!`;

    case "active_streaker":
    case "week_warrior":
      if (dailyGoal.current > 0) {
        return `${dailyGoal.current}/${dailyGoal.target} min today`;
      }
      return `Complete today's ${dailyGoal.target} min goal to maintain your streak`;

    case "returning_user":
      return "Jump back in and rebuild your learning habit";

    case "goal_complete":
      return "You've crushed today's goal! Ready for more?";

    default:
      return "";
  }
}

/**
 * Get streak display text
 */
export function getStreakDisplayText(progress: UserProgress): string {
  if (progress.currentStreak === 0) {
    return "No streak yet";
  }

  if (progress.currentStreak === 1) {
    return "1 day streak";
  }

  return `${progress.currentStreak} day streak`;
}

/**
 * Get motivational badge text based on streak milestones
 */
export function getStreakBadge(streak: number): string | null {
  if (streak >= 30) return "🏆 Legend";
  if (streak >= 14) return "⭐ Champion";
  if (streak >= 7) return "🔥 On Fire";
  return null;
}

/**
 * Check if user should see grace period warning
 * (has streak but hasn't completed today's activity yet)
 */
export function shouldShowGraceWarning(progress: UserProgress): boolean {
  const todayActivity = getTodayActivity(progress);
  const hasActiveStreak = progress.currentStreak > 1;
  const noActivityToday = todayActivity.minutesSpent === 0;
  const isNotBrandNew = progress.totalXP > 0;

  return hasActiveStreak && noActivityToday && isNotBrandNew;
}

/**
 * Get grace period message
 */
export function getGracePeriodMessage(progress: UserProgress): string {
  const hoursLeft = getHoursUntilMidnight();

  if (hoursLeft <= 3) {
    return `⏰ ${hoursLeft}h left to keep your ${progress.currentStreak} day streak!`;
  }

  return `Complete an activity today to maintain your ${progress.currentStreak} day streak`;
}

/**
 * Get hours until midnight
 */
function getHoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60));
}
