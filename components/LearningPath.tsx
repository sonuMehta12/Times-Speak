"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Check, Lock, Star, Play, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

enum LessonStatus {
  Completed = 'completed',
  Active = 'active',
  Locked = 'locked'
}

interface Lesson {
  id: number;
  title: string;
  phrase: string;
  status: LessonStatus;
  xp: number;
  duration: string;
}

const initialLessons: Lesson[] = [
  { id: 1, title: "Introducing Yourself", phrase: "Hi, I'm... Nice to meet you!", status: LessonStatus.Completed, xp: 50, duration: "5 min" },
  { id: 2, title: "Talking About Hobbies", phrase: "I enjoy... In my free time...", status: LessonStatus.Completed, xp: 50, duration: "7 min" },
  { id: 3, title: "Describing Your Day", phrase: "Today I... Yesterday I...", status: LessonStatus.Completed, xp: 50, duration: "6 min" },
  { id: 4, title: "How to Talk About Work?", phrase: "I work at... I'm responsible for...", status: LessonStatus.Active, xp: 75, duration: "10 min" },
  { id: 5, title: "Making Plans", phrase: "Would you like to... How about...", status: LessonStatus.Locked, xp: 75, duration: "8 min" },
  { id: 6, title: "Ordering Food", phrase: "I'd like to order... Could I have...", status: LessonStatus.Locked, xp: 75, duration: "9 min" },
  { id: 7, title: "Asking for Directions", phrase: "Excuse me, how do I get to...", status: LessonStatus.Locked, xp: 100, duration: "12 min" },
  { id: 8, title: "Shopping & Bargaining", phrase: "How much is this? Do you have...", status: LessonStatus.Locked, xp: 100, duration: "11 min" }
];

const NODE_V_SPACING = 100;
const NODE_H_OFFSET = 25;
const NODE_SIZE = 48;
const PATH_WIDTH = 350;

const getNodePosition = (index: number): { x: number; y: number } => {
  const isLeft = index % 2 === 0;
  return {
    x: 50 + (isLeft ? -NODE_H_OFFSET : NODE_H_OFFSET),
    y: NODE_SIZE / 2 + index * NODE_V_SPACING,
  };
};

const getStatusColors = (status: LessonStatus) => {
  switch (status) {
    case LessonStatus.Completed:
      return { 
        node: 'bg-teal', 
        text: 'text-white', 
        border: 'border-teal', 
        ring: 'ring-teal',
        shadow: 'shadow-teal/30'
      };
    case LessonStatus.Active:
      return { 
        node: 'bg-gold', 
        text: 'text-navy', 
        border: 'border-gold', 
        ring: 'ring-gold',
        shadow: 'shadow-gold/40'
      };
    case LessonStatus.Locked:
      return { 
        node: 'bg-gray-200', 
        text: 'text-gray-400', 
        border: 'border-gray-300', 
        ring: 'ring-gray-300',
        shadow: 'shadow-gray-200'
      };
  }
};

interface ActiveLessonCardProps {
  lesson: Lesson;
  onStart: () => void;
  isLeft: boolean;
}

const ActiveLessonCard: React.FC<ActiveLessonCardProps> = ({ lesson, onStart, isLeft }) => {
  const positionClasses = isLeft ? 'left-full ml-6' : 'right-full mr-6';
  const arrowClasses = isLeft 
    ? 'left-0 -translate-x-1/2 border-t border-l' 
    : 'right-0 translate-x-1/2 border-b border-r';

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 w-56 z-30 animate-fade-in-up ${positionClasses}`}>
      <Card className="relative bg-white rounded-2xl shadow-xl border-2 border-gold">
        <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white transform rotate-45 ${arrowClasses} border-gold`}></div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <Badge className="bg-gold/20 text-gold border-0 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              +{lesson.xp} XP
            </Badge>
            <Badge variant="outline" className="border-gray-200 rounded-full px-2 py-0.5 text-xs text-text-secondary flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {lesson.duration}
            </Badge>
          </div>
          
          <h3 className="text-base font-bold text-navy mb-2 font-display">
            {lesson.title}
          </h3>
          
          <div className="text-xs text-text-primary bg-navy/5 p-2 rounded-lg border-l-3 border-gold italic mb-3">
            &quot;{lesson.phrase}&quot;
          </div>
          
          <Button
            onClick={onStart}
            className="w-full bg-coral hover:bg-coral-hover text-white font-semibold py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-coral/30 h-auto text-sm"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Start Lesson
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface LessonNodeProps {
  lesson: Lesson;
  index: number;
  isActive: boolean;
  onClick: (id: number) => void;
}

