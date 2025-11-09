"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MoreVertical,
  Mic,
  Play,
  CheckCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Volume2,
  RefreshCw,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Web Speech API type definitions
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onresult: (e: SpeechRecognitionEvent) => void;
  onerror: (e: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface WordComparison {
  word: string;
  isCorrect: boolean;
}

interface PronunciationFeedback {
  overallScore: number;
  wordScores: WordComparison[];
  generalFeedback: string;
}

// Helper function to format time in MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Transcript data with timestamps
const transcriptData = [
  {
    start: 0,
    end: 20,
    text: "Hi everyone! 👋 In today's lesson, we'll learn five natural phrases professionals use to talk about their work. By the end, you'll be able to introduce yourself confidently in meetings, interviews, or casual workplace conversations. Let's dive in!"
  },
  {
    start: 20,
    end: 45,
    text: "Phrase 1: \"I work at ___, where I handle ___.\" Listen and repeat: \"I work at Times Internet, where I handle client accounts.\""
  },
  {
    start: 45,
    end: 75,
    text: "Grammar Tip: Use \"work at\" for specific companies or locations. For example: \"I work at Google\" or \"I work at the downtown office.\" Use \"work in\" for industries, fields, or departments like \"I work in marketing\" or \"I work in finance.\""
  },
  {
    start: 75,
    end: 95,
    text: "The verb \"handle\" means to manage or take care of something. Other options include: deal with, manage, or oversee. Your turn - personalize it: \"I work at [your company], where I handle [your main responsibility].\""
  },
  {
    start: 95,
    end: 120,
    text: "Phrase 2: \"I'm currently focusing on ___.\" This phrase shows what you're working on right now — your main priority these days. Example: \"I'm currently focusing on improving client relationships.\""
  },
  {
    start: 120,
    end: 145,
    text: "Grammar Rule: After \"focusing on,\" always use the -ing form (gerund). For example: \"focusing on improving\" not \"focusing on improve.\" More examples: \"I'm currently focusing on developing new features\" or \"I'm currently focusing on expanding our market reach.\""
  },
  {
    start: 145,
    end: 175,
    text: "Phrase 3: \"I'm responsible for ___, which helps us ___.\" Use this phrase to describe your main duty AND its purpose. Example: \"I'm responsible for onboarding new clients, which helps us reduce setup time.\""
  },
  {
    start: 175,
    end: 200,
    text: "Structure Breakdown: State your responsibility: \"I'm responsible for [task]\" then connect it to a goal: \"which helps us [achieve result].\" This phrase works brilliantly in interviews because it shows you understand both the task and its business impact."
  },
  {
    start: 200,
    end: 225,
    text: "Phrase 4: \"My role involves ___, which allows me to ___.\" Use \"involves\" when describing multiple activities or ongoing responsibilities. Example: \"My role involves coordinating marketing and sales teams, which allows me to understand both perspectives.\""
  },
  {
    start: 225,
    end: 250,
    text: "Grammar Pattern: \"Involves\" is ALWAYS followed by verb + -ing. For example: \"involves coordinating,\" \"involves managing,\" \"involves analyzing.\" Remember, the stress is on the second syllable: in-VOL-ves."
  },
  {
    start: 250,
    end: 280,
    text: "Phrase 5: \"Recently, I ___, which resulted in ___.\" This is your achievement phrase — use it to share concrete results. Example: \"Recently, I streamlined our reporting process, which resulted in 30% faster turnaround times.\""
  },
  {
    start: 280,
    end: 310,
    text: "Structure: Start with \"Recently\" or \"Last month/quarter,\" use past tense for your action like helped, created, improved, or launched, then show the result: \"which resulted in [measurable outcome].\" Interview Tip: Always try to include numbers or specific outcomes like \"30% faster\" or \"reduced by two days.\""
  }
];

export default function LessonPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [rolePlayCompleted, setRolePlayCompleted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'feedback'>('idle');
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [transcript, setTranscript] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const analyzePronunciation = (spoken: string, target: string) => {
    const spokenWords = spoken.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
    const targetWords = target.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);

    let correctWords = 0;
    const wordScores: WordComparison[] = targetWords.map((targetWord, index) => {
      const spokenWord = spokenWords[index] || '';
      const isCorrect = targetWord.trim() === spokenWord.trim();
      if (isCorrect) correctWords++;
      
      return {
        word: targetWord,
        isCorrect: isCorrect,
      };
    });

    const overallScore = targetWords.length > 0 ? Math.round((correctWords / targetWords.length) * 100) : 0;

    let generalFeedback = '';
    if (overallScore === 100) generalFeedback = "Perfect pronunciation! 🎉";
    else if (overallScore >= 80) generalFeedback = "Excellent! Very close to the target.";
    else if (overallScore >= 50) generalFeedback = "Good effort! A few words to work on.";
    else generalFeedback = "Keep practicing! You can do it.";
    
    setFeedback({
      overallScore,
      wordScores,
      generalFeedback
    });
    setRecordingState('feedback');
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsRecording(true);
        setRecordingState('recording');
      };
      
      recognitionInstance.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        const currentPhrase = unitLessons[currentPhraseIndex];
        analyzePronunciation(spokenText, currentPhrase.phrase.replace(/_+/g, '').trim());
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setRecordingState('idle');
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
        if (recordingState === 'recording') {
          setRecordingState('processing');
        }
      };

      recognitionRef.current = recognitionInstance;
    }
  }, [currentPhraseIndex]);

  const handleStartRecording = async () => {
    setFeedback(null);
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      recognitionRef.current?.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied. Please enable it in your browser settings.");
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && recordingState === 'recording') {
      setRecordingState('processing');
      recognitionRef.current.stop();
    }
  };

  const playPhrase = () => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }
    const currentPhrase = unitLessons[currentPhraseIndex];
    const utterance = new SpeechSynthesisUtterance(currentPhrase.phrase.replace(/_+/g, '').trim());
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleTryAgain = () => {
    setFeedback(null);
    setTranscript('');
    setRecordingState('idle');
  };

  const handleNextPhrase = () => {
    setFeedback(null);
    setTranscript('');
    setRecordingState('idle');
    setCurrentPhraseIndex((prev) => (prev + 1) % unitLessons.length);
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTranscriptClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const unitLessons = [
    {
      id: 1,
      number: "Phrase 1",
      title: "Work Location & Responsibility",
      phrase: "I work at Microsoft, where I handle customer support.",
      duration: "4 min",
      emoji: "💼",
      status: "current",
    },
    {
      id: 2,
      number: "Phrase 2",
      title: "Current Focus",
      phrase: "I'm currently focusing on improving our customer service response times.",
      duration: "3 min",
      emoji: "🎯",
      status: "locked",
    },
    {
      id: 3,
      number: "Phrase 3",
      title: "Responsibility & Impact",
      phrase: "I'm responsible for onboarding new clients, which helps us reduce setup time.",
      duration: "4 min",
      emoji: "✅",
      status: "locked",
    },
    {
      id: 4,
      number: "Phrase 4",
      title: "Role Description",
      phrase: "My role involves coordinating marketing and sales teams, which allows me to understand both perspectives.",
      duration: "4 min",
      emoji: "🔄",
      status: "locked",
    },
    {
      id: 5,
      number: "Phrase 5",
      title: "Recent Achievement",
      phrase: "Recently, I streamlined our reporting process, which resulted in thirty percent faster turnaround times.",
      duration: "5 min",
      emoji: "🏆",
      status: "locked",
    },
  ];

  const moreLessons = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop",
      phrase: "Let's grab a coffee sometime",
      title: "Casual Invitations",
      tutor: { name: "Emma Wilson", avatar: "https://i.pravatar.cc/150?img=5" },
      learners: 156,
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop",
      phrase: "Could you help me with this?",
      title: "Polite Requests",
      tutor: { name: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=3" },
      learners: 203,
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=225&fit=crop",
      phrase: "I appreciate your time",
      title: "Expressing Gratitude",
      tutor: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      learners: 289,
    },
  ];

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
                onClick={() => window.history.back()}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-primary leading-tight truncate font-display text-base">
                  Meeting a new Colleague
                </p>
                <p className="text-xs text-text-secondary">
                  Unit 1 • Phrase 1 of 5
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy flex-shrink-0"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Section */}
          <div className="relative w-full h-[40vh] bg-gradient-to-br from-navy via-navy-hover to-navy group">
            {/* Video Player */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controlsList="nodownload"
              preload="metadata"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoPause}
              onTimeUpdate={handleTimeUpdate}
            >
              <source src="/videos/5_Phrases_to_Describe_Work.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Play Button Overlay */}
            {!isVideoPlaying && (
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/50"
                onClick={handlePlayVideo}
              >
                <div className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-white/20">
                  <Play className="h-9 w-9 text-navy ml-1" fill="currentColor" />
                </div>
              </div>
            )}

            {/* Video Controls Bar (appears on hover when playing) */}
            {isVideoPlaying && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isVideoPlaying ? (
                      <div className="w-3 h-3 flex gap-1">
                        <div className="w-1 h-3 bg-white rounded-sm" />
                        <div className="w-1 h-3 bg-white rounded-sm" />
                      </div>
                    ) : (
                      <Play className="h-4 w-4 text-white ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  
                  <div className="flex-1 flex items-center gap-2 text-white text-xs">
                    <span className="font-medium">5 Phrases to Describe Work</span>
                  </div>

                  <button
                    onClick={() => videoRef.current?.requestFullscreen()}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Lesson Badge */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-coral rounded-full animate-pulse" />
              <span className="text-white text-xs font-semibold">Phrase 1 of 5</span>
            </div>
          </div>

          {/* Lesson Description */}
          <div className="p-4 bg-white border-b border-gray-100">
            <p className="text-sm text-text-secondary leading-relaxed">
              {showFullDescription
                ? "Learn five natural phrases professionals use to talk about your work. By the end, you'll be able to introduce yourself confidently in meetings, interviews, or casual workplace conversations."
                : "Learn five natural phrases professionals use to talk about your work..."}
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-navy font-semibold ml-1 hover:underline"
              >
                {showFullDescription ? "Read less" : "Read more"}
              </button>
            </p>
          </div>

          {/* Transcript Section */}
          <div className="bg-white border-b border-gray-100">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-navy">Transcript</h3>
                  <p className="text-xs text-text-secondary">Follow along with the video</p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 text-text-tertiary transition-transform ${
                showTranscript ? 'rotate-90' : ''
              }`} />
            </button>

            {showTranscript && (
              <div className="px-4 pb-4 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {transcriptData.map((item, index) => {
                    const isActive = currentTime >= item.start && currentTime < item.end;
                    return (
                      <div
                        key={index}
                        onClick={() => handleTranscriptClick(item.start)}
                        className={`p-3 rounded-[12px] cursor-pointer transition-all ${
                          isActive
                            ? 'bg-navy/10 border-2 border-navy shadow-sm'
                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-12 h-8 rounded-[8px] flex items-center justify-center text-xs font-semibold ${
                            isActive ? 'bg-navy text-white' : 'bg-white text-text-secondary'
                          }`}>
                            {formatTime(item.start)}
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            isActive ? 'text-navy font-medium' : 'text-text-primary'
                          }`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tabs Section */}
          <div className="px-4 pt-4 bg-white">
            {/* Simple Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-5">
              <button
                onClick={() => setActiveTab("practice")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  activeTab === "practice"
                    ? "text-navy border-b-2 border-navy"
                    : "text-text-secondary"
                }`}
              >
                Practice
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  activeTab === "quiz"
                    ? "text-navy border-b-2 border-navy"
                    : "text-text-secondary"
                }`}
              >
                Quiz
              </button>
              <button
                onClick={() => setActiveTab("roleplay")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  activeTab === "roleplay"
                    ? "text-navy border-b-2 border-navy"
                    : "text-text-secondary"
                }`}
              >
                Role Play
              </button>
            </div>

            {/* Practice Tab */}
            {activeTab === "practice" && (
              <Card className="border-gray-200 shadow-sm rounded-[20px]">
                <CardContent className="p-6">
                  {recordingState === 'feedback' && feedback ? (
                    // Feedback UI
                    <div className="animate-fade-in-up">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl font-bold text-teal">{feedback.overallScore}</div>
                        <div>
                          <p className="font-semibold text-text-primary">Overall Score</p>
                          <p className="text-text-secondary text-sm">{feedback.generalFeedback}</p>
                        </div>
                      </div>

                      {transcript && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-[12px]">
                          <h4 className="font-semibold text-text-primary mb-2 text-sm">You said:</h4>
                          <p className="text-base text-text-secondary italic">"{transcript}"</p>
                        </div>
                      )}
                      
                      <div className="mb-6 p-4 bg-gray-50 rounded-[12px]">
                        <h4 className="font-semibold text-text-primary mb-3 text-sm">Word Analysis</h4>
                        <div className="flex flex-wrap gap-2 text-base font-medium">
                          {feedback.wordScores.map((ws, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1.5 rounded-[8px] ${
                                ws.isCorrect
                                  ? 'text-teal bg-teal/10'
                                  : 'text-coral bg-coral/10'
                              }`}
                            >
                              {ws.word}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={handleTryAgain}
                          variant="outline"
                          className="flex-1 h-11 rounded-[12px] font-semibold border-2 border-navy text-navy hover:bg-navy/5"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                        </Button>
                        {currentPhraseIndex < unitLessons.length - 1 && (
                          <Button
                            onClick={handleNextPhrase}
                            className="flex-1 bg-navy hover:bg-navy-hover text-white h-11 rounded-[12px] font-semibold"
                          >
                            Next Phrase <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Recording UI
                    <div className="min-h-[280px] flex flex-col items-center justify-center text-center">
                      <div className="mb-4">
                        <Badge className="bg-navy/10 text-navy border-0 mb-3">
                          Phrase {currentPhraseIndex + 1} of {unitLessons.length}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold text-text-primary mb-5 leading-relaxed px-4">
                        "{unitLessons[currentPhraseIndex].phrase}"
                      </p>
                      
                      <button
                        onClick={playPhrase}
                        className="mb-6 bg-teal/10 text-teal py-2 px-4 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-teal/20 transition-colors"
                      >
                        <Volume2 className="h-4 w-4" /> Listen to phrase
                      </button>

                      {recordingState === 'recording' ? (
                        <Button
                          size="icon"
                          onClick={handleStopRecording}
                          className="h-16 w-16 rounded-full mb-4 bg-coral hover:bg-coral-hover animate-pulse shadow-lg shadow-coral/30"
                        >
                          <Square className="h-7 w-7 text-white" />
                        </Button>
                      ) : recordingState === 'processing' ? (
                        <div className="h-16 w-16 rounded-full mb-4 bg-navy/20 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                        </div>
                      ) : (
                        <Button
                          size="icon"
                          onClick={handleStartRecording}
                          className="h-16 w-16 rounded-full mb-4 bg-navy hover:bg-navy-hover shadow-md shadow-navy/20 transition-transform hover:scale-105"
                        >
                          <Mic className="h-7 w-7 text-white" />
                        </Button>
                      )}
                      
                      <p className="text-sm text-text-secondary">
                        {recordingState === 'recording' 
                          ? 'Listening... Speak now!' 
                          : recordingState === 'processing'
                          ? 'Processing...'
                          : 'Tap the microphone and speak the phrase'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quiz Tab */}
            {activeTab === "quiz" && (
              <Card className="border-gray-200 shadow-sm rounded-[20px]">
                <CardContent className="p-6 min-h-[280px] flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-xl font-bold text-text-primary font-display mb-2">
                    Quick Quiz
                  </h3>
                  <p className="text-sm text-text-secondary mb-5 leading-relaxed max-w-xs">
                    Test your understanding of this lesson with 5 questions
                  </p>
                  <Button
                    className="bg-navy hover:bg-navy-hover text-white px-8 h-11 rounded-[16px] font-semibold shadow-md"
                    onClick={() => router.push("/quiz")}
                  >
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Role Play Tab */}
            {activeTab === "roleplay" && (
              <Card className="border-gray-200 shadow-sm rounded-[20px]">
                <CardContent className="p-6 min-h-[280px] flex flex-col items-center justify-center text-center">
                  {rolePlayCompleted ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
                        <CheckCircle className="h-12 w-12 text-success" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary font-display mb-2">
                        Role Play Completed!
                      </h3>
                      <p className="text-sm text-text-secondary mb-5">
                        Great job! You've successfully completed this role play. 🎉
                      </p>
                      <Button
                        className="bg-navy hover:bg-navy-hover text-white px-8 h-11 rounded-[16px] font-semibold"
                        onClick={() => setRolePlayCompleted(false)}
                      >
                        Practice Again
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-navy/10 flex items-center justify-center mb-4 text-4xl">
                        👤
                      </div>
                      <h3 className="text-lg font-bold text-text-primary font-display mb-2">
                        Meeting at a new Colleague
                      </h3>
                      <p className="text-sm text-text-secondary mb-5">
                        Practice meeting a new Colleague
                      </p>
                      <div className="flex gap-2 w-full">
                        <Button
                          className="flex-1 bg-navy hover:bg-navy-hover text-white h-11 rounded-[16px] font-semibold text-sm"
                          onClick={() => router.push("/role")}
                        >
                          🎭 Start
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-gray-100 hover:bg-gray-200 border-0 h-11 rounded-[16px] font-semibold text-sm"
                          onClick={() => setRolePlayCompleted(true)}
                        >
                          ✓ Complete
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Unit Lessons Section */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-text-primary font-display">
                5 Professional Phrases
              </h3>
            </div>
            <div className="space-y-2">
              {unitLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`border-gray-200 rounded-[16px] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer bg-white ${
                    lesson.status === "current"
                      ? "ring-2 ring-navy shadow-md"
                      : ""
                  }`}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div
                      className={`w-16 h-12 rounded-[12px] flex items-center justify-center text-2xl flex-shrink-0 ${
                        lesson.status === "current"
                          ? "bg-gradient-to-br from-navy/20 to-teal/20"
                          : "bg-gradient-to-br from-navy/10 to-teal/10"
                      }`}
                    >
                      {lesson.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary font-medium mb-0.5">
                        {lesson.number}
                      </p>
                      <p
                        className={`text-sm font-semibold mb-1 ${
                          lesson.status === "current"
                            ? "text-navy"
                            : "text-text-primary"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-text-secondary italic mb-1 line-clamp-1">
                        &quot;{lesson.phrase}&quot;
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {lesson.duration}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        lesson.status === "completed"
                          ? "bg-success"
                          : lesson.status === "current"
                          ? "bg-navy"
                          : "bg-gray-200"
                      }`}
                    >
                      {lesson.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : lesson.status === "current" ? (
                        <Play className="h-3 w-3 text-white ml-0.5" />
                      ) : (
                        <Lock className="h-3 w-3 text-text-tertiary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Creator Section */}
          <div className="p-4 bg-white border-t border-gray-100">
            <Card className="border-gray-200 rounded-[16px] shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-gray-100">
                  <AvatarFallback className="bg-gradient-to-br from-navy to-teal text-white font-bold text-lg">
                    S
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-secondary mb-0.5">
                    Created by
                  </p>
                  <p className="text-base font-bold text-text-primary font-display mb-0.5">
                    Stacy
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    Expert English Coach • 15K followers
                  </p>
                </div>
                <Button className="bg-navy hover:bg-navy-hover text-white px-4 h-9 rounded-full font-semibold text-sm">
                  Follow
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* More Lessons Carousel */}
          <div className="p-4 pb-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-text-primary font-display">
                More Lessons
              </h3>
            </div>
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {moreLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="flex-shrink-0 w-[260px] border-gray-200 rounded-[16px] hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer snap-start bg-white"
                >
                  <CardContent className="p-3">
                    <div className="relative aspect-video rounded-[12px] overflow-hidden group mb-2 border border-gray-200">
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm text-navy mb-1 font-display">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-text-secondary italic mb-2">
                      "{lesson.phrase}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-gray-100">
                          <AvatarImage
                            src={lesson.tutor.avatar}
                            alt={lesson.tutor.name}
                          />
                          <AvatarFallback className="text-xs">
                            {lesson.tutor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-text-primary">
                          {lesson.tutor.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-gray-200 rounded-[8px] text-xs"
                      >
                        {lesson.learners}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
