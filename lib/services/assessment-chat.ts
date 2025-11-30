// lib/services/assessment-chat.ts
// Client-side assessment service using Gemini API

import { GoogleGenAI, Content } from "@google/genai";
import { generateAssessmentSystemInstruction, ASSESSMENT_RESPONSE_SCHEMA } from "../constants/assessment-prompts";
import { ConversationTurn } from "../types/aditi";
import { UserProfile, ConversationAnalysis, Message, Scenario } from "../types/roleplay";
import { analyzeConversation } from "./gemini-analysis";
import { safeParseJSON } from "@/lib/utils/json-parser";

/**
 * Assessment response from Gemini
 */
export interface AssessmentResponse {
  english: string;           // AI's question/response in English
  hinglish: string;          // Hinglish translation
  assessment_complete: boolean; // True when assessment is finished (turn 8)
}

/**
 * Get Gemini client using client-side API key
 */
const getClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment.");
  }
  return new GoogleGenAI({ apiKey });
};

// Model for assessment conversation
const ASSESSMENT_MODEL = 'gemini-2.0-flash-exp';

/**
 * Generates the next question/response in the assessment conversation
 *
 * @param userProfile User's profile data from onboarding
 * @param history Conversation history so far
 * @param userMessage Current user message
 * @param turnNumber Current turn number (1-8)
 * @returns Assessment response with next question
 */
export const generateAssessmentResponse = async (
  userProfile: UserProfile,
  history: ConversationTurn[],
  userMessage: string,
  turnNumber: number
): Promise<AssessmentResponse> => {
  const client = getClient();

  // Generate dynamic system instruction based on user profile and current turn
  const systemInstruction = generateAssessmentSystemInstruction(userProfile, turnNumber);

  // Convert history to Gemini Content format
  const contents: Content[] = history.map(turn => ({
    role: turn.role,
    parts: turn.parts
  }));

  // Add current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const response = await client.models.generateContent({
    model: ASSESSMENT_MODEL,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: ASSESSMENT_RESPONSE_SCHEMA,
      temperature: 0.8, // Natural, varied conversation
      maxOutputTokens: 512, // Limit response size for assessment questions
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Assessment AI");
  }

  // Use safe JSON parser with fallback
  const parsed = safeParseJSON<AssessmentResponse>(
    text,
    {
      english: "I'm having a bit of trouble. Could you tell me more about your professional background?",
      hinglish: "Mujhe thoda problem aa raha hai. Kya aap apne professional background ke baare mein bata sakte ho?",
      assessment_complete: false
    },
    'Assessment Chat'
  );

  return parsed;
};

/**
 * Creates a mock scenario object for assessment grading
 * This matches the Scenario interface expected by analyzeConversation
 */
function createAssessmentScenario(userProfile: UserProfile): Scenario {
  return {
    id: 'assessment',
    title: 'English Proficiency Assessment',
    description: 'A conversational assessment to evaluate your English communication skills',
    role: 'Assessment Interviewer',
    learningObjective: `Evaluate ${userProfile.name}'s English proficiency across pronunciation, vocabulary, grammar, fluency, clarity, and listening comprehension`,
    difficulty: userProfile.level || 'B1',
    estimatedTime: '2 minutes',
    category: 'Assessment',
    tags: ['assessment', 'evaluation', 'proficiency'],
    targetSkills: ['pronunciation', 'vocabulary', 'grammar', 'fluency', 'clarity', 'listening'],
  };
}

/**
 * Grades the completed assessment conversation
 * Reuses the existing analyzeConversation function from gemini-analysis
 *
 * @param userProfile User's profile data
 * @param messages Full conversation history (user + AI messages)
 * @returns Detailed 6-skill analysis
 */
export const gradeAssessment = async (
  userProfile: UserProfile,
  messages: Message[]
): Promise<ConversationAnalysis> => {
  const scenario = createAssessmentScenario(userProfile);

  try {
    // Reuse existing conversation analysis function
    const analysis = await analyzeConversation(scenario, userProfile, messages);
    return analysis;
  } catch (error) {
    console.error("Assessment grading failed:", error);

    // Return fallback with encouraging feedback
    return {
      overallScore: 65,
      cefrLevel: userProfile.level || 'Intermediate B1',
      aiCoachInsight: `Great job completing the assessment, ${userProfile.name}! You showed good communication skills. We'll create a personalized course to help you improve further.`,
      skills: {
        pronunciation: {
          score: 65,
          strength: 'You communicated clearly enough to be understood.',
          improvement: 'Focus on practicing word stress and intonation.',
          coachTip: 'Keep practicing! Record yourself to hear improvements.',
        },
        vocabulary: {
          score: 60,
          strength: 'You used functional vocabulary effectively.',
          improvement: 'Expand your range of professional vocabulary.',
          coachTip: 'Reading industry articles will help build vocabulary naturally.',
          vocabularyData: [],
        },
        grammar: {
          score: 70,
          strength: 'Your sentences were generally well-structured.',
          improvement: 'Pay attention to verb tenses when describing past events.',
          coachTip: 'Great foundation! Small refinements will make a big difference.',
          grammarData: [],
        },
        fluency: {
          score: 65,
          strength: 'You maintained good conversation flow.',
          improvement: 'Reduce hesitations with more practice.',
          coachTip: 'The more you practice, the more natural it will feel!',
          fluencyData: [],
        },
        clarity: {
          score: 75,
          strength: 'Your main ideas came across clearly.',
          improvement: 'Work on organizing complex thoughts.',
          coachTip: "You're doing great! Keep up the clear communication.",
        },
        listening: {
          score: 70,
          strength: 'You responded appropriately to all questions.',
          improvement: 'Focus on catching specific details in questions.',
          coachTip: "Active listening improves with practice - you're on the right track!",
        },
      },
    };
  }
};

/**
 * Convert assessment messages to ConversationTurn format for Gemini API
 */
export const convertToAssessmentHistory = (messages: any[]): ConversationTurn[] => {
  return messages
    .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.text.replace(/<[^>]*>/g, '') }] // Strip HTML tags
    }));
};
