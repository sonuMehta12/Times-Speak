"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Volume2, Languages, Lightbulb, Mic, MessageCircle, Keyboard, ChevronDown, Star, Captions } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Mode = 'chat' | 'call';
type MessageSender = 'user' | 'ai';

interface Message {
  id: number;
  sender: MessageSender;
  text: string;
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
}

export default function ChatPage() {
  const userName = 'John';
  const [mode, setMode] = useState<Mode>('chat');
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: 'ai', 
      text: `Hi ${userName}! Let's practice polite requests. Try saying: <strong>"Could you please pass me the salt?"</strong>`, 
      time: "10:05 AM", 
      teachingBadge: 'New Phrase' 
    },
    { 
      id: 2, 
      sender: 'user', 
      text: `Could you pass to me the salt?`, 
      time: "10:06 AM", 
      feedback: { 
        grade: 'Good try!',
        original: `Could you pass <span class="bg-error/20 text-error px-1 rounded font-medium">to me</span> the salt?`,
        corrected: `Could you <span class="bg-success/20 text-success px-1 rounded font-medium">please</span> pass <span class="bg-success/20 text-success px-1 rounded font-medium">me</span> the salt?`,
      } 
    },
    { 
      id: 3, 
      sender: 'ai', 
      text: `For natural phrasing, say "pass me" and add "please" to be more polite. Great start!`, 
      time: "10:07 AM" 
    },
    { 
      id: 4, 
      sender: 'ai', 
      text: `Good attempt! You got the main idea right. Let's try another one. How would you ask someone to open the window?`, 
      time: "10:07 AM", 
      translation: { 
        language: 'Hinglish Translation', 
        text: 'Badhiya koshish! Chalo ek aur try karte hain.' 
      } 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (mode === 'call') {
      setCallDuration(0);
      intervalId = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mode]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(true), 1000);
    const newMsgTimer = setTimeout(() => {
      setIsLoading(false);
      setMessages(prev => [...prev, {
        id: 5,
        sender: 'ai',
        text: "Just let me know when you're ready to try!",
        time: "10:08 AM"
      }]);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(newMsgTimer);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="w-full -mt-4 -mx-4">
      <div className="fixed inset-0 flex flex-col bg-bg-card max-w-[393px] mx-auto left-0 right-0 z-50">
        {/* Header - Fixed to top */}
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-lg z-20 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => window.history.back()}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Avatar className="h-11 w-11">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=44&auto=format&fit=crop" />
                  <AvatarFallback>SI</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-bold text-text-primary leading-tight font-body">Sia</p>
                <p className="text-sm text-success font-medium font-body">Active now</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {mode === 'call' && (
                <div className="font-mono text-navy font-semibold text-base" aria-label="Call duration">
                  {formatTime(callDuration)}
                </div>
              )}
              <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
                <Button 
                  onClick={() => setMode('chat')} 
                  variant="ghost"
                  size="sm"
                  className={`px-3 py-1.5 h-auto rounded-full text-xs font-semibold transition-colors ${
                    mode === 'chat' ? 'bg-navy text-white shadow-sm hover:bg-navy-hover hover:text-white' : 'text-text-secondary hover:bg-transparent'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 inline mr-1.5" /> Chat
                </Button>
                <Button 
                  onClick={() => setMode('call')} 
                  variant="ghost"
                  size="sm"
                  className={`px-3 py-1.5 h-auto rounded-full text-xs font-semibold transition-colors ${
                    mode === 'call' ? 'bg-navy text-white shadow-sm hover:bg-navy-hover hover:text-white' : 'text-text-secondary hover:bg-transparent'
                  }`}
                >
                  <Mic className="h-4 w-4 inline mr-1.5" /> Call
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-bg-card">
          {mode === 'chat' ? (
            <ChatView 
              messages={messages} 
              isLoading={isLoading} 
              userName={userName} 
              messagesEndRef={messagesEndRef} 
            />
          ) : (
            <CallView userName={userName} />
          )}
        </main>

        {/* Footer Action Bar - Fixed to bottom */}
        {mode === 'chat' && (
          <footer className="flex-shrink-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 shadow-sm">
            <div className="flex justify-around items-center">
              <button className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors">
                <div className="h-14 w-14 bg-gray-100 rounded-[20px] flex items-center justify-center text-text-primary shadow-sm hover:bg-gray-200 transition-all">
                  <Keyboard className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold font-body">Type</span>
              </button>
              
              <button className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors transform -translate-y-2">
                <div className="h-16 w-16 bg-coral text-white rounded-full flex items-center justify-center shadow-lg shadow-coral/30 hover:bg-coral-hover transition-all">
                  <Mic className="h-7 w-7" />
                </div>
                <span className="text-xs font-semibold font-body">Speak</span>
              </button>
              
              <button className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors">
                <div className="h-14 w-14 bg-gray-100 rounded-[20px] flex items-center justify-center text-text-primary shadow-sm hover:bg-gray-200 transition-all">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold font-body">Hint</span>
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

// Chat View Component
const ChatView: React.FC<{ 
  messages: Message[]; 
  isLoading: boolean; 
  userName: string; 
  messagesEndRef: React.RefObject<HTMLDivElement> 
}> = ({ messages, isLoading, userName, messagesEndRef }) => (
  <div className="px-4 py-4 space-y-4">
    {messages.map(msg => (
      <div 
        key={msg.id} 
        className={`flex w-full items-start gap-3 ${
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
    {isLoading && <TypingIndicator userName={userName} />}
    <div ref={messagesEndRef} />
  </div>
);

// Call View Component
const CallView: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-navy text-white p-4">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Avatars */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-teal shadow-2xl">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop" 
                  className="object-cover"
                />
                <AvatarFallback>SI</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                <Mic className="h-5 w-5 text-teal" />
              </div>
            </div>
            <p className="font-bold text-lg font-body">Sia</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-coral/50 shadow-2xl">
                <AvatarFallback className="bg-coral text-white font-bold text-5xl">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                <Mic className="h-5 w-5 text-coral" />
              </div>
            </div>
            <p className="font-bold text-lg font-body">{userName}</p>
          </div>
        </div>
        
        <p className="text-white/70 text-center font-body">
          Your call has started.<br/>Tap the microphone to speak.
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 w-full pb-4">
        <button className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors">
          <div className="h-16 w-16 bg-white/10 rounded-[20px] flex items-center justify-center text-white shadow-sm hover:bg-white/20 transition-all">
            <Captions className="h-7 w-7" />
          </div>
          <span className="text-xs font-semibold font-body">CC</span>
        </button>
        
        <button className="flex flex-col items-center gap-1.5 text-white transition-colors">
          <div className="h-20 w-20 bg-coral text-white rounded-full flex items-center justify-center shadow-lg hover:bg-coral-hover transition-all transform hover:scale-105">
            <Mic className="h-9 w-9" />
          </div>
        </button>
        
        <button className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors">
          <div className="h-16 w-16 bg-white/10 rounded-[20px] flex items-center justify-center text-white shadow-sm hover:bg-white/20 transition-all">
            <Lightbulb className="h-7 w-7" />
          </div>
          <span className="text-xs font-semibold font-body">Hint</span>
        </button>
      </div>
    </div>
  );
};

