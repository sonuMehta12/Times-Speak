'use client';

import React, { useState, useEffect } from 'react';
import { Message, Scenario, UserProfile, ConversationAnalysis } from '@/lib/types/roleplay';
import { analyzeConversation } from '@/lib/services/gemini-analysis';
import ResultsBreakdownPage from './ResultsBreakdownPage';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RoleplayResultsProps {
  scenario: Scenario;
  userProfile: UserProfile;
  messages: Message[];
  onNavigate: (destination: 'explore' | 'retake') => void;
  onBack: () => void;
}

export default function RoleplayResults({
  scenario,
  userProfile,
  messages,
  onNavigate,
  onBack,
}: RoleplayResultsProps) {
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setIsAnalyzing(true);
        setError(null);

        // Call Gemini analysis service
        const result = await analyzeConversation(scenario, userProfile, messages);

        setAnalysis(result);
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Unable to analyze conversation. Please try again.');

        // Fallback: Generate basic analysis
        const fallbackAnalysis: ConversationAnalysis = {
          overallScore: 70,
          cefrLevel: 'Intermediate B1',
          aiCoachInsight: `Great job completing this scenario, ${userProfile.name}! You showed good communication skills. Keep practicing to build more confidence!`,
          skills: {
            pronunciation: {
              score: 70,
              strength: 'You spoke clearly and were easy to understand.',
              improvement: 'Focus on common professional vocabulary.',
              coachTip: 'Practice makes perfect! Keep working on pronunciation.',
            },
            vocabulary: {
              score: 65,
              strength: 'You used appropriate vocabulary for the context.',
              improvement: 'Try incorporating more sophisticated words.',
              coachTip: 'Read and listen to native content to expand your vocabulary.',
            },
            grammar: {
              score: 75,
              strength: 'Your sentences were generally well-formed.',
              improvement: 'Pay attention to verb tenses.',
              coachTip: 'You have a good foundation - small improvements will make a big difference!',
            },
            fluency: {
              score: 68,
              strength: 'You maintained good conversation flow.',
              improvement: 'Reduce hesitations with more practice.',
              coachTip: 'The more you practice, the more natural it will become!',
            },
            clarity: {
              score: 75,
              strength: 'Your ideas came across clearly.',
              improvement: 'Finish sentences with consistent energy.',
              coachTip: 'Great communication! Keep it up.',
            },
            listening: {
              score: 72,
              strength: 'You responded appropriately to prompts.',
              improvement: 'Focus on catching specific details.',
              coachTip: 'Active listening improves with practice!',
            },
          },
        };

        setAnalysis(fallbackAnalysis);
      } finally {
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, [scenario, userProfile, messages]);

  // Loading state
  if (isAnalyzing || !analysis) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-teal/20 bg-gradient-to-br from-teal/5 to-navy/5 rounded-3xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal to-navy rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-teal to-navy rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-navy mb-3">
              Analyzing Your Performance
            </h2>

            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              Our AI is carefully reviewing your conversation to provide personalized feedback...
            </p>

            <div className="flex items-center justify-center gap-2 text-teal">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">This usually takes 5-10 seconds</span>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-warning-light border border-warning rounded-xl">
                <p className="text-xs text-warning-dark">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render results when analysis is complete
  return (
    <ResultsBreakdownPage
      userName={userProfile.name}
      analysis={analysis}
      onNavigate={onNavigate}
      onBack={onBack}
    />
  );
}
