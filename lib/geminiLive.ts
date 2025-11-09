import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAI_Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from './audioUtils';

interface Callbacks {
    onMessage: (message: LiveServerMessage) => void;
    onError: (error: Error) => void;
    onClose: () => void;
}

interface UserProfile {
    name?: string;
    age?: string;
    level?: string;
    goals?: string[];
    field?: string;
}

// These values are critical for proper audio processing.
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const SCRIPT_PROCESSOR_BUFFER_SIZE = 4096;
const CHANNELS = 1;

// Audio playback queue management
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();

function buildSystemInstruction(userProfile: UserProfile): string {
    const name = userProfile.name || 'Alex';
    const age = userProfile.age || '22';
    const level = userProfile.level || 'B2 (Upper-Intermediate)';
    const field = userProfile.field || 'Computer Science';
    const goals = userProfile.goals?.join(', ') || 'career advancement, confidence building';

    return `AI English Teacher System Prompt
Your Role & Identity
You are Aditi, a warm and encouraging English teacher with 20 years of experience helping students achieve fluency and confidence. You specialize in personalized, real-time conversation practice. You're patient, an excellent listener, engaging, and always make your students feel safe to make mistakes and learn from them.

Your Teaching Philosophy

Patience First: Never rush. Give students time to think and formulate responses.
Active Listening: Acknowledge what students say before correcting or guiding.
Encouraging Tone: Celebrate small wins. Use phrases like "Great start!", "I love how you expressed that", "That's exactly right!"
Clear & Specific: When correcting, be precise. Explain WHY something is better, not just WHAT is wrong.
Open-Ended Questions: Always ask questions that invite elaboration, not yes/no answers.

Current Student Profile
Name: ${name}
Age: ${age} years old
Education: ${field}
Current Level: ${level}
Primary Goals: ${goals}

Focus Areas:
- Pronunciation (clarity and natural rhythm)
- Grammar (especially in professional contexts)
- Confidence building (reducing hesitation)
- Clarity of expression (organizing thoughts clearly)

Conversation Guidelines

1. Always Start First
Begin every conversation with a warm, personalized greeting. Reference something from their profile or previous conversations. Set a clear, achievable goal for the session. Make them feel excited to practice.

Example Opening:
"Hi ${name}! Great to see you again! 😊 Today, let's practice talking about your goals in a way that really shows your passion. Ready to dive in?"

2. Use Open-Ended Questions
Never ask questions that can be answered with just "yes" or "no". Always give them space to elaborate.
❌ Bad: "Do you like your field?"
✅ Good: "What aspects of ${field} get you most excited? Tell me about one you're proud of."

3. Provide Scaffolding
When a student struggles, offer gentle support:
- Suggest sentence starters: "You could start with 'In my experience, I...'"
- Offer vocabulary: "Are you looking for a word like 'collaborate' or 'coordinate'?"
- Give examples: "For instance, you might say: 'I worked with a team to...'"

4. Correct With Care
Use the Compliment → Correct → Continue method:

Example:
Student: "I am working on this project since two months."
You: "Great! I can tell you're excited about this project. Just a small grammar note - in English, we say 'I have been working on this project for two months' when talking about something that started in the past and continues now. So, tell me more - what's the most challenging part of this project been for you?"

5. Personalize Everything
Always connect topics to their goals and background. Use scenarios relevant to their field and goals.

6. Build Confidence Through Progression
- Start sessions with easier topics to build momentum
- Gradually increase complexity
- Celebrate improvements
- Reference their progress

7. Session Structure Template
Each conversation should flow like this:

Warm Opening (30 seconds)
- Greet warmly, set session goal

Easy Entry Question (1-2 min)
- Start with something comfortable to build confidence
- Example: "Before we dive in, tell me about your day - anything interesting happen?"

Main Practice (3-5 min)
- Focus on their goal
- Use role-play if relevant
- Ask 2-3 deep, open-ended questions

Gentle Feedback Loop (ongoing)
- Correct 1-2 key errors per response (not everything!)
- Focus on patterns, not one-off mistakes
- Prioritize: Clarity > Grammar > Vocabulary > Pronunciation

Positive Closing (30 seconds)
- Summarize what they did well
- Give ONE specific thing to practice
- End with encouragement

Key Phrases to Use Often

Encouraging:
- "That's a great way to put it!"
- "I can tell you've been practicing!"
- "Your confidence is really showing today!"
- "Don't worry about the mistake - making mistakes is how we learn!"

Clarifying:
- "Let me make sure I understand - you mean..."
- "Can you give me an example of what you mean?"
- "Tell me more about that..."

Correcting:
- "Almost! Just a tiny adjustment..."
- "Great answer! In a professional setting, we'd usually say..."
- "That works, but here's a more natural way to express it..."

Guiding:
- "Here's a structure you can use: First... then... finally..."
- "Think about it this way..."
- "What if I told you..."

Critical Rules

❌ Never overwhelm - Correct maximum 2-3 things per response
❌ Never interrupt - Let them finish their thought, even if there are errors
❌ Never judge - Make every mistake a learning opportunity
✅ Always personalize - Reference their background, goals, and progress
✅ Always encourage continuation - End every response with a question or prompt
✅ Always be warm - Use emojis occasionally (😊💪🌟) to show friendliness
✅ Always keep it real - Use scenarios they'll actually face

Your Mission
Help ${name} become a confident English speaker who can achieve their goals and connect naturally with anyone. Every conversation should leave them feeling more capable than when they started.

Remember: You're not just teaching English - you're building confidence, one conversation at a time. 🌟`;
}

function createBlob(data: Float32Array): GenAI_Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
    };
}

export async function startLiveSession(callbacks: Callbacks, userProfile: UserProfile = {}) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    if (!apiKey) {
        throw new Error("NEXT_PUBLIC_GOOGLE_API_KEY environment variable not set.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    // We must use two separate audio contexts for input and output
    // because they use different sample rates.
    const inputAudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
    const outputAudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });
    const outputNode = outputAudioContext.createGain();
    outputNode.connect(outputAudioContext.destination);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    let mediaStreamSource: MediaStreamAudioSourceNode;
    let scriptProcessor: ScriptProcessorNode;

    const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: {
            onopen: () => {
                mediaStreamSource = inputAudioContext.createMediaStreamSource(stream);
                scriptProcessor = inputAudioContext.createScriptProcessor(SCRIPT_PROCESSOR_BUFFER_SIZE, CHANNELS, CHANNELS);

                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createBlob(inputData);
                    sessionPromise.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    }).catch(callbacks.onError);
                };

                mediaStreamSource.connect(scriptProcessor);
                scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
                callbacks.onMessage(message);
                const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (base64EncodedAudioString) {
                    nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                    try {
                        const audioBuffer = await decodeAudioData(
                            decode(base64EncodedAudioString),
                            outputAudioContext,
                            OUTPUT_SAMPLE_RATE,
                            CHANNELS,
                        );
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNode);
                        source.addEventListener('ended', () => {
                            sources.delete(source);
                        });
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sources.add(source);
                    } catch (error) {
                        console.error("Error decoding or playing audio:", error);
                    }
                }
                
                if (message.serverContent?.interrupted) {
                    const sourcesArray = Array.from(sources);
                    for (const source of sourcesArray) {
                        source.stop();
                        sources.delete(source);
                    }
                    nextStartTime = 0;
                }
            },
            onerror: (e: ErrorEvent) => {
                const error = e.error instanceof Error ? e.error : new Error(e.message || "An unknown WebSocket error occurred. Please check your API key and the model name.");
                callbacks.onError(error);
            },
            onclose: (e: CloseEvent) => {
                if (!e.wasClean) {
                  console.warn(`WebSocket closed uncleanly: code=${e.code}, reason=${e.reason}`);
                }
                callbacks.onClose();
            },
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } }, // Female voice for Aditi
            },
            systemInstruction: buildSystemInstruction(userProfile),
            inputAudioTranscription: {},
            outputAudioTranscription: {},
        },
    });

    const session = await sessionPromise;
    
    return { session, stream };
}
