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
  X,
  Trophy,
  RotateCcw,
  Repeat,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [userName, setUserName] = useState("Rohan");
  const [aiName, setAiName] = useState("Aisha");
  const scenarioTitle = "Meeting a New Colleague ☕";
  const scenarioImage =
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=225&fit=crop";

  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userRecordings, setUserRecordings] = useState<number[]>([]);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHintModal, setShowHintModal] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
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
    setCurrentPracticeIndex(0);
    setUserRecordings([]);

    for (let i = 0; i < conversationScript.length; i++) {
      const message = conversationScript[i];
      const messageWithUserName = {
        ...message,
        text: message.text
          .replace(/Rohan/g, userName)
          .replace(/Aisha/g, aiName),
      };

      setDisplayedMessages((prev) => [...prev, messageWithUserName]);
      setActiveMessageId(message.id);

      const readTime = message.text.length * 40 + 500;
      await new Promise((resolve) => setTimeout(resolve, readTime));
    }

    setActiveMessageId(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    playConversation();
  }, []);

  const handleEnterPracticeMode = async () => {
    setIsPracticeMode(true);
    setDisplayedMessages([]);
    setCurrentPracticeIndex(0);
    setUserRecordings([]);
    setHintsRemaining(3); // Reset hints when entering practice mode

    // Show first AI message
    const firstAiMessage = conversationScript[0];
    const messageWithNames = {
      ...firstAiMessage,
      text: firstAiMessage.text.replace(/Aisha/g, aiName),
    };
    setDisplayedMessages([messageWithNames]);
  };

  const handleRecordResponse = () => {
    if (isRecording) return;

    setIsRecording(true);

    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);

      // Add user's response
      const userMessageIndex = currentPracticeIndex + 1;
      if (userMessageIndex < conversationScript.length) {
        const userMessage = conversationScript[userMessageIndex];
        if (userMessage.sender === "user") {
          const messageWithNames = {
            ...userMessage,
            text: userMessage.text
              .replace(/Rohan/g, userName)
              .replace(/Aisha/g, aiName),
          };
          setDisplayedMessages((prev) => [...prev, messageWithNames]);
          setUserRecordings((prev) => [...prev, userMessage.id]);

          // Wait a bit, then show next AI message
          setTimeout(() => {
            const nextAiIndex = userMessageIndex + 1;
            if (nextAiIndex < conversationScript.length) {
              const nextAiMessage = conversationScript[nextAiIndex];
              const messageWithNames = {
                ...nextAiMessage,
                text: nextAiMessage.text.replace(/Aisha/g, aiName),
              };
              setDisplayedMessages((prev) => [...prev, messageWithNames]);
              setCurrentPracticeIndex(nextAiIndex);
            } else {
              // Conversation ended
              setTimeout(() => {
                setShowFeedbackModal(true);
              }, 1000);
            }
          }, 1500);
        }
      }
    }, 3000);
  };

  const handleSwapRoles = () => {
    const tempName = userName;
    setUserName(aiName);
    setAiName(tempName);
    setShowFeedbackModal(false);

    // Restart conversation with swapped roles
    setTimeout(() => {
      playConversation();
    }, 500);
  };

  const handleRetake = () => {
    setShowFeedbackModal(false);
    setHintsRemaining(3); // Reset hints on retake
    setTimeout(() => {
      handleEnterPracticeMode();
    }, 500);
  };

  const handleShowHint = () => {
    if (hintsRemaining > 0) {
      setShowHintModal(true);
      setHintsRemaining(hintsRemaining - 1);
    }
  };

  const handlePlayRecording = () => {
    setIsPlayingRecording(true);
    // Simulate playing recording for 3 seconds
    setTimeout(() => {
      setIsPlayingRecording(false);
    }, 3000);
  };

  // Get hint based on current practice index
  const getCurrentHint = () => {
    const hints = [
      "Try introducing yourself with your name and role.",
      "Mention what you do at your company.",
      "Talk about your current projects or responsibilities.",
      "Share a recent achievement or improvement you've made.",
      "Ask about the other person's role to show interest.",
      "Keep the conversation natural and friendly.",
    ];
    const hintIndex = Math.floor(currentPracticeIndex / 2);
    return hints[hintIndex] || "Stay confident and speak naturally!";
  };

  const handleBack = () => {
    window.history.back();
  };

  const totalUserMessages = conversationScript.filter(
    (m) => m.sender === "user"
  ).length;
  const completionPercentage = Math.round(
    (userRecordings.length / totalUserMessages) * 100
  );

  return (
    <div className="w-full -mt-4 -mx-4">
      <div className="fixed inset-0 flex flex-col bg-bg-card max-w-[393px] mx-auto left-0 right-0 z-50">
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
                  {isPracticeMode ? "Practice Mode" : "Controlled Practice"}
                </p>
              </div>
            </div>
            <Badge
              onClick={() => setShowComingSoonModal(true)}
              className="bg-navy/10 text-navy hover:bg-navy/20 border-0 rounded-full px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0 ml-2 cursor-pointer transition-all active:scale-95 hover:shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-semibold">AI</span>
            </Badge>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-4 bg-bg-card">
          <div className="space-y-3 pb-4">
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
                      alt={aiName}
                    />
                    <AvatarFallback className="bg-teal text-white text-sm font-semibold">
                      {aiName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-9 h-9 flex-shrink-0 bg-coral border-2 border-coral-hover">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=64&auto=format&fit=crop"
                      alt={userName}
                    />
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
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      msg.sender === "user" ? "text-coral" : "text-teal"
                    }`}
                  >
                    {msg.sender === "user" ? userName : aiName}
                  </p>
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
                      userRecordings.includes(msg.id) && (
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
          {!isPracticeMode ? (
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
                disabled={isPlaying}
                className="flex flex-col items-center gap-1.5 transition-colors w-20 h-auto transform -translate-y-3 bg-transparent p-0 hover:bg-transparent disabled:opacity-50"
              >
                <div className="h-16 w-16 bg-coral text-white rounded-full flex items-center justify-center shadow-lg shadow-coral/40 hover:bg-coral-hover hover:shadow-xl hover:shadow-coral/50 transition-all active:scale-95">
                  <Mic className="h-7 w-7" />
                </div>
                <span className="text-xs font-semibold text-text-secondary">
                  Practice
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
          ) : (
            <div className="flex items-center justify-between max-w-sm mx-auto">
              {/* Hint Button */}
              <Button
                variant="ghost"
                onClick={handleShowHint}
                disabled={hintsRemaining === 0}
                className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-gold transition-colors w-20 h-auto hover:bg-transparent p-0 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <div
                  className={`h-12 w-12 rounded-[14px] flex items-center justify-center shadow-sm transition-all active:scale-95 ${
                    hintsRemaining > 0
                      ? "bg-gold/10 text-gold hover:bg-gold/20 hover:shadow-md"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold">Hint</span>
                  <Badge className="bg-gold/20 text-gold border-0 px-1.5 py-0 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {hintsRemaining}
                  </Badge>
                </div>
              </Button>

              {/* Tap to Speak Button */}
              <Button
                onClick={handleRecordResponse}
                disabled={
                  isRecording ||
                  currentPracticeIndex >= conversationScript.length - 1
                }
                className={`flex items-center gap-3 px-8 py-6 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording ? "animate-pulse" : ""
                }`}
              >
                <Mic className="h-6 w-6" />
                <span>{isRecording ? "Recording..." : "Tap to Speak"}</span>
              </Button>

              {/* Empty space for balance */}
              <div className="w-20" />
            </div>
          )}
        </footer>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 max-w-[393px] mx-auto left-0 right-0">
          <Card className="w-full max-w-md bg-white rounded-[24px] shadow-2xl border-gray-200 animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gold/20 rounded-[16px] flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-navy font-display">
                      Great Job!
                    </h2>
                    <p className="text-sm text-text-secondary font-body">
                      You completed the role-play
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFeedbackModal(false)}
                  className="h-10 w-10 rounded-full hover:bg-gray-100 text-text-secondary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Performance Stats */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-text-primary font-body">
                    Completion
                  </span>
                  <span className="text-lg font-bold text-teal font-display">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-teal rounded-full transition-all duration-1000"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <Card className="bg-success/10 rounded-[16px] p-4 text-center border-success/20">
                  <div className="text-2xl font-bold text-success mb-1 font-display">
                    85%
                  </div>
                  <div className="text-xs text-text-secondary font-body">
                    Fluency
                  </div>
                </Card>
                <Card className="bg-navy/10 rounded-[16px] p-4 text-center border-navy/20">
                  <div className="text-2xl font-bold text-navy mb-1 font-display">
                    90%
                  </div>
                  <div className="text-xs text-text-secondary font-body">
                    Grammar
                  </div>
                </Card>
                <Card className="bg-coral/10 rounded-[16px] p-4 text-center border-coral/20">
                  <div className="text-2xl font-bold text-coral mb-1 font-display">
                    88%
                  </div>
                  <div className="text-xs text-text-secondary font-body">
                    Pronunciation
                  </div>
                </Card>
              </div>

              {/* Play Recording Button */}
              <Button
                onClick={handlePlayRecording}
                disabled={isPlayingRecording}
                variant="outline"
                className="w-full border-2 border-teal/30 bg-teal/5 text-teal hover:bg-teal/10 hover:border-teal/50 py-4 rounded-[16px] font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
              >
                {isPlayingRecording ? (
                  <>
                    <Pause className="w-5 h-5 animate-pulse" />
                    <span>Playing Your Recording...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Play Your Recording</span>
                  </>
                )}
              </Button>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleRetake}
                  className="w-full bg-coral hover:bg-coral-hover text-white py-4 rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake Practice
                </Button>

                <Button
                  onClick={handleSwapRoles}
                  variant="outline"
                  className="w-full border-2 border-navy text-navy hover:bg-navy/5 py-4 rounded-[16px] font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Repeat className="w-5 h-5" />
                  Swap Roles ({aiName} ↔ {userName})
                </Button>

                <Button
                  onClick={() => setShowFeedbackModal(false)}
                  variant="ghost"
                  className="w-full text-text-secondary hover:text-navy py-4 rounded-[16px] font-semibold transition-all"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 max-w-[393px] mx-auto left-0 right-0">
          <Card className="w-full max-w-md bg-white rounded-[24px] shadow-2xl border-gray-200 animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gold/20 rounded-[16px] flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-navy font-display">
                      Hint
                    </h2>
                    <p className="text-sm text-text-secondary font-body">
                      {hintsRemaining} {hintsRemaining === 1 ? "hint" : "hints"}{" "}
                      remaining
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHintModal(false)}
                  className="h-10 w-10 rounded-full hover:bg-gray-100 text-text-secondary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Hint Content */}
              <Card className="bg-gold/5 border-gold/20 rounded-[16px] p-5 mb-6">
                <p className="text-base text-text-primary leading-relaxed font-body">
                  💡 {getCurrentHint()}
                </p>
              </Card>

              {/* Hints Remaining Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index < hintsRemaining ? "bg-gold w-8" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setShowHintModal(false)}
                className="w-full bg-gold hover:bg-gold/90 text-navy py-4 rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Coming Soon Modal - AI Personalization */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 max-w-[393px] mx-auto left-0 right-0">
          <Card className="w-full max-w-md bg-white rounded-[24px] shadow-2xl border-gray-200 animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-navy to-teal rounded-[16px] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gold animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-navy font-display">
                      Coming Soon
                    </h2>
                    <p className="text-sm text-text-secondary font-body">
                      AI Personalization
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowComingSoonModal(false)}
                  className="h-10 w-10 rounded-full hover:bg-gray-100 text-text-secondary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Feature Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-navy mb-3 font-display">
                  Tailor Every Conversation to Your World
                </h3>
                <p className="text-base text-text-primary leading-relaxed mb-4 font-body">
                  Imagine practicing conversations that mirror your real-life
                  situations—whether it's preparing for a job interview,
                  navigating a client meeting, or simply chatting with a new
                  colleague.
                </p>
                {/* <p className="text-base text-text-primary leading-relaxed font-body">
                  With AI Personalization, you'll be able to customize every role-play scenario to match your unique context, goals, and challenges. Practice becomes personal, relevant, and incredibly effective.
                </p> */}
              </div>

              {/* Feature Highlights
              <Card className="bg-gradient-to-br from-navy/5 to-teal/5 border-navy/10 rounded-[16px] p-5 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gold text-sm font-bold">✓</span>
                    </div>
                    <p className="text-sm text-text-primary font-body">
                      <strong className="font-semibold">Custom Scenarios:</strong> Set the scene, characters, and objectives
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gold text-sm font-bold">✓</span>
                    </div>
                    <p className="text-sm text-text-primary font-body">
                      <strong className="font-semibold">Adaptive Difficulty:</strong> AI adjusts to your skill level
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gold text-sm font-bold">✓</span>
                    </div>
                    <p className="text-sm text-text-primary font-body">
                      <strong className="font-semibold">Real-World Context:</strong> Practice for your actual situations
                    </p>
                  </div>
                </div>
              </Card> */}

              {/* CTA */}
              <div className="text-center mb-4">
                <Badge className="bg-teal/10 text-teal border-teal/20 px-4 py-2 rounded-full text-sm font-semibold">
                  🚀 Launching Soon
                </Badge>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full bg-navy hover:bg-navy/90 text-white py-4 rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Got it, can't wait!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
