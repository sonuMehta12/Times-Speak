// components/roleplay/ChatInterface.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  ArrowLeft,
  Mic,
  Volume2,
  CheckCircle2,
  Languages,
  Lightbulb,
  Loader2,
  Square,
  MoreVertical,
  Play,
  RotateCcw,
  Keyboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message, Scenario, UserProfile } from '@/lib/types/roleplay';
import { generateAgentResponseStream, speakWithBrowserTTS } from '@/lib/services/gemini';

interface ChatInterfaceProps {
  scenario: Scenario;
  userProfile: UserProfile;
  onBack: () => void;
}

export default function ChatInterface({ scenario, userProfile, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Audio State
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'keyboard'>('voice');
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioChain = useRef<Promise<void>>(Promise.resolve());
  const isPlayingRef = useRef(false);

  // Stop all audio playback
  const stopAudio = () => {
    isPlayingRef.current = false;
    audioChain.current = Promise.resolve();

    // Cancel browser TTS if playing
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPlayingMessageId(null);
    setAudioLoadingId(null);
  };

  // Initialize chat with greeting
  useEffect(() => {
    const greetingTranslation =
      scenario.exampleConversation &&
      scenario.exampleConversation.length > 0 &&
      scenario.exampleConversation[0].speaker === 'Agent' &&
      scenario.exampleConversation[0].text === scenario.initialGreeting
        ? scenario.exampleConversation[0].translation
        : 'नमस्कार।';

    const initialMessage: Message = {
      id: 'init',
      role: 'assistant',
      content: scenario.initialGreeting,
      timestamp: Date.now(),
      suggestions: ['Hello!', 'Hi there!', 'Good morning!'],
      translation: greetingTranslation,
    };

    setMessages([initialMessage]);

    // Auto-play greeting after a short delay
    setTimeout(() => {
      handlePlayAudio('init', scenario.initialGreeting);
    }, 500);

    // Cleanup on unmount
    return () => {
      stopAudio();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showSuggestions, showTranslation, isLoading, isTyping]);

  // Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support voice typing. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        // Auto-send when speech recognition completes
        const messageToSend = finalTranscript.trim();
        if (messageToSend) {
          handleSendMessage(messageToSend);
        }
      }
    };

    recognition.start();
  };

  // Play streaming sentence audio - Uses FAST Browser TTS for instant playback
  const playStreamingSentence = async (text: string): Promise<void> => {
    try {
      await speakWithBrowserTTS(text, 'en-US', 'female');
    } catch (e) {
      console.error('Browser TTS error:', e);
    }
  };

  // Manual play button handler
  const handlePlayAudio = async (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      stopAudio();
      return;
    }

    stopAudio();
    isPlayingRef.current = true;
    setPlayingMessageId(msgId);
    setAudioLoadingId(msgId);

    audioChain.current = audioChain.current.then(async () => {
      if (!isPlayingRef.current) return;
      setAudioLoadingId(null);
      await playStreamingSentence(text);
      setPlayingMessageId(null);
    });
  };

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    stopAudio();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    // Create placeholder assistant message
    const assistantMsgId = (Date.now() + 1).toString();
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      const finalResponse = await generateAgentResponseStream(
        scenario,
        userProfile,
        messages,
        text,
        (partial) => {
          setIsLoading(false);
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, content: partial.role_response || m.content } : m))
          );
        },
        (_sentence) => {
          // Streaming sentences - not used for auto-play
        }
      );

      // Finalize message with full response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: finalResponse.role_response,
                translation: finalResponse.translation,
                suggestions: finalResponse.suggestions,
              }
            : m
        )
      );

      if (finalResponse.objective_completed) {
        setIsCompleted(true);
      }

      // Auto-play the complete response
      if (finalResponse.role_response) {
        setTimeout(() => {
          handlePlayAudio(assistantMsgId, finalResponse.role_response);
        }, 300);
      }
    } catch (error) {
      console.error('Failed to generate response', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, content: 'Sorry, I had trouble connecting. Please try again.' } : m
        )
      );
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const toggleTranslation = (msgId: string) => {
    setShowTranslation((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const toggleSuggestions = (msgId: string) => {
    setShowSuggestions((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleListenAll = () => {
    let index = 0;

    const speakNext = () => {
      if (index < messages.length) {
        const msg = messages[index];
        const textToSpeak = msg.content;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.9;

        const voices = window.speechSynthesis.getVoices();
        if (msg.role === 'assistant') {
          const femaleVoice = voices.find((v) => v.name.includes('Female') || v.name.includes('Samantha'));
          if (femaleVoice) utterance.voice = femaleVoice;
        } else {
          const maleVoice = voices.find((v) => v.name.includes('Male') || v.name.includes('Daniel'));
          if (maleVoice) utterance.voice = maleVoice;
        }

        utterance.onend = () => {
          index++;
          if (index < messages.length) {
            setTimeout(speakNext, 500);
          }
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    speakNext();
  };

  const handleRetake = () => {
    window.speechSynthesis.cancel();
    setMessages([]);
    setIsCompleted(false);
    setShowTranslation({});
    setShowSuggestions({});

    // Restart with initial greeting
    const greetingTranslation =
      scenario.exampleConversation &&
      scenario.exampleConversation.length > 0 &&
      scenario.exampleConversation[0].speaker === 'Agent' &&
      scenario.exampleConversation[0].text === scenario.initialGreeting
        ? scenario.exampleConversation[0].translation
        : 'नमस्कार।';

    const initialMessage: Message = {
      id: 'init',
      role: 'assistant',
      content: scenario.initialGreeting,
      timestamp: Date.now(),
      suggestions: ['Hello!', 'Hi there!', 'Good morning!'],
      translation: greetingTranslation,
    };

    setMessages([initialMessage]);
  };

  return (
    <div className="w-full">
      <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 mx-4">
              <h1 className="text-base font-bold text-navy truncate font-display">{scenario.title} - Roleplay</h1>
              {isCompleted && <p className="text-xs text-teal font-semibold">Objective Completed!</p>}
            </div>

            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-bg-card min-h-0 pb-32">
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-fade-in">
                {msg.role === 'assistant' ? (
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-teal to-teal-400">
                      <AvatarFallback className="text-white font-bold">AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
                        <CardContent className="p-4">
                          {msg.id === messages[messages.length - 1].id && isTyping && !msg.content ? (
                            // Typing indicator with three dots
                            <div className="flex items-center gap-1 py-1">
                              <span className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-text-primary font-body mb-2">
                                {msg.content}
                                {msg.id === messages[messages.length - 1].id && isTyping && msg.content && (
                                  <span className="inline-block w-1 h-4 bg-teal ml-1 animate-pulse align-middle"></span>
                                )}
                              </p>

                              {!isTyping && msg.content && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePlayAudio(msg.id, msg.content)}
                                    disabled={isLoading}
                                    className="h-8 px-3 text-xs hover:bg-gray-100"
                                  >
                                    {audioLoadingId === msg.id ? (
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : playingMessageId === msg.id ? (
                                      <Square className="h-3 w-3 mr-1 fill-current" />
                                    ) : (
                                      <Volume2 className="h-3 w-3 mr-1" />
                                    )}
                                    {audioLoadingId === msg.id
                                      ? 'Loading...'
                                      : playingMessageId === msg.id
                                      ? 'Stop'
                                      : 'Listen'}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleTranslation(msg.id)}
                                    className="h-8 px-3 text-xs hover:bg-gray-100"
                                  >
                                    <Languages className="h-3 w-3 mr-1" />
                                    {showTranslation[msg.id] ? 'Hide' : userProfile.nativeLanguage}
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                      <p className="text-xs text-text-secondary mt-1 ml-3">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>

                      {/* Translation */}
                      {showTranslation[msg.id] && msg.translation && (
                        <div className="mt-2 text-sm text-text-secondary italic bg-indigo-50/50 border border-indigo-100 px-4 py-2 rounded-2xl">
                          <span className="font-semibold text-xs text-teal uppercase mr-1">
                            {userProfile.nativeLanguage}:
                          </span>
                          {msg.translation}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 mb-4 justify-end">
                    <div className="flex-1 flex justify-end">
                      <div className="max-w-[80%]">
                        <Card className="bg-navy border-navy rounded-2xl shadow-sm">
                          <CardContent className="p-4">
                            <p className="text-sm text-white font-body">{msg.content}</p>
                          </CardContent>
                        </Card>
                        <p className="text-xs text-text-secondary mt-1 mr-3 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Avatar className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-coral to-coral-hover">
                      <AvatarFallback className="text-white font-bold">U</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}


            {/* Completion Card */}
            {isCompleted && (
              <div className="flex justify-center my-4">
                <Card className="bg-gradient-to-br from-teal/10 to-navy/5 border-teal/20 max-w-md">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-teal mx-auto mb-3" />
                    <h3 className="font-display font-bold text-navy mb-2">Objective Completed!</h3>
                    <p className="text-sm text-text-secondary">
                      Great job, {userProfile.name}! You've successfully completed this scenario. Keep practicing to
                      build more confidence!
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Bottom Action Area */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 space-y-3">
          {!isCompleted ? (
            <>
              {/* Suggestions Card */}
              {showSuggestions[messages[messages.length - 1]?.id] && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].suggestions && (
                <Card className="bg-amber-50 border-amber-100 rounded-2xl">
                  <CardContent className="p-4">
                    <p className="text-xs font-bold text-amber-600 uppercase mb-2">You could say:</p>
                    <div className="flex flex-wrap gap-2">
                      {messages[messages.length - 1].suggestions?.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputValue(suggestion)}
                          className="text-sm text-left bg-white hover:bg-amber-100 text-text-primary px-3 py-1.5 rounded-lg border border-amber-200/50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Keyboard Mode - Text Input */}
              {inputMode === 'keyboard' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your response..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-navy focus:outline-none text-sm font-body disabled:bg-gray-100"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 py-3 rounded-2xl bg-coral hover:bg-coral-hover text-white disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Main Action Buttons */}
              <div className="flex items-center justify-center gap-6">
                {/* Keyboard Mode Button - Circular */}
                {inputMode === 'keyboard' ? (
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      onClick={() => setInputMode('voice')}
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                      className="h-16 w-16 rounded-full border-2 border-gray-300 bg-gray-100 text-text-secondary hover:border-navy hover:bg-navy/10 transition-all"
                    >
                      <Keyboard className="h-6 w-6" />
                    </Button>
                    <span className="text-xs font-medium text-text-secondary">Keyboard</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      onClick={() => setInputMode('keyboard')}
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                      className="h-16 w-16 rounded-full border-2 border-gray-300 bg-white text-text-secondary hover:border-navy hover:bg-navy/10 transition-all"
                    >
                      <Keyboard className="h-6 w-6" />
                    </Button>
                    <span className="text-xs font-medium text-text-secondary">Keyboard</span>
                  </div>
                )}

                {/* Mic Button - Large Circular Primary */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    onClick={toggleListening}
                    disabled={isLoading}
                    size="icon"
                    className={`h-20 w-20 rounded-full font-semibold shadow-lg transition-all active:scale-95 ${
                      isListening
                        ? 'bg-error hover:bg-error/90 text-white'
                        : 'bg-coral hover:bg-coral-hover text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isListening ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                  <span className="text-xs font-medium text-text-secondary">Practice</span>
                </div>

                {/* Hint Button - Circular */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    onClick={() => {
                      const lastMsg = messages[messages.length - 1];
                      if (lastMsg?.role === 'assistant' && lastMsg.suggestions) {
                        toggleSuggestions(lastMsg.id);
                      }
                    }}
                    variant="outline"
                    size="icon"
                    disabled={isLoading || !messages[messages.length - 1]?.suggestions}
                    className={`h-16 w-16 rounded-full border-2 transition-all ${
                      showSuggestions[messages[messages.length - 1]?.id]
                        ? 'border-gold bg-gold text-white'
                        : 'border-gray-300 bg-white text-text-secondary hover:border-gold hover:bg-gold/10'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <Lightbulb className="h-6 w-6" />
                  </Button>
                  <span className="text-xs font-medium text-text-secondary">Hint</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleListenAll}
                variant="outline"
                className="flex-1 py-3 rounded-2xl border-2 border-navy text-navy hover:bg-navy/5 font-semibold"
              >
                <Play className="h-4 w-4 mr-2" />
                Listen
              </Button>
              <Button
                onClick={handleRetake}
                variant="outline"
                className="flex-1 py-3 rounded-2xl border-2 border-navy text-navy hover:bg-navy/5 font-semibold"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button onClick={onBack} className="flex-1 py-3 rounded-2xl bg-coral hover:bg-coral-hover text-white font-semibold shadow-lg">
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
