// lib/services/gemini.ts

import { GoogleGenAI, Type, Schema, Modality } from '@google/genai';
import { Message, Scenario, UserProfile, GeminiResponse } from '../types/roleplay';

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
 * JSON Schema for structured AI responses
 * Ensures consistent output format for parsing
 */
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    role_response: {
      type: Type.STRING,
      description: 'Your in-character response. Keep it natural, 15-40 words. Split complex thoughts into short sentences.',
    },
    translation: {
      type: Type.STRING,
      description: "A natural translation of your response into the user's native language.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 short, natural example responses the user could say next, adapted to their proficiency level.',
    },
    objective_completed: {
      type: Type.BOOLEAN,
      description: 'Set to true ONLY if the user has successfully achieved the specific learning objective of the scenario.',
    },
  },
  required: ['role_response', 'translation', 'suggestions', 'objective_completed'],
  // Property ordering ensures role_response comes first for faster streaming display
  propertyOrdering: ['role_response', 'translation', 'suggestions', 'objective_completed'],
};

/**
 * Constructs a dynamic system prompt based on scenario and user profile
 * This prompt adapts to Rahul's specific challenges and learning goals
 */
function buildSystemPrompt(scenario: Scenario, userProfile: UserProfile): string {
  return `You are an expert English language tutor engaging in a role-play scenario.

**Current Role**: ${scenario.role}
**Scenario**: ${scenario.title} - ${scenario.description}
**Objective**: ${scenario.learningObjective}

**User Profile**:
- Name: ${userProfile.name}
- English Level: ${userProfile.level} (Upper-Intermediate - has strong fundamentals but needs confidence)
- Native Language: ${userProfile.nativeLanguage}

**User's Learning Goals**:
${userProfile.learningGoals.map((goal) => `- ${goal}`).join('\n')}

**User's Challenges & Context**:
${userProfile.challengesContext}

**Key Challenges to Address**:
${userProfile.challenges.primary.map((challenge) => `- ${challenge}`).join('\n')}
${userProfile.challenges.conversation.map((challenge) => `- ${challenge}`).join('\n')}

**Teaching Guidelines**:
1. **Stay in Character**: Be authentic to the role (${scenario.role}). Create a realistic, natural conversation.

2. **Level Adaptation for B2 (Upper-Intermediate)**:
   - Use natural, professional language
   - Moderate pace with some idioms and expressions
   - Introduce new vocabulary in context
   - Don't oversimplify - challenge them appropriately

3. **Build Confidence**:
   - NEVER explicitly correct grammar or pronunciation
   - Model correct usage naturally in your replies
   - Be encouraging and patient
   - Create a judgment-free environment

4. **Encourage Fluency**:
   - Keep responses brief (15-40 words) to maintain conversation flow
   - Ask follow-up questions to build conversational momentum
   - Help them find words when they struggle (through your suggestions)

5. **Support Vocabulary Building**:
   - Use contextual vocabulary relevant to the scenario
   - Naturally repeat key terms in your responses
   - Provide varied suggestions to expand their expression options

6. **Goal Achievement**:
   - Guide the user toward completing: "${scenario.learningObjective}"
   - When the objective is met, mark 'objective_completed' as true
   - Give warm, encouraging closure when complete

7. **Translation**:
   - Always provide natural ${userProfile.nativeLanguage} translation
   - Use conversational translation, not literal word-by-word

Remember: ${userProfile.name} knows the language but needs confidence. Your role is to create a safe space for practice where mistakes are learning opportunities, not failures.`;
}

/**
 * Generates AI response with streaming support
 * Streams role_response in real-time and triggers sentence-by-sentence TTS
 */
