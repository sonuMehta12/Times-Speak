"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, Languages, Keyboard, Send, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/lib/types/roleplay';
import { generateAssessmentResponse, convertToAssessmentHistory, AssessmentResponse } from '@/lib/services/assessment-chat';
import { generateSpeechBase64, playAudioFromBase64, stopAudio } from '@/lib/services/aditi-tutor';
import VoiceRecorder from '@/components/common/VoiceRecorder';

type MessageSender = 'user' | 'ai';

interface AssessmentMessage {
  id: number;
  sender: MessageSender;
  text: string;
  time: string;
  translation?: {
    language: string;
    text: string;
  };
  audioBase64?: string;
}

interface AssessmentChatProps {
  userProfile: UserProfile;
  onComplete: (messages: AssessmentMessage[]) => void;
  onCancel?: () => void;
}

export default function AssessmentChat({ userProfile, onComplete, onCancel }: AssessmentChatProps) {
  const [messages, setMessages] = useState<AssessmentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeInput, setTypeInput] = useState('');
  const [currentTurn, setCurrentTurn] = useState(1);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const greetingInitialized = useRef(false);
  const isPlayingAudioRef = useRef(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const userName = userProfile.name || 'there';
  const MAX_TURNS = 5;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop any playing audio
      if (activeSourceRef.current) {
        try {
          activeSourceRef.current.stop();
          activeSourceRef.current.disconnect();
        } catch (e) {
          // Already stopped
        }
        activeSourceRef.current = null;
      }
      // Also call global stopAudio to ensure cleanup
      stopAudio();
    };
  }, []);

  // Initialize with greeting
  useEffect(() => {
    if (greetingInitialized.current) return;
    greetingInitialized.current = true;

    const initializeAssessment = async () => {
      const greeting = `Hi ${userName}! Welcome to your English assessment. I'm excited to chat with you for a few minutes. How are you feeling today?`;
      const hinglish = `Hi ${userName}! Aapke English assessment mein aapka swagat hai. Main aapse kuch minutes baat karne ke liye excited hoon. Aaj aap kaisa feel kar rahe ho?`;

      const greetingMessage: AssessmentMessage = {
        id: Date.now(), // Use timestamp for unique ID
        sender: 'ai',
        text: greeting,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        translation: {
          language: 'Hinglish Translation',
          text: hinglish
        }
      };

      setMessages([greetingMessage]);

      // Generate TTS audio for greeting in background
      try {
        const greetingAudio = await generateSpeechBase64(greeting);
        const updatedGreeting = { ...greetingMessage, audioBase64: greetingAudio };
        setMessages([updatedGreeting]);

        // Auto-play greeting audio
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') {
              await ctx.resume();
            }
            await ctx.close();
          }
          setAutoPlayEnabled(true);
          await playAudioFromBase64(greetingAudio);
        } catch (audioErr) {
          console.log('Auto-play blocked by browser - user interaction required:', audioErr);
        }
      } catch (err) {
        console.error('Greeting TTS generation failed:', err);
      }
    };

    initializeAssessment();
  }, [userName]);

  // Handle sending a message
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Enable auto-play after first user interaction
    let shouldEnableAutoPlay = false;
    if (!autoPlayEnabled) {
      shouldEnableAutoPlay = true;
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          await ctx.close();
        }
        setAutoPlayEnabled(true);
      } catch (err) {
        console.log('Audio context initialization:', err);
      }
    }

    const userMessageTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Add user message to chat
    const userMsg: AssessmentMessage = {
      id: Date.now() + Math.random(), // Use timestamp + random to ensure uniqueness
      sender: 'user',
      text: messageText,
      time: userMessageTime
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setShowTypeModal(false);
    setTypeInput('');

    try {
      // Convert messages to conversation history
      const history = convertToAssessmentHistory(messages);

      // Increment turn number for next AI response
      const nextTurn = currentTurn + 1;

      // Get AI response
      const response: AssessmentResponse = await generateAssessmentResponse(
        userProfile,
        history,
        messageText,
        nextTurn
      );

      // Generate TTS audio for the response
      let audioBase64: string | undefined;
      try {
        audioBase64 = await generateSpeechBase64(response.english);
      } catch (err) {
        console.error('TTS generation failed:', err);
      }

      const aiMessageTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Add AI response to chat
      const aiMsg: AssessmentMessage = {
        id: Date.now() + Math.random() + 1, // Use timestamp + random to ensure uniqueness
        sender: 'ai',
        text: response.english,
        time: aiMessageTime,
        translation: {
          language: 'Hinglish Translation',
          text: response.hinglish
        },
        audioBase64
      };

      const updatedMessages = [...messages, userMsg, aiMsg];
      setMessages(updatedMessages);
      setCurrentTurn(nextTurn);

      // Auto-play audio for AI response
      if (audioBase64) {
        try {
          isPlayingAudioRef.current = true;
          const source = await playAudioFromBase64(audioBase64);
          activeSourceRef.current = source;

          source.onended = () => {
            isPlayingAudioRef.current = false;
            activeSourceRef.current = null;
          };
        } catch (err) {
          isPlayingAudioRef.current = false;
          console.error('Auto-play audio failed:', err);
          if (shouldEnableAutoPlay) {
            setTimeout(async () => {
              try {
                isPlayingAudioRef.current = true;
                const retrySource = await playAudioFromBase64(audioBase64!);
                activeSourceRef.current = retrySource;

                retrySource.onended = () => {
                  isPlayingAudioRef.current = false;
                  activeSourceRef.current = null;
                };
              } catch (retryErr) {
                isPlayingAudioRef.current = false;
                console.log('Audio auto-play blocked - click speaker icon to play');
              }
            }, 100);
          }
        }
      }

      // Check if assessment is complete
      if (response.assessment_complete || nextTurn > MAX_TURNS) {
        // Show continue button immediately
        setShowContinueButton(true);

        // Wait for audio to finish, but don't auto-complete
        const waitForAudio = async () => {
          // Poll until audio finishes (max 10 seconds)
          let waited = 0;
          while (isPlayingAudioRef.current && waited < 10000) {
            await new Promise(resolve => setTimeout(resolve, 500));
            waited += 500;
          }
          // Audio finished - user can now click Continue button
        };
        waitForAudio();
      }

    } catch (error) {
      console.error('Error getting assessment response:', error);

      // Fallback error message
      const errorMsg: AssessmentMessage = {
        id: Date.now() + Math.random(), // Use timestamp + random to ensure uniqueness
        sender: 'ai',
        text: "I'm sorry, I had trouble processing that. Could you try again?",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        translation: {
          language: 'Hinglish Translation',
          text: 'Sorry, mujhe problem ho gayi. Kya tum phir se try kar sakte ho?'
        }
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Type button
  const handleTypeSubmit = () => {
    if (typeInput.trim()) {
      handleSendMessage(typeInput);
    }
  };

  return (
    <div className="w-full h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md h-screen bg-bg-card flex flex-col overflow-hidden shadow-xl">
        {/* Header with progress */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/imgs/assessment-bot.png" />
                <AvatarFallback className="bg-teal/10 text-teal font-bold">AS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-text-primary leading-tight">English Assessment</p>
                <p className="text-sm text-success font-medium">Active</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-text-secondary font-semibold">
              <span>Question {Math.min(currentTurn, MAX_TURNS)} of {MAX_TURNS}</span>
              <span>{Math.round((currentTurn / MAX_TURNS) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal to-coral h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentTurn / MAX_TURNS) * 100}%` }}
              />
            </div>
          </div>
        </header>

        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto bg-bg-card p-4 overscroll-contain">
          <div className="space-y-4">
            {/* Info banner */}
            <Card className="bg-teal/5 border-teal/20">
              <CardContent className="p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                <p className="text-sm text-navy leading-relaxed">
                  Answer naturally. We're evaluating your pronunciation, vocabulary, grammar, fluency, clarity, and listening skills.
                </p>
              </CardContent>
            </Card>

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex w-full items-start gap-3 animate-fade-in-up ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'items-start'
                }`}
              >
                <MessageAvatar sender={msg.sender} userName={userName} />
                <div className={`flex flex-col max-w-[85%] break-words ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <MessageBubble message={msg} />
                </div>
              </div>
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Footer action bar */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
          {showContinueButton ? (
            <Button
              onClick={() => onComplete(messages)}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              Continue to Results
            </Button>
          ) : (
            <div className="flex justify-around items-center">
              <button
                onClick={() => setShowTypeModal(true)}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors disabled:opacity-50"
              >
                <div className="h-12 w-12 bg-gray-100 rounded-[18px] flex items-center justify-center shadow-sm hover:bg-gray-200 transition-all">
                  <Keyboard className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">Type</span>
              </button>

              <div className="transform -translate-y-2">
                <VoiceRecorder
                  mode="manual"
                  onRecordingComplete={handleSendMessage}
                  variant="large"
                  showInterimResults={true}
                  disabled={isLoading}
                  maxDuration={120}
                  onError={(error) => console.error('Voice recording error:', error)}
                />
              </div>

              <div className="w-12"></div> {/* Spacer for balance */}
            </div>
          )}
        </footer>

        {/* Type Modal */}
        {showTypeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
            <div className="bg-white w-full rounded-t-2xl p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-text-primary">Type your response</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTypeModal(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <textarea
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                placeholder="Type what you want to say..."
                className="w-full min-h-[120px] p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal/20"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTypeSubmit();
                  }
                }}
              />
              <Button
                onClick={handleTypeSubmit}
                disabled={!typeInput.trim()}
                className="w-full mt-4 bg-teal hover:bg-teal-hover text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send Response
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Message Avatar Component
const MessageAvatar: React.FC<{ sender: MessageSender; userName: string }> = ({ sender, userName }) => {
  if (sender === 'ai') {
    return (
      <Avatar className="w-8 h-8 self-end flex-shrink-0">
        <AvatarImage src="/imgs/assessment-bot.png" />
        <AvatarFallback className="bg-teal/10 text-teal font-bold">AS</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="w-8 h-8 self-end flex-shrink-0">
      <AvatarFallback className="bg-coral text-white font-bold text-base">
        {userName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{ message: AssessmentMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = async () => {
    if (message.audioBase64 && !isPlayingAudio) {
      setIsPlayingAudio(true);
      try {
        await playAudioFromBase64(message.audioBase64);
      } catch (err) {
        console.error('Audio playback failed:', err);
      } finally {
        setIsPlayingAudio(false);
      }
    }
  };

  return (
    <Card className={`shadow-md transition-all ${
      isUser
        ? 'bg-navy text-white rounded-[18px] rounded-br-md border-0'
        : 'bg-white text-text-primary rounded-[18px] rounded-bl-md border border-gray-200'
    }`}>
      <CardContent className="p-3.5">
        <p className="text-[15px] leading-relaxed mb-2">
          {message.text}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayAudio}
            disabled={!message.audioBase64 || isPlayingAudio}
            className={`h-7 w-7 rounded-full transition-all ${
              isUser
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-teal/10 hover:bg-teal/20 text-teal'
            } disabled:opacity-40`}
            aria-label="Listen to message"
          >
            <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          </Button>

          {message.translation && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTranslation(!showTranslation)}
              className={`h-7 w-7 rounded-full transition-all ${
                isUser
                  ? showTranslation
                    ? 'bg-white/30 hover:bg-white/40 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                  : showTranslation
                    ? 'bg-teal/20 hover:bg-teal/30 text-teal'
                    : 'bg-teal/10 hover:bg-teal/20 text-teal'
              }`}
              aria-label="Toggle Translation"
            >
              <Languages className="h-4 w-4" />
            </Button>
          )}

          <span className="text-[10px] ml-auto opacity-60 font-medium">{message.time}</span>
        </div>

        {message.translation && showTranslation && (
          <div className={`mt-2.5 pt-2.5 animate-fade-in-down ${
            isUser ? 'border-t border-white/20' : 'border-t border-gray-200'
          }`}>
            <p className="text-xs font-semibold opacity-70 mb-1">
              {message.translation.language}
            </p>
            <p className="text-sm opacity-90 italic leading-relaxed">
              &quot;{message.translation.text}&quot;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Typing Indicator Component
const TypingIndicator: React.FC = () => (
  <div className="flex w-full items-start gap-3 justify-start animate-fade-in-up">
    <Avatar className="w-8 h-8 self-end flex-shrink-0">
      <AvatarImage src="/imgs/assessment-bot.png" />
      <AvatarFallback className="bg-teal/10 text-teal font-bold">AS</AvatarFallback>
    </Avatar>
    <Card className="border-0 bg-white rounded-[18px] rounded-bl-md shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);
