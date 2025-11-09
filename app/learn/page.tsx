"use client";

import React, { useState } from 'react';
import { ArrowLeft, Check, Lock, Star, Play, Trophy, Target, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  status: 'completed' | 'current' | 'locked';
  xp: number;
}

interface Unit {
  id: number;
  title: string;
  description: string;
  emoji: string;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
  isUnlocked: boolean;
}

const learningPathData: Unit[] = [
  {
    id: 1,
    title: "Essential Greetings",
    description: "Start conversations confidently in any situation",
    emoji: "👋",
    totalLessons: 4,
    completedLessons: 2,
    isUnlocked: true,
    lessons: [
      { 
        id: '1a', 
        title: "Breaking the Ice", 
        subtitle: "Master \"How's it going?\" and casual greetings",
        duration: "8 min",
        status: 'completed',
        xp: 50
      },
      { 
        id: '1b', 
        title: "Professional Introductions", 
        subtitle: "Learn to introduce yourself at work",
        duration: "10 min",
        status: 'completed',
        xp: 50
      },
      { 
        id: '1c', 
        title: "Making Small Talk", 
        subtitle: "Keep conversations flowing naturally",
        duration: "12 min",
        status: 'current',
        xp: 75
      },
      { 
        id: '1d', 
        title: "Ending Conversations Politely", 
        subtitle: "Say goodbye without awkwardness",
        duration: "8 min",
        status: 'locked',
        xp: 50
      },
    ]
  },
  {
    id: 2,
    title: "Dining Out",
    description: "Order with confidence at any restaurant",
    emoji: "🍽️",
    totalLessons: 5,
    completedLessons: 0,
    isUnlocked: false,
    lessons: [
      { 
        id: '2a', 
        title: "Reading the Menu", 
        subtitle: "Understand restaurant vocabulary",
        duration: "10 min",
        status: 'locked',
        xp: 50
      },
      { 
        id: '2b', 
        title: "Ordering Your Meal", 
        subtitle: "Express preferences and dietary needs",
        duration: "12 min",
        status: 'locked',
        xp: 75
      },
      { 
        id: '2c', 
        title: "Making Special Requests", 
        subtitle: "Customize your order politely",
        duration: "8 min",
        status: 'locked',
        xp: 50
      },
      { 
        id: '2d', 
        title: "Handling Problems", 
        subtitle: "Address issues with your order",
        duration: "10 min",
        status: 'locked',
        xp: 75
      },
      { 
        id: '2e', 
        title: "Paying the Bill", 
        subtitle: "Settle the check like a native",
        duration: "8 min",
        status: 'locked',
        xp: 50
      },
    ]
  },
  {
    id: 3,
    title: "Travel Essentials",
    description: "Navigate airports, hotels, and transportation",
    emoji: "✈️",
    totalLessons: 6,
    completedLessons: 0,
    isUnlocked: false,
    lessons: [
      { 
        id: '3a', 
        title: "At the Airport", 
        subtitle: "Check-in, security, and boarding phrases",
        duration: "15 min",
        status: 'locked',
        xp: 100
      },
      { 
        id: '3b', 
        title: "Hotel Check-in", 
        subtitle: "Book rooms and make requests",
        duration: "12 min",
        status: 'locked',
        xp: 75
      },
      { 
        id: '3c', 
        title: "Asking for Directions", 
        subtitle: "Find your way in a new city",
        duration: "10 min",
        status: 'locked',
        xp: 50
      },
      { 
        id: '3d', 
        title: "Using Public Transport", 
        subtitle: "Navigate buses, trains, and subways",
        duration: "10 min",
        status: 'locked',
        xp: 50
      },
      { 
        id: '3e', 
        title: "Taking Taxis", 
        subtitle: "Give clear directions to drivers",
        duration: "8 min",
        status: 'locked',
        xp: 50
      },
      { 
        id: '3f', 
        title: "Emergency Situations", 
        subtitle: "Get help when you need it most",
        duration: "12 min",
        status: 'locked',
        xp: 75
      },
    ]
  },
  {
    id: 4,
    title: "Business Meetings",
    description: "Communicate professionally in the workplace",
    emoji: "💼",
    totalLessons: 5,
    completedLessons: 0,
    isUnlocked: false,
    lessons: [
      { 
        id: '4a', 
        title: "Opening a Meeting", 
        subtitle: "Start professional discussions",
        duration: "10 min",
        status: 'locked',
        xp: 75
      },
      { 
        id: '4b', 
        title: "Expressing Opinions", 
        subtitle: "Share ideas diplomatically",
        duration: "12 min",
        status: 'locked',
        xp: 75
      },
      { 
        id: '4c', 
        title: "Agreeing & Disagreeing", 
        subtitle: "Navigate different viewpoints",
        duration: "10 min",
        status: 'locked',
        xp: 50
      },
      { 
        id: '4d', 
        title: "Making Suggestions", 
        subtitle: "Propose solutions effectively",
        duration: "10 min",
        status: 'locked',
        xp: 50
      },
      { 
        id: '4e', 
        title: "Closing & Action Items", 
        subtitle: "End meetings with clear next steps",
        duration: "8 min",
        status: 'locked',
        xp: 50
      },
    ]
  },
];

