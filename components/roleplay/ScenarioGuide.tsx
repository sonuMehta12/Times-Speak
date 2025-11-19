// components/roleplay/ScenarioGuide.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Target,
  Volume2,
  SkipForward,
  MessageSquare,
  Loader2,
  Play,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Scenario, UserProfile } from '@/lib/types/roleplay';
import { streamSpeech, speakWithBrowserTTS } from '@/lib/services/gemini';

interface ScenarioGuideProps {
  scenario: Scenario;
  userProfile: UserProfile;
  onStart: () => void;
  onBack: () => void;
}

type ViewMode = 'preview' | 'listen' | 'completed';

export default function ScenarioGuide({ scenario, userProfile, onStart, onBack }: ScenarioGuideProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(-1);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    return audioCtxRef.current;
  };

  // Auto-scroll to current message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentTurnIndex]);

  // Stop audio playback
  const stopAudio = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (audioCtxRef.current) {
      audioCtxRef.current.suspend();
      audioCtxRef.current = null;
    }
  };

  // Play audio for a single turn using Gemini TTS with browser fallback
  const playTurnAudio = async (text: string, speaker: 'Agent' | 'Learner'): Promise<void> => {
    const voiceName = speaker === 'Agent' ? 'Kore' : 'Puck';

    try {
      // Try Gemini TTS first
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();

      const streamResponse = await streamSpeech(text, voiceName);
      let nextStartTime = ctx.currentTime + 0.05;

      for await (const chunk of streamResponse) {
        if (!isPlayingRef.current) return; // Stop if user paused

        const base64Audio = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          // Decode base64 to bytes
          const binaryString = atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Convert to AudioBuffer (PCM 16-bit to Float32)
          const dataInt16 = new Int16Array(bytes.buffer);
          const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < dataInt16.length; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
          }

          // Schedule playback
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);

          const start = Math.max(ctx.currentTime, nextStartTime);
          source.start(start);
          nextStartTime = start + buffer.duration;
        }
      }

      // Wait for audio to finish
      const duration = Math.max(0, nextStartTime - ctx.currentTime);
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
    } catch (error) {
      console.error('Gemini TTS failed, using browser TTS fallback:', error);
      // Fallback to browser TTS
      try {
        await speakWithBrowserTTS(text, 'en-US');
      } catch (fallbackError) {
        console.error('Browser TTS also failed:', fallbackError);
      }
    }
  };

  // Play through the entire conversation
  const playConversation = async () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsLoadingAudio(true);
    setCurrentTurnIndex(0);

    for (let i = 0; i < scenario.exampleConversation.length; i++) {
      if (!isPlayingRef.current) break;

      setCurrentTurnIndex(i);
      const turn = scenario.exampleConversation[i];

      setIsLoadingAudio(true);
      await playTurnAudio(turn.text, turn.speaker);
      setIsLoadingAudio(false);

      // Pause between turns
      if (isPlayingRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsLoadingAudio(false);
    setViewMode('completed');
  };

  // Start listening
  const handleListen = () => {
    setViewMode('listen');
    setTimeout(() => {
      playConversation();
    }, 300);
  };

  // Listen again
  const handleListenAgain = () => {
    setCurrentTurnIndex(-1);
    stopAudio();
    setTimeout(() => {
      playConversation();
    }, 300);
  };

  // Skip to practice
  const handleSkip = () => {
    stopAudio();
    onStart();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // PREVIEW VIEW
  if (viewMode === 'preview') {
    return (
      <div className="min-h-screen bg-bg-primary">
        {/* Sticky Header with Title */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-navy hover:bg-navy/10 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-lg font-bold text-navy flex-1">
              {scenario.title}
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-64 bg-gradient-to-br from-navy/5 to-teal/5">
          <img
            src={scenario.image}
            alt={scenario.title}
            className="w-full h-full object-cover"
          />
          {scenario.badge && (
            <Badge
              className={`absolute top-4 left-4 ${
                scenario.badgeColor === 'gold'
                  ? 'bg-gold text-navy'
                  : scenario.badgeColor === 'coral'
                  ? 'bg-coral text-white'
                  : 'bg-teal text-white'
              } border-0 rounded-[12px] shadow-md font-semibold`}
            >
              {scenario.badge}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="px-4 py-6 pb-32">

          {/* Learning Objective Card */}
          <Card className="mb-8 border-gold/30 bg-gradient-to-br from-gold/5 to-navy/5 rounded-[24px] overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-gold flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    Learning Objective
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {scenario.learningObjective}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listen Mode Info */}
          <Card className="mb-6 border-teal/20 bg-gradient-to-br from-teal/5 to-navy/5 rounded-[24px] overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-teal flex items-center justify-center flex-shrink-0">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    Listen Mode
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    First, listen to the perfect conversation. Pay attention to pronunciation, phrasing, and flow. You'll practice this yourself next!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleListen}
              className="w-full bg-navy text-white hover:bg-navy/90 rounded-[16px] h-14 font-bold text-base shadow-lg"
            >
              <Play className="h-5 w-5 mr-2 fill-current" />
              Listen to Conversation
            </Button>

            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full border-2 border-navy text-navy hover:bg-navy/5 rounded-[16px] h-14 font-semibold text-base"
            >
              <SkipForward className="h-5 w-5 mr-2" />
              Skip & Start Practice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // LISTEN MODE VIEW
  if (viewMode === 'listen') {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-navy hover:bg-navy/10 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-display text-lg font-bold text-navy">{scenario.title}</h2>
              <p className="text-xs text-text-secondary">Listen Mode</p>
            </div>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-navy hover:bg-navy/10 rounded-[12px] font-semibold text-sm"
            >
              <SkipForward className="h-4 w-4 mr-1.5" />
              Skip
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-bg-card px-4 py-6 pb-32">
          <div className="space-y-8">
            {scenario.exampleConversation.map((turn, index) => {
              const isVisible = index <= currentTurnIndex;
              const isActive = index === currentTurnIndex;

              if (!isVisible) return null;

              const isAgent = turn.speaker === 'Agent';

              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 animate-fade-in ${
                    !isAgent ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar
                    className={`w-10 h-10 flex-shrink-0 ${
                      isAgent
                        ? 'bg-gradient-to-br from-teal to-teal-400'
                        : 'bg-gradient-to-br from-gold to-gold-hover'
                    }`}
                  >
                    <AvatarFallback className="text-white font-bold">
                      {isAgent ? 'AI' : 'You'}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 max-w-[80%] ${!isAgent ? 'flex flex-col items-end' : ''}`}>
                    <Card
                      className={`${
                        isAgent
                          ? 'bg-white border-gray-200'
                          : 'bg-navy text-white border-navy'
                      } rounded-[20px] ${
                        isAgent ? 'rounded-tl-lg' : 'rounded-tr-lg'
                      } shadow-sm ${isActive ? 'ring-2 ring-teal' : ''}`}
                    >
                      <CardContent className="p-4">
                        <p className={`text-sm leading-relaxed ${isAgent ? 'text-text-primary' : 'text-white'}`}>
                          {turn.text}
                        </p>
                        {isActive && isLoadingAudio && (
                          <div className="flex items-center gap-2 mt-2">
                            <Loader2 className="h-4 w-4 text-teal animate-spin" />
                            <span className="text-xs text-teal">Playing...</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Translation hint */}
                    {turn.translation && isVisible && (
                      <div className="mt-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-[12px] max-w-full">
                        <p className="text-xs text-text-secondary italic">
                          <span className="font-semibold text-teal">Hindi:</span> {turn.translation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    );
  }

  // COMPLETED VIEW
  if (viewMode === 'completed') {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-navy hover:bg-navy/10 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-display text-lg font-bold text-navy">{scenario.title}</h2>
              <p className="text-xs text-text-secondary">Conversation Complete</p>
            </div>
          </div>
        </div>

        {/* Messages (same as listen mode) */}
        <div className="flex-1 overflow-y-auto bg-bg-card px-4 py-6 pb-32">
          <div className="space-y-8">
            {scenario.exampleConversation.map((turn, index) => {
              const isAgent = turn.speaker === 'Agent';

              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    !isAgent ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar
                    className={`w-10 h-10 flex-shrink-0 ${
                      isAgent
                        ? 'bg-gradient-to-br from-teal to-teal-400'
                        : 'bg-gradient-to-br from-gold to-gold-hover'
                    }`}
                  >
                    <AvatarFallback className="text-white font-bold">
                      {isAgent ? 'AI' : 'You'}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 max-w-[80%] ${!isAgent ? 'flex flex-col items-end' : ''}`}>
                    <Card
                      className={`${
                        isAgent
                          ? 'bg-white border-gray-200'
                          : 'bg-navy text-white border-navy'
                      } rounded-[20px] ${
                        isAgent ? 'rounded-tl-lg' : 'rounded-tr-lg'
                      } shadow-sm`}
                    >
                      <CardContent className="p-4">
                        <p className={`text-sm leading-relaxed ${isAgent ? 'text-text-primary' : 'text-white'}`}>
                          {turn.text}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-teal to-navy text-white hover:opacity-90 rounded-[16px] h-14 font-bold text-base shadow-lg"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Start Practice Role-Play
          </Button>

          <Button
            onClick={handleListenAgain}
            variant="outline"
            className="w-full border-2 border-navy text-navy hover:bg-navy/5 rounded-[16px] h-12 font-semibold"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Listen Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
