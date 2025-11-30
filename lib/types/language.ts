// lib/types/language.ts

/**
 * Represents a speaker in a roleplay dialogue
 */
export type Speaker = "A" | "B";

/**
 * Represents a single line in a roleplay dialogue
 */
export interface RolePlayLine {
  speaker: Speaker;
  text: string;
}

/**
 * Represents a multiple choice question to test comprehension
 */
export interface CueQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

/**
 * Phrase explanation for lesson teaching
 */
export interface PhraseExplanation {
  phrase: string;
  explanation: string;
}

/**
 * Represents a single lesson within a unit
 */
export interface Lesson {
  id: string;
  /** Lesson name - ALWAYS in English (e.g., "Casual Greetings") */
  title?: string;
  /** The English phrase being taught - ALWAYS in English (e.g., "Hey! How's it going?") */
  phrase: string;
  /** Explanation of the phrase - IN HINGLISH (Hindi-English mix for Hindi-speaking learners) */
  phraseMeaning?: string;
  /** Teaching script/instructions - ALWAYS in English */
  script: string;
  phraseExplanations?: PhraseExplanation[];
  cueQuestion: CueQuestion;
  roleplay: RolePlayLine[];
  // Home page daily lesson card fields
  /** @deprecated Image URLs are no longer used - lessons use solid color backgrounds with category emojis */
  imageUrl?: string;
  duration?: string;
  /** Category name - ALWAYS in English (e.g., "Conversation", "Professional", "Workplace") */
  category?: string;
  /** Brief lesson description - IN HINGLISH (Hindi-English mix for Hindi-speaking learners) */
  subtitle?: string;
}

/**
 * Final quiz content (pedagogically optimized quiz types)
 */
export interface FinalQuizContent {
  id: string;
  questions: import('./quiz').QuizQuestion[];
  totalQuestions: number;
}

/**
 * Final roleplay content (comprehensive conversation)
 * @deprecated No longer used - units now only have finalQuiz
 */
export interface FinalRoleplayContent {
  id: string;
  scenario: string;
  dialogue: RolePlayLine[];
}

/**
 * Represents a learning unit containing multiple lessons
 * Current implementation uses 1 unit with 7 lessons
 */
export interface Unit {
  unitId: string;
  title: string;
  lessons: Lesson[];
  finalQuiz?: FinalQuizContent;
  /** @deprecated Final roleplay removed - units now only have final quiz */
  finalRoleplay?: FinalRoleplayContent;
}

/**
 * Progress tracking for individual steps within a lesson
 */
export interface StepProgress {
  lesson: boolean;
  quiz: boolean;
  roleplay: boolean;
  quizScore?: number;
}

/**
 * Represents user progress for a specific lesson (Enhanced)
 */
export interface LessonProgress {
  lessonId: string;
  steps: StepProgress;
  completed: boolean;
  completedAt?: string; // ISO date string
  xpEarned: number;
}

/**
 * Represents user progress for a specific unit (Enhanced)
 */
export interface UnitProgress {
  unitId: string;
  lessonsProgress: Record<string, LessonProgress>; // Changed to Record for easier lookup
  finalQuizCompleted: boolean;
  finalRoleplayCompleted: boolean;
  isCompleted: boolean;
  lastAccessedAt?: string; // ISO date string
}

/**
 * Activity entry for a specific day
 */
export interface ActivityEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  minutesSpent: number;
  activitiesCompleted: string[]; // lesson IDs, quiz IDs, roleplay IDs
  lessonsCount: number;
  quizzesCount: number;
  roleplaysCount: number;
  xpEarned: number;
}

/**
 * Represents overall user learning progress (Enhanced)
 */
export interface UserProgress {
  userId: string;
  units: Record<string, UnitProgress>; // Changed to Record for easier lookup
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  badges: string[];
  activityLog: Record<string, ActivityEntry>; // date string -> activity data
  dailyGoalMinutes: number; // default: 10
  weeklyGoalDays: number; // default: 7
}

/**
 * Reward data for gamification
 */
export interface Reward {
  type: 'xp' | 'badge' | 'streak' | 'achievement';
  value: number | string;
  title: string;
  description: string;
  icon?: string;
}

/**
 * Summary data shown after lesson completion
 */
export interface LessonSummary {
  lessonId: string;
  phrase: string;
  xpEarned: number;
  quizScore?: number;
  timeSpent?: string;
  rewards: Reward[];
  nextLesson?: Lesson;
}
