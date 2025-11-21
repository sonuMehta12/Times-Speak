// lib/services/aditi-tutor.ts

import { GoogleGenAI, Modality, Content } from "@google/genai";
import { generateSystemInstruction, ADITI_RESPONSE_SCHEMA } from "../constants/aditi-prompts";
import { TutorResponse, ConversationTurn } from "../types/aditi";
import { UserProfile } from "../types/roleplay";

const getClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment.");
  }
  return new GoogleGenAI({ apiKey });
};

// Model for intelligence/chat
const CHAT_MODEL = 'gemini-2.0-flash-exp';
// Model for Text-to-Speech (same as roleplay scenario)
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

/**
 * Generates the JSON response for Aditi tutor persona based on user profile
 */
export const generateAditiResponse = async (
  userProfile: UserProfile,
  history: ConversationTurn[],
  userMessage: string
): Promise<TutorResponse> => {
  const client = getClient();

  // Generate dynamic system instruction based on user profile
  const systemInstruction = generateSystemInstruction(userProfile);

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
    model: CHAT_MODEL,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: ADITI_RESPONSE_SCHEMA,
      temperature: 0.8, // Slightly higher for more natural, varied responses
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Aditi AI");
  }

  try {
    const parsed = JSON.parse(text) as TutorResponse;

    // Validate that hint array has exactly 3 items
    if (!parsed.hint || parsed.hint.length !== 3) {
      console.warn("Invalid hint array, generating fallback hints");
      parsed.hint = [
        "That's interesting. Tell me more.",
        "I understand. Could you elaborate on that?",
        "I see. What else would you like to discuss?"
      ];
    }

    return parsed;
  } catch (e) {
    console.error("Failed to parse JSON from Aditi AI", text);
    // Fallback if JSON is malformed (rare with schema)
    return {
      message: "I'm having a bit of trouble understanding. Could you rephrase that?",
      hinglish: "Mujhe thoda samajh nahi aaya. Kya tum phir se keh sakte ho?",
      hint: [
        "Let me try again.",
        "Could you please repeat that?",
        "I'm ready to continue. What's next?"
      ]
    };
  }
};

/**
 * Generates Speech from text using Gemini TTS.
 * Returns base64 encoded audio string.
 */
export const generateSpeechBase64 = async (text: string): Promise<string> => {
  const client = getClient();
  const cleanText = text.replace(/\*\*/g, ""); // Remove markdown formatting

  const response = await client.models.generateContent({
    model: TTS_MODEL,
    contents: [{ parts: [{ text: cleanText }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated from TTS");

  return base64Audio;
};

/**
 * Helper to decode and play raw PCM using AudioContext
 */
let audioContext: AudioContext | null = null;

export const ensureAudioContext = async (): Promise<void> => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
};

export const playAudioFromBase64 = async (base64Audio: string): Promise<void> => {
  // Initialize AudioContext lazily
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Ensure context is running (browsers suspend it until user interaction)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // Decode base64
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Gemini TTS raw PCM is 24kHz, mono, 16-bit signed integer (Little Endian)
  const dataInt16 = new Int16Array(bytes.buffer);
  const numChannels = 1;
  const sourceSampleRate = 24000; // Fixed for this model
  const frameCount = dataInt16.length / numChannels;

  // Create buffer with the source sample rate
  const buffer = audioContext.createBuffer(numChannels, frameCount, sourceSampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    // Convert Int16 to Float32 (-1.0 to 1.0)
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};

/**
 * Convert conversation history from AditiMessage format to ConversationTurn format
 */
export const convertToConversationHistory = (messages: any[]): ConversationTurn[] => {
  return messages
    .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.text.replace(/<[^>]*>/g, '') }] // Strip HTML tags
    }));
};
