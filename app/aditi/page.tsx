"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, Languages, Lightbulb, Keyboard, ChevronDown, Star, Phone, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserProfile } from '@/lib/data/user-profile';
import { generateAditiResponse, generateSpeechBase64, playAudioFromBase64, stopAudio, convertToConversationHistory } from '@/lib/services/aditi-tutor';
import { getRandomAditiGreeting, getGreetingHinglish, getGreetingHints } from '@/lib/utils/aditi-greetings';
import { AditiMessage } from '@/lib/types/aditi';
import { UserProfile } from '@/lib/types/roleplay';
import VoiceRecorder from '@/components/common/VoiceRecorder';

type MessageSender = 'user' | 'ai';

export default function ChatPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState('John');

  // Ref to track if greeting has been initialized
  const greetingInitialized = useRef(false);

  // Load user data from localStorage
  useEffect(() => {
    // Prevent multiple initializations
    if (greetingInitialized.current) return;
    greetingInitialized.current = true;

    const initializeAditi = async () => {
      const profile = getUserProfile();
      setUserProfile(profile);
      setUserName(profile.name || 'John');

      // Initialize with a random greeting
      const greeting = getRandomAditiGreeting(profile);
      const hinglish = getGreetingHinglish(profile);
      const hints = getGreetingHints(profile);

      // Show greeting immediately (don't wait for audio)
      const greetingMessage: AditiMessage = {
        id: 1,
        sender: 'ai',
        text: greeting,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        translation: {
          language: 'Hinglish Translation',
          text: hinglish
        },
        hints
      };

      setMessages([greetingMessage]);
      setCurrentHints(hints);

      // Generate TTS audio for greeting in background
      try {
        const greetingAudio = await generateSpeechBase64(greeting);
        // Update message with audio
        const updatedGreeting = { ...greetingMessage, audioBase64: greetingAudio };
        setMessages([updatedGreeting]);

        // Auto-play greeting audio immediately (only once)
        try {
          // Initialize and resume audio context for auto-play
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') {
              await ctx.resume();
            }
            await ctx.close();
          }

          // Enable auto-play for future messages
          setAutoPlayEnabled(true);

          // Play the greeting audio
          await playAudioFromBase64(greetingAudio);
        } catch (audioErr) {
          console.log('Auto-play blocked by browser - user interaction required:', audioErr);
          // This is expected on some browsers - audio will play on first user interaction
        }
      } catch (err) {
        console.error('Greeting TTS generation failed:', err);
      }
    };

    initializeAditi();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const [messages, setMessages] = useState<AditiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentHints, setCurrentHints] = useState<string[]>([]);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeInput, setTypeInput] = useState('');
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle recording start - stop any playing TTS
  const handleRecordingStart = () => {
    stopAudio();
  };

  // Handle sending a message to Aditi
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !userProfile) return;

    // Ensure auto-play is enabled after first user interaction
    // Also initialize audio context on first interaction (required by browsers)
    let shouldEnableAutoPlay = false;
    if (!autoPlayEnabled) {
      shouldEnableAutoPlay = true;
      try {
        // Initialize audio context with user gesture
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
    const userMsg: AditiMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: messageText,
      time: userMessageTime
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setShowHintModal(false);
    setShowTypeModal(false);
    setTypeInput('');

    try {
      // Convert messages to conversation history
      const history = convertToConversationHistory(messages);

      // Get AI response
      const response = await generateAditiResponse(userProfile, history, messageText);

      // Generate TTS audio for the response
      let audioBase64: string | undefined;
      try {
        audioBase64 = await generateSpeechBase64(response.message);
      } catch (err) {
        console.error('TTS generation failed:', err);
      }

      const aiMessageTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Add AI response to chat
      const aiMsg: AditiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: response.message,
        time: aiMessageTime,
        translation: {
          language: 'Hinglish Translation',
          text: response.hinglish
        },
        hints: response.hint,
        audioBase64,
        feedback: response.feedback
      };

      setMessages(prev => [...prev, aiMsg]);
      setCurrentHints(response.hint);

      // Auto-play audio for AI response - always try to play
      if (audioBase64) {
        try {
          await playAudioFromBase64(audioBase64);
        } catch (err) {
          console.error('Auto-play audio failed:', err);
          // If auto-play fails and we just enabled it, try again after a brief delay
          if (shouldEnableAutoPlay) {
            setTimeout(async () => {
              try {
                await playAudioFromBase64(audioBase64);
              } catch (retryErr) {
                console.log('Audio auto-play blocked - click speaker icon to play');
              }
            }, 100);
          }
        }
      }

      // If there's feedback for the user's message, add it to the user message
      if (response.feedback) {
        setMessages(prev => prev.map(msg =>
          msg.id === userMsg.id
            ? { ...msg, feedback: response.feedback }
            : msg
        ));
      }

    } catch (error) {
      console.error('Error getting Aditi response:', error);

      // Fallback error message
      const errorMsg: AditiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: "I'm sorry, I had trouble processing that. Could you try again?",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        translation: {
          language: 'Hinglish Translation',
          text: 'Sorry, mujhe problem ho gayi. Kya tum phir se try kar sakte ho?'
        },
        hints: ['Let me try again.', 'I understand.', 'What should we do next?']
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

  // Handle Hint selection
  const handleHintSelect = (hint: string) => {
    handleSendMessage(hint);
  };

  return (
    <div className="w-full">
      <div className="fixed inset-0 flex flex-col bg-bg-card max-w-[393px] mx-auto left-0 right-0 z-50">
        {/* Header - Fixed to top */}
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-lg z-20 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  stopAudio(); // Stop audio before navigation
                  window.history.back();
                }}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Avatar className="h-11 w-11">
                  <AvatarImage src="/imgs/Aditi.png" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-bold text-text-primary leading-tight font-body">Aditi</p>
                <p className="text-sm text-success font-medium font-body">Active now</p>
              </div>
            </div>

            {/* Only Call Button - No Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/aditi'}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-teal/10 hover:bg-teal/20 text-teal"
                aria-label="Start voice call"
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-bg-card">
          <ChatView
            messages={messages}
            isLoading={isLoading}
            userName={userName}
            messagesEndRef={messagesEndRef}
          />
        </main>

        {/* Footer Action Bar - Fixed to bottom */}
        <footer className="flex-shrink-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 shadow-sm">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setShowTypeModal(true)}
              className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors"
            >
              <div className="h-14 w-14 bg-gray-100 rounded-[20px] flex items-center justify-center text-text-primary shadow-sm hover:bg-gray-200 transition-all">
                <Keyboard className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold font-body">Type</span>
            </button>

            <div className="transform -translate-y-2">
              <VoiceRecorder
                mode="manual"
                onRecordingComplete={handleSendMessage}
                onRecordingStart={handleRecordingStart}
                variant="large"
                showInterimResults={true}
                disabled={isLoading}
                maxDuration={120}
                onError={(error) => console.error('Voice recording error:', error)}
              />
            </div>

            <button
              onClick={() => setShowHintModal(true)}
              disabled={currentHints.length === 0}
              className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors disabled:opacity-50"
            >
              <div className="h-14 w-14 bg-gray-100 rounded-[20px] flex items-center justify-center text-text-primary shadow-sm hover:bg-gray-200 transition-all">
                <Lightbulb className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold font-body">Hint</span>
            </button>
          </div>
        </footer>

        {/* Type Modal */}
        {showTypeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center max-w-[393px] mx-auto left-0 right-0">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-text-primary">Type your message</h3>
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
                className="w-full min-h-[120px] p-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-navy/20 font-body"
                autoFocus
              />
              <Button
                onClick={handleTypeSubmit}
                disabled={!typeInput.trim()}
                className="w-full mt-4 bg-navy hover:bg-navy-hover text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send Message
              </Button>
            </div>
          </div>
        )}

        {/* Hint Modal */}
        {showHintModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center max-w-[393px] mx-auto left-0 right-0">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-text-primary">Choose a response</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHintModal(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-3">
                {currentHints.map((hint, index) => (
                  <button
                    key={index}
                    onClick={() => handleHintSelect(hint)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-2xl hover:border-navy hover:bg-navy/5 transition-all font-body text-text-primary"
                  >
                    <span className="text-xs text-text-secondary font-semibold mb-1 block">
                      {index === 0 ? 'Simple' : index === 1 ? 'Professional' : 'Engaging'}
                    </span>
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Chat View Component
const ChatView: React.FC<{
  messages: AditiMessage[];
  isLoading: boolean;
  userName: string;
  messagesEndRef: React.RefObject<HTMLDivElement>
}> = ({ messages, isLoading, userName, messagesEndRef }) => (
  <div className="px-4 py-6 space-y-5">
    {messages.length === 0 && !isLoading && (
      <div className="flex items-center justify-center h-full text-text-secondary text-sm">
        <p>Start a conversation with Aditi...</p>
      </div>
    )}
    {messages.map(msg => (
      <div
        key={msg.id}
        className={`flex w-full items-start gap-3 animate-fade-in-up ${
          msg.sender === 'user' ? 'flex-row-reverse' : 'items-start'
        }`}
      >
        <MessageAvatar sender={msg.sender} userName={userName} />
        <div className={`flex flex-col w-full max-w-[85%] ${
          msg.sender === 'user' ? 'items-end' : 'items-start'
        }`}>
          <MessageBubble message={msg} />
          {msg.sender === 'user' && msg.feedback && (
            <FeedbackSection feedback={msg.feedback} />
          )}
        </div>
      </div>
    ))}
    {isLoading && <TypingIndicator />}
    <div ref={messagesEndRef} />
  </div>
);

// Message Avatar Component
const MessageAvatar: React.FC<{ sender: MessageSender; userName: string }> = ({ sender, userName }) => {
  if (sender === 'ai') {
    return (
      <Avatar className="w-8 h-8 self-end flex-shrink-0">
        <AvatarImage src="/imgs/Aditi.png" />
        <AvatarFallback>AD</AvatarFallback>
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

// Message Bubble Component with Keyword Highlighting
const MessageBubble: React.FC<{ message: AditiMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Parse **keywords** for highlighting
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const keyword = part.slice(2, -2);
        return (
          <strong key={index} className="text-indigo-700 font-bold">
            {keyword}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

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
        ? 'bg-navy text-white rounded-[20px] rounded-br-lg border-0'
        : 'bg-white text-text-primary rounded-[20px] rounded-bl-lg border border-gray-200'
    }`}>
      <CardContent className="p-4">
        <p className="text-[15px] leading-relaxed font-body mb-2">
          {renderText(message.text)}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayAudio}
            disabled={!message.audioBase64 || isPlayingAudio}
            className={`h-8 w-8 rounded-full transition-all ${
              isUser
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-teal/10 hover:bg-teal/20 text-teal'
            } disabled:opacity-40`}
            aria-label="Listen to message"
            title={isPlayingAudio ? 'Playing...' : 'Listen to message'}
          >
            <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          </Button>

          {message.translation && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTranslation(!showTranslation)}
              className={`h-8 w-8 rounded-full transition-all ${
                isUser
                  ? showTranslation
                    ? 'bg-white/30 hover:bg-white/40 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                  : showTranslation
                    ? 'bg-navy/20 hover:bg-navy/30 text-navy'
                    : 'bg-navy/10 hover:bg-navy/20 text-navy'
              }`}
              aria-label="Toggle Translation"
              title={showTranslation ? 'Hide translation' : 'Show translation'}
            >
              <Languages className="h-4 w-4" />
            </Button>
          )}

          <span className="text-[11px] ml-auto opacity-60 font-body font-medium">{message.time}</span>
        </div>

        {message.translation && showTranslation && (
          <div className={`mt-3 pt-3 animate-fade-in-down ${
            isUser ? 'border-t border-white/20' : 'border-t border-gray-200'
          }`}>
            <p className="text-xs font-semibold opacity-70 mb-1.5 font-body">
              {message.translation.language}
            </p>
            <p className="text-sm opacity-90 italic font-body leading-relaxed">
              &quot;{message.translation.text}&quot;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Feedback Section Component
const FeedbackSection: React.FC<{ feedback: AditiMessage['feedback'] }> = ({ feedback }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!feedback) return null;

  return (
    <>
      <div className="w-full flex justify-end mt-2">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          className="text-sm font-semibold text-teal hover:text-teal-hover flex items-center gap-1.5 transition-all h-auto px-3 py-1.5 hover:bg-teal/10 rounded-full"
        >
          <Star className="h-4 w-4 text-gold fill-gold" />
          <span className="font-body">{isOpen ? 'Hide Feedback' : 'View Feedback'}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {isOpen && (
        <Card className="w-full mt-2 border-2 border-teal/20 rounded-[16px] shadow-md animate-fade-in-down bg-gradient-to-br from-white to-teal/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-teal font-bold mb-3 font-body text-base">
              <Star className="h-5 w-5 text-gold fill-gold" />
              <span>{feedback.grade}</span>
            </div>
            <div className="space-y-3 text-text-secondary text-sm font-body">
              <div>
                <p className="text-xs font-semibold text-text-primary mb-1">Your message:</p>
                <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: feedback.original }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary mb-1">Improved version:</p>
                <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: feedback.corrected }} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

// Typing Indicator Component
const TypingIndicator: React.FC = () => (
  <div className="flex w-full items-start gap-3 justify-start animate-fade-in-up">
    <Avatar className="w-8 h-8 self-end flex-shrink-0">
      <AvatarImage src="/imgs/Aditi.png" />
      <AvatarFallback>AD</AvatarFallback>
    </Avatar>
    <Card className="border-0 bg-white rounded-[20px] rounded-bl-lg shadow-sm">
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