const LessonNode: React.FC<LessonNodeProps> = ({ lesson, index, isActive, onClick }) => {
  const colors = getStatusColors(lesson.status);
  const isClickable = lesson.status !== LessonStatus.Locked;

  return (
    <button
      onClick={() => isClickable && onClick(lesson.id)}
      disabled={!isClickable}
      style={{ width: `${NODE_SIZE}px`, height: `${NODE_SIZE}px` }}
      className={`relative rounded-full flex items-center justify-center font-bold text-xl
                  border-3 shadow-md transition-all duration-300
                  ${colors.node} ${colors.text} ${colors.border} ${colors.shadow}
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'}
                  ${isActive ? `ring-4 ring-offset-2 ring-offset-white ${colors.ring}` : ''}`}
    >
      {lesson.status === LessonStatus.Completed && <Check className="h-6 w-6" strokeWidth={3} />}
      {lesson.status === LessonStatus.Active && <Star className="h-6 w-6" fill="currentColor" />}
      {lesson.status === LessonStatus.Locked && <Lock className="h-5 w-5" />}

      {isActive && (
        <div className="absolute inset-0 rounded-full bg-gold/30 animate-pulse"></div>
      )}
    </button>
  );
};

export default function LearnPage() {
  const userName = "John";
  const [lessons] = useState<Lesson[]>(initialLessons);
  const activeLesson = useMemo(() => lessons.find(l => l.status === LessonStatus.Active), [lessons]);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(activeLesson?.id ?? null);

  const handleNodeClick = useCallback((id: number) => {
    setActiveNodeId(id);
  }, []);
  
  const handleStartLesson = useCallback((id: number) => {
    console.log('Starting lesson:', id);
    window.location.href = '/lesson';
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const pathHeight = (lessons.length - 1) * NODE_V_SPACING + NODE_SIZE + 100;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Learning Path Container */} 
      <div className="relative rounded-3xl p-6 overflow-hidden max-w-2xl mx-auto">
        {/* Decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-navy/5 to-transparent pointer-events-none" />
        
        <div className="relative mx-auto" style={{ width: `${PATH_WIDTH}px`, minHeight: `${pathHeight}px` }}>
          {/* SVG Path */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${PATH_WIDTH} ${pathHeight}`}
            preserveAspectRatio="none"
          >
            {lessons.slice(0, -1).map((lesson, index) => {
              const startPos = getNodePosition(index);
              const endPos = getNodePosition(index + 1);
              const isPathCompleted = lesson.status === LessonStatus.Completed;

              const startX = (startPos.x / 100) * PATH_WIDTH;
              const startY = startPos.y;
              const endX = (endPos.x / 100) * PATH_WIDTH;
              const endY = endPos.y;
              
              const ctrlX1 = startX;
              const ctrlY1 = startY + NODE_V_SPACING * 0.5;
              const ctrlX2 = endX;
              const ctrlY2 = endY - NODE_V_SPACING * 0.5;

              return (
                <path
                  key={`path-${lesson.id}`}
                  d={`M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`}
                  stroke={isPathCompleted ? '#06B6D4' : '#E5E7EB'}
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Lesson Nodes and Active Card */}
          {lessons.map((lesson, index) => {
            const position = getNodePosition(index);
            const isActive = activeNodeId === lesson.id && lesson.status !== LessonStatus.Locked;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={lesson.id}
                className="absolute"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 20 : 10,
                }}
              >
                <LessonNode
                  lesson={lesson}
                  index={index}
                  isActive={isActive}
                  onClick={handleNodeClick}
                />
                {isActive && (
                  <ActiveLessonCard
                    lesson={lesson}
                    onStart={() => handleStartLesson(lesson.id)}
                    isLeft={isLeft}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-6" />
    </div>
  );
}