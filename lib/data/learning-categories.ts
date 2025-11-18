// lib/data/learning-categories.ts

export interface LearningCategory {
  id: string;
  name: string;
  description?: string;
}

/**
 * Categories for organizing language learning units
 */
export const LEARNING_CATEGORIES: LearningCategory[] = [
  {
    id: "all",
    name: "All Units",
    description: "View all available learning units",
  },
  {
    id: "beginner",
    name: "Beginner",
    description: "Basic phrases and introductions",
  },
  {
    id: "workplace",
    name: "Workplace",
    description: "Professional communication skills",
  },
  {
    id: "social",
    name: "Social",
    description: "Everyday conversations and social situations",
  },
  {
    id: "travel",
    name: "Travel",
    description: "Useful phrases for traveling",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Complex conversations and expressions",
  },
];

/**
 * Difficulty levels for lessons
 */
export const DIFFICULTY_LEVELS = [
  { id: "easy", name: "Easy", color: "#10b981" },
  { id: "medium", name: "Medium", color: "#f59e0b" },
  { id: "hard", name: "Hard", color: "#ef4444" },
] as const;