const LessonCard: React.FC<{ lesson: Lesson; unitEmoji: string; onStart: () => void }> = ({ 
  lesson, 
  unitEmoji,
  onStart 
}) => {
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';
  const isCurrent = lesson.status === 'current';

  return (
    <Card 
      className={`overflow-hidden transition-all border-2 rounded-[20px] ${
        isLocked 
          ? 'bg-gray-50 border-gray-200 opacity-60' 
          : isCurrent
          ? 'bg-gradient-to-br from-gold/10 to-gold/5 border-gold shadow-md hover:shadow-lg hover:-translate-y-1'
          : 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-1'
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-14 h-14 rounded-[16px] flex items-center justify-center ${
            isLocked 
              ? 'bg-gray-200' 
              : isCompleted
              ? 'bg-teal text-white'
              : isCurrent
              ? 'bg-gold text-navy'
              : 'bg-navy/10 text-navy'
          }`}>
            {isLocked ? (
              <Lock className="h-6 w-6 text-gray-400" />
            ) : isCompleted ? (
              <Check className="h-7 w-7" />
            ) : isCurrent ? (
              <Star className="h-7 w-7" />
            ) : (
              <span className="text-2xl">{unitEmoji}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`font-bold text-base leading-tight ${
                isLocked ? 'text-gray-400' : 'text-navy'
              }`}>
                {lesson.title}
              </h4>
              {isCurrent && (
                <Badge className="bg-gold text-navy border-0 rounded-full px-2 py-0.5 text-xs font-bold flex-shrink-0">
                  NEXT
                </Badge>
              )}
              {isCompleted && (
                <Badge className="bg-teal/10 text-teal border-0 rounded-full px-2 py-0.5 text-xs font-bold flex-shrink-0">
                  DONE
                </Badge>
              )}
            </div>
            
            <p className={`text-sm mb-3 ${
              isLocked ? 'text-gray-400' : 'text-text-secondary'
            }`}>
              {lesson.subtitle}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  {lesson.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  +{lesson.xp} XP
                </span>
              </div>

              <Button
                onClick={onStart}
                disabled={isLocked}
                size="sm"
                className={`h-8 rounded-full font-semibold text-xs px-4 ${
                  isLocked
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200'
                    : isCurrent
                    ? 'bg-coral text-white hover:bg-coral-hover shadow-sm'
                    : isCompleted
                    ? 'bg-teal/10 text-teal hover:bg-teal/20'
                    : 'bg-navy text-white hover:bg-navy-hover'
                }`}
              >
                {isCompleted ? 'Review' : isCurrent ? 'Continue' : isLocked ? 'Locked' : 'Start'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UnitSection: React.FC<{ 
  unit: Unit; 
  isExpanded: boolean; 
  onToggle: () => void;
  onStartLesson: (lessonId: string) => void;
}> = ({ 
  unit, 
  isExpanded, 
  onToggle,
  onStartLesson 
}) => {
  const progress = (unit.completedLessons / unit.totalLessons) * 100;

  return (
    <div className="mb-6 animate-fade-in-up">
      {/* Unit Header Card */}
      <Card 
        className={`overflow-hidden border-2 rounded-[24px] cursor-pointer transition-all ${
          unit.isUnlocked
            ? 'bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1'
            : 'bg-gray-50 border-gray-200 opacity-70'
        }`}
        onClick={unit.isUnlocked ? onToggle : undefined}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Emoji */}
            <div className={`flex-shrink-0 w-16 h-16 rounded-[16px] flex items-center justify-center text-3xl ${
              unit.isUnlocked ? 'bg-navy/10' : 'bg-gray-200'
            }`}>
              {unit.isUnlocked ? unit.emoji : <Lock className="h-7 w-7 text-gray-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h3 className={`font-display font-bold text-lg mb-1 ${
                    unit.isUnlocked ? 'text-navy' : 'text-gray-400'
                  }`}>
                    {unit.title}
                  </h3>
                  <p className={`text-sm ${
                    unit.isUnlocked ? 'text-text-secondary' : 'text-gray-400'
                  }`}>
                    {unit.description}
                  </p>
                </div>
                {unit.isUnlocked && (
                  <ChevronRight className={`h-5 w-5 text-text-tertiary transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`} />
                )}
              </div>

              {/* Progress Bar */}
              {unit.isUnlocked && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                    <span className="font-medium">
                      {unit.completedLessons} of {unit.totalLessons} lessons
                    </span>
                    <span className="font-bold text-teal">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {!unit.isUnlocked && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Complete previous unit to unlock</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      {isExpanded && unit.isUnlocked && (
        <div className="mt-4 space-y-3 pl-4 border-l-2 border-gold/30 ml-8">
          {unit.lessons.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              unitEmoji={unit.emoji}
              onStart={() => onStartLesson(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function LearnPage() {
  const userName = "John";
  const [expandedUnitId, setExpandedUnitId] = useState<number | null>(1);

  const handleBack = () => {
    window.history.back();
  };

  const handleToggleUnit = (unitId: number) => {
    setExpandedUnitId(expandedUnitId === unitId ? null : unitId);
  };

  const handleStartLesson = (lessonId: string) => {
    console.log('Start lesson:', lessonId);
    // Navigate to lesson page
  };

  // Calculate overall progress
  const totalLessons = learningPathData.reduce((sum, unit) => sum + unit.totalLessons, 0);
  const completedLessons = learningPathData.reduce((sum, unit) => sum + unit.completedLessons, 0);
  const overallProgress = (completedLessons / totalLessons) * 100;

  return (
    <div className="w-full">
    
      {/* Overall Progress Card */}
      <Card className="mb-6 bg-gradient-to-br from-navy to-navy-hover text-white rounded-[24px] shadow-lg border-2 border-navy animate-fade-in-up">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Your Progress</p>
              <h2 className="font-display text-3xl font-bold">
                {completedLessons}/{totalLessons}
              </h2>
              <p className="text-sm opacity-90 mt-1">Lessons Completed</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-[16px] p-3">
              <Trophy className="h-8 w-8 text-gold" />
            </div>
          </div>
          
          <div className="relative w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm opacity-90">
              Keep going! You're doing great 🎉
            </p>
            <span className="font-bold text-gold">{Math.round(overallProgress)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-navy" />
          <h2 className="font-display text-lg font-bold text-navy">
            Your Curriculum
          </h2>
        </div>

        {learningPathData.map((unit, index) => (
          <UnitSection
            key={unit.id}
            unit={unit}
            isExpanded={expandedUnitId === unit.id}
            onToggle={() => handleToggleUnit(unit.id)}
            onStartLesson={handleStartLesson}
          />
        ))}
      </div>

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  );
}