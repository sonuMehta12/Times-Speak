// components/roleplay/ScenarioGuide.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Eye,
  EyeOff,
  MessageSquare,
  Target,
  Loader2,
  SkipForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scenario, UserProfile } from '@/lib/types/roleplay';
import { streamSpeech, speakWithBrowserTTS } from '@/lib/services/gemini';

interface ScenarioGuideProps {
  scenario: Scenario;
  userProfile: UserProfile;
  onStart: () => void;
  onBack: () => void;
}

export default function ScenarioGuide({ scenario, userProfile, onStart, onBack }: ScenarioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(-1);
  const [showTranslations, setShowTranslations] = useState(false);
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
    if (isPlaying) {
      stopAudio();
      return;
    }

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
  };

  // Skip to next turn
  const skipToNext = () => {
    if (currentTurnIndex < scenario.exampleConversation.length - 1) {
      stopAudio();
      setCurrentTurnIndex(currentTurnIndex + 1);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary pb-6">
      {/* Header */}
      <div className="bg-navy text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold">{scenario.title}</h1>
            <p className="text-sm text-white/80">{scenario.description}</p>
          </div>
        </div>

        {/* Objective Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-gold rounded-full p-2">
                <Target className="h-4 w-4 text-navy" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Learning Objective</h3>
                <p className="text-sm text-white/90">{scenario.learningObjective}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listen Mode Instructions */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-teal/10 to-navy/5 border border-teal/20 rounded-[16px] p-4 mb-4">
          <h3 className="font-display font-bold text-navy mb-2 flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-teal" />
            Listen Mode
          </h3>
          <p className="text-sm text-text-secondary">
            First, listen to the perfect conversation. Pay attention to pronunciation, phrasing, and flow. You'll practice
            this yourself next!
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={playConversation}
            className={`flex-1 rounded-[16px] h-12 font-semibold ${
              isPlaying ? 'bg-coral hover:bg-coral/90' : 'bg-navy hover:bg-navy/90'
            } text-white`}
          >
            {isLoadingAudio ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading Audio...
              </>
            ) : isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2 fill-current" />
                Play Conversation
              </>
            )}
          </Button>

          {isPlaying && (
            <Button
              onClick={skipToNext}
              variant="outline"
              className="rounded-[16px] h-12 border-gray-200"
              disabled={currentTurnIndex >= scenario.exampleConversation.length - 1}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          )}

          <Button
            onClick={() => setShowTranslations(!showTranslations)}
            variant="outline"
            className="rounded-[16px] h-12 border-gray-200"
          >
            {showTranslations ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>

        {/* Conversation Display */}
        <div className="space-y-4">
          {scenario.exampleConversation.map((turn, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ${
                currentTurnIndex === index ? 'scale-[1.02]' : currentTurnIndex > index ? 'opacity-60' : 'opacity-40'
              }`}
            >
              <Card
                className={`border-gray-200 rounded-[16px] overflow-hidden ${
                  currentTurnIndex === index ? 'ring-2 ring-teal shadow-lg' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        turn.speaker === 'Agent' ? 'bg-navy/10' : 'bg-gold/10'
                      }`}
                    >
                      <MessageSquare className={`h-5 w-5 ${turn.speaker === 'Agent' ? 'text-navy' : 'text-gold'}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={`${
                            turn.speaker === 'Agent' ? 'bg-navy text-white' : 'bg-gold text-navy'
                          } border-0 rounded-[8px] text-xs`}
                        >
                          {turn.speaker === 'Agent' ? scenario.role : 'You'}
                        </Badge>
                        {currentTurnIndex === index && isLoadingAudio && (
                          <Loader2 className="h-4 w-4 text-teal animate-spin" />
                        )}
                      </div>

                      <p className="text-text-primary font-medium mb-2">{turn.text}</p>

                      {showTranslations && (
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-[12px] p-3 mt-2">
                          <p className="text-sm text-text-secondary italic">
                            <span className="font-semibold text-xs text-teal uppercase mr-1">
                              {userProfile.nativeLanguage}:
                            </span>
                            {turn.translation}
                          </p>
                        </div>
                      )}

                      {turn.explanation && (
                        <div className="bg-amber-50 border border-amber-100 rounded-[12px] p-3 mt-2">
                          <p className="text-xs text-amber-700">
                            <span className="font-semibold">Tip:</span> {turn.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Start Practice Button */}
        <div className="mt-8">
          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-teal to-navy text-white hover:opacity-90 rounded-[16px] h-14 font-bold text-base shadow-lg"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Ready! Start Role-Play Practice
          </Button>
        </div>
      </div>
    </div>
  );
}