// Message Avatar Component
const MessageAvatar: React.FC<{ sender: MessageSender; userName: string }> = ({ sender, userName }) => {
  if (sender === 'ai') {
    return (
      <Avatar className="w-8 h-8 self-end flex-shrink-0">
        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=32&auto=format&fit=crop" />
        <AvatarFallback>SI</AvatarFallback>
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
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [showTranslation, setShowTranslation] = useState(false);
  
  return (
    <Card className={`shadow-sm ${
      isUser 
        ? 'bg-navy text-white rounded-[20px] rounded-br-lg border-0' 
        : 'bg-white text-text-primary rounded-[20px] rounded-bl-lg border border-gray-200'
    }`}>
      <CardContent className="p-3">
        {message.teachingBadge && (
          <Badge className="inline-flex items-center gap-1.5 bg-gold/10 text-gold hover:bg-gold/10 border-0 px-2.5 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="h-3 w-3" /> {message.teachingBadge}
          </Badge>
        )}
        
        <p 
          className="text-sm leading-relaxed font-body" 
          dangerouslySetInnerHTML={{ __html: message.text }} 
        />

        <div className="flex items-center gap-3 mt-2">
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-7 w-7 rounded-full transition-colors ${
              isUser 
                ? 'bg-white/20 hover:bg-white/30 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-text-primary'
            }`}
            aria-label="Listen"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => message.translation && setShowTranslation(!showTranslation)}
            className={`h-7 w-7 rounded-full transition-colors ${
              isUser 
                ? showTranslation 
                  ? 'bg-white/30 hover:bg-white/40 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
                : showTranslation
                  ? 'bg-gray-300 hover:bg-gray-400 text-text-primary'
                  : 'bg-gray-200 hover:bg-gray-300 text-text-primary'
            }`}
            aria-label="Toggle Translation"
            disabled={!message.translation}
          >
            <Languages className="h-4 w-4" />
          </Button>
          
          <span className="text-xs ml-auto opacity-70 font-body">{message.time}</span>
        </div>

        {message.translation && showTranslation && (
          <div className="mt-2 pt-2 border-t border-gray-200/50 animate-fade-in-down">
            <p className="text-xs font-semibold opacity-70 mb-1 font-body">
              {message.translation.language}
            </p>
            <p className="text-sm opacity-90 italic font-body">
              &quot;{message.translation.text}&quot;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Feedback Section Component
const FeedbackSection: React.FC<{ feedback: Message['feedback'] }> = ({ feedback }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!feedback) return null;

  return (
    <>
      <div className="w-full flex justify-end mt-1.5">
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          variant="ghost"
          className="text-sm font-semibold text-teal hover:text-teal-hover flex items-center gap-1 transition-colors h-auto p-1 hover:bg-transparent"
        >
          <span className="font-body">{isOpen ? 'Hide Feedback' : 'View Feedback'}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      
      {isOpen && (
        <Card className="w-full mt-2 border-gray-200 rounded-[16px] shadow-sm animate-fade-in-down">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-teal font-bold mb-3 font-body">
              <Star className="h-4 w-4 text-gold fill-current" />
              <span>{feedback.grade}</span>
            </div>
            <div className="space-y-2 text-text-secondary text-sm font-body">
              <p dangerouslySetInnerHTML={{ __html: feedback.original }} />
              <p dangerouslySetInnerHTML={{ __html: feedback.corrected }} />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

// Typing Indicator Component
const TypingIndicator: React.FC<{ userName: string }> = ({ userName }) => (
  <div className="flex w-full items-start gap-3 justify-start animate-fade-in-up">
    <MessageAvatar sender="ai" userName={userName} />
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
