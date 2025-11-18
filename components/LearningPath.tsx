"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock, Star, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLessonContext } from '@/lib/context/LessonContext';
import { UNITS_DATA } from '@/lib/data/units';

enum LessonStatus {
  Completed = 'completed',
  Active = 'active',
  Locked = 'locked'
}

interface Node {
  id: string;
  lessonId?: string;
  unitId: string;
  title: string;
  phrase: string;
  phraseMeaning?: string;
  lessonNumber?: number;
  status: LessonStatus;
  xp: number;
  duration: string;
  type: 'lesson' | 'final-quiz' | 'final-roleplay';
}

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
  node: Node;
  onStart: () => void;
  isLeft: boolean;
}

const ActiveLessonCard: React.FC<ActiveLessonCardProps> = ({ node, onStart, isLeft }) => {
  const getButtonText = () => {
    if (node.type === 'final-quiz') return 'Start Final Quiz';
    if (node.type === 'final-roleplay') return 'Start Final Roleplay';
    return 'Start the lesson';
  };

  // Fixed positioning: card appears in a fixed horizontal position
  // For LEFT nodes: card goes to LEFT side of screen
  // For RIGHT nodes: card goes to RIGHT side of screen
  const horizontalPosition = isLeft
    ? 'left-0 ml-2'  // Card on left edge
    : 'right-0 mr-2'; // Card on right edge

  // Notch connects card to node - positioned on the side CLOSEST to the node
  // For LEFT nodes: notch on RIGHT side (toward the left node)
  // For RIGHT nodes: notch on LEFT side (toward the right node)
  const arrowHorizontalPosition = isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2';
  const arrowRotation = isLeft ? '-rotate-45' : 'rotate-45';
  const arrowBorders = isLeft ? 'border-b-2 border-r-2' : 'border-t-2 border-l-2';

  // Format phrase to show fill-in-the-blank style
  const formatPhraseWithBlanks = (phrase: string) => {
    // Find the last word and replace with ___
    const words = phrase.trim().split(' ');
    if (words.length > 1) {
      words[words.length - 1] = '___?';
      return words.join(' ');
    }
    return phrase;
  };

  return (
    <div className={`absolute top-[60px] ${horizontalPosition} w-[min(260px,calc(100vw-100px))] z-30 animate-fade-in`}>
      <Card className="relative bg-white rounded-2xl shadow-2xl border-2 border-gold/30">
        {/* Arrow/Notch pointing to the node - positioned on the side facing the node */}
        <div className={`absolute ${arrowHorizontalPosition} top-2 w-3 h-3 bg-white transform ${arrowRotation} ${arrowBorders} border-gold/30 z-10`}></div>

        <CardContent className="p-4">
          {/* Header: Lesson tag + XP */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="border-coral/30 bg-coral/10 text-coral rounded-md px-2 py-0.5 text-xs font-semibold">
              {node.lessonNumber ? `Lesson ${node.lessonNumber}` : node.title}
            </Badge>
            <Badge className="bg-gold/20 text-gold border-0 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="h-3 w-3 fill-gold" />
              +{node.xp} Exp
            </Badge>
          </div>

          {/* Key Phrase in "fill-in-the-blank" style */}
          <div className="bg-gradient-to-br from-navy/5 to-teal/5 p-3.5 rounded-xl mb-2.5 border border-navy/10">
            <p className="text-lg font-bold text-navy text-center font-display leading-snug">
              {formatPhraseWithBlanks(node.phrase)}
            </p>
          </div>

          {/* Phrase Meaning */}
          {node.phraseMeaning && (
            <p className="text-xs text-text-secondary text-center mb-4 leading-relaxed">
              {node.phraseMeaning}
            </p>
          )}

          {/* Start Button */}
          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-coral to-coral-hover hover:from-coral-hover hover:to-coral-active text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-coral/30 h-auto text-sm"
          >
            {getButtonText()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface LessonNodeProps {
  node: Node;
  isActive: boolean;
  onClick: (id: string) => void;
}

const LessonNode: React.FC<LessonNodeProps> = ({ node, isActive, onClick }) => {
  const colors = getStatusColors(node.status);
  const isClickable = node.status !== LessonStatus.Locked;

  const getNodeIcon = () => {
    if (node.status === LessonStatus.Completed) return <Check className="h-6 w-6" strokeWidth={3} />;
    if (node.status === LessonStatus.Active) {
      if (node.type === 'final-quiz') return <Target className="h-6 w-6" fill="currentColor" />;
      if (node.type === 'final-roleplay') return <Trophy className="h-6 w-6" fill="currentColor" />;
      return <Star className="h-6 w-6" fill="currentColor" />;
    }
    return <Lock className="h-5 w-5" />;
  };

  return (
    <button
      onClick={() => isClickable && onClick(node.id)}
      disabled={!isClickable}
      style={{ width: `${NODE_SIZE}px`, height: `${NODE_SIZE}px` }}
      className={`relative rounded-full flex items-center justify-center font-bold text-xl
                  border-3 shadow-md transition-all duration-300
                  ${colors.node} ${colors.text} ${colors.border} ${colors.shadow}
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'}
                  ${isActive ? `ring-4 ring-offset-2 ring-offset-white ${colors.ring}` : ''}`}
    >
      {getNodeIcon()}

      {isActive && (
        <div className="absolute inset-0 rounded-full bg-gold/30 animate-pulse"></div>
      )}
    </button>
  );
};

export default function LearningPath() {
  const router = useRouter();
  const {
    userProgress,
    isLessonUnlocked,
    isFinalQuizUnlocked,
    isFinalRoleplayUnlocked
  } = useLessonContext();

  // Get current unit (Unit 1 for now)
  const currentUnit = UNITS_DATA[0]; // unit_1_introduction
  const unitId = currentUnit.unitId;

  // Transform lessons from UNITS_DATA into nodes
  const nodes: Node[] = useMemo(() => {
    const lessonNodes: Node[] = currentUnit.lessons.map((lesson, index) => {
      const progress = userProgress.units[unitId]?.lessonsProgress[lesson.id];

      // Determine status
      let status: LessonStatus;
      if (progress?.completed) {
        status = LessonStatus.Completed;
      } else if (isLessonUnlocked(lesson.id, unitId)) {
        status = LessonStatus.Active;
      } else {
        status = LessonStatus.Locked;
      }

      return {
        id: `lesson-${lesson.id}`,
        lessonId: lesson.id,
        unitId,
        title: lesson.title || `Lesson ${index + 1}`,
        phrase: lesson.phrase,
        phraseMeaning: lesson.phraseMeaning,
        lessonNumber: index + 1,
        status,
        xp: progress?.xpEarned || 50,
        duration: "5 min",
        type: 'lesson' as const,
      };
    });

    // Add final quiz node (Node 6)
    const finalQuizUnlocked = isFinalQuizUnlocked(unitId);
    const finalQuizCompleted = userProgress.units[unitId]?.finalQuizCompleted;

    const finalQuizNode: Node = {
      id: 'final-quiz',
      unitId,
      title: 'Final Quiz',
      phrase: 'Test Your Knowledge',
      status: finalQuizCompleted
        ? LessonStatus.Completed
        : finalQuizUnlocked
          ? LessonStatus.Active
          : LessonStatus.Locked,
      xp: 100,
      duration: '10 min',
      type: 'final-quiz',
    };

    // Add final roleplay node (Node 7)
    const finalRoleplayUnlocked = isFinalRoleplayUnlocked(unitId);
    const finalRoleplayCompleted = userProgress.units[unitId]?.finalRoleplayCompleted;

    const finalRoleplayNode: Node = {
      id: 'final-roleplay',
      unitId,
      title: 'Final Roleplay',
      phrase: 'Master Conversation',
      status: finalRoleplayCompleted
        ? LessonStatus.Completed
        : finalRoleplayUnlocked
          ? LessonStatus.Active
          : LessonStatus.Locked,
      xp: 150,
      duration: '15 min',
      type: 'final-roleplay',
    };

    return [...lessonNodes, finalQuizNode, finalRoleplayNode];
  }, [currentUnit, unitId, userProgress, isLessonUnlocked, isFinalQuizUnlocked, isFinalRoleplayUnlocked]);

  const activeNode = useMemo(() => nodes.find(n => n.status === LessonStatus.Active), [nodes]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(activeNode?.id ?? null);

  const handleNodeClick = useCallback((id: string) => {
    setActiveNodeId(id);
  }, []);

  const handleStartNode = useCallback((node: Node) => {
    if (node.type === 'final-quiz') {
      router.push(`/${unitId}/final/quiz`);
    } else if (node.type === 'final-roleplay') {
      router.push(`/${unitId}/final/roleplay`);
    } else if (node.lessonId) {
      router.push(`/${unitId}/${node.lessonId}/lesson`);
    }
  }, [router, unitId]);

  const pathHeight = (nodes.length - 1) * NODE_V_SPACING + NODE_SIZE + 100;

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
            {nodes.slice(0, -1).map((node, index) => {
              const startPos = getNodePosition(index);
              const endPos = getNodePosition(index + 1);
              const isPathCompleted = node.status === LessonStatus.Completed;

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
                  key={`path-${node.id}`}
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
          {nodes.map((node, index) => {
            const position = getNodePosition(index);
            const isActive = activeNodeId === node.id && node.status !== LessonStatus.Locked;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={node.id}
                className="absolute"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 20 : 10,
                }}
              >
                <LessonNode
                  node={node}
                  isActive={isActive}
                  onClick={handleNodeClick}
                />
                {isActive && (
                  <ActiveLessonCard
                    node={node}
                    onStart={() => handleStartNode(node)}
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
