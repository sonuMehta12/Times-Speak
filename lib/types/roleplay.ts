// lib/types/roleplay.ts

/**
 * User Profile for personalized learning experience
 */
export interface UserProfile {
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  nativeLanguage: string;
  learningGoals: string[];
  challenges: {
    primary: string[];
    conversation: string[];
  };
  challengesContext: string;

  // Enhanced onboarding fields
  gender?: string;
  ageRange?: string;
  currentStatus?: string;
  interestedField?: string[];
  primaryGoal?: string[];
  whatStopsYou?: string[];
  fearOfSpeaking?: string;
  hardestPart?: string[];
  feelingWhenSpeak?: string;
  englishLevel?: string;

  // Progress tracking fields
  joinDate?: string; // ISO date string when user completed onboarding
  currentStreak?: number; // Consecutive days of learning
  totalTimeMinutes?: number; // Total learning time in minutes
  roleplayCompleted?: number; // Number of roleplay sessions completed
  lastActiveDate?: string; // ISO date string of last activity

  // Assessment-related fields
  assessmentResult?: ConversationAnalysis; // Result from English proficiency assessment
  assessmentCompletedAt?: string; // ISO date string when assessment was completed
  learningPriorities?: string[]; // Prioritized skills to focus on based on assessment
  recommendedStartingPoint?: string; // Recommended lesson/unit to start with
  hasPersonalizedCourse?: boolean; // Whether AI-generated personalized course exists
  courseGeneratedAt?: string; // ISO date string when personalized course was generated
}

/**
 * Difficulty levels for scenarios
 */
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * Category types matching explore page categories
 */
export type ScenarioCategory = 'interview' | 'travel' | 'restaurant' | 'shopping' | 'medical' | 'social' | 'assessment';

/**
 * A single turn in the example conversation (for Listen Mode)
 */
export interface ExampleConversationTurn {
  speaker: 'Agent' | 'Learner';
  text: string;
  translation: string;
  explanation?: string; // Optional educational tooltip
}

/**
 * Complete Roleplay Scenario
 */
export interface Scenario {
  id: string;
  title: string;
  description: string;
  topic: string;
  category: ScenarioCategory;
  difficulty: DifficultyLevel;
  duration: string; // e.g., "10-15 min"
  image: string;
  role: string; // e.g., "Barista", "Doctor", "Interviewer"
  learningObjective: string;
  initialGreeting: string;
  exampleConversation: ExampleConversationTurn[];
  badge?: string; // e.g., "Most Popular", "New", "Trending"
  badgeColor?: 'gold' | 'coral' | 'teal';
  rating?: number;
  learners?: string; // e.g., "5.8K"
}

/**
 * Message in the chat interface
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  translation?: string;
  suggestions?: string[];
}

/**
 * AI Response from Gemini
 */
export interface GeminiResponse {
  role_response: string;
  translation: string;
  suggestions: string[];
  objective_completed: boolean;
}

/**
 * View states for the roleplay flow
 */
export type RoleplayViewState = 'selection' | 'guide' | 'chat';

/**
 * Pronunciation mistake for detailed feedback
 */
export interface PronunciationMistake {
  word: string;
  phoneticUser: string;
  phoneticTarget: string;
  score: number;
}

/**
 * Grammar correction for feedback
 */
export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

/**
 * Vocabulary upgrade suggestion
 */
export interface VocabularyUpgrade {
  original: string;
  alternatives: string[];
  context: string;
}

/**
 * Fluency metric
 */
export interface FluencyMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'bad';
}

/**
 * Skill-specific details for feedback
 */
export interface SkillDetails {
  score: number;
  strength: string;
  improvement: string;
  coachTip: string;
  pronunciationData?: PronunciationMistake[];
  grammarData?: GrammarCorrection[];
  vocabularyData?: VocabularyUpgrade[];
  fluencyData?: FluencyMetric[];
}

/**
 * Complete conversation analysis result
 */
export interface ConversationAnalysis {
  overallScore: number;
  cefrLevel: string;
  aiCoachInsight: string;
  skills: {
    pronunciation: SkillDetails;
    vocabulary: SkillDetails;
    grammar: SkillDetails;
    fluency: SkillDetails;
    clarity: SkillDetails;
    listening: SkillDetails;
  };
}
