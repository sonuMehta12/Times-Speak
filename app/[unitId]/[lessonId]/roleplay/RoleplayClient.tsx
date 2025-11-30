"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, Languages, Lightbulb, Mic, MoreVertical, RotateCcw, Play, Keyboard, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLessonContext } from "@/lib/context/LessonContext";
import { Lesson, Unit, RolePlayLine } from "@/lib/types/language";
import VoiceRecorder from "@/components/common/VoiceRecorder";

interface IndividualRoleplayProps {
  type: "individual";
  unitId: string;
  lesson: Lesson;
  unit?: never;
}

interface FinalRoleplayProps {
  type: "final";
  unitId: string;
  unit: Unit;
  lesson?: never;
}

type Props = IndividualRoleplayProps | FinalRoleplayProps;

interface Message extends RolePlayLine {
  id: number;
  time: string;
  sender: "ai" | "user";
  feedback?: { grade: string };
  userSpoken?: string;
}

export default function RoleplayClient(props: Props) {
  const router = useRouter();
  const { completeRoleplay } = useLessonContext();

  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isConversationComplete, setIsConversationComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'keyboard'>('voice');
  const [typedMessage, setTypedMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const isSpeakingRef = useRef(false);

  if (props.type === "individual") {
    const { lesson, unitId } = props;
    const roleplayDialogue = lesson.roleplay || [];


    // Start conversation with first AI message(s) - only once using ref
    useEffect(() => {
      if (roleplayDialogue.length > 0 && !hasInitializedRef.current) {
        hasInitializedRef.current = true;
        console.log('Initializing roleplay conversation');
        setTimeout(() => {
          playAITurns(0);
        }, 300);
      }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [displayedMessages]);

    // Play all consecutive AI messages starting from index
    const playAITurns = (startIndex: number) => {
      console.log('playAITurns called with index:', startIndex);

      if (startIndex >= roleplayDialogue.length) {
        setIsConversationComplete(true);
        completeRoleplay(lesson.id, unitId);
        return;
      }

      const currentLine = roleplayDialogue[startIndex];

      // If it's user's turn, stop and wait for user input
      if (currentLine.speaker === "B") {
        setCurrentTurnIndex(startIndex);
        setShowHint(false);
        return;
      }

      // It's AI's turn - add message and speak
      setIsAISpeaking(true);
      isSpeakingRef.current = true;

      const aiMessage: Message = {
        ...currentLine,
        id: Date.now() + startIndex, // Use timestamp to ensure unique IDs
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "ai"
      };

      setDisplayedMessages(prev => {
        // Prevent duplicate messages
        const isDuplicate = prev.some(msg =>
          msg.text === aiMessage.text &&
          msg.sender === 'ai' &&
          msg.time === aiMessage.time
        );
        if (isDuplicate) {
          console.log('Preventing duplicate message:', aiMessage.text);
          return prev;
        }
        console.log('Adding AI message:', aiMessage.text);
        return [...prev, aiMessage];
      });

      // Speak the AI message
      const utterance = new SpeechSynthesisUtterance(currentLine.text);
      utterance.rate = 0.9;

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha'));
      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.onend = () => {
        console.log('TTS finished for:', currentLine.text);
        setIsAISpeaking(false);
        isSpeakingRef.current = false;

        // Check if next message is also AI
        if (startIndex + 1 < roleplayDialogue.length) {
          const nextLine = roleplayDialogue[startIndex + 1];
          if (nextLine.speaker === "A") {
            // Continue with next AI message
            setTimeout(() => playAITurns(startIndex + 1), 800);
          } else {
            // Next is user's turn
            setCurrentTurnIndex(startIndex + 1);
          }
        } else {
          // Conversation complete
          setIsConversationComplete(true);
          completeRoleplay(lesson.id, unitId);
        }
      };

      // Fallback timeout to ensure indicator doesn't get stuck
      setTimeout(() => {
        if (isSpeakingRef.current) {
          console.log('Fallback: Stopping AI speaking indicator');
          setIsAISpeaking(false);
          isSpeakingRef.current = false;
        }
      }, 10000);

      window.speechSynthesis.speak(utterance);
    };

    const speakMessage = (text: string, type: "ai" | "user") => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;

        const voices = window.speechSynthesis.getVoices();
        if (type === "ai") {
          const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha'));
          if (femaleVoice) utterance.voice = femaleVoice;
        } else {
          const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel'));
          if (maleVoice) utterance.voice = maleVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    };

    const calculateFeedback = (spoken: string, expected: string): string => {
      const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
      const expectedWords = expected.toLowerCase().trim().split(/\s+/);

      const maxLength = Math.max(spokenWords.length, expectedWords.length);
      let matches = 0;

      for (let i = 0; i < maxLength; i++) {
        if (spokenWords[i] === expectedWords[i]) {
          matches++;
        }
      }

      const accuracy = (matches / maxLength) * 100;

      if (accuracy >= 95) return 'A';
      if (accuracy >= 85) return 'B+';
      if (accuracy >= 75) return 'B';
      if (accuracy >= 65) return 'C+';
      if (accuracy >= 50) return 'C';
      return 'D';
    };

    const handleSpeechResult = (transcript: string) => {
      console.log('handleSpeechResult called with:', transcript);

      if (currentTurnIndex >= roleplayDialogue.length) return;

      const expectedLine = roleplayDialogue[currentTurnIndex];
      if (expectedLine.speaker !== "B") return; // Safety check

      const grade = calculateFeedback(transcript, expectedLine.text);

      const userMessage: Message = {
        ...expectedLine,
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "user",
        feedback: { grade },
        userSpoken: transcript
      };

      setDisplayedMessages(prev => [...prev, userMessage]);
      setShowHint(false);

      // Continue with next AI turn(s)
      setTimeout(() => {
        playAITurns(currentTurnIndex + 1);
      }, 1000);
    };

    const handleTypedMessage = () => {
      if (!typedMessage.trim()) return;

      console.log('handleTypedMessage called with:', typedMessage);

      if (currentTurnIndex >= roleplayDialogue.length) return;

      const expectedLine = roleplayDialogue[currentTurnIndex];
      if (expectedLine.speaker !== "B") return; // Safety check

      const grade = calculateFeedback(typedMessage, expectedLine.text);

      const userMessage: Message = {
        ...expectedLine,
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "user",
        feedback: { grade },
        userSpoken: typedMessage
      };

      setDisplayedMessages(prev => [...prev, userMessage]);
      setShowHint(false);
      setTypedMessage('');

      // Continue with next AI turn(s)
      setTimeout(() => {
        playAITurns(currentTurnIndex + 1);
      }, 1000);
    };


    const getHintMessage = () => {
      if (currentTurnIndex >= roleplayDialogue.length) return "";
      const expectedLine = roleplayDialogue[currentTurnIndex];
      if (expectedLine.speaker !== "B") return "";

      const words = expectedLine.text.split(' ');
      return words.map((word, i) => (i % 3 === 0 ? '___' : word)).join(' ');
    };

    const getCurrentExpectedText = () => {
      if (currentTurnIndex >= roleplayDialogue.length) return "";
      const expectedLine = roleplayDialogue[currentTurnIndex];
      return expectedLine.speaker === "B" ? expectedLine.text : "";
    };

    const getFeedbackColor = (grade: string) => {
      if (grade === 'A' || grade === 'B+') return 'bg-success text-white';
      if (grade === 'B' || grade === 'C+') return 'bg-gold text-navy';
      return 'bg-coral text-white';
    };

    const handleListenAll = () => {
      setIsListening(true);
      let index = 0;

      const speakNext = () => {
        if (index < displayedMessages.length) {
          const msg = displayedMessages[index];
          const textToSpeak = msg.sender === "user" && msg.userSpoken ? msg.userSpoken : msg.text;

          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = 0.9;

          const voices = window.speechSynthesis.getVoices();
          if (msg.sender === "ai") {
            const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha'));
            if (femaleVoice) utterance.voice = femaleVoice;
          } else {
            const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel'));
            if (maleVoice) utterance.voice = maleVoice;
          }

          utterance.onend = () => {
            index++;
            if (index < displayedMessages.length) {
              setTimeout(speakNext, 500);
            } else {
              setIsListening(false);
            }
          };

          window.speechSynthesis.speak(utterance);
        }
      };

      speakNext();
    };

    const handleRetake = () => {
      window.speechSynthesis.cancel();
      setDisplayedMessages([]);
      setCurrentTurnIndex(0);
      setIsConversationComplete(false);
      setIsListening(false);
      setShowHint(false);
      setIsAISpeaking(false);
      hasInitializedRef.current = false;

      // Restart conversation
      setTimeout(() => {
        hasInitializedRef.current = true;
        playAITurns(0);
      }, 100);
    };

    const handleContinue = () => {
      window.speechSynthesis.cancel();
      router.push(`/lesson-complete?type=roleplay&unitId=${unitId}&lessonId=${lesson.id}`);
    };

    const isUserTurn = currentTurnIndex < roleplayDialogue.length &&
                       roleplayDialogue[currentTurnIndex].speaker === "B";

    return (
      <div className="w-full -mt-4 -mx-4">
        <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
          {/* Header */}
          <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex-1 mx-4">
                <h1 className="text-base font-bold text-navy truncate font-display">
                  {lesson.title} - Roleplay
                </h1>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-bg-card min-h-0 pb-32">
            <div className="p-4 space-y-4">
              {displayedMessages.map((msg) => (
                <div key={msg.id} className="animate-fade-in">
                  {msg.sender === "ai" ? (
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-teal to-teal-400">
                        <AvatarFallback className="text-white font-bold">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
                          <CardContent className="p-4">
                            <p className="text-sm text-text-primary font-body mb-2">{msg.text}</p>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakMessage(msg.text, "ai")}
                                className="h-8 px-3 text-xs hover:bg-gray-100"
                              >
                                <Volume2 className="h-3 w-3 mr-1" />
                                Listen
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-xs hover:bg-gray-100"
                              >
                                <Languages className="h-3 w-3 mr-1" />
                                Translate
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        <p className="text-xs text-text-secondary mt-1 ml-3">{msg.time}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 mb-4 justify-end">
                      <div className="flex-1 flex justify-end">
                        <div className="max-w-[80%]">
                          <div className="flex items-start gap-2">
                            {msg.feedback && (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 ${getFeedbackColor(msg.feedback.grade)}`}>
                                {msg.feedback.grade}
                              </div>
                            )}
                            <Card className="bg-navy border-navy rounded-2xl shadow-sm">
                              <CardContent className="p-4">
                                <p className="text-sm text-white font-body mb-2">
                                  {msg.userSpoken || msg.text}
                                </p>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => speakMessage(msg.userSpoken || msg.text, "user")}
                                    className="h-8 px-3 text-xs hover:bg-white/10 text-white"
                                  >
                                    <Volume2 className="h-3 w-3 mr-1" />
                                    Listen
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-xs hover:bg-white/10 text-white"
                                  >
                                    <Languages className="h-3 w-3 mr-1" />
                                    Translate
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          <p className="text-xs text-text-secondary mt-1 mr-3 text-right">{msg.time}</p>
                        </div>
                      </div>
                      <Avatar className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-coral to-coral-hover">
                        <AvatarFallback className="text-white font-bold">U</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Bottom Action Area */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 space-y-3">
            {!isConversationComplete ? (
              <>
                {/* Hint Card */}
                {isUserTurn && showHint && (
                  <Card className="bg-gradient-to-br from-navy/5 to-teal/5 border-navy/10 rounded-2xl">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold text-text-secondary mb-2">Hint:</p>
                      <p className="text-base font-bold text-navy font-display">{getHintMessage()}</p>
                    </CardContent>
                  </Card>
                )}

                {/* AI Speaking Indicator */}
                {isAISpeaking && (
                  <Card className="bg-gradient-to-br from-teal/5 to-navy/5 border-teal/20 rounded-2xl">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold text-navy text-center flex items-center justify-center gap-2">
                        <span className="animate-pulse">🎤</span>
                        AI is speaking...
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Your Turn Indicator */}
                {isUserTurn && !isAISpeaking && !showHint && (
                  <Card className="bg-gradient-to-br from-coral/5 to-gold/5 border-coral/20 rounded-2xl">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold text-navy text-center">
                        Your turn! Click the hint button for help 💡
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Text Input for Keyboard Mode */}
                {inputMode === 'keyboard' && isUserTurn && !isAISpeaking && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={typedMessage}
                      onChange={(e) => setTypedMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && typedMessage.trim()) {
                          handleTypedMessage();
                        }
                      }}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-navy focus:outline-none text-sm font-body"
                    />
                    <Button
                      onClick={handleTypedMessage}
                      disabled={!typedMessage.trim()}
                      className="px-6 py-3 rounded-2xl bg-coral hover:bg-coral-hover text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {inputMode === 'voice' ? (
                    <div className="flex-1">
                      <VoiceRecorder
                        mode="manual"
                        onRecordingComplete={handleSpeechResult}
                        disabled={!isUserTurn || isAISpeaking}
                        variant="default"
                        buttonText={!isUserTurn ? "Wait for your turn..." : "Speak"}
                        showInterimResults={true}
                        maxDuration={60}
                        className="w-full py-4 rounded-2xl font-semibold shadow-lg"
                        onError={(error) => console.error('Voice recording error:', error)}
                      />
                    </div>
                  ) : (
                    <Button
                      disabled={!isUserTurn || isAISpeaking}
                      className="flex-1 py-4 rounded-2xl font-semibold shadow-lg bg-navy text-white disabled:bg-gray-300 disabled:cursor-not-allowed cursor-default"
                    >
                      <Keyboard className="h-5 w-5 mr-2" />
                      Keyboard Mode
                    </Button>
                  )}

                  {isUserTurn && !isAISpeaking && (
                    <>
                      <Button
                        onClick={() => setInputMode(inputMode === 'voice' ? 'keyboard' : 'voice')}
                        variant="outline"
                        className="px-6 py-4 rounded-2xl border-2 border-navy text-navy hover:bg-navy/5"
                      >
                        {inputMode === 'voice' ? (
                          <Keyboard className="h-5 w-5" />
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowHint(true)}
                        variant="outline"
                        disabled={showHint}
                        className="px-6 py-4 rounded-2xl border-2 border-navy text-navy hover:bg-navy/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lightbulb className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handleListenAll}
                  disabled={isListening}
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
                <Button
                  onClick={handleContinue}
                  className="flex-1 py-3 rounded-2xl bg-coral hover:bg-coral-hover text-white font-semibold shadow-lg"
                >
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

  // Final Roleplay
  const { unit, unitId } = props;

  return (
    <div className="w-full -mt-4 -mx-4">
      <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
        <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 mx-4">
              <h1 className="text-base font-bold text-navy truncate font-display">
                {unit.title} - Final Roleplay
              </h1>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-bg-card min-h-0 p-6">
          <h1 className="text-3xl font-bold mb-4 text-navy font-display">Final Roleplay</h1>
          <p className="text-text-secondary mb-6 font-body">
            Final roleplay practice for {unit.title}
          </p>

          <div className="bg-yellow-50 p-6 rounded-lg mb-6 border border-yellow-200">
            <p className="text-sm text-text-primary font-body">
              This is a placeholder for the final roleplay. Will be implemented in the next phase.
            </p>
          </div>

          <Button
            onClick={() => router.push('/')}
            className="w-full bg-coral hover:bg-coral-hover text-white py-4 rounded-[16px] font-semibold shadow-lg transition-all active:scale-95"
          >
            Back to Home
          </Button>
        </main>
      </div>
    </div>
  );
}
