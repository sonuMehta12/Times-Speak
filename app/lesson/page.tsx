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
  SkipForward,
  Pause,
  Check,
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
  const [activeTab, setActiveTab] = useState("quiz");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [rolePlayCompleted, setRolePlayCompleted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
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
          <div className="flex items-center justify-between p-4 pb-2">
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
                  Unit 1 • Lesson {currentLesson} of 5
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
          
          {/* Progress Bar with Lesson Checkpoints */}
          <div className="px-4 pb-3">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-navy to-teal rounded-full transition-all duration-500"
                  style={{ width: `${((currentLesson - 1) / 4) * 100}%` }}
                />
              </div>
              
              {/* Lesson Checkpoints */}
              <div className="relative flex justify-between">
                {[1, 2, 3, 4, 5].map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson);
                  const isCurrent = lesson === currentLesson;
                  const isLocked = lesson > currentLesson;
                  
                  return (
                    <div key={lesson} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-teal to-teal-600 text-white shadow-md'
                            : isCurrent
                            ? 'bg-gradient-to-br from-navy to-navy-hover text-white shadow-lg ring-4 ring-navy/20'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : `L${lesson}`}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium ${
                        isCurrent ? 'text-navy' : isCompleted ? 'text-teal' : 'text-gray-400'
                      }`}>
                        {isCurrent ? 'Current' : isCompleted ? 'Done' : isLocked ? 'Locked' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Section - 16:9 Aspect Ratio */}
          <div className="relative w-full bg-black">
            <div className="relative w-full group" style={{ paddingBottom: '56.25%' }}>
              {/* Video Player */}
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-contain"
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

              {/* Play/Pause Button Overlay - Center (Always Visible on Hover) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play();
                      } else {
                        videoRef.current.pause();
                      }
                    }
                  }}
                  className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-white/20 z-10"
                >
                  {isVideoPlaying ? (
                    <Pause className="h-9 w-9 text-navy" />
                  ) : (
                    <Play className="h-9 w-9 text-navy ml-1" fill="currentColor" />
                  )}
                </button>
              </div>
              
              {/* Initial Play Button (Only when video hasn't started) */}
              {!isVideoPlaying && currentTime === 0 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center">
                    <Play className="h-9 w-9 text-navy ml-1" fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Previous Button - Left Side */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                  }
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all z-10 opacity-0 hover:opacity-100 group-hover:opacity-100"
                aria-label="Previous 10 seconds"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              {/* Next Button - Right Side */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all z-10 opacity-0 hover:opacity-100 group-hover:opacity-100"
                aria-label="Next 10 seconds"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              {/* Lesson Badge - Top Left */}
              {/* <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 z-10">
                <div className="w-2 h-2 bg-coral rounded-full animate-pulse" />
                <span className="text-white text-xs font-semibold">Lesson {currentLesson} of 5</span>
              </div> */}
            </div>
          </div>

          {/* Video Progress Bar */}
          <div className="bg-white border-b border-gray-100 px-4 py-2">
            <div className="flex items-center gap-2 w-full">
              {/* Current Time */}
              <span className="text-xs text-text-secondary w-10 text-right">
                {formatTime(currentTime)}
              </span>
              
              {/* Progress Bar */}
              <div 
                className="flex-1 h-1.5 bg-gray-200 rounded-full cursor-pointer relative group"
                onClick={(e) => {
                  if (!videoRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = pos * (videoRef.current.duration || 0);
                }}
              >
                <div 
                  className="absolute left-0 top-0 h-full bg-navy/80 rounded-full group-hover:bg-navy transition-all duration-200"
                  style={{
                    width: videoRef.current && videoRef.current.duration 
                      ? `${(currentTime / videoRef.current.duration) * 100}%` 
                      : '0%'
                  }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity" />
                </div>
              </div>
              
              {/* Duration */}
              <span className="text-xs text-text-secondary w-10">
                {videoRef.current ? formatTime(videoRef.current.duration || 0) : '0:00'}
              </span>
              
              {/* Skip & Next Button */}
              <button
                onClick={() => {
                  router.push('/quiz');
                }}
                className="ml-2 bg-gray-100 hover:bg-gray-200 text-text-secondary px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 transition-all text-xs font-medium"
              >
                <span>Skip & Next</span>
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Transcript Section - Single Active CC Style */}
          <div className="bg-white border-b border-gray-100 px-4 py-3">
            <div className="bg-gray-50 rounded-xl p-4 min-h-[80px] flex items-center justify-center">
              {(() => {
                const activeTranscript = transcriptData.find(
                  item => currentTime >= item.start && currentTime < item.end
                );
                
                return activeTranscript ? (
                  <div className="text-center w-full">
                    <p className="text-lg text-navy font-medium leading-relaxed">
                      {activeTranscript.text}
                    </p>
                    <div className="mt-2 text-xs text-text-secondary">
                      {formatTime(activeTranscript.start)} - {formatTime(activeTranscript.end)}
                    </div>
                  </div>
                ) : (
                  <p className="text-text-secondary text-center w-full">
                    No active transcript for current time
                  </p>
                );
              })()}
            </div>
          </div>

          {/* Practice Zone Section */}
          <div className="px-4 pt-4 bg-white">
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-5">
               <button
                onClick={() => setActiveTab("practice")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  activeTab === "practice"
                    ? "text-navy border-b-2 border-navy"
                    : "text-text-secondary"
                }`}
              >
                🔊 Practice
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  activeTab === "quiz"
                    ? "text-navy border-b-2 border-navy"
                    : "text-text-secondary"
                }`}
              >
                📝 Quiz
              </button>
              <button
                onClick={() => setActiveTab("roleplay")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  activeTab === "roleplay"
                    ? "text-navy border-b-2 border-navy"
                    : "text-text-secondary"
                }`}
              >
                🎭 Role Play
              </button>
             
            </div>

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

            {/* Practice Tab */}
            {activeTab === "practice" && (
              <Card className="border-gray-200 shadow-sm rounded-[20px]">
                <CardContent className="p-6 min-h-[280px] flex flex-col items-center justify-between">
                  
                  <div className="w-full bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-text-secondary">Phrase to practice</span>
                      <button 
                        onClick={playPhrase}
                        className="p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
                        aria-label="Play phrase"
                      >
                        <Volume2 className="h-4 w-4 text-navy" />
                      </button>
                    </div>
                    <p className="text-text-primary font-medium">
                      {unitLessons[currentPhraseIndex]?.phrase.replace(/_+/g, ' ').trim()}
                    </p>
                  </div>

                  {feedback ? (
                    <div className="w-full bg-white rounded-xl p-4 border border-gray-100 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-text-secondary">Your pronunciation</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${
                            feedback.overallScore >= 80 ? 'text-green-600' : 
                            feedback.overallScore >= 50 ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {feedback.overallScore}%
                          </span>
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                feedback.overallScore >= 80 ? 'bg-green-500' : 
                                feedback.overallScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${feedback.overallScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {feedback.wordScores.map((wordScore, i) => (
                          <span 
                            key={i} 
                            className={`px-2 py-1 text-sm rounded-md ${
                              wordScore.isCorrect 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800 line-through'
                            }`}>
                            {wordScore.word}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-xs text-text-secondary">
                        {feedback.generalFeedback}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                      <p className="text-sm text-center text-text-secondary mb-3">
                        {transcript || "Your recording will appear here..."}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 w-full">
                    {recordingState === 'recording' ? (
                      <Button 
                        onClick={handleStopRecording}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        <Square className="h-4 w-4" />
                        Stop Recording
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleStartRecording}
                        disabled={recordingState === 'processing'}
                        className={`flex-1 ${
                          recordingState === 'processing' 
                            ? 'bg-navy/70' 
                            : 'bg-navy hover:bg-navy-hover'
                        } text-white h-12 rounded-xl font-semibold flex items-center justify-center gap-2`}
                      >
                        {recordingState === 'processing' ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4" />
                            {feedback ? 'Try Again' : 'Start Speaking'}
                          </>
                        )}
                      </Button>
                    )}
                    
                    {feedback && (
                      <Button 
                        onClick={handleNextPhrase}
                        variant="outline"
                        className="h-12 rounded-xl font-medium border-gray-300 hover:bg-gray-50"
                      >
                        Next Phrase
                      </Button>
                    )}
                  </div>
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
