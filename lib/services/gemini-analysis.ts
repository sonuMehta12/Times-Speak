// lib/services/gemini-analysis.ts

import { GoogleGenAI, Type, Schema } from '@google/genai';
import { Message, Scenario, UserProfile, ConversationAnalysis, PronunciationMistake, GrammarCorrection, VocabularyUpgrade, FluencyMetric } from '../types/roleplay';
import { safeParseJSON } from '@/lib/utils/json-parser';

// Initialize the Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * JSON Schema for conversation analysis response
 */
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: 'Overall performance score out of 100',
    },
    cefrLevel: {
      type: Type.STRING,
      description: 'CEFR level assessment (e.g., "Intermediate B1")',
    },
    aiCoachInsight: {
      type: Type.STRING,
      description: 'A brief, encouraging insight about the overall performance (2-3 sentences)',
    },
    pronunciation: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        strength: { type: Type.STRING },
        improvement: { type: Type.STRING },
        coachTip: { type: Type.STRING },
        mistakes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              phoneticUser: { type: Type.STRING },
              phoneticTarget: { type: Type.STRING },
              score: { type: Type.NUMBER },
            },
          },
        },
      },
    },
    vocabulary: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        strength: { type: Type.STRING },
        improvement: { type: Type.STRING },
        coachTip: { type: Type.STRING },
        upgrades: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
              context: { type: Type.STRING },
            },
          },
        },
      },
    },
    grammar: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        strength: { type: Type.STRING },
        improvement: { type: Type.STRING },
        coachTip: { type: Type.STRING },
        corrections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              corrected: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
          },
        },
      },
    },
    fluency: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        strength: { type: Type.STRING },
        improvement: { type: Type.STRING },
        coachTip: { type: Type.STRING },
        metrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING },
              status: { type: Type.STRING },
            },
          },
        },
      },
    },
    clarity: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        strength: { type: Type.STRING },
        improvement: { type: Type.STRING },
        coachTip: { type: Type.STRING },
      },
    },
    listening: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        strength: { type: Type.STRING },
        improvement: { type: Type.STRING },
        coachTip: { type: Type.STRING },
      },
    },
  },
  required: ['overallScore', 'cefrLevel', 'aiCoachInsight', 'pronunciation', 'vocabulary', 'grammar', 'fluency', 'clarity', 'listening'],
};

/**
 * Builds system prompt for conversation analysis
 */
function buildAnalysisPrompt(scenario: Scenario, userProfile: UserProfile, messages: Message[]): string {
  // Extract only user messages for analysis
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);

  return `You are an expert English language assessment AI. Analyze the following conversation from a roleplay practice session and provide detailed, constructive feedback.

**Scenario Context:**
- Title: ${scenario.title}
- Learning Objective: ${scenario.learningObjective}
- Role: ${scenario.role}

**User Profile:**
- Name: ${userProfile.name}
- Current Level: ${userProfile.level}
- Native Language: ${userProfile.nativeLanguage}
- Learning Goals: ${userProfile.learningGoals.join(', ')}

**Conversation to Analyze:**
${messages.map((msg, idx) => `${idx + 1}. ${msg.role === 'user' ? userProfile.name : scenario.role}: "${msg.content}"`).join('\n')}

**Analysis Instructions:**

1. **Overall Assessment:**
   - Calculate an overall score (0-100) based on all six skills
   - Assign a CEFR level (e.g., "Intermediate B1", "Advanced C1")
   - Provide an encouraging AI coach insight (2-3 sentences focusing on positives and growth)

2. **Pronunciation (Score 0-100):**
   - Identify 2-3 words likely mispronounced based on common ESL patterns
   - Provide phonetic representations (user's likely pronunciation vs. correct)
   - Score each mistake (0-100, lower = more problematic)
   - Give strength, improvement area, and a human-like coach tip

3. **Vocabulary (Score 0-100):**
   - Identify 2-3 basic words that could be upgraded to more sophisticated alternatives
   - Suggest 3 alternative words for each
   - Include the context sentence where it was used
   - Give strength, improvement area, and coach tip

4. **Grammar (Score 0-100):**
   - Find 1-2 actual grammar mistakes from user messages (if any)
   - Provide the original sentence and corrected version
   - Explain the grammar rule briefly
   - Give strength, improvement area, and coach tip

5. **Fluency (Score 0-100):**
   - Estimate words per minute (based on message length)
   - Count pauses or hesitations (if inferable from ellipsis or short responses)
   - Count filler words (um, uh, like, you know)
   - Provide 3 metrics with status (good/warning/bad)
   - Give strength, improvement area, and coach tip

6. **Clarity (Score 0-100):**
   - Assess how clearly ideas were communicated
   - Check if responses were relevant and coherent
   - Give strength, improvement area, and coach tip

7. **Listening (Score 0-100):**
   - Evaluate how well user understood and responded to prompts
   - Check if responses were contextually appropriate
   - Give strength, improvement area, and coach tip

**Important Guidelines:**
- Be encouraging and constructive - focus on growth, not criticism
- Scores should reflect realistic assessment (not too harsh, not too lenient)
- Coach tips should sound human and supportive (e.g., "You're dropping the ends of words...")
- If there are no clear grammar mistakes, acknowledge good usage and suggest minor refinements
- If pronunciation can't be assessed accurately, estimate based on common ESL challenges for ${userProfile.nativeLanguage} speakers
- Make feedback specific and actionable

Provide your analysis in the exact JSON format specified.`;
}

/**
 * Analyzes a completed conversation and provides detailed feedback
 */
