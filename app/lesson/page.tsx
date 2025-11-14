"use client";

import React, { useState, useEffect, useRef } from 'react';

// Type for Speech Recognition
interface SpeechRecognitionType {
  new(): any;
}
import { ArrowLeft, Volume2, Mic, Star, Check, X, Play, MoreVertical, Sparkles, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type LessonStep = 'intro' | 'lesson' | 'quiz' | 'roleplay-intro';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export default function LessonPage() {
  const [currentStep, setCurrentStep] = useState<LessonStep>('lesson');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const lessonTitle = "Meeting a New Challenge";
  const unitInfo = "Unit 1 • Lesson 1 of 5";
  const currentLesson = 1;
  const totalLessons = 5;

  const mainPhrase = "I work at Microsoft, where I handle customer support.";
  const phraseExplanations = [
    { phrase: "'Work at'", explanation: "tells people where you work." },
    { phrase: "'Handle'", explanation: "explains your main responsibility." }
  ];

  const quizQuestion: QuizQuestion = {
    id: 1,
    question: "Choose the correct sentence:",
    options: [
      "I work at Microsoft, where I handle customer support.",
      "I work in Microsoft, where I handle customer support.",
      "I work on Microsoft, where I handle customer support."
    ],
    correct: 0
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Translation function (placeholder - would integrate with translation API)
  const translateText = (text: string) => {
    // For now, show an alert. In production, this would call a translation API
    alert(`Translation feature would translate: "${text}"`);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
          setIsRecording(true);
        };
        
        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
          setHasRecorded(true);
          
          // Show feedback modal after a short delay
          setTimeout(() => {
            setShowFeedbackModal(true);
          }, 500);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
          setIsRecording(false);
        };
        
        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, []);

  // Auto-read the initial message when page loads
  useEffect(() => {
    const initialMessage = "Let's master a simple, powerful way to introduce your job.";
    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      speakText(initialMessage);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartRecording = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      // Stop recording
      recognitionRef.current?.stop();
    } else {
      // Start recording
      setTranscript('');
      setHasRecorded(false);
      setShowFeedbackModal(false);
      recognitionRef.current?.start();
    }
  };

  const handleContinueFromFeedback = () => {
    setShowFeedbackModal(false);
    setTimeout(() => {
      setCurrentStep('quiz');
    }, 300);
  };

  const handleTryAgain = () => {
    setShowFeedbackModal(false);
    setHasRecorded(false);
    setIsRecording(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (showQuizFeedback) return;
    setSelectedAnswer(index);
    
    const isCorrect = index === quizQuestion.correct;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      // For correct answers, move directly to roleplay without showing feedback
      setTimeout(() => {
        setCurrentStep('roleplay-intro');
      }, 500);
    } else {
      // For incorrect answers, show feedback
      setShowQuizFeedback(true);
    }
  };

  const handleQuizContinue = () => {
    // Single quiz completed, move to roleplay
    setCurrentStep('roleplay-intro');
  };

  const handleStartRolePlay = () => {
    window.location.href = '/role';
  };

  const isCorrectAnswer = selectedAnswer === quizQuestion.correct;

  return (
    <div className="w-full -mt-4 -mx-4">
      <div className="fixed inset-0 flex flex-col bg-bg-primary max-w-[393px] mx-auto left-0 right-0 z-50">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 mx-4">
              <div className="text-xs font-semibold text-text-secondary mb-1 font-body">
                {unitInfo}
              </div>
              <h1 className="text-base font-bold text-navy truncate font-display">
                {lessonTitle}
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-bg-card min-h-0 pb-20">

          {/* LESSON/SPEAKING PRACTICE SCREEN */}
          {currentStep === 'lesson' && (
            <div className="p-6 pb-8 space-y-6 animate-fade-in-up min-h-full">
              {/* AI Message */}
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-gray-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" />
                  <AvatarFallback className="bg-teal text-white font-semibold">AI</AvatarFallback>
                </Avatar>
                <Card className="flex-1 bg-white border-gray-200 rounded-[20px] rounded-tl-md shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-text-primary leading-relaxed font-body flex-1">
                        Let's master a simple, powerful way to introduce your job.
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => speakText("Let's master a simple, powerful way to introduce your job.")}
                          className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => translateText("Let's master a simple, powerful way to introduce your job.")}
                          className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                        >
                          <Languages className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lesson Title */}
              <h2 className="text-2xl font-bold text-navy font-display">Lesson</h2>

              {/* Main Lesson Card */}
              <Card className="bg-gray-50 border-gray-200 rounded-[20px] shadow-sm">
                <CardContent className="p-5 space-y-4">
                  {/* Phrase Explanations */}
                  {phraseExplanations.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge className="bg-navy/10 text-navy hover:bg-navy/10 border-0 rounded-[12px] px-3 py-1.5 font-semibold whitespace-nowrap">
                        {item.phrase}
                      </Badge>
                      <p className="text-sm text-text-primary font-body flex-1">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-text-secondary font-body mb-4">
                      Put them together for a clear, professional introduction.
                    </p>
                    
                    {/* Phrase to Practice */}
                    <Card className="bg-white border-2 border-gray-200 rounded-[20px] shadow-sm">
                      <CardContent className="p-5 text-center space-y-4">
                        <p className="text-lg font-bold text-navy leading-relaxed font-body">
                          {mainPhrase}
                        </p>
                        
                        <Button
                          onClick={handleStartRecording}
                          disabled={!speechSupported}
                          className={`w-full py-6 rounded-[16px] font-semibold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 ${
                            isListening
                              ? 'bg-error hover:bg-error-hover text-white animate-pulse'
                              : hasRecorded
                              ? 'bg-success hover:bg-success-hover text-white'
                              : speechSupported
                              ? 'bg-coral hover:bg-coral-hover text-white'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <Mic className="w-5 h-5 mr-2" />
                          {!speechSupported 
                            ? 'Speech Not Supported' 
                            : isListening 
                            ? 'Listening... (Tap to stop)' 
                            : hasRecorded 
                            ? 'Recorded! Tap to try again' 
                            : 'Speak Now'
                          }
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* QUIZ SCREEN */}
          {currentStep === 'quiz' && (
            <div className="p-6 pb-8 space-y-6 animate-fade-in-up min-h-full">
              {/* AI Message */}
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-gray-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" />
                  <AvatarFallback className="bg-teal text-white font-semibold">AI</AvatarFallback>
                </Avatar>
                <Card className="flex-1 bg-white border-gray-200 rounded-[20px] rounded-tl-md shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-text-primary leading-relaxed font-body flex-1">
                        Let's test your understanding with a quick quiz.
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => speakText("Let's test your understanding with a quick quiz.")}
                          className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => translateText("Let's test your understanding with a quick quiz.")}
                          className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                        >
                          <Languages className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lesson Title */}
              <h2 className="text-2xl font-bold text-navy font-display">Lesson</h2>

              {/* Quiz Question Card */}
              <Card className="bg-gray-50 border-gray-200 rounded-[20px] shadow-sm">
                <CardContent className="p-5 space-y-4">
                  {/* Feedback Message */}
                  {showQuizFeedback && (
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="w-8 h-8 flex-shrink-0 border-2 border-gray-100">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" />
                        <AvatarFallback className="bg-teal text-white font-semibold text-xs">AI</AvatarFallback>
                      </Avatar>
                      <Card className="flex-1 bg-white border-gray-200 rounded-[16px] rounded-tl-md shadow-sm">
                        <CardContent className="p-3">
                          <p className="text-xs text-text-primary leading-relaxed font-body">
                            {isCorrectAnswer 
                              ? "Excellent! That's the correct answer." 
                              : `Good try. The correct sentence is option ${quizQuestion.correct + 1}.`
                            }
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <p className="text-base font-semibold text-navy font-body mb-4">
                    {quizQuestion.question}
                  </p>

                  {/* Explanation text when feedback is shown */}
                  {showQuizFeedback && (
                    <div className="bg-white rounded-[16px] p-4 mb-4 border border-gray-200">
                      <p className="text-xs text-text-secondary font-body leading-relaxed">
                        Use work at for specific workplaces, and work in for industries or departments (e.g., marketing, HR, finance).
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {quizQuestion.options.map((option: string, index: number) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === quizQuestion.correct;
                      
                      let buttonClass = '';
                      if (showQuizFeedback) {
                        if (isCorrect) {
                          // Correct answer - always show green
                          buttonClass = 'border-success bg-success/10 text-success';
                        } else if (isSelected && !isCorrect) {
                          // Selected wrong answer - show red
                          buttonClass = 'border-error bg-error/10 text-error';
                        } else {
                          // Other options when feedback is shown
                          buttonClass = 'border-gray-200 bg-gray-100 text-gray-500';
                        }
                      } else {
                        // Before selection
                        buttonClass = isSelected
                          ? 'border-navy bg-navy/5 text-navy'
                          : 'border-gray-200 bg-white text-text-primary hover:border-navy/30 hover:bg-navy/5';
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showQuizFeedback}
                          className={`w-full p-4 rounded-[16px] border-2 text-left transition-all text-sm font-medium font-body ${buttonClass} ${
                            showQuizFeedback ? 'cursor-default' : 'cursor-pointer active:scale-95'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizFeedback && (
                    <Button
                      onClick={handleQuizContinue}
                      className="w-full mt-4 py-4 bg-success hover:bg-success-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      Continue
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ROLE PLAY INTRO SCREEN */}
          {currentStep === 'roleplay-intro' && (
            <div className="p-6 pb-8 space-y-6 animate-fade-in-up min-h-full">
              {/* Progress Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/20 rounded-[16px] flex items-center justify-center border border-gold/30">
                    <Star className="w-7 h-7 text-gold fill-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy font-display">Lesson Complete!</h3>
                    <p className="text-xs text-text-secondary font-body">Time for role-play practice</p>
                  </div>
                </div>
              </div>

              {/* AI Message */}
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-gray-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" />
                  <AvatarFallback className="bg-teal text-white font-semibold">AI</AvatarFallback>
                </Avatar>
                <Card className="flex-1 bg-white border-gray-200 rounded-[20px] rounded-tl-md shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-text-primary leading-relaxed font-body flex-1">
                        Great progress! Now let's practice this in a real conversation. You'll meet a colleague and introduce yourself naturally.
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => speakText("Great progress! Now let's practice this in a real conversation. You'll meet a colleague and introduce yourself naturally.")}
                          className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => translateText("Great progress! Now let's practice this in a real conversation. You'll meet a colleague and introduce yourself naturally.")}
                          className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                        >
                          <Languages className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Scenario Preview */}
              <Card className="bg-gradient-to-br from-navy/5 to-teal/5 border-navy/20 rounded-[24px] shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop"
                      alt="Role play scenario"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-white/90 text-navy hover:bg-white/90 border-0 rounded-full px-3 py-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold" />
                        Role-Play Scenario
                      </Badge>
                      <h3 className="text-xl font-bold text-white font-display">
                        Meeting a New Colleague
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card className="bg-white border-gray-200 rounded-[20px] shadow-sm">
                <CardContent className="p-5">
                  <h4 className="text-sm font-bold text-navy mb-3 font-body">What to expect:</h4>
                  <ul className="space-y-2 text-sm text-text-primary font-body">
                    <li className="flex items-start gap-2">
                      <span className="text-teal mt-0.5">•</span>
                      <span>You'll have a natural conversation with AI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal mt-0.5">•</span>
                      <span>Use the phrases you just learned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal mt-0.5">•</span>
                      <span>Get real-time feedback on your speaking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* CTA Button */}
              <Button
                onClick={handleStartRolePlay}
                className="w-full bg-coral hover:bg-coral-hover text-white py-6 rounded-[16px] font-semibold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Role-Play
              </Button>
            </div>
          )}
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
              <CardContent className="p-6 space-y-6">
                {/* AI Message */}
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-gray-100">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" />
                    <AvatarFallback className="bg-teal text-white font-semibold">AI</AvatarFallback>
                  </Avatar>
                  <Card className="flex-1 bg-gray-50 border-gray-200 rounded-[20px] rounded-tl-md shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-text-primary leading-relaxed font-body flex-1">
                          you're close. Let's polish the clarity together.
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => speakText("you're close. Let's polish the clarity together.")}
                            className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => translateText("you're close. Let's polish the clarity together.")}
                            className="h-7 w-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy"
                          >
                            <Languages className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback Card */}
                <Card className="bg-gray-50 border-gray-200 rounded-[20px] shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white hover:bg-gray-100 text-navy flex-shrink-0"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <p className="text-base font-medium text-text-primary leading-relaxed font-body flex-1">
                        {transcript || "I work at Microsoft where I handle customer support."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Instruction */}
                <p className="text-sm text-text-secondary font-body text-center px-4">
                  Say it slowly first, then increase your pace. I'm here to help you get it right.
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="py-4 rounded-[16px] font-semibold border-2 border-gray-200 text-text-secondary hover:bg-gray-50 hover:text-navy transition-all active:scale-95"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleContinueFromFeedback}
                    className="py-4 bg-navy hover:bg-navy-hover text-white rounded-[16px] font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
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
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}