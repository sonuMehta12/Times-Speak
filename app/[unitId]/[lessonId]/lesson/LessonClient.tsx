"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, MoreVertical, Star, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLessonContext } from "@/lib/context/LessonContext";
import { Lesson } from "@/lib/types/language";
import Image from 'next/image';
import VoiceRecorder from '@/components/common/VoiceRecorder';

interface Props {
  lesson: Lesson;
  unitId: string;
  lessonNumber: number;
  totalLessons: number;
}

export default function LessonClient({ lesson, unitId, lessonNumber, totalLessons }: Props) {
  const router = useRouter();
  const { setCurrentLesson, completeLesson } = useLessonContext();

  // States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracyScore, setAccuracyScore] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Calculate accuracy score based on transcript vs expected phrase
  const calculateAccuracy = (spoken: string, expected: string): number => {
    const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
    const expectedWords = expected.toLowerCase().trim().split(/\s+/);

    let matchCount = 0;
    expectedWords.forEach((word, index) => {
      if (spokenWords[index] && spokenWords[index] === word) {
        matchCount++;
      }
    });

    const accuracy = Math.round((matchCount / expectedWords.length) * 100);
    return accuracy;
  };

  // Get word-by-word comparison
  const getWordComparison = () => {
    const spokenWords = transcript.toLowerCase().trim().split(/\s+/);
    const expectedWords = lesson.phrase.toLowerCase().trim().split(/\s+/);

    return expectedWords.map((expectedWord, index) => {
      const spokenWord = spokenWords[index];
      const isCorrect = spokenWord === expectedWord;
      const isMissing = !spokenWord;

      return {
        expected: lesson.phrase.split(/\s+/)[index],
        spoken: transcript.split(/\s+/)[index] || '',
        isCorrect,
        isMissing
      };
    });
  };

  // Get improvement tip based on accuracy
  const getImprovementTip = (accuracy: number): string | null => {
    if (accuracy >= 90) return null;

    const wordComparison = getWordComparison();
    const incorrectWords = wordComparison.filter(w => !w.isCorrect && !w.isMissing);
    const missingWords = wordComparison.filter(w => w.isMissing);

    if (missingWords.length > 0) {
      return `Try to complete the full phrase. You missed: "${missingWords.map(w => w.expected).join(' ')}"`;
    }

    if (incorrectWords.length > 0) {
      const firstIncorrect = incorrectWords[0];
      return `The word "${firstIncorrect.expected}" sounds different. Try pronouncing it as "${firstIncorrect.expected}" clearly.`;
    }

    return "Keep practicing to improve your pronunciation!";
  };

  const unitInfo = `Unit 1 • Lesson ${lessonNumber} of ${totalLessons}`;
  const xpToEarn = 50;

  // Calculate progress: Step 1 of 3 (Lesson phase)
  const progressPercentage = 33;

  // Split script into chunks (sentences)
  const scriptChunks = lesson.script.match(/[^.!?]+[.!?]+/g) || [lesson.script];

  // Set current lesson on mount
  useEffect(() => {
    setCurrentLesson(unitId, lesson.id);
  }, [unitId, lesson.id, setCurrentLesson]);


  // Auto-speak the script on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakScript();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak the entire script with synchronized captions
  const speakScript = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      setIsSpeaking(true);
      setCurrentCaption('');

      const utterance = new SpeechSynthesisUtterance(lesson.script);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utteranceRef.current = utterance;

      // Track word boundaries to update caption in real-time
      let currentChunkIndex = 0;
      let spokenText = '';

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const word = lesson.script.substring(event.charIndex, event.charIndex + event.charLength);
          spokenText += (spokenText ? ' ' : '') + word;

          // Find which chunk we're currently in
          let accumulatedText = '';
          for (let i = 0; i < scriptChunks.length; i++) {
            accumulatedText += scriptChunks[i];
            if (spokenText.length <= accumulatedText.length) {
              if (i !== currentChunkIndex) {
                currentChunkIndex = i;
                setCurrentCaption(scriptChunks[i].trim());
              }
              break;
            }
          }
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);

      // Set first chunk immediately
      if (scriptChunks.length > 0) {
        setCurrentCaption(scriptChunks[0].trim());
      }
    }
  };

  // Speak just the key phrase
  const speakPhrase = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lesson.phrase);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRecordingComplete = (speechResult: string) => {
    setTranscript(speechResult);
    setHasRecorded(true);

    // Calculate accuracy
    const accuracy = calculateAccuracy(speechResult, lesson.phrase);
    setAccuracyScore(accuracy);

    setTimeout(() => {
      setShowFeedbackModal(true);
    }, 500);
  };

  const handleContinueFromFeedback = () => {
    setShowFeedbackModal(false);
    setTimeout(() => {
      // Complete lesson and move to quiz
      completeLesson(lesson.id, unitId);
      router.push(`/${unitId}/${lesson.id}/quiz`);
    }, 300);
  };

  const handleTryAgain = () => {
    setShowFeedbackModal(false);
    setHasRecorded(false);
    setTranscript('');
    setAccuracyScore(0);
  };

  return (
    <div className="w-full -mt-4 -mx-4">
      <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 mx-4">
              <div className="text-xs font-semibold text-text-secondary mb-1 font-body">
                {unitInfo}
              </div>
              <h1 className="text-sm font-bold text-navy truncate font-display">
                {lesson.title || `Lesson ${lessonNumber}`}
              </h1>
            </div>

            <Badge className="bg-gold/20 text-gold border-0 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-gold" />
              +{xpToEarn}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy ml-2"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pb-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1.5 text-center font-medium">
              Step 1 of 3: Lesson
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-bg-card min-h-0">
          <div className="px-5 py-5 space-y-4 animate-fade-in-up pb-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-2">
              {/* Avatar with Speaking Rings */}
              <div className="relative flex items-center justify-center">
                {/* Animated Speaking Rings */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-teal/30 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-0 rounded-full bg-teal/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }}></div>
                    <div className="absolute inset-0 rounded-full bg-teal/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.6s' }}></div>
                  </>
                )}

                {/* Avatar Image - Made smaller */}
                <div className={`relative w-28 h-28 rounded-full overflow-hidden border-4 ${isSpeaking ? 'border-teal shadow-xl shadow-teal/30' : 'border-gray-200'} transition-all duration-300 bg-gradient-to-br from-teal-100 to-teal-200`}>
                  <Image
                    src="/imgs/Aditi.png"
                    alt="AI Teacher"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Repeat Button */}
              <Button
                onClick={speakScript}
                disabled={isSpeaking}
                variant="ghost"
                className="text-teal hover:bg-teal/10 font-semibold text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full h-auto"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
                {isSpeaking ? 'Speaking...' : 'Repeat'}
              </Button>
            </div>

            {/* Caption Container - Made more compact */}
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-3.5">
                {currentCaption ? (
                  <p className="text-sm text-text-primary leading-relaxed font-body text-center animate-fade-in">
                    {currentCaption}
                  </p>
                ) : (
                  <p className="text-xs text-text-secondary leading-relaxed font-body text-center italic">
                    Listen carefully...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Practice Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-navy font-display">
                Practice
              </h2>

              {/* Key Phrase Card - More compact */}
              <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
                <CardContent className="p-4 space-y-3">
                  {/* Phrase */}
                  <div className="bg-gradient-to-br from-navy/5 to-teal/5 p-3 rounded-xl border border-navy/10">
                    <p className="text-base font-bold text-navy text-center font-display leading-snug">
                      {lesson.phrase}
                    </p>
                  </div>

                  {/* Meaning */}
                  {lesson.phraseMeaning && (
                    <p className="text-xs text-text-secondary text-center leading-relaxed">
                      {lesson.phraseMeaning}
                    </p>
                  )}

                  {/* Listen Button */}
                  <Button
                    onClick={speakPhrase}
                    variant="outline"
                    className="w-full py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-navy hover:bg-gray-50 transition-all active:scale-95"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>

                  {/* Speak Now Button */}
                  <VoiceRecorder
                    mode="auto"
                    onRecordingComplete={handleRecordingComplete}
                    variant="default"
                    buttonText={hasRecorded ? "Try Again" : "Speak Now"}
                    showInterimResults={false}
                    maxDuration={30}
                    className="w-full py-3 rounded-xl font-semibold text-sm shadow-md"
                    onError={(error) => console.error('Voice recording error:', error)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* FEEDBACK BOTTOM SHEET MODAL */}
      {showFeedbackModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] max-w-[393px] mx-auto left-0 right-0 animate-fade-in"
            onClick={() => setShowFeedbackModal(false)}
          ></div>

          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto z-[70] animate-slide-up">
            <Card className="bg-white border-t-2 border-gray-200 rounded-t-[24px] shadow-2xl">
              <CardContent className="p-6 space-y-5">
                {/* Success Message */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-navy mb-1">
                    {accuracyScore >= 90 ? 'Great job!' : accuracyScore >= 70 ? 'Good try!' : 'Keep practicing!'}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {accuracyScore >= 90 ? 'Your pronunciation is very clear.' : 'Let\'s improve your pronunciation.'}
                  </p>
                </div>

                {/* Circular Progress Bar */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    {/* Background Circle */}
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - accuracyScore / 100)}`}
                        className={`transition-all duration-1000 ${
                          accuracyScore >= 90
                            ? 'text-success'
                            : accuracyScore >= 70
                            ? 'text-gold'
                            : 'text-error'
                        }`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-navy">{accuracyScore}%</div>
                        <div className="text-xs text-text-secondary font-medium">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phrase Comparison */}
                <div className="space-y-2">
                  <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Phrase Comparison</p>
                  <Card className="bg-gray-50 border-gray-200 rounded-xl shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex flex-wrap gap-1.5 items-center justify-center">
                        {getWordComparison().map((word, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-md text-sm font-medium ${
                              word.isCorrect
                                ? 'bg-success/20 text-success'
                                : word.isMissing
                                ? 'bg-error/20 text-error line-through'
                                : 'bg-error/20 text-error'
                            }`}
                          >
                            {word.expected}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-text-secondary text-center mt-2">
                        You said: <span className="font-medium text-text-primary">{transcript || '...'}</span>
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Improvement Tip */}
                {getImprovementTip(accuracyScore) && (
                  <div className="space-y-2">
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Improvement Tip</p>
                    <Card className="bg-teal/5 border-teal/20 rounded-xl shadow-sm">
                      <CardContent className="p-3">
                        <p className="text-sm text-text-primary leading-relaxed">
                          {getImprovementTip(accuracyScore)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="py-3 rounded-xl font-semibold border-2 border-gray-200 text-text-secondary hover:bg-gray-50 hover:text-navy transition-all active:scale-95"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleContinueFromFeedback}
                    className="py-3 bg-navy hover:bg-navy-hover text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