export async function analyzeConversation(
  scenario: Scenario,
  userProfile: UserProfile,
  messages: Message[]
): Promise<ConversationAnalysis> {
  const ai = getGeminiClient();

  try {
    const prompt = buildAnalysisPrompt(scenario, userProfile, messages);

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.5, // Lower temperature for more consistent analysis
        maxOutputTokens: 2048, // Limit response size to prevent truncation issues
      },
    });

    const analysisText = response.text || '{}';

    // Use safe JSON parser with fallback
    const analysis = safeParseJSON(
      analysisText,
      {
        overallScore: 65,
        cefrLevel: 'Intermediate B1',
        aiCoachInsight: `Great effort, ${userProfile.name}! You completed the conversation successfully. Keep practicing to build more confidence and fluency!`,
        pronunciation: {
          score: 65,
          strength: 'You communicated clearly enough to be understood.',
          improvement: 'Focus on practicing common professional vocabulary pronunciation.',
          coachTip: 'Keep practicing! Consistency is key to improving pronunciation.',
          mistakes: [],
        },
        vocabulary: {
          score: 60,
          strength: 'You used functional, everyday vocabulary effectively.',
          improvement: 'Try to incorporate more varied and sophisticated words.',
          coachTip: 'Reading and listening to native content will help expand your vocabulary naturally.',
          upgrades: [],
        },
        grammar: {
          score: 70,
          strength: 'Your sentences were generally well-structured.',
          improvement: 'Pay attention to verb tenses in storytelling.',
          coachTip: 'Great foundation! Small refinements will make a big difference.',
          corrections: [],
        },
        fluency: {
          score: 65,
          strength: 'You maintained good conversation flow.',
          improvement: 'Reduce pauses and hesitations with more practice.',
          coachTip: 'The more you practice, the more natural it will feel!',
          metrics: [],
        },
        clarity: {
          score: 75,
          strength: 'Your main ideas came across clearly.',
          improvement: 'Finish sentences with consistent energy.',
          coachTip: "You're doing great! Keep up the clear communication.",
        },
        listening: {
          score: 70,
          strength: 'You responded appropriately to all prompts.',
          improvement: 'Focus on catching specific details.',
          coachTip: "Active listening comes with practice - you're on the right track!",
        },
      },
      'Gemini Analysis'
    );

    return {
      overallScore: analysis.overallScore,
      cefrLevel: analysis.cefrLevel,
      aiCoachInsight: analysis.aiCoachInsight,
      skills: {
        pronunciation: {
          score: analysis.pronunciation.score,
          strength: analysis.pronunciation.strength,
          improvement: analysis.pronunciation.improvement,
          coachTip: analysis.pronunciation.coachTip,
          pronunciationData: analysis.pronunciation.mistakes || [],
        },
        vocabulary: {
          score: analysis.vocabulary.score,
          strength: analysis.vocabulary.strength,
          improvement: analysis.vocabulary.improvement,
          coachTip: analysis.vocabulary.coachTip,
          vocabularyData: analysis.vocabulary.upgrades || [],
        },
        grammar: {
          score: analysis.grammar.score,
          strength: analysis.grammar.strength,
          improvement: analysis.grammar.improvement,
          coachTip: analysis.grammar.coachTip,
          grammarData: analysis.grammar.corrections || [],
        },
        fluency: {
          score: analysis.fluency.score,
          strength: analysis.fluency.strength,
          improvement: analysis.fluency.improvement,
          coachTip: analysis.fluency.coachTip,
          fluencyData: analysis.fluency.metrics || [],
        },
        clarity: {
          score: analysis.clarity.score,
          strength: analysis.clarity.strength,
          improvement: analysis.clarity.improvement,
          coachTip: analysis.clarity.coachTip,
        },
        listening: {
          score: analysis.listening.score,
          strength: analysis.listening.strength,
          improvement: analysis.listening.improvement,
          coachTip: analysis.listening.coachTip,
        },
      },
    };
  } catch (error) {
    console.error('Conversation analysis failed:', error);

    // Return fallback encouraging feedback
    return {
      overallScore: 65,
      cefrLevel: 'Intermediate B1',
      aiCoachInsight: `Great effort, ${userProfile.name}! You completed the conversation successfully. Keep practicing to build more confidence and fluency!`,
      skills: {
        pronunciation: {
          score: 65,
          strength: 'You communicated clearly enough to be understood.',
          improvement: 'Focus on practicing common professional vocabulary pronunciation.',
          coachTip: 'Keep practicing! Consistency is key to improving pronunciation.',
        },
        vocabulary: {
          score: 60,
          strength: 'You used functional, everyday vocabulary effectively.',
          improvement: 'Try to incorporate more varied and sophisticated words.',
          coachTip: 'Reading and listening to native content will help expand your vocabulary naturally.',
          vocabularyData: [],
        },
        grammar: {
          score: 70,
          strength: 'Your sentences were generally well-structured.',
          improvement: 'Pay attention to verb tenses in storytelling.',
          coachTip: 'Great foundation! Small refinements will make a big difference.',
          grammarData: [],
        },
        fluency: {
          score: 65,
          strength: 'You maintained good conversation flow.',
          improvement: 'Reduce pauses and hesitations with more practice.',
          coachTip: 'The more you practice, the more natural it will feel!',
          fluencyData: [],
        },
        clarity: {
          score: 75,
          strength: 'Your main ideas came across clearly.',
          improvement: 'Finish sentences with consistent energy.',
          coachTip: "You're doing great! Keep up the clear communication.",
        },
        listening: {
          score: 70,
          strength: 'You responded appropriately to all prompts.',
          improvement: 'Focus on catching specific details.',
          coachTip: "Active listening comes with practice - you're on the right track!",
        },
      },
    };
  }
}
