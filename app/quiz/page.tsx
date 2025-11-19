"use client";

import React, { useState, useRef, useEffect } from "react";
import {PageHeader} from "@/components/PageHeader";
import {
  Play,
  Volume2,
  ChevronRight,
  Check,
  X,
  Mic,
  RotateCcw,
  Award,
  Sparkles,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  Square,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  transcript: string;
}

type BaseQuestion = {
  id: number;
  question: string;
  correctFeedback?: string;
  incorrectFeedback?: string;
};

type ListeningQuestion = BaseQuestion & {
  type: "listening";
  audio: string;
  options: string[];
  correct: number;
};

type GrammarQuestion = BaseQuestion & {
  type: "grammar";
  prompt: string;
  options: string[];
  correct: number;
};

type ArrangeQuestion = BaseQuestion & {
  type: "arrange";
  words: string[];
  correct: string;
};

type PatternQuestion = BaseQuestion & {
  type: "pattern";
  context: string[];
  prompt: string;
  options: string[];
  correct: number;
};

type AudioStressQuestion = BaseQuestion & {
  type: "audio-stress";
  sentence: string;
  options: { label: string; stress: string }[];
  correct: number;
};

type ComprehensionQuestion = BaseQuestion & {
  type: "comprehension";
  sentence: string;
  options: string[];
  correct: number;
};

type SpeakingQuestion = BaseQuestion & {
  type: "speaking";
  prompt: string;
  options: string[];
};

type QuizQuestion =
  | ListeningQuestion
  | GrammarQuestion
  | ArrangeQuestion
  | PatternQuestion
  | AudioStressQuestion
  | ComprehensionQuestion
  | SpeakingQuestion;

