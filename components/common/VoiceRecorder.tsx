"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VoiceRecorderProps {
  // Mode: 'manual' (tap to stop) or 'auto' (auto-send when done)
  mode?: 'manual' | 'auto';

  // Callback when recording completes with transcript
  onRecordingComplete: (transcript: string) => void;

  // Callback when recording starts (optional)
  onRecordingStart?: () => void;

  // Callback for errors (optional)
  onError?: (error: string) => void;

  // Visual style variant
  variant?: 'default' | 'large' | 'minimal';

  // Custom button text
  buttonText?: string;

  // Disabled state
  disabled?: boolean;

  // Language for recognition
  language?: string; // Default: 'en-US'

  // Show transcript preview while recording (for manual mode)
  showInterimResults?: boolean;

  // Max recording duration in seconds (safety limit)
  maxDuration?: number; // Default: 60 seconds

  // Additional CSS classes
  className?: string;
}

export default function VoiceRecorder({
  mode = 'manual',
  onRecordingComplete,
  onRecordingStart,
  onError,
  variant = 'default',
  buttonText,
  disabled = false,
  language = 'en-US',
  showInterimResults = false,
  maxDuration = 60,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedTranscriptRef = useRef('');
  const forceStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support on mount
  useEffect(() => {
    const checkSupport = () => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
      } else {
        setIsSupported(false);
        console.warn('Web Speech Recognition not supported in this browser');
        if (onError) {
          onError('Speech recognition not supported. Please use Chrome or Edge browser.');
        }
      }
    };

    checkSupport();
  }, [onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      stopTimer();
    };
  }, []);

  // Setup speech recognition
  const setupRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError?.('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return null;
    }

    const recognition = new SpeechRecognition();

    // CRITICAL CONFIG FOR MANUAL MODE
    recognition.continuous = mode === 'manual'; // Manual mode keeps listening
    recognition.interimResults = showInterimResults || mode === 'manual';
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    return recognition;
  };

  // Start timer
  const startTimer = () => {
    setRecordingDuration(0);
    timerRef.current = setInterval(() => {
      setRecordingDuration((prev) => {
        const newDuration = prev + 1;

        // Auto-stop at max duration
        if (newDuration >= maxDuration) {
          stopRecording();
        }

        return newDuration;
      });
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start recording
  const startRecording = () => {
    const recognition = setupRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecording(true);
      accumulatedTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      startTimer();
      onRecordingStart?.();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptText;
        } else {
          interim += transcriptText;
        }
      }

      if (mode === 'manual') {
        // Manual mode: accumulate transcript in ref (always has current value)
        if (final) {
          accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? ' ' : '') + final;
          setTranscript(accumulatedTranscriptRef.current); // Update state for display
        }
        setInterimTranscript(interim);
      } else {
        // Auto mode: accumulate in ref for fallback, send immediately if final
        if (final) {
          accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? ' ' : '') + final;
          onRecordingComplete(final.trim());
          setIsRecording(false);
          stopTimer();
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      stopTimer();

      // Provide user-friendly error messages
      let errorMessage = 'Speech recognition error';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not detected. Please check your microphone.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      }

      onError?.(errorMessage);
    };

    recognition.onend = () => {
      // Clear forced stop timeout if it exists
      if (forceStopTimeoutRef.current) {
        clearTimeout(forceStopTimeoutRef.current);
        forceStopTimeoutRef.current = null;
      }

      setIsRecording(false);
      stopTimer();

      // Use ref value which always has the current accumulated transcript
      const currentTranscript = accumulatedTranscriptRef.current.trim();

      if (currentTranscript) {
        // Send whatever was accumulated (works for both manual and auto modes)
        onRecordingComplete(currentTranscript);
      }

      // Clear everything for next recording
      accumulatedTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
      onError?.('Failed to start recording. Please try again.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }

      // Force stop after 500ms if onend doesn't fire
      forceStopTimeoutRef.current = setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          stopTimer();
          setInterimTranscript('');
          const finalTranscript = accumulatedTranscriptRef.current.trim();
          if (finalTranscript && onRecordingComplete) {
            onRecordingComplete(finalTranscript);
          }
          accumulatedTranscriptRef.current = '';
          setTranscript('');
        }
      }, 500);
    }
  };

  // Handle mic button click
  const handleMicClick = () => {
    if (isRecording) {
      // Stop and send
      stopRecording();
    } else {
      // Start recording
      startRecording();
    }
  };

  // Get button size classes based on variant
  const getButtonSize = () => {
    switch (variant) {
      case 'large':
        return 'h-14 w-14';
      case 'minimal':
        return 'h-10 w-10';
      case 'default':
      default:
        return 'h-12 w-12';
    }
  };

  // Get icon size classes based on variant
  const getIconSize = () => {
    switch (variant) {
      case 'large':
        return 'h-6 w-6';
      case 'minimal':
        return 'h-4 w-4';
      case 'default':
      default:
        return 'h-5 w-5';
    }
  };

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-sm text-error">
          Voice recording is not supported in this browser.
          <br />
          Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <button
        onClick={handleMicClick}
        disabled={disabled}
        className={cn(
          'flex flex-col items-center gap-1.5',
          'transition-all',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        type="button"
      >
        <div
          className={cn(
            'rounded-full flex items-center justify-center shadow-lg',
            'transition-all',
            getButtonSize(),
            isRecording
              ? 'bg-error text-white shadow-error/30 animate-pulse'
              : 'bg-teal text-white shadow-teal/30 hover:bg-teal-hover'
          )}
        >
          {isRecording ? (
            <Square className={getIconSize()} />
          ) : (
            <Mic className={getIconSize()} />
          )}
        </div>

        <span className="text-xs font-semibold text-text-secondary">
          {isRecording
            ? `Stop (${formatDuration(recordingDuration)})`
            : buttonText || 'Speak'}
        </span>
      </button>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 mt-1 animate-fade-in">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
          <span className="text-xs text-error font-medium">Recording...</span>
        </div>
      )}

      {/* Show transcript while recording or after */}
      {(transcript || interimTranscript) && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
          {transcript && (
            <p className="text-sm text-navy font-medium">{transcript}</p>
          )}
          {interimTranscript && (
            <p className="text-sm text-gray-400 italic mt-1">{interimTranscript}</p>
          )}
        </div>
      )}

      {/* Unsupported browser message */}
      {!isSupported && (
        <div className="text-xs text-red-500 mt-2 text-center max-w-xs">
          Voice input not supported in this browser. Please use Chrome or Edge.
        </div>
      )}
    </div>
  );
}
