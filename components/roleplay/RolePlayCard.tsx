// components/roleplay/RolePlayCard.tsx
'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scenario } from '@/lib/types/roleplay';

interface RolePlayCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  variant?: 'featured' | 'grid';
}

export default function RolePlayCard({ scenario, onSelect, variant = 'grid' }: RolePlayCardProps) {
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Beginner: 'bg-teal/10 text-teal border-teal/20',
      Intermediate: 'bg-gold/10 text-navy border-gold/30',
      Advanced: 'bg-coral/10 text-coral border-coral/20',
    };
    return colors[level] || 'bg-navy/10 text-navy border-navy/20';
  };

  const getBadgeStyles = (color?: 'gold' | 'coral' | 'teal') => {
    if (!color) return '';
    const styles = {
      gold: 'bg-gold text-navy',
      coral: 'bg-coral text-white',
      teal: 'bg-teal text-white',
    };
    return styles[color];
  };

  if (variant === 'featured') {
    return (
      <Card
        className="flex-shrink-0 w-[85%] snap-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-[24px] overflow-hidden"
        onClick={() => onSelect(scenario)}
      >
        <div className="relative h-48 w-full bg-gradient-to-br from-navy/5 to-teal/5">
          <img src={scenario.image} alt={scenario.title} className="w-full h-full object-cover" />
          {scenario.badge && (
            <Badge
              className={`absolute top-3 left-3 ${getBadgeStyles(scenario.badgeColor)} border-0 rounded-[12px] shadow-md font-semibold`}
            >
              {scenario.badge}
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-display text-base font-bold text-navy mb-2">{scenario.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">{scenario.description}</p>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{scenario.duration}</span>
            </div>
            <Badge className={`${getLevelColor(scenario.difficulty)} border rounded-[12px]`}>{scenario.difficulty}</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (for category sections)
  return (
    <Card
      className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-[16px] overflow-hidden"
      onClick={() => onSelect(scenario)}
    >
      <div className="relative h-32 w-full bg-gradient-to-br from-navy/5 to-teal/5">
        <img src={scenario.image} alt={scenario.title} className="w-full h-full object-cover" />
        <Badge className={`absolute top-2 right-2 ${getLevelColor(scenario.difficulty)} border rounded-[8px] text-xs`}>
          {scenario.difficulty}
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm text-text-primary mb-2 line-clamp-1">{scenario.title}</h3>
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Clock className="h-3 w-3" />
          <span>{scenario.duration}</span>
        </div>
      </CardContent>
    </Card>
  );
}