export default function QuizPage() {
  const [quizState, setQuizState] = useState("prep"); // prep, quiz, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { answer: number | string; correct: boolean }>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dragWords, setDragWords] = useState<string[]>([]);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState<number | null>(null);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'feedback'>('idle');
  const [speakingFeedback, setSpeakingFeedback] = useState<PronunciationFeedback | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      type: "listening",
      question: "What did you hear?",
      audio: "I'm currently focusing on improving our customer service response times.",
      options: [
        "I'm currently focused on improving...",
        "I'm currently focusing on improving...",
        "I'm currently focusing to improve...",
      ],
      correct: 1,
      correctFeedback: 'Perfect! "Focusing on" is always followed by the -ing form (gerund).',
      incorrectFeedback: 'Not quite. Listen again for the phrase "focusing on" + [verb + -ing]. This is the correct pattern in English.',
    },
    {
      id: 2,
      type: "grammar",
      question: "Complete the sentence with the correct preposition:",
      prompt: "I work ___ Microsoft, where I handle technical support.",
      options: ["in", "at", "on"],
      correct: 1,
      correctFeedback: 'Excellent! We use "at" for specific companies and locations.',
      incorrectFeedback: 'Remember: "work at" for companies and places, "work in" for fields and departments.',
    },
    {
      id: 3,
      type: "arrange",
      question: "Arrange these words to form a correct sentence:",
      words: ["for", "I'm", "responsible", "onboarding", "new", "clients"],
      correct: "I'm responsible for onboarding new clients.",
      correctFeedback: 'Great sentence structure! Notice how "responsible for" is followed by a gerund (onboarding).',
      incorrectFeedback: "The pattern is: Subject + am/is/are + responsible for + [verb-ing] + [object]",
    },
    {
      id: 4,
      type: "pattern",
      question: "Look at these two sentences:",
      context: [
        '"My role involves coordinating teams."',
        '"I\'m responsible for managing projects."',
      ],
      prompt: 'What do you notice about the verbs after "involves" and "responsible for"?',
      options: [
        "They are in base form (coordinate, manage)",
        "They end in -ing (gerunds)",
        "They are in past tense",
        'They use "to" (to coordinate, to manage)',
      ],
      correct: 1,
      correctFeedback: 'Exactly! Both "involves" and "responsible for" must be followed by gerunds (-ing forms).',
      incorrectFeedback: 'Look again at the verb endings. After "involves" and "responsible for," we always use the -ing form.',
    },
    {
      id: 5,
      type: "audio-stress",
      question: "Which recording has the correct stress pattern?",
      sentence: '"I\'m responsible for onboarding new clients."',
      options: [
        { label: "Audio A", stress: "Even stress on all words (robotic)" },
        { label: "Audio B", stress: "Natural stress pattern" },
      ],
      correct: 1,
      correctFeedback: "Yes! In natural English, we stress the important content words (responsible, onboarding, new, clients).",
      incorrectFeedback: "Natural English has rhythm — some words are stronger (stressed) and others are weaker (unstressed).",
    },
    {
      id: 6,
      type: "comprehension",
      question: "What does this sentence tell you?",
      sentence: '"My role involves coordinating different teams to deliver projects on time."',
      options: [
        "I work alone most of the time",
        "I work with multiple groups of people",
        "I only deliver projects, I don't coordinate",
        "I'm not responsible for deadlines",
      ],
      correct: 1,
      correctFeedback: 'Correct! "Coordinating teams" means working with and organizing multiple groups.',
      incorrectFeedback: '"Coordinating teams" means bringing different groups together and organizing their work.',
    },
    {
      id: 7,
      type: "speaking",
      question: "Now it's your turn to speak!",
      prompt: "Choose ONE phrase and practice speaking it clearly:",
      options: [
        "I work at Microsoft, where I handle customer support.",
        "I'm currently focusing on improving our customer service response times.",
        "I'm responsible for onboarding new clients, which helps us reduce setup time.",
      ],
    },
  ];

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];
  const totalCorrect = Object.values(userAnswers).filter((a) => a.correct).length;

  // Type guards
  const hasCorrectNumber = (q: QuizQuestion): q is Exclude<QuizQuestion, ArrangeQuestion | SpeakingQuestion> => {
    return 'correct' in q && typeof q.correct === 'number';
  };

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    const isCorrect = hasCorrectNumber(question) ? answer === question.correct : false;
    setUserAnswers({
      ...userAnswers,
      [question.id]: { answer, correct: isCorrect },
    });
  };

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
    
    setSpeakingFeedback({
      overallScore,
      wordScores,
      generalFeedback,
      transcript: spoken
    });
    setRecordingState('feedback');
    setShowFeedback(true);
    setUserAnswers({
      ...userAnswers,
      [question.id]: { answer: "recorded", correct: overallScore >= 70 },
    });
  };

  useEffect(() => {
    if (question.type === 'speaking' && selectedPhraseIndex !== null) {
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
          const targetPhrase = question.options[selectedPhraseIndex].replace(/_+/g, '').trim();
          analyzePronunciation(spokenText, targetPhrase);
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
    }
  }, [selectedPhraseIndex, question]);

  const handleStartSpeakingRecording = async () => {
    if (selectedPhraseIndex === null) {
      alert("Please select a phrase first!");
      return;
    }
    setSpeakingFeedback(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      recognitionRef.current?.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied. Please enable it in your browser settings.");
    }
  };

  const handleStopSpeakingRecording = () => {
    if (recognitionRef.current && recordingState === 'recording') {
      setRecordingState('processing');
      recognitionRef.current.stop();
    }
  };

  const playSpeakingPhrase = () => {
    if (selectedPhraseIndex === null) {
      alert("Please select a phrase first!");
      return;
    }
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }
    const targetPhrase = question.type === 'speaking' ? question.options[selectedPhraseIndex].replace(/_+/g, '').trim() : '';
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const playListeningAudio = () => {
    if (question.type !== 'listening') return;
    
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }
    
    setIsPlaying(true);
    setAudioPlayed(true);
    
    const utterance = new SpeechSynthesisUtterance(question.audio);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const playStressAudio = (optionIndex: number) => {
    if (question.type !== 'audio-stress') return;
    
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }
    
    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(question.sentence.replace(/"/g, ''));
    utterance.lang = 'en-US';
    
    // Audio A: robotic (even stress) - slower rate
    // Audio B: natural stress - normal rate with emphasis
    if (optionIndex === 0) {
      utterance.rate = 0.7; // Slower, more robotic
      utterance.pitch = 1.0; // Flat pitch
    } else {
      utterance.rate = 0.9; // Natural speed
      utterance.pitch = 1.1; // Slightly varied pitch for natural stress
    }
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentQuestion === quizQuestions.length - 1) {
      setQuizState("results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setDragWords([]);
      setAudioPlayed(false);
      setIsRecording(false);
      setSelectedPhraseIndex(null);
      setRecordingState('idle');
      setSpeakingFeedback(null);
    }
  };

  // PREPARATION SCREEN
  const PrepScreen = () => (
    <div className="w-full">
      <Card className="border-gray-200 rounded-[24px] shadow-md overflow-hidden">
        <div className="relative bg-navy p-8 text-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-gold/20 rounded-[20px] flex items-center justify-center mx-auto mb-4 shadow-md border border-gold/30">
              <Target className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display">
              Ready to Practice?
            </h1>
            <p className="text-white/80 text-base font-body">
              Test your knowledge with 7 quick questions
            </p>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-navy/10 rounded-[16px] flex items-center justify-center mx-auto mb-2 border border-gray-200">
                <Sparkles className="w-6 h-6 text-navy" />
              </div>
              <div className="text-xl font-bold text-navy mb-0.5 font-display">7</div>
              <div className="text-xs text-text-secondary font-body">Questions</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-coral/10 rounded-[16px] flex items-center justify-center mx-auto mb-2 border border-gray-200">
                <Zap className="w-6 h-6 text-coral" />
              </div>
              <div className="text-xl font-bold text-navy mb-0.5 font-display">5</div>
              <div className="text-xs text-text-secondary font-body">Minutes</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-[16px] flex items-center justify-center mx-auto mb-2 border border-gray-200">
                <Trophy className="w-6 h-6 text-gold" />
              </div>
              <div className="text-xl font-bold text-navy mb-0.5 font-display">100</div>
              <div className="text-xs text-text-secondary font-body">Points</div>
            </div>
          </div>

          <Button
            onClick={() => setQuizState("quiz")}
            className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
          >
            Start Quiz
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-sm text-text-secondary mt-4 font-body">
            Take your time — there&apos;s no rush!
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // QUIZ SCREEN
  const QuizScreen = () => {
    const isCorrect = hasCorrectNumber(question) ? selectedAnswer === question.correct : false;

    return (
      <div className="w-full">
        {/* Progress Header */}
        <Card className="mb-6 border-gray-200 rounded-[24px] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy rounded-[12px] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {currentQuestion + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy font-body">
                    Question {currentQuestion + 1}
                  </div>
                  <div className="text-xs text-text-secondary font-body">
                    of {quizQuestions.length}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-navy font-display">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-text-secondary font-body">Complete</div>
              </div>
            </div>

            {/* Progress Bar - Same as Home Page */}
            <div className="mb-0">
              <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-200">
                <div 
                  className="absolute top-0 left-0 h-full bg-teal rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-gray-200 rounded-[24px] shadow-md overflow-hidden mb-6">
          {/* Question Header */}
          <div className="bg-gradient-to-br from-teal/10 to-navy/10 px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-navy/10 text-navy hover:bg-navy/10 border-0 rounded-[12px] capitalize text-xs">
                {question.type.replace("-", " ")}
              </Badge>
              {question.type === "listening" && <Volume2 className="w-4 h-4 text-teal" />}
              {question.type === "speaking" && <Mic className="w-4 h-4 text-coral" />}
            </div>
            <h2 className="text-xl font-bold text-navy leading-snug font-display">
              {question.question}
            </h2>
          </div>

          <CardContent className="p-5">
            {/* Listening Question */}
            {question.type === "listening" && (
              <>
                <Card className="bg-gradient-to-br from-teal to-teal-hover rounded-[20px] p-5 mb-5 shadow-sm border-0">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={playListeningAudio}
                      disabled={isPlaying}
                      className="w-14 h-14 bg-white hover:bg-white rounded-[16px] flex items-center justify-center hover:scale-105 transition-all shadow-sm flex-shrink-0 disabled:opacity-50"
                    >
                      {isPlaying ? (
                        <div className="w-3 h-3 bg-teal rounded"></div>
                      ) : (
                        <Play className="w-6 h-6 text-teal ml-0.5" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="text-sm text-white/90 mb-2 font-medium font-body">
                        {audioPlayed ? "Playing audio..." : "Tap to listen"}
                      </div>
                      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-300 rounded-full"
                          style={{ width: isPlaying ? "100%" : "0%" }}
                        ></div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAudioPlayed(false)}
                      className="text-white hover:text-white hover:bg-white/20 rounded-[12px] h-10 w-10"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const showResult = showFeedback && isSelected;

                    return (
                      <Button
                        key={index}
                        onClick={() => !showFeedback && handleAnswer(index)}
                        disabled={showFeedback}
                        variant="outline"
                        className={`w-full p-4 h-auto rounded-[20px] border-2 text-left transition-all ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success/10 shadow-sm hover:bg-success/10"
                              : "border-error bg-error/10 shadow-sm hover:bg-error/10"
                            : isSelected
                            ? "border-teal bg-teal/10 shadow-sm hover:bg-teal/10"
                            : "border-gray-200 hover:border-teal hover:bg-teal/5"
                        } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-9 h-9 rounded-[12px] flex items-center justify-center font-bold text-sm transition-all ${
                                showResult
                                  ? isCorrect
                                    ? "bg-success text-white shadow-sm"
                                    : "bg-error text-white shadow-sm"
                                  : isSelected
                                  ? "bg-teal text-white shadow-sm"
                                  : "bg-gray-100 text-text-secondary"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-base text-text-primary font-medium leading-relaxed font-body text-left">
                              {option}
                            </span>
                          </div>
                          {showResult && (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isCorrect ? "bg-success" : "bg-error"
                              }`}
                            >
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <X className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Grammar Question */}
            {question.type === "grammar" && (
              <>
                <Card className="bg-navy/5 rounded-[20px] p-5 mb-5 border-gray-200">
                  <p className="text-lg text-navy leading-relaxed font-medium text-center font-body">
                    {question.prompt}
                  </p>
                </Card>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const showResult = showFeedback && isSelected;

                    return (
                      <Button
                        key={index}
                        onClick={() => !showFeedback && handleAnswer(index)}
                        disabled={showFeedback}
                        variant="outline"
                        className={`w-full p-4 h-auto rounded-[20px] border-2 text-left transition-all ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success/10 shadow-sm hover:bg-success/10"
                              : "border-error bg-error/10 shadow-sm hover:bg-error/10"
                            : isSelected
                            ? "border-teal bg-teal/10 shadow-sm hover:bg-teal/10"
                            : "border-gray-200 hover:border-teal hover:bg-teal/5"
                        } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-9 h-9 rounded-[12px] flex items-center justify-center font-bold transition-all ${
                                showResult
                                  ? isCorrect
                                    ? "bg-success text-white shadow-sm"
                                    : "bg-error text-white shadow-sm"
                                  : isSelected
                                  ? "bg-teal text-white shadow-sm"
                                  : "bg-gray-100 text-text-secondary"
                              }`}
                            >
                              {option}
                            </div>
                          </div>
                          {showResult && (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isCorrect ? "bg-success" : "bg-error"
                              }`}
                            >
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <X className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Word Arrangement Question */}
            {question.type === "arrange" && (
              <>
                <div className="space-y-4">
                  <Card className="bg-teal/5 rounded-[20px] p-5 min-h-28 border-2 border-dashed border-teal/30">
                    {dragWords.length === 0 ? (
                      <p className="text-text-tertiary text-center py-3 font-medium font-body text-sm">
                        Tap words below to build your sentence
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {dragWords.map((word, index) => (
                          <Button
                            key={index}
                            onClick={() =>
                              !showFeedback &&
                              setDragWords(dragWords.filter((_, i) => i !== index))
                            }
                            className="px-3 py-2 bg-teal hover:bg-teal-hover text-white rounded-[12px] font-medium cursor-pointer hover:scale-105 transition-all shadow-sm text-sm"
                          >
                            {word}
                          </Button>
                        ))}
                      </div>
                    )}
                  </Card>

                  <div className="flex flex-wrap gap-2">
                    {question.words
                      .filter((word) => !dragWords.includes(word))
                      .map((word, index) => (
                        <Button
                          key={index}
                          onClick={() => !showFeedback && setDragWords([...dragWords, word])}
                          disabled={showFeedback}
                          variant="outline"
                          className="px-3 py-2 bg-white border-2 border-gray-200 text-navy rounded-[12px] font-medium hover:border-teal hover:bg-teal/5 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {word}
                        </Button>
                      ))}
                  </div>

                  {!showFeedback && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="ghost"
                        onClick={() => setDragWords([])}
                        className="px-5 py-2.5 text-teal hover:text-teal-hover font-semibold transition-colors hover:bg-teal/10 rounded-[12px]"
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() => {
                          const userAnswer = dragWords.join(" ");
                          const isCorrect = userAnswer === question.correct;
                          setSelectedAnswer(isCorrect ? question.correct : "wrong");
                          setShowFeedback(true);
                          setUserAnswers({
                            ...userAnswers,
                            [question.id]: { answer: userAnswer, correct: isCorrect },
                          });
                        }}
                        disabled={dragWords.length === 0}
                        className="flex-1 px-5 py-3 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                      >
                        Check Answer
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Pattern Recognition Question */}
            {question.type === "pattern" && (
              <>
                <Card className="bg-navy/5 rounded-[20px] p-5 mb-5 border-gray-200">
                  <div className="space-y-2">
                    {question.context.map((sentence, index) => (
                      <p key={index} className="text-base text-navy font-medium italic font-body">
                        {sentence}
                      </p>
                    ))}
                  </div>
                </Card>

                <p className="text-sm text-text-primary mb-4 font-medium font-body">
                  {question.prompt}
                </p>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const showResult = showFeedback && isSelected;

                    return (
                      <Button
                        key={index}
                        onClick={() => !showFeedback && handleAnswer(index)}
                        disabled={showFeedback}
                        variant="outline"
                        className={`w-full p-4 h-auto rounded-[20px] border-2 text-left transition-all ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success/10 shadow-sm hover:bg-success/10"
                              : "border-error bg-error/10 shadow-sm hover:bg-error/10"
                            : isSelected
                            ? "border-teal bg-teal/10 shadow-sm hover:bg-teal/10"
                            : "border-gray-200 hover:border-teal hover:bg-teal/5"
                        } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-9 h-9 rounded-[12px] flex items-center justify-center font-bold text-sm transition-all ${
                                showResult
                                  ? isCorrect
                                    ? "bg-success text-white shadow-sm"
                                    : "bg-error text-white shadow-sm"
                                  : isSelected
                                  ? "bg-teal text-white shadow-sm"
                                  : "bg-gray-100 text-text-secondary"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-base text-text-primary font-medium leading-relaxed font-body text-left">
                              {option}
                            </span>
                          </div>
                          {showResult && (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isCorrect ? "bg-success" : "bg-error"
                              }`}
                            >
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <X className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Audio Stress Question */}
            {question.type === "audio-stress" && (
              <>
                <Card className="bg-navy/5 rounded-[20px] p-5 mb-5 border-gray-200">
                  <p className="text-base text-navy font-medium text-center font-body">
                    {question.sentence}
                  </p>
                </Card>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const showResult = showFeedback && isSelected;

                    return (
                      <Card
                        key={index}
                        onClick={() => !showFeedback && handleAnswer(index)}
                        className={`cursor-pointer rounded-[20px] border-2 p-4 transition-all ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success/10 shadow-sm"
                              : "border-error bg-error/10 shadow-sm"
                            : isSelected
                            ? "border-teal bg-teal/10 shadow-sm"
                            : "border-gray-200 hover:border-teal hover:bg-teal/5"
                        } ${showFeedback ? "cursor-default" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold transition-all ${
                                showResult
                                  ? isCorrect
                                    ? "bg-success text-white shadow-sm"
                                    : "bg-error text-white shadow-sm"
                                  : isSelected
                                  ? "bg-teal text-white shadow-sm"
                                  : "bg-gray-100 text-text-secondary"
                              }`}
                            >
                              <Volume2 className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-navy font-body text-sm">
                                {option.label}
                              </div>
                              <div className="text-xs text-text-secondary font-body">
                                {option.stress}
                              </div>
                            </div>
                          </div>
                          {showResult && (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isCorrect ? "bg-success" : "bg-error"
                              }`}
                            >
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <X className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            playStressAudio(index);
                          }}
                          disabled={isPlaying}
                          className={`w-full py-2.5 rounded-[12px] font-medium transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 ${
                            isSelected
                              ? "bg-teal text-white hover:bg-teal-hover"
                              : "bg-white border-2 border-gray-200 text-navy hover:border-teal hover:bg-teal/5"
                          }`}
                        >
                          <Play className="w-4 h-4" />
                          Listen
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {/* Comprehension Question */}
            {question.type === "comprehension" && (
              <>
                <Card className="bg-navy/5 rounded-[20px] p-5 mb-5 border-gray-200">
                  <p className="text-lg text-navy leading-relaxed font-medium text-center font-body">
                    {question.sentence}
                  </p>
                </Card>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const showResult = showFeedback && isSelected;

                    return (
                      <Button
                        key={index}
                        onClick={() => !showFeedback && handleAnswer(index)}
                        disabled={showFeedback}
                        variant="outline"
                        className={`w-full p-4 h-auto rounded-[20px] border-2 text-left transition-all ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success/10 shadow-sm hover:bg-success/10"
                              : "border-error bg-error/10 shadow-sm hover:bg-error/10"
                            : isSelected
                            ? "border-teal bg-teal/10 shadow-sm hover:bg-teal/10"
                            : "border-gray-200 hover:border-teal hover:bg-teal/5"
                        } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-9 h-9 rounded-[12px] flex items-center justify-center font-bold text-sm transition-all ${
                                showResult
                                  ? isCorrect
                                    ? "bg-success text-white shadow-sm"
                                    : "bg-error text-white shadow-sm"
                                  : isSelected
                                  ? "bg-teal text-white shadow-sm"
                                  : "bg-gray-100 text-text-secondary"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-base text-text-primary font-medium leading-relaxed font-body text-left">
                              {option}
                            </span>
                          </div>
                          {showResult && (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isCorrect ? "bg-success" : "bg-error"
                              }`}
                            >
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <X className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Speaking Question */}
            {question.type === "speaking" && (
              <>
                <Card className="bg-navy/5 rounded-[20px] p-5 mb-5 border-gray-200">
                  <p className="text-sm text-text-primary font-medium mb-3 font-body">
                    {question.prompt}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhraseIndex(index)}
                        className={`w-full flex items-start gap-2 p-3 rounded-[16px] border-2 transition-all ${
                          selectedPhraseIndex === index
                            ? 'bg-teal/10 border-teal'
                            : 'bg-white border-gray-200 hover:border-teal/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedPhraseIndex === index ? 'bg-teal' : 'bg-teal/10'
                        }`}>
                          <span className={`font-bold text-xs ${
                            selectedPhraseIndex === index ? 'text-white' : 'text-teal'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-text-primary font-body text-left">
                          {option}
                        </p>
                      </button>
                    ))}
                  </div>
                </Card>

                {selectedPhraseIndex !== null && !showFeedback && (
                  <div className="mb-4 text-center">
                    <button
                      onClick={playSpeakingPhrase}
                      className="bg-teal/10 text-teal py-2 px-4 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-teal/20 transition-colors mx-auto"
                    >
                      <Volume2 className="h-4 w-4" /> Listen to phrase
                    </button>
                  </div>
                )}

                {!showFeedback && (
                  <div className="text-center py-4">
                    {recordingState === 'recording' ? (
                      <Button
                        onClick={handleStopSpeakingRecording}
                        className="w-24 h-24 rounded-[24px] flex items-center justify-center mx-auto mb-5 bg-coral hover:bg-coral-hover animate-pulse scale-110 shadow-md"
                      >
                        <Square className="w-10 h-10 text-white" />
                      </Button>
                    ) : recordingState === 'processing' ? (
                      <div className="w-24 h-24 rounded-[24px] flex items-center justify-center mx-auto mb-5 bg-navy/20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
                      </div>
                    ) : (
                      <Button
                        onClick={handleStartSpeakingRecording}
                        disabled={selectedPhraseIndex === null}
                        className={`w-24 h-24 rounded-[24px] flex items-center justify-center mx-auto mb-5 transition-all shadow-md ${
                          selectedPhraseIndex === null
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-coral hover:bg-coral-hover hover:scale-110'
                        }`}
                      >
                        <Mic className="w-10 h-10 text-white" />
                      </Button>
                    )}

                    <p className="text-lg font-semibold text-navy mb-1 font-display">
                      {recordingState === 'recording' 
                        ? "Recording..." 
                        : recordingState === 'processing'
                        ? "Processing..."
                        : selectedPhraseIndex === null
                        ? "Select a phrase first"
                        : "Tap to Record"}
                    </p>
                    <p className="text-sm text-text-secondary mb-6 font-body">
                      {recordingState === 'recording'
                        ? "Speak clearly and naturally"
                        : recordingState === 'processing'
                        ? "Analyzing your pronunciation..."
                        : selectedPhraseIndex === null
                        ? "Choose one of the phrases above"
                        : "Press to start speaking"}
                    </p>

                    {recordingState === 'recording' && (
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-coral rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 40 + 10}px`,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Feedback Section */}
            {showFeedback && selectedAnswer !== null && question.type !== "speaking" && (
              <Card
                className={`mt-6 p-5 rounded-[20px] border-2 ${
                  isCorrect
                    ? "bg-success/10 border-success/30"
                    : "bg-error/10 border-error/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-[16px] flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? "bg-success" : "bg-error"
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <X className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-lg font-bold mb-2 font-display ${
                        isCorrect ? "text-success" : "text-error"
                      }`}
                    >
                      {isCorrect ? "Excellent!" : "Not quite right"}
                    </div>
                    <p className="text-sm leading-relaxed font-body text-text-primary">
                      {isCorrect
                        ? (question.correctFeedback || "Great job!")
                        : (question.incorrectFeedback || "Try again!")}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {showFeedback && question.type === "speaking" && speakingFeedback && (
              <Card className="mt-6 p-5 rounded-[20px] border-2 bg-teal/10 border-teal/30">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-5xl font-bold text-teal">{speakingFeedback.overallScore}</div>
                  <div>
                    <p className="font-semibold text-text-primary">Overall Score</p>
                    <p className="text-text-secondary text-sm">{speakingFeedback.generalFeedback}</p>
                  </div>
                </div>

                {speakingFeedback.transcript && (
                  <div className="mb-4 p-4 bg-white rounded-[12px]">
                    <h4 className="font-semibold text-text-primary mb-2 text-sm">You said:</h4>
                    <p className="text-base text-text-secondary italic">"{speakingFeedback.transcript}"</p>
                  </div>
                )}
                
                <div className="p-4 bg-white rounded-[12px]">
                  <h4 className="font-semibold text-text-primary mb-3 text-sm">Word Analysis</h4>
                  <div className="flex flex-wrap gap-2 text-base font-medium">
                    {speakingFeedback.wordScores.map((ws, i) => (
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
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Next Button */}
        {showFeedback && (
          <div className="mt-4">
            <Button
              onClick={handleNext}
              className="w-full py-4 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
            >
              {currentQuestion === quizQuestions.length - 1 ? "See Results" : "Next Question"}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // RESULTS SCREEN
  const ResultsScreen = () => {
    const percentage = Math.round((totalCorrect / quizQuestions.length) * 100);
    const isPerfect = percentage === 100;
    const isGreat = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="w-full">
        <Card className="border-gray-200 rounded-[24px] shadow-md overflow-hidden">
          {/* Header */}
          <div className="relative bg-navy p-8 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>

            {/* Confetti Effect */}
            {isPerfect && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: ["#D4AF37", "#FF6B6B", "#06B6D4", "#0A2463", "#10B981"][
                        Math.floor(Math.random() * 5)
                      ],
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            <div className="relative">
              <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gold/30">
                {isPerfect ? (
                  <Trophy className="w-12 h-12 text-gold" />
                ) : isGreat ? (
                  <Award className="w-12 h-12 text-gold" />
                ) : (
                  <Sparkles className="w-12 h-12 text-white" />
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mb-2 font-display">
                {isPerfect
                  ? "Perfect Score!"
                  : isGreat
                  ? "Excellent Work!"
                  : isGood
                  ? "Well Done!"
                  : "Keep Practicing!"}
              </h1>
              <p className="text-white/80 text-base font-body">
                {isPerfect
                  ? "You've mastered all the concepts! 🎉"
                  : isGreat
                  ? "You're doing great! Keep it up!"
                  : isGood
                  ? "Good progress! A bit more practice will help."
                  : "Don't worry, practice makes perfect!"}
              </p>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Progress Bar with Percentage */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-secondary font-body">Your Score</span>
                <span className="text-2xl font-bold text-teal font-display">{percentage}%</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-200">
                <div
                  className="absolute top-0 left-0 h-full bg-teal rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-text-secondary mt-2 font-body">
                {totalCorrect} of {quizQuestions.length} correct
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="bg-gradient-to-br from-success/10 to-success/5 rounded-[20px] p-4 text-center border-success/20">
                <div className="w-10 h-10 bg-success rounded-[16px] flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-navy mb-0.5 font-display">
                  {totalCorrect}
                </div>
                <div className="text-xs text-text-secondary font-body">Correct</div>
              </Card>

              <Card className="bg-gradient-to-br from-error/10 to-error/5 rounded-[20px] p-4 text-center border-error/20">
                <div className="w-10 h-10 bg-error rounded-[16px] flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <X className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-navy mb-0.5 font-display">
                  {quizQuestions.length - totalCorrect}
                </div>
                <div className="text-xs text-text-secondary font-body">Incorrect</div>
              </Card>

              <Card className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-[20px] p-4 text-center border-gold/20">
                <div className="w-10 h-10 bg-gold rounded-[16px] flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-navy mb-0.5 font-display">
                  +{totalCorrect * 10}
                </div>
                <div className="text-xs text-text-secondary font-body">XP</div>
              </Card>
            </div>

            {/* Rewards */}
            {isGreat && (
              <Card className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-[20px] p-5 mb-6 border-2 border-gold/20">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gold rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-navy mb-1 font-display">
                      Achievement Unlocked!
                    </div>
                    <div className="text-gold font-medium mb-1 font-body text-sm">
                      {isPerfect ? "🏆 Perfect Score Master" : "⭐ Quiz Champion"}
                    </div>
                    <p className="text-xs text-text-primary font-body">
                      {isPerfect
                        ? "You answered all questions correctly!"
                        : "You scored over 80% - excellent work!"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => alert("Navigate to Role Play Practice")}
                className="w-full py-4 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Practice Role-Play
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuizState("prep");
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                    setUserAnswers({});
                    setDragWords([]);
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-medium hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => alert("Return to home")}
                  className="flex-1 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-semibold hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
                >
                  Back to Lessons
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Main Render
  return (
    <>
    <PageHeader title="Quiz" />
    <div className="p-4">
      {quizState === "prep" && <PrepScreen />}
      {quizState === "quiz" && <QuizScreen />}
      {quizState === "results" && <ResultsScreen />}
    </div>
    </>
  );
}