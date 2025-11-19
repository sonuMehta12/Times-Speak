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
}

/**
 * Difficulty levels for scenarios
 */
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * Category types matching explore page categories
 */
export type ScenarioCategory = 'interview' | 'travel' | 'restaurant' | 'shopping' | 'medical' | 'social';

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
