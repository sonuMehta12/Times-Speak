"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuizPage() {
  const [quizState, setQuizState] = useState("prep"); // prep, quiz, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dragWords, setDragWords] = useState([]);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      type: "listening",
      question: "What did you hear?",
      audio:
        "I'm currently focusing on improving our customer service response times.",
      options: [
        "I'm currently focused on improving...",
        "I'm currently focusing on improving...",
        "I'm currently focusing to improve...",
      ],
      correct: 1,
      correctFeedback:
        'Perfect! "Focusing on" is always followed by the -ing form (gerund).',
      incorrectFeedback:
        'Not quite. Listen again for the phrase "focusing on" + [verb + -ing]. This is the correct pattern in English.',
    },
    {
      id: 2,
      type: "grammar",
      question: "Complete the sentence with the correct preposition:",
      prompt: "I work ___ Microsoft, where I handle technical support.",
      options: ["in", "at", "on"],
      correct: 1,
      correctFeedback:
        'Excellent! We use "at" for specific companies and locations.',
      incorrectFeedback:
        'Remember: "work at" for companies and places, "work in" for fields and departments.',
    },
    {
      id: 3,
      type: "arrange",
      question: "Arrange these words to form a correct sentence:",
      words: ["for", "I'm", "responsible", "onboarding", "new", "clients"],
      correct: "I'm responsible for onboarding new clients.",
      correctFeedback:
        'Great sentence structure! Notice how "responsible for" is followed by a gerund (onboarding).',
      incorrectFeedback:
        "The pattern is: Subject + am/is/are + responsible for + [verb-ing] + [object]",
    },
    {
      id: 4,
      type: "pattern",
      question: "Look at these two sentences:",
      context: [
        '"My role involves coordinating teams."',
        '"I\'m responsible for managing projects."',
      ],
      prompt:
        'What do you notice about the verbs after "involves" and "responsible for"?',
      options: [
        "They are in base form (coordinate, manage)",
        "They end in -ing (gerunds)",
        "They are in past tense",
        'They use "to" (to coordinate, to manage)',
      ],
      correct: 1,
      correctFeedback:
        'Exactly! Both "involves" and "responsible for" must be followed by gerunds (-ing forms).',
      incorrectFeedback:
        'Look again at the verb endings. After "involves" and "responsible for," we always use the -ing form.',
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
      correctFeedback:
        "Yes! In natural English, we stress the important content words (responsible, onboarding, new, clients).",
      incorrectFeedback:
        "Natural English has rhythm — some words are stronger (stressed) and others are weaker (unstressed).",
    },
    {
      id: 6,
      type: "comprehension",
      question: "What does this sentence tell you?",
      sentence:
        '"My role involves coordinating different teams to deliver projects on time."',
      options: [
        "I work alone most of the time",
        "I work with multiple groups of people",
        "I only deliver projects, I don't coordinate",
        "I'm not responsible for deadlines",
      ],
      correct: 1,
      correctFeedback:
        'Correct! "Coordinating teams" means working with and organizing multiple groups.',
      incorrectFeedback:
        '"Coordinating teams" means bringing different groups together and organizing their work.',
    },
    {
      id: 7,
      type: "speaking",
      question: "Now it's your turn to speak!",
      prompt: "Choose ONE phrase and complete it with your own information:",
      options: [
        "I work at ___, where I handle ___.",
        "I'm currently focusing on ___.",
        "I'm responsible for ___, which helps us ___.",
      ],
    },
  ];

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];
  const totalCorrect = Object.values(userAnswers).filter(
    (a) => a.correct
  ).length;

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    const isCorrect = answer === question.correct;
    setUserAnswers({
      ...userAnswers,
      [question.id]: { answer, correct: isCorrect },
    });
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
    }
  };

  // PREPARATION SCREEN
  const PrepScreen = () => (
    <div className="w-full -mt-4 -mx-4 min-h-screen bg-gradient-to-br from-teal/5 via-navy/5 to-coral/5 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="border-gray-200 rounded-[24px] shadow-lg overflow-hidden">
          <div className="relative bg-navy p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

            <div className="relative">
              <div className="w-24 h-24 bg-gold/20 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-lg border border-gold/30">
                <Target className="w-12 h-12 text-gold" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 font-display">
                Ready to Practice?
              </h1>
              <p className="text-white/80 text-lg font-body">
                Test your knowledge with 7 quick questions
              </p>
            </div>
          </div>

          <CardContent className="p-10">
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-navy/10 rounded-[20px] flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <Sparkles className="w-8 h-8 text-navy" />
                </div>
                <div className="text-2xl font-bold text-navy mb-1 font-display">
                  7
                </div>
                <div className="text-sm text-text-secondary font-body">
                  Questions
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-coral/10 rounded-[20px] flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <Zap className="w-8 h-8 text-coral" />
                </div>
                <div className="text-2xl font-bold text-navy mb-1 font-display">
                  5
                </div>
                <div className="text-sm text-text-secondary font-body">
                  Minutes
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-[20px] flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <Trophy className="w-8 h-8 text-gold" />
                </div>
                <div className="text-2xl font-bold text-navy mb-1 font-display">
                  100
                </div>
                <div className="text-sm text-text-secondary font-body">
                  Points
                </div>
              </div>
            </div>

            <Card className="bg-teal/5 rounded-[20px] p-6 mb-8 border-teal/20">
              <h3 className="font-semibold text-navy mb-3 flex items-center gap-2 font-body">
                <div className="w-6 h-6 bg-teal rounded-[8px] flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                What you&apos;ll practice:
              </h3>
              <ul className="space-y-2 text-text-primary font-body">
                <li className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">•</span>
                  <span>Listening comprehension with real audio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">•</span>
                  <span>Grammar patterns and prepositions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">•</span>
                  <span>Sentence construction and word order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">•</span>
                  <span>Speaking practice with pronunciation</span>
                </li>
              </ul>
            </Card>

            <Button
              onClick={() => setQuizState("quiz")}
              className="w-full bg-coral text-white hover:bg-coral-hover py-6 rounded-[16px] font-semibold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
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
    </div>
  );

  // QUIZ SCREEN
  const QuizScreen = () => {
    const isCorrect = selectedAnswer === question.correct;

    return (
      <div className="w-full -mt-4 -mx-4 min-h-screen bg-gradient-to-br from-teal/5 via-navy/5 to-coral/5">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy rounded-[12px] flex items-center justify-center text-white font-bold text-sm shadow-md">
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
                <div className="text-2xl font-bold text-navy font-display">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-text-secondary font-body">
                  Complete
                </div>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Card className="border-gray-200 rounded-[24px] shadow-lg overflow-hidden">
            {/* Question Header */}
            <div className="bg-gradient-to-br from-teal/10 to-navy/10 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-navy/10 text-navy hover:bg-navy/10 border-0 rounded-[12px] capitalize">
                  {question.type.replace("-", " ")}
                </Badge>
                {question.type === "listening" && (
                  <Volume2 className="w-5 h-5 text-teal" />
                )}
                {question.type === "speaking" && (
                  <Mic className="w-5 h-5 text-coral" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-navy leading-snug font-display">
                {question.question}
              </h2>
            </div>

            <CardContent className="p-8">
              {/* Listening Question */}
              {question.type === "listening" && (
                <>
                  <Card className="bg-gradient-to-br from-teal to-teal-hover rounded-[20px] p-8 mb-8 shadow-md border-gray-200">
                    <div className="flex items-center gap-5">
                      <Button
                        onClick={() => {
                          setIsPlaying(!isPlaying);
                          setAudioPlayed(true);
                        }}
                        className="w-16 h-16 bg-white hover:bg-white rounded-[16px] flex items-center justify-center hover:scale-110 transition-all shadow-md flex-shrink-0"
                      >
                        {isPlaying ? (
                          <div className="w-4 h-4 bg-teal rounded"></div>
                        ) : (
                          <Play className="w-7 h-7 text-teal ml-1" />
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
                        className="text-white hover:text-white hover:bg-white/20 rounded-[12px]"
                      >
                        <RotateCcw className="w-6 h-6" />
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
                          className={`w-full p-5 h-auto rounded-[20px] border-2 text-left transition-all ${
                            showResult
                              ? isCorrect
                                ? "border-success bg-success/10 shadow-md hover:bg-success/10"
                                : "border-error bg-error/10 shadow-md hover:bg-error/10"
                              : isSelected
                              ? "border-teal bg-teal/10 shadow-md hover:bg-teal/10"
                              : "border-gray-200 hover:border-teal hover:bg-teal/5 hover:shadow-sm"
                          } ${
                            showFeedback ? "cursor-default" : "cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold text-sm transition-all ${
                                  showResult
                                    ? isCorrect
                                      ? "bg-success text-white shadow-md"
                                      : "bg-error text-white shadow-md"
                                    : isSelected
                                    ? "bg-teal text-white shadow-md"
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
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCorrect ? "bg-success" : "bg-error"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-5 h-5 text-white" />
                                ) : (
                                  <X className="w-5 h-5 text-white" />
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
                  <Card className="bg-navy/5 rounded-[20px] p-6 mb-8 border-gray-200">
                    <p className="text-xl text-navy leading-relaxed font-medium text-center font-body">
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
                          className={`w-full p-5 h-auto rounded-[20px] border-2 text-left transition-all ${
                            showResult
                              ? isCorrect
                                ? "border-success bg-success/10 shadow-md hover:bg-success/10"
                                : "border-error bg-error/10 shadow-md hover:bg-error/10"
                              : isSelected
                              ? "border-teal bg-teal/10 shadow-md hover:bg-teal/10"
                              : "border-gray-200 hover:border-teal hover:bg-teal/5 hover:shadow-sm"
                          } ${
                            showFeedback ? "cursor-default" : "cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold transition-all ${
                                  showResult
                                    ? isCorrect
                                      ? "bg-success text-white shadow-md"
                                      : "bg-error text-white shadow-md"
                                    : isSelected
                                    ? "bg-teal text-white shadow-md"
                                    : "bg-gray-100 text-text-secondary"
                                }`}
                              >
                                {option}
                              </div>
                            </div>
                            {showResult && (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCorrect ? "bg-success" : "bg-error"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-5 h-5 text-white" />
                                ) : (
                                  <X className="w-5 h-5 text-white" />
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
                  <div className="space-y-6">
                    <Card className="bg-teal/5 rounded-[20px] p-6 min-h-32 border-2 border-dashed border-teal/30">
                      {dragWords.length === 0 ? (
                        <p className="text-text-tertiary text-center py-4 font-medium font-body">
                          Tap words below to build your sentence
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {dragWords.map((word, index) => (
                            <Button
                              key={index}
                              onClick={() =>
                                !showFeedback &&
                                setDragWords(
                                  dragWords.filter((_, i) => i !== index)
                                )
                              }
                              className="px-4 py-2.5 bg-teal hover:bg-teal-hover text-white rounded-[12px] font-medium cursor-pointer hover:scale-105 transition-all shadow-sm"
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
                            onClick={() =>
                              !showFeedback &&
                              setDragWords([...dragWords, word])
                            }
                            disabled={showFeedback}
                            variant="outline"
                            className="px-4 py-2.5 bg-white border-2 border-gray-200 text-navy rounded-[12px] font-medium hover:border-teal hover:bg-teal/5 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {word}
                          </Button>
                        ))}
                    </div>

                    {!showFeedback && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="ghost"
                          onClick={() => setDragWords([])}
                          className="px-6 py-3 text-teal hover:text-teal-hover font-semibold transition-colors hover:bg-teal/10 rounded-[12px]"
                        >
                          Reset
                        </Button>
                        <Button
                          onClick={() => {
                            const userAnswer = dragWords.join(" ");
                            const isCorrect = userAnswer === question.correct;
                            setSelectedAnswer(
                              isCorrect ? question.correct : "wrong"
                            );
                            setShowFeedback(true);
                            setUserAnswers({
                              ...userAnswers,
                              [question.id]: {
                                answer: userAnswer,
                                correct: isCorrect,
                              },
                            });
                          }}
                          disabled={dragWords.length === 0}
                          className="flex-1 px-6 py-4 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95"
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
                  <Card className="bg-navy/5 rounded-[20px] p-6 mb-8 border-gray-200">
                    <div className="space-y-3">
                      {question.context.map((sentence, index) => (
                        <p
                          key={index}
                          className="text-lg text-navy font-medium italic font-body"
                        >
                          {sentence}
                        </p>
                      ))}
                    </div>
                  </Card>

                  <p className="text-base text-text-primary mb-6 font-medium font-body">
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
                          className={`w-full p-5 h-auto rounded-[20px] border-2 text-left transition-all ${
                            showResult
                              ? isCorrect
                                ? "border-success bg-success/10 shadow-md hover:bg-success/10"
                                : "border-error bg-error/10 shadow-md hover:bg-error/10"
                              : isSelected
                              ? "border-teal bg-teal/10 shadow-md hover:bg-teal/10"
                              : "border-gray-200 hover:border-teal hover:bg-teal/5 hover:shadow-sm"
                          } ${
                            showFeedback ? "cursor-default" : "cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold text-sm transition-all ${
                                  showResult
                                    ? isCorrect
                                      ? "bg-success text-white shadow-md"
                                      : "bg-error text-white shadow-md"
                                    : isSelected
                                    ? "bg-teal text-white shadow-md"
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
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCorrect ? "bg-success" : "bg-error"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-5 h-5 text-white" />
                                ) : (
                                  <X className="w-5 h-5 text-white" />
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
                  <Card className="bg-navy/5 rounded-[20px] p-6 mb-8 border-gray-200">
                    <p className="text-lg text-navy font-medium text-center mb-2 font-body">
                      {question.sentence}
                    </p>
                  </Card>

                  <div className="space-y-4">
                    {question.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const showResult = showFeedback && isSelected;

                      return (
                        <Card
                          key={index}
                          onClick={() => !showFeedback && handleAnswer(index)}
                          className={`cursor-pointer rounded-[20px] border-2 p-6 transition-all ${
                            showResult
                              ? isCorrect
                                ? "border-success bg-success/10 shadow-md"
                                : "border-error bg-error/10 shadow-md"
                              : isSelected
                              ? "border-teal bg-teal/10 shadow-md"
                              : "border-gray-200 hover:border-teal hover:bg-teal/5 hover:shadow-sm"
                          } ${showFeedback ? "cursor-default" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-[12px] flex items-center justify-center font-bold transition-all ${
                                  showResult
                                    ? isCorrect
                                      ? "bg-success text-white shadow-md"
                                      : "bg-error text-white shadow-md"
                                    : isSelected
                                    ? "bg-teal text-white shadow-md"
                                    : "bg-gray-100 text-text-secondary"
                                }`}
                              >
                                <Volume2 className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="font-bold text-navy font-body">
                                  {option.label}
                                </div>
                                <div className="text-sm text-text-secondary font-body">
                                  {option.stress}
                                </div>
                              </div>
                            </div>
                            {showResult && (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCorrect ? "bg-success" : "bg-error"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-5 h-5 text-white" />
                                ) : (
                                  <X className="w-5 h-5 text-white" />
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlaying(!isPlaying);
                            }}
                            className={`w-full py-3 rounded-[12px] font-medium transition-all flex items-center justify-center gap-2 ${
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
                  <Card className="bg-navy/5 rounded-[20px] p-6 mb-8 border-gray-200">
                    <p className="text-xl text-navy leading-relaxed font-medium text-center font-body">
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
                          className={`w-full p-5 h-auto rounded-[20px] border-2 text-left transition-all ${
                            showResult
                              ? isCorrect
                                ? "border-success bg-success/10 shadow-md hover:bg-success/10"
                                : "border-error bg-error/10 shadow-md hover:bg-error/10"
                              : isSelected
                              ? "border-teal bg-teal/10 shadow-md hover:bg-teal/10"
                              : "border-gray-200 hover:border-teal hover:bg-teal/5 hover:shadow-sm"
                          } ${
                            showFeedback ? "cursor-default" : "cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold text-sm transition-all ${
                                  showResult
                                    ? isCorrect
                                      ? "bg-success text-white shadow-md"
                                      : "bg-error text-white shadow-md"
                                    : isSelected
                                    ? "bg-teal text-white shadow-md"
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
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCorrect ? "bg-success" : "bg-error"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-5 h-5 text-white" />
                                ) : (
                                  <X className="w-5 h-5 text-white" />
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
                  <Card className="bg-navy/5 rounded-[20px] p-6 mb-8 border-gray-200">
                    <p className="text-base text-text-primary font-medium mb-4 font-body">
                      {question.prompt}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-white rounded-[16px] border border-gray-200"
                        >
                          <div className="w-6 h-6 bg-teal/10 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-teal font-bold text-xs">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-text-primary font-body">
                            {option}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="text-center py-6">
                    <Button
                      onClick={() => {
                        setIsRecording(!isRecording);
                        if (!isRecording) {
                          setTimeout(() => {
                            setIsRecording(false);
                            setSelectedAnswer("recorded");
                            setShowFeedback(true);
                            setUserAnswers({
                              ...userAnswers,
                              [question.id]: {
                                answer: "recorded",
                                correct: true,
                              },
                            });
                          }, 3000);
                        }
                      }}
                      className={`w-28 h-28 rounded-[24px] flex items-center justify-center mx-auto mb-6 transition-all shadow-lg ${
                        isRecording
                          ? "bg-coral animate-pulse scale-110 hover:bg-coral"
                          : "bg-coral hover:bg-coral-hover hover:scale-110"
                      }`}
                    >
                      <Mic className="w-12 h-12 text-white" />
                    </Button>

                    <p className="text-lg font-semibold text-navy mb-2 font-display">
                      {isRecording ? "Recording..." : "Tap to Record"}
                    </p>
                    <p className="text-sm text-text-secondary mb-8 font-body">
                      {isRecording
                        ? "Speak clearly and naturally"
                        : "Press and hold to start speaking"}
                    </p>

                    {isRecording && (
                      <div className="flex items-center justify-center gap-1 mb-6">
                        {[...Array(24)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-coral rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 48 + 12}px`,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Feedback Section */}
              {showFeedback &&
                selectedAnswer !== null &&
                question.type !== "speaking" && (
                  <Card
                    className={`mt-8 p-6 rounded-[20px] border-2 ${
                      isCorrect
                        ? "bg-success/10 border-success/30"
                        : "bg-error/10 border-error/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-success" : "bg-error"
                        }`}
                      >
                        {isCorrect ? (
                          <Check className="w-7 h-7 text-white" />
                        ) : (
                          <X className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-xl font-bold mb-2 font-display ${
                            isCorrect ? "text-success" : "text-error"
                          }`}
                        >
                          {isCorrect ? "Excellent!" : "Not quite right"}
                        </div>
                        <p
                          className={`text-base leading-relaxed font-body ${
                            isCorrect
                              ? "text-text-primary"
                              : "text-text-primary"
                          }`}
                        >
                          {isCorrect
                            ? question.correctFeedback
                            : question.incorrectFeedback}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

              {showFeedback && question.type === "speaking" && (
                <Card className="mt-8 p-6 rounded-[20px] border-2 bg-success/10 border-success/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 bg-success">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold mb-3 text-success font-display">
                        Great job! 🎉
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-gray-200">
                          <span className="text-text-primary font-medium font-body">
                            Grammar
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-success w-[85%]"></div>
                            </div>
                            <span className="text-success font-bold font-body">
                              85%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-gray-200">
                          <span className="text-text-primary font-medium font-body">
                            Pronunciation
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-success w-[90%]"></div>
                            </div>
                            <span className="text-success font-bold font-body">
                              90%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-gray-200">
                          <span className="text-text-primary font-medium font-body">
                            Fluency
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-success w-[80%]"></div>
                            </div>
                            <span className="text-success font-bold font-body">
                              80%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Card className="text-sm text-text-primary mt-4 bg-success/10 p-3 rounded-[12px] border-success/20">
                        💡 <strong>Tip:</strong> Try to emphasize the key words
                        more for better natural flow.
                      </Card>
                    </div>
                  </div>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Next Button */}
          {showFeedback && (
            <div className="mt-6">
              <Button
                onClick={handleNext}
                className="w-full py-5 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
              >
                {currentQuestion === quizQuestions.length - 1
                  ? "See Results"
                  : "Next Question"}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
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
      <div className="w-full -mt-4 -mx-4 min-h-screen bg-gradient-to-br from-teal/5 via-navy/5 to-coral/5 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <Card className="border-gray-200 rounded-[24px] shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative bg-navy p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

              {/* Confetti Effect */}
              {isPerfect && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full animate-bounce"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor: [
                          "#D4AF37",
                          "#FF6B6B",
                          "#06B6D4",
                          "#0A2463",
                          "#10B981",
                        ][Math.floor(Math.random() * 5)],
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                      }}
                    ></div>
                  ))}
                </div>
              )}

              <div className="relative">
                <div className="w-32 h-32 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-gold/30">
                  {isPerfect ? (
                    <Trophy className="w-16 h-16 text-gold" />
                  ) : isGreat ? (
                    <Award className="w-16 h-16 text-gold" />
                  ) : (
                    <Sparkles className="w-16 h-16 text-white" />
                  )}
                </div>

                <h1 className="text-5xl font-bold text-white mb-3 font-display">
                  {isPerfect
                    ? "Perfect Score!"
                    : isGreat
                    ? "Excellent Work!"
                    : isGood
                    ? "Well Done!"
                    : "Keep Practicing!"}
                </h1>
                <p className="text-white/80 text-xl font-body">
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

            {/* Score Circle */}
            <CardContent className="p-10">
              <div className="flex items-center justify-center mb-10">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#06B6D4"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 88 * (1 - percentage / 100)
                      }`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold text-teal font-display">
                      {percentage}%
                    </div>
                    <div className="text-text-secondary font-medium mt-1 font-body">
                      {totalCorrect} of {quizQuestions.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <Card className="bg-gradient-to-br from-success/10 to-success/5 rounded-[20px] p-5 text-center border-success/20">
                  <div className="w-12 h-12 bg-success rounded-[16px] flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-navy mb-1 font-display">
                    {totalCorrect}
                  </div>
                  <div className="text-sm text-text-secondary font-body">
                    Correct
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-error/10 to-error/5 rounded-[20px] p-5 text-center border-error/20">
                  <div className="w-12 h-12 bg-error rounded-[16px] flex items-center justify-center mx-auto mb-3 shadow-md">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-navy mb-1 font-display">
                    {quizQuestions.length - totalCorrect}
                  </div>
                  <div className="text-sm text-text-secondary font-body">
                    Incorrect
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-[20px] p-5 text-center border-gold/20">
                  <div className="w-12 h-12 bg-gold rounded-[16px] flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-navy mb-1 font-display">
                    +{totalCorrect * 10}
                  </div>
                  <div className="text-sm text-text-secondary font-body">
                    XP Earned
                  </div>
                </Card>
              </div>

              {/* Rewards */}
              {isGreat && (
                <Card className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-[20px] p-6 mb-8 border-2 border-gold/20">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gold rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-navy mb-1 font-display">
                        Achievement Unlocked!
                      </div>
                      <div className="text-gold font-medium mb-2 font-body">
                        {isPerfect
                          ? "🏆 Perfect Score Master"
                          : "⭐ Quiz Champion"}
                      </div>
                      <p className="text-sm text-text-primary font-body">
                        {isPerfect
                          ? "You answered all questions correctly on your first try!"
                          : "You scored over 80% - excellent work!"}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    alert("Navigate to Role Play Practice");
                  }}
                  className="w-full py-5 bg-coral hover:bg-coral-hover text-white rounded-[16px] font-semibold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
                >
                  Practice Role-Play
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center gap-4">
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
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-medium hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      alert("Return to home");
                    }}
                    className="flex-1 py-3 border-2 border-gray-200 text-navy rounded-[12px] font-semibold hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
                  >
                    Back to Lessons
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <>
      {quizState === "prep" && <PrepScreen />}
      {quizState === "quiz" && <QuizScreen />}
      {quizState === "results" && <ResultsScreen />}
    </>
  );
}
