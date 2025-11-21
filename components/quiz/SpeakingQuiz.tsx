// components/quiz/SpeakingQuiz.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Volume2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SpeakingQuestion, PronunciationFeedback, SpeechRecognition } from "@/lib/types/quiz";

interface SpeakingQuizProps {
  question: SpeakingQuestion;
  showFeedback: boolean;
  onSubmitAnswer: (feedback: PronunciationFeedback, isCorrect: boolean) => void;
  disabled?: boolean;
}

export function SpeakingQuiz({
  question,
  showFeedback,
  onSubmitAnswer,
  disabled = false,
}: SpeakingQuizProps) {
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState<number | null>(null);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'feedback'>('idle');
  const [speakingFeedback, setSpeakingFeedback] = useState<PronunciationFeedback | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedPhraseIndex !== null) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          setRecordingState('recording');
        };

        recognitionInstance.onresult = (event) => {
          // Clear any existing timeout
          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = null;
          }

          const spokenText = event.results[0][0].transcript;
          const targetPhrase = question.options[selectedPhraseIndex].replace(/_+/g, '').trim();
          analyzePronunciation(spokenText, targetPhrase);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);

          // Clear timeout on error
          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = null;
          }

          // Handle specific errors
          if (event.error === 'no-speech') {
            alert("No speech detected. Please try again and speak clearly.");
          } else if (event.error === 'not-allowed') {
            alert("Microphone access denied. Please enable it in your browser settings.");
          } else {
            alert(`Speech recognition error: ${event.error}. Please try again.`);
          }

          setRecordingState('idle');
        };

        recognitionInstance.onend = () => {
          // Don't change state here - let onresult or timeout handle it
          // This prevents getting stuck in processing state
        };

        recognitionRef.current = recognitionInstance;
      }
    }

    // Cleanup on unmount
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedPhraseIndex]);

  const analyzePronunciation = (spoken: string, target: string) => {
    const spokenWords = spoken.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
    const targetWords = target.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);

    let correctWords = 0;
    const wordScores = targetWords.map((targetWord, index) => {
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
    if (overallScore === 100) generalFeedback = "Perfect pronunciation!";
    else if (overallScore >= 80) generalFeedback = "Excellent! Very close to the target.";
    else if (overallScore >= 50) generalFeedback = "Good effort! A few words to work on.";
    else generalFeedback = "Keep practicing! You can do it.";

    const feedback: PronunciationFeedback = {
      overallScore,
      wordScores,
      generalFeedback,
      transcript: spoken
    };

    setSpeakingFeedback(feedback);
    setRecordingState('feedback');
    onSubmitAnswer(feedback, overallScore >= 70);
  };

  const handleStartRecording = async () => {
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

  const handleStopRecording = () => {
    if (recognitionRef.current && recordingState === 'recording') {
      setRecordingState('processing');
      recognitionRef.current.stop();

      // Add timeout fallback: if processing takes more than 5 seconds, show error
      processingTimeoutRef.current = setTimeout(() => {
        console.error('Speech recognition timeout - no result received');
        setRecordingState('idle');
        alert("Processing timed out. Please try speaking again.");
      }, 5000);
    }
  };

  const playPhrase = () => {
    if (selectedPhraseIndex === null) {
      alert("Please select a phrase first!");
      return;
    }
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }
    const targetPhrase = question.options[selectedPhraseIndex].replace(/_+/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Phrase Selection */}
      <Card className="bg-navy/5 rounded-[20px] p-5 mb-5 border-gray-200">
        <p className="text-sm text-text-secondary mb-3 font-semibold font-body">
          {question.prompt}
        </p>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !disabled && !showFeedback && setSelectedPhraseIndex(index)}
              disabled={disabled || showFeedback}
              className={`w-full flex items-start gap-2 p-3 rounded-[16px] border-2 transition-all ${
                selectedPhraseIndex === index
                  ? 'bg-teal/10 border-teal'
                  : 'bg-white border-gray-200 hover:border-teal/50'
              } ${disabled || showFeedback ? 'cursor-not-allowed opacity-50' : ''}`}
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

      {/* Listen Button */}
      {selectedPhraseIndex !== null && !showFeedback && (
        <div className="mb-4 text-center">
          <button
            onClick={playPhrase}
            disabled={disabled}
            className="bg-teal/10 text-teal py-2 px-4 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-teal/20 transition-colors mx-auto disabled:opacity-50"
          >
            <Volume2 className="h-4 w-4" /> Listen to phrase
          </button>
        </div>
      )}

      {/* Recording Interface */}
      {!showFeedback && (
        <div className="text-center py-4">
          {recordingState === 'recording' ? (
            <Button
              onClick={handleStopRecording}
              disabled={disabled}
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
              onClick={handleStartRecording}
              disabled={selectedPhraseIndex === null || disabled}
              className={`w-24 h-24 rounded-[24px] flex items-center justify-center mx-auto mb-5 transition-all shadow-md ${
                selectedPhraseIndex === null || disabled
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

          {/* Waveform Animation */}
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

      {/* Speaking Feedback */}
      {showFeedback && speakingFeedback && (
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
    </>
  );
}
