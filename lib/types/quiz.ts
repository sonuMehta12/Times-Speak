// lib/types/quiz.ts

/**
 * Quiz question types for the final quiz
 * These types are designed to test different language learning skills
 */

export type BaseQuestion = {
  id: number;
  question: string;
  correctFeedback?: string;
  incorrectFeedback?: string;
};

/**
 * Listening comprehension - tests audio understanding with multiple choice
 */
export type ListeningQuestion = BaseQuestion & {
  type: "listening";
  audio: string; // Text to be spoken via TTS
  options: string[];
  correct: number; // Index of correct option
};

/**
 * Grammar question - fill in the blank with correct option
 */
export type GrammarQuestion = BaseQuestion & {
  type: "grammar";
  prompt: string; // Sentence with blank (___)
  options: string[];
  correct: number;
};

/**
 * Word arrangement - construct sentence from shuffled words
 */
export type ArrangeQuestion = BaseQuestion & {
  type: "arrange";
  words: string[]; // Shuffled words
  correct: string; // Correct complete sentence
};

/**
 * Pattern recognition - identify grammatical patterns
 */
export type PatternQuestion = BaseQuestion & {
  type: "pattern";
  context: string[]; // Example sentences
  prompt: string;
  options: string[];
  correct: number;
};

/**
 * Audio stress - identify correct stress/intonation
 */
export type AudioStressQuestion = BaseQuestion & {
  type: "audio-stress";
  sentence: string;
  options: { label: string; stress: string }[];
  correct: number;
};

/**
 * Reading comprehension - understanding meaning
 */
export type ComprehensionQuestion = BaseQuestion & {
  type: "comprehension";
  sentence: string; // Context sentence
  options: string[];
  correct: number;
};

/**
 * Speaking practice - pronunciation with speech recognition
 */
export type SpeakingQuestion = BaseQuestion & {
  type: "speaking";
  prompt: string;
  options: string[]; // Phrases to choose from and speak
};

/**
 * Context recognition - scenario-based appropriate response
 */
export type ContextQuestion = BaseQuestion & {
  type: "context";
  scenario: string; // Situation description
  options: string[];
  correct: number;
};

/**
 * Union type of all quiz question types
 */
export type QuizQuestion =
  | ListeningQuestion
  | GrammarQuestion
  | ArrangeQuestion
  | PatternQuestion
  | AudioStressQuestion
  | ComprehensionQuestion
  | SpeakingQuestion
  | ContextQuestion;

/**
 * Speech recognition interfaces
 */
export interface WordComparison {
  word: string;
  isCorrect: boolean;
}

export interface PronunciationFeedback {
  overallScore: number;
  wordScores: WordComparison[];
  generalFeedback: string;
  transcript: string;
}

/**
 * Web Speech API type definitions
 */
export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onresult: (e: SpeechRecognitionEvent) => void;
  onerror: (e: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
