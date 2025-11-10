"use client";

import React, { useState } from 'react';
import { Flame, Trophy, ChevronDown, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface DayData {
  day: string;
  date: number;
  completed: boolean;
  lessonsCount: number;
}

interface StreakProgressWidgetProps {
  userName: string;
  currentStreak: number;
  userRank: number;
  userPoints: number;
  weeklyGoalProgress: number; // 0-100
  weeklyGoalCurrent: number;
  weeklyGoalTarget: number;
}

export default function StreakProgressWidget({
  userName = "John",
  currentStreak = 5,
  userRank = 3,
  userPoints = 2650,
  weeklyGoalProgress = 0,
  weeklyGoalCurrent = 5,
  weeklyGoalTarget = 7,
}: Partial<StreakProgressWidgetProps>) {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90'>('7');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock data for last 7 days
  const last7Days: DayData[] = [
    { day: 'Mon', date: 4, completed: true, lessonsCount: 1 },
    { day: 'Tue', date: 5, completed: true, lessonsCount: 1 },
    { day: 'Wed', date: 6, completed: true, lessonsCount: 1 },
    { day: 'Thu', date: 7, completed: true, lessonsCount: 1 },
    { day: 'Fri', date: 8, completed: true, lessonsCount: 1 },
    { day: 'Sat', date: 9, completed: false, lessonsCount: 0 },
    { day: 'Sun', date: 10, completed: false, lessonsCount: 0 },
  ];

  const lessonsRemaining = weeklyGoalTarget - weeklyGoalCurrent;

  return (
    <Card className="mb-6 border-gray-200 rounded-[24px] shadow-md overflow-hidden animate-fade-in-up">
      <CardContent className="p-4">
        {/* Header Row - Filter & Rank */}
        <div className="flex items-center justify-between mb-3">
          {/* Time Filter Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-7 px-2.5 rounded-[10px] border-gray-200 bg-white hover:bg-gray-50 text-text-secondary font-medium text-xs flex items-center gap-1.5"
            >
              Last {timeFilter} Days
              <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-[12px] shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => { setTimeFilter('7'); setIsDropdownOpen(false); }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 text-text-primary font-medium"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => { setTimeFilter('30'); setIsDropdownOpen(false); }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 text-text-secondary"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => { setTimeFilter('90'); setIsDropdownOpen(false); }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 text-text-secondary"
                >
                  Last 90 Days
                </button>
              </div>
            )}
          </div>

          {/* Rank Badge */}
          <div className="bg-gradient-to-br from-gold/20 to-gold/10 rounded-[12px] px-3 py-1.5 border border-gold/30 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold flex-shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-text-secondary font-medium">Your Rank</span>
              <span className="text-base font-bold text-navy">#{userRank}</span>
              <span className="text-xs font-semibold text-gold">· {userPoints.toLocaleString()} pts</span>
            </div>
          </div>
        </div>

        {/* Streak Section */}
        <div className="flex items-center gap-3 mb-3">
          {/* Streak Icon & Number */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-coral to-coral-hover rounded-[12px] flex items-center justify-center shadow-md shadow-coral/20">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-coral">
                <span className="text-base font-bold text-coral leading-none">{currentStreak}</span>
              </div>
            </div>
            <p className="text-[10px] text-text-secondary text-center mt-1 font-semibold">
              Day Streak
            </p>
          </div>

          {/* Daily Breakdown */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1.5">
              {last7Days.map((dayData, index) => (
                <div key={index} className="flex flex-col items-center">
                  <p className="text-[10px] text-text-tertiary font-medium mb-1">
                    {dayData.day}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all ${
                      dayData.completed
                        ? 'bg-teal shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-gray-100 border border-dashed border-gray-300'
                    }`}
                  >
                    {dayData.completed ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium">{dayData.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-navy">Today's Goal Progress</h3>
            <span className="bg-navy text-white rounded-full px-2 py-0.5 text-xs font-bold">
              {weeklyGoalProgress}%
            </span>
          </div>
          
          <Progress 
            value={weeklyGoalProgress} 
            className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Usage in your home page:
// Replace the AI greeting card section with:
// <StreakProgressWidget 
//   userName={userName}
//   currentStreak={5}
//   userRank={3}
//   userPoints={2650}
//   weeklyGoalProgress={71}
//   weeklyGoalCurrent={5}
//   weeklyGoalTarget={7}
// />