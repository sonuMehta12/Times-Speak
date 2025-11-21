'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Languages, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  children: React.ReactNode;
  translation?: string;
  autoPlay?: boolean;
  showSpeakerIcon?: boolean;
  showTranslationIcon?: boolean;
  translationLanguage?: string;
  className?: string;
  avatarVariant?: 'ai' | 'sparkles' | 'custom';
  customAvatarContent?: React.ReactNode;
}

/**
 * Reusable Message Bubble Component
 *
 * Features:
 * - Auto-playback on mount (configurable)
 * - Speaker icon for manual playback/stop
 * - Translation toggle icon
 * - Smooth animations
 * - Fully configurable via props
 */
export default function MessageBubble({
  children,
  translation,
  autoPlay = false,
  showSpeakerIcon = true,
  showTranslationIcon = true,
  translationLanguage = 'Hindi',
  className = '',
  avatarVariant = 'sparkles',
  customAvatarContent,
}: MessageBubbleProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoPlayedRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Convert children to text for TTS
  const getTextContent = (content: React.ReactNode): string => {
    if (typeof content === 'string') return content;
    if (typeof content === 'number') return String(content);
    if (React.isValidElement(content)) {
      return getTextContent(content.props.children);
    }
    if (Array.isArray(content)) {
      return content.map(getTextContent).join(' ');
    }
    return '';
  };

  const textContent = getTextContent(children);

  // Auto-play when text content changes
  useEffect(() => {
    if (autoPlay && textContent) {
      // Reset the ref when text changes
      hasAutoPlayedRef.current = false;

      if (!hasAutoPlayedRef.current) {
        hasAutoPlayedRef.current = true;
        // Small delay to ensure smooth UI rendering
        const timeout = setTimeout(() => {
          handlePlayAudio();
        }, 300);

        return () => clearTimeout(timeout);
      }
    }

    // Cleanup on unmount
    return () => {
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textContent, autoPlay]);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
    utteranceRef.current = null;
  };

  const handlePlayAudio = async () => {
    // If already playing, stop it
    if (isPlaying) {
      stopAudio();
      return;
    }

    // Check browser support
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Browser does not support Speech Synthesis');
      return;
    }

    try {
      setIsLoading(true);

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(textContent);
      utteranceRef.current = utterance;

      // Configure voice settings
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to use a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (v) => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsLoading(false);
        utteranceRef.current = null;
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const toggleTranslation = () => {
    setShowTranslation((prev) => !prev);
  };

  const renderAvatar = () => {
    if (customAvatarContent) {
      return (
        <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-gold">
          <AvatarFallback className="bg-gradient-to-br from-gold to-gold-hover">
            {customAvatarContent}
          </AvatarFallback>
        </Avatar>
      );
    }

    switch (avatarVariant) {
      case 'ai':
        return (
          <Avatar className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-teal to-teal-400">
            <AvatarFallback className="text-white font-bold">AI</AvatarFallback>
          </Avatar>
        );
      case 'sparkles':
      default:
        return (
          <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-gold">
            <AvatarFallback className="bg-gradient-to-br from-gold to-gold-hover">
              <Sparkles className="w-5 h-5 text-white" />
            </AvatarFallback>
          </Avatar>
        );
    }
  };

  return (
    <div className={`animate-fade-in-up ${className}`}>
      <div className="flex items-start gap-3 mb-6">
        {renderAvatar()}
        <div className="flex-1">
          <Card className="border-gray-200 rounded-[20px] rounded-tl-none bg-gray-50 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-text-primary leading-relaxed font-body mb-3">
                {children}
              </p>

              {/* Action Buttons */}
              {(showSpeakerIcon || (showTranslationIcon && translation)) && (
                <div className="flex gap-2">
                  {/* Speaker/Listen Button */}
                  {showSpeakerIcon && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayAudio}
                      className="h-8 px-3 text-xs hover:bg-gray-200 transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : isPlaying ? (
                        <Square className="h-3 w-3 mr-1 fill-current" />
                      ) : (
                        <Volume2 className="h-3 w-3 mr-1" />
                      )}
                      {isLoading ? 'Loading...' : isPlaying ? 'Stop' : 'Listen'}
                    </Button>
                  )}

                  {/* Translation Button */}
                  {showTranslationIcon && translation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTranslation}
                      className="h-8 px-3 text-xs hover:bg-gray-200 transition-colors"
                    >
                      <Languages className="h-3 w-3 mr-1" />
                      {showTranslation ? 'Hide' : translationLanguage}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Translation Display */}
          {showTranslation && translation && (
            <div className="mt-2 text-sm text-text-secondary italic bg-indigo-50/50 border border-indigo-100 px-4 py-2 rounded-[20px] rounded-tl-none animate-fade-in">
              <span className="font-semibold text-xs text-teal uppercase mr-1">
                {translationLanguage}:
              </span>
              {translation}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
