"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  Languages,
  Lightbulb,
  Mic,
  Star,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type MessageSender = "user" | "ai";

interface Message {
  id: number;
  sender: MessageSender;
  text: string;
  time: string;
  feedback?: {
    grade: string;
  };
}

export default function RolePlayConversationPage() {
  const userName = "Rohan"; // Replace with actual user name from auth/context
  const scenarioTitle = "Meeting a New Colleague ☕";
  const scenarioImage =
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=225&fit=crop";

  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationScript: Message[] = [
    {
      id: 1,
      sender: "ai",
      text: "Hey! I don't think we've met. I'm Aisha from Marketing.",
      time: "10:05 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "Oh, hi Aisha! Nice to meet you. I'm Rohan. Uh, I work at Times Internet, where I handle client accounts.",
      time: "10:06 AM",
      feedback: { grade: "Good Start!" },
    },
    {
      id: 3,
      sender: "ai",
      text: "Oh cool! Client accounts — that sounds interesting. What kind of accounts?",
      time: "10:06 AM",
    },
    {
      id: 4,
      sender: "user",
      text: "Mostly B2B clients, you know, corporate partnerships and stuff. I'm currently focusing on improving how we onboard new clients.",
      time: "10:07 AM",
      feedback: { grade: "Confident!" },
    },
    {
      id: 5,
      sender: "ai",
      text: "Hmm, onboarding. Yeah, that can be tricky. What's your main responsibility there?",
      time: "10:07 AM",
    },
    {
      id: 6,
      sender: "user",
      text: "Well, I'm responsible for the whole onboarding process, which helps us get clients set up faster. We've been trying to cut down the time it takes.",
      time: "10:08 AM",
      feedback: { grade: "Clear!" },
    },
    {
      id: 7,
      sender: "ai",
      text: "That makes sense. How's it going?",
      time: "10:08 AM",
    },
    {
      id: 8,
      sender: "user",
      text: "Actually, pretty well! Recently, I streamlined our documentation process, which resulted in about 30% faster turnaround.",
      time: "10:09 AM",
      feedback: { grade: "Excellent!" },
    },
    {
      id: 9,
      sender: "ai",
      text: "Wow, that's impressive! 30% is significant.",
      time: "10:09 AM",
    },
    {
      id: 10,
      sender: "user",
      text: "Thanks! What about you? What does Marketing do here?",
      time: "10:10 AM",
      feedback: { grade: "Great Question!" },
    },
    {
      id: 11,
      sender: "ai",
      text: "Oh, my role involves coordinating between different teams — creative, sales, analytics — which allows me to see the big picture of our campaigns.",
      time: "10:10 AM",
    },
    {
      id: 12,
      sender: "user",
      text: "Sounds like you've got your hands full!",
      time: "10:11 AM",
      feedback: { grade: "Natural!" },
    },
    {
      id: 13,
      sender: "ai",
      text: "[laughs] Yeah, definitely! But it's interesting work. Anyway, nice meeting you, Rohan.",
      time: "10:11 AM",
    },
    {
      id: 14,
      sender: "user",
      text: "You too, Aisha. See you around!",
      time: "10:12 AM",
      feedback: { grade: "Perfect!" },
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages]);

  const playConversation = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setDisplayedMessages([]);
    setActiveMessageId(null);
    setIsPracticeMode(false);

    for (let i = 0; i < conversationScript.length; i++) {
      const message = conversationScript[i];
      const messageWithUserName = {
        ...message,
        text: message.text.replace(/Rohan/g, userName),
      };

      setDisplayedMessages((prev) => [...prev, messageWithUserName]);
      setActiveMessageId(message.id);

      const readTime = message.text.length * 40 + 500;
      await new Promise((resolve) => setTimeout(resolve, readTime));
    }

    setActiveMessageId(null);
    setIsPlaying(false);
    setIsPracticeMode(true);
  };

  useEffect(() => {
    playConversation();
  }, []);

  const handleEnterPracticeMode = () => {
    setIsPracticeMode(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full">
      <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-lg z-20 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <img
                src={scenarioImage}
                alt={scenarioTitle}
                className="w-12 h-12 rounded-[12px] object-cover flex-shrink-0 border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-primary leading-tight truncate font-display text-base">
                  {scenarioTitle}
                </p>
                <p className="text-xs text-text-secondary">
                  Controlled Practice
                </p>
              </div>
            </div>
            <Badge className="bg-navy/10 text-navy hover:bg-navy/10 border-0 rounded-full px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0 ml-2">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-semibold">AI</span>
            </Badge>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-4 bg-bg-card">
          <div className="space-y-3">
            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full items-start gap-3 animate-fade-in-up ${
                  msg.sender === "user" ? "flex-row-reverse" : "items-start"
                }`}
              >
                {/* Avatar */}
                {msg.sender === "ai" ? (
                  <Avatar className="w-9 h-9 flex-shrink-0 border-2 border-gray-100">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop"
                      alt="Aisha"
                    />
                    <AvatarFallback className="bg-teal text-white text-sm font-semibold">
                      A
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-9 h-9 flex-shrink-0 bg-coral border-2 border-coral-hover">
                    <AvatarFallback className="bg-coral text-white font-bold text-base">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Message Bubble */}
                <div
                  className={`flex flex-col w-full max-w-[80%] ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <Card
                    className={`relative p-3.5 rounded-[20px] shadow-sm transition-all duration-500 border-2 ${
                      msg.sender === "user"
                        ? "bg-navy text-white rounded-br-md border-navy"
                        : "bg-white text-text-primary rounded-bl-md border-gray-200"
                    } ${
                      msg.id === activeMessageId
                        ? "ring-2 ring-gold ring-offset-2"
                        : ""
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <p className="text-xs font-semibold text-teal mb-1.5">
                        Aisha
                      </p>
                    )}
                    <p
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />

                    <div className="flex items-center gap-2.5 mt-2.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-full transition-colors ${
                          msg.sender === "user"
                            ? "bg-white/20 hover:bg-white/30 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-text-secondary"
                        }`}
                        aria-label="Listen"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-full transition-colors ${
                          msg.sender === "user"
                            ? "bg-white/20 hover:bg-white/30 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-text-secondary"
                        }`}
                        aria-label="Translate"
                      >
                        <Languages className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-[10px] ml-auto opacity-70 font-medium">
                        {msg.time}
                      </span>
                    </div>

                    {msg.sender === "user" &&
                      msg.feedback &&
                      isPracticeMode && (
                        <Badge className="absolute -bottom-2.5 right-2 bg-gold text-navy border-0 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md animate-fade-in-up">
                          <Star className="w-3 h-3 fill-navy" />
                          <span>{msg.feedback.grade}</span>
                        </Badge>
                      )}
                  </Card>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Action Bar */}
        <footer className="flex-shrink-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 shadow-lg">
          <div className="flex justify-around items-center max-w-sm mx-auto">
            <Button
              variant="ghost"
              onClick={playConversation}
              disabled={isPlaying}
              className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors w-20 h-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-transparent p-0"
            >
              <div className="h-14 w-14 bg-gray-100 rounded-[16px] flex items-center justify-center text-navy shadow-sm hover:bg-gray-200 hover:shadow-md transition-all active:scale-95">
                <RefreshCw
                  className={`h-6 w-6 ${isPlaying ? "animate-spin" : ""}`}
                />
              </div>
              <span className="text-xs font-semibold">Repeat</span>
            </Button>

            <Button
              onClick={handleEnterPracticeMode}
              className="flex flex-col items-center gap-1.5 transition-colors w-20 h-auto transform -translate-y-3 bg-transparent p-0 hover:bg-transparent"
            >
              <div className="h-16 w-16 bg-coral text-white rounded-full flex items-center justify-center shadow-lg shadow-coral/40 hover:bg-coral-hover hover:shadow-xl hover:shadow-coral/50 transition-all active:scale-95">
                <Mic className="h-7 w-7" />
              </div>
              <span className="text-xs font-semibold text-text-secondary">
                Speak
              </span>
            </Button>

            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-navy transition-colors w-20 h-auto hover:bg-transparent p-0"
            >
              <div className="h-14 w-14 bg-gray-100 rounded-[16px] flex items-center justify-center text-navy shadow-sm hover:bg-gray-200 hover:shadow-md transition-all active:scale-95">
                <Lightbulb className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold">Hint</span>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