export async function generateAgentResponseStream(
  scenario: Scenario,
  userProfile: UserProfile,
  history: Message[],
  userMessageContent: string,
  onPartialResponse: (partial: Partial<GeminiResponse>) => void,
  onSentenceGenerated: (sentence: string) => void
): Promise<GeminiResponse> {
  const ai = getGeminiClient();
  const systemInstruction = buildSystemPrompt(scenario, userProfile);

  try {
    // Convert app message format to Gemini format
    const contents = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add new user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessageContent }],
    });

    const streamResult = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash-exp',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    let fullText = '';
    let lastParsedRoleResponse = '';
    let sentenceBuffer = '';
    // Sentence delimiters: period, question mark, exclamation followed by space/newline/end
    const sentenceDelimiters = /[.!?]+(?:\s+|$|\n)/g;

    // Process stream chunks
    for await (const chunk of streamResult) {
      const chunkText = chunk.text || '';
      fullText += chunkText;

      // Extract role_response from partial JSON using regex
      // This allows us to display text before full JSON is complete
      const match = fullText.match(/"role_response"\s*:\s*"((?:[^"\\]|\\.)*)"/);

      if (match) {
        let currentRoleResponse = match[1];

        // Unescape JSON string
        try {
          currentRoleResponse = currentRoleResponse.replace(/\\"/g, '"').replace(/\\n/g, '\n');
        } catch (e) {
          // Use raw if unescape fails
        }

        // Check for new content
        if (currentRoleResponse.length > lastParsedRoleResponse.length) {
          const newContent = currentRoleResponse.slice(lastParsedRoleResponse.length);
          sentenceBuffer += newContent;
          lastParsedRoleResponse = currentRoleResponse;

          // Update UI with current text
          onPartialResponse({ role_response: currentRoleResponse });

          // Extract complete sentences for TTS
          let delimiterMatch;
          while ((delimiterMatch = sentenceDelimiters.exec(sentenceBuffer)) !== null) {
            const endIdx = delimiterMatch.index + delimiterMatch[0].length;
            const sentence = sentenceBuffer.slice(0, endIdx).trim();
            if (sentence) {
              onSentenceGenerated(sentence);
            }
            sentenceBuffer = sentenceBuffer.slice(endIdx);
            sentenceDelimiters.lastIndex = 0; // Reset regex state
          }
        }
      }
    }

    // Handle remaining text in buffer as final sentence
    if (sentenceBuffer.trim()) {
      onSentenceGenerated(sentenceBuffer.trim());
    }

    // Parse final complete JSON
    try {
      return JSON.parse(fullText) as GeminiResponse;
    } catch (e) {
      console.warn('Could not parse final JSON, using regex fallback', e);

      // Fallback: Extract data via regex if JSON parse fails
      let translation = '';
      const translationMatch = fullText.match(/"translation"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (translationMatch) {
        try {
          translation = translationMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
        } catch (e) {
          translation = translationMatch[1];
        }
      }

      let suggestions: string[] = [];
      const suggestionsMatch = fullText.match(/"suggestions"\s*:\s*\[([\s\S]*?)\]/);
      if (suggestionsMatch) {
        const items = suggestionsMatch[1].match(/"((?:[^"\\]|\\.)*)"/g);
        if (items) {
          suggestions = items.map((s) => s.slice(1, -1).replace(/\\"/g, '"'));
        }
      }

      return {
        role_response: lastParsedRoleResponse,
        translation: translation,
        suggestions: suggestions,
        objective_completed: false,
      };
    }
  } catch (error) {
    console.error('Gemini Streaming API Error:', error);
    return {
      role_response: "I'm having trouble connecting. Please try again.",
      translation: 'कनेक्शन में समस्या है। कृपया पुनः प्रयास करें।',
      suggestions: ['Can you repeat that?', 'Let me try again.', 'Could you say that differently?'],
      objective_completed: false,
    };
  }
}

/**
 * Streams TTS audio for a given text
 * Returns a stream of audio chunks for Web Audio API processing
 */
export async function streamSpeech(text: string, voiceName: string = 'Kore'): Promise<any> {
  const ai = getGeminiClient();

  try {
    return await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });
  } catch (error) {
    console.error('Gemini TTS Error:', error);
    throw error;
  }
}

/**
 * Browser TTS using Web Speech API (FAST - Instant playback!)
 * PRIMARY TTS METHOD - 50-100ms latency vs Gemini's 200-500ms
 * Use this for real-time conversation where speed matters
 */
export function speakWithBrowserTTS(text: string, lang: string = 'en-US', voiceGender: 'female' | 'male' = 'female'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Browser TTS not supported'));
      return;
    }

    // Cancel any ongoing speech for instant response
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Wait for voices to load (important for quality)
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      let selectedVoice;

      // Try to find best quality voice based on gender
      if (voiceGender === 'female') {
        // Prefer high-quality female voices for AI responses
        selectedVoice = voices.find(voice =>
          voice.lang.startsWith('en') && (
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Female')
          )
        );
      } else {
        // Male voices for user responses
        selectedVoice = voices.find(voice =>
          voice.lang.startsWith('en') && (
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.name.includes('David') ||
            voice.name.includes('Male')
          )
        );
      }

      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (error) => {
      console.error('Browser TTS error:', error);
      resolve(); // Resolve anyway to prevent getting stuck
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Generates single non-streaming audio (for Listen Mode)
 * Returns Uint8Array of PCM audio data
 */
export async function generateSpeech(text: string, voiceName: string = 'Kore'): Promise<Uint8Array | null> {
  const ai = getGeminiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    // Decode base64 to Uint8Array
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Gemini TTS Error:', error);
    return null;
  }
}
