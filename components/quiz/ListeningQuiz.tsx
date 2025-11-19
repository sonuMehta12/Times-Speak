// components/quiz/ListeningQuiz.tsx
"use client";

import React, { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import type { ListeningQuestion } from "@/lib/types/quiz";

interface ListeningQuizProps {
  question: ListeningQuestion;
  selectedAnswer: number | null;
  showFeedback: boolean;
  onSelectAnswer: (index: number) => void;
  disabled?: boolean;
}

export function ListeningQuiz({
  question,
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
  disabled = false,
}: ListeningQuizProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const playAudio = () => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    setIsPlaying(true);
    setAudioPlayed(true);

    const utterance = new SpeechSynthesisUtterance(question.audio);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-teal to-teal-hover rounded-[16px] p-3 mb-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            onClick={playAudio}
            disabled={isPlaying || disabled}
            className="w-11 h-11 bg-white hover:bg-white rounded-[12px] flex items-center justify-center hover:scale-105 transition-all shadow-sm flex-shrink-0 disabled:opacity-50"
          >
            {isPlaying ? (
              <div className="w-2.5 h-2.5 bg-teal rounded"></div>
            ) : (
              <Play className="w-5 h-5 text-teal ml-0.5" />
            )}
          </Button>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white/90 mb-1.5 font-medium font-body">
              {audioPlayed ? "Playing..." : "Tap to listen"}
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
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
            disabled={disabled}
            className="text-white hover:text-white hover:bg-white/20 rounded-[10px] h-8 w-8 flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <MultipleChoiceOptions
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={question.correct}
        showFeedback={showFeedback}
        onSelectAnswer={onSelectAnswer}
        disabled={disabled}
      />
    </>
  );
}
