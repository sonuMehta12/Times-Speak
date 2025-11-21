// lib/types/aditi.ts

/**
 * Response from Aditi AI Tutor
 */
export interface TutorResponse {
  message: string;           // AI response with **keyword** markdown for highlighting
  hinglish: string;          // Hinglish translation
  hint: string[];            // Array of exactly 3 suggestion options
  feedback?: FeedbackData;   // Optional feedback for user's message
}

/**
 * Feedback data for user's message
 */
export interface FeedbackData {
  grade: string;             // e.g., "Good try!", "Excellent!", "Keep practicing"
  original: string;          // User's message with errors highlighted in HTML
  corrected: string;         // Corrected version with improvements highlighted in HTML
}

/**
 * Message in Aditi chat
 */
export interface AditiMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;              // Plain text or HTML for rendering
  time: string;
  translation?: {
    language: string;
    text: string;
  };
  teachingBadge?: string;
  feedback?: {
    grade: string;
    original: string;
    corrected: string;
  };
  audioBase64?: string;      // Base64 audio for TTS
  hints?: string[];          // Available hint options from AI
}

/**
 * Conversation history for Gemini API
 */
export interface ConversationTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}
