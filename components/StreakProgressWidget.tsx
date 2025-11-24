"use client";

import React, { useState } from 'react';
import { Flame, Trophy, ChevronDown, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLessonContext } from '@/lib/context/LessonContext';
import {
  getLast7Days,
  getDailyGoalProgress,
  getWeeklyGoalProgress
} from '@/lib/utils/progress';
import {
  getHeroMessage,
  getStreakDisplayText,
  getStreakBadge,
  shouldShowGraceWarning,
  getGracePeriodMessage
} from '@/lib/utils/hero-messages';

interface DayData {
  day: string;
  date: number;
  completed: boolean;
  lessonsCount: number;
}

interface StreakProgressWidgetProps {
  userName?: string;
}

export default function StreakProgressWidget({
  userName = "there",
}: StreakProgressWidgetProps) {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90'>('7');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { userProgress } = useLessonContext();

  // Calculate real data from user progress
  const dailyGoal = getDailyGoalProgress(userProgress);
  const weeklyGoal = getWeeklyGoalProgress(userProgress);
  const last7DaysActivities = getLast7Days(userProgress);
  const streakBadge = getStreakBadge(userProgress.currentStreak);
  const showGraceWarning = shouldShowGraceWarning(userProgress);

  // Transform activity data to day display format
  const last7Days: DayData[] = last7DaysActivities.map((activity) => {
    const date = new Date(activity.date);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return {
      day: dayNames[date.getDay()],
      date: date.getDate(),
      completed: activity.minutesSpent > 0,
      lessonsCount: activity.lessonsCount + activity.quizzesCount + activity.roleplaysCount,
    };
  });

  // Get dynamic hero message (no subtitle - concise hero message only)
  const heroMessage = getHeroMessage(userProgress, userName);
  const streakText = getStreakDisplayText(userProgress);

  // For leaderboard (mock for now - can be implemented later)
  const userRank = 0; // 0 means hide rank for now
  const userPoints = userProgress.totalXP;

  return (
    <Card className="mb-6 border-gray-200 rounded-[24px] shadow-md overflow-hidden animate-fade-in-up">
      <CardContent className="p-4">
        {/* Hero Message Section - Single concise message only */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-navy">
                {heroMessage}
              </h2>
              {showGraceWarning && (
                <p className="text-xs text-coral mt-1 font-medium">
                  {getGracePeriodMessage(userProgress)}
                </p>
              )}
            </div>
            {streakBadge && (
              <div className="flex-shrink-0 bg-gradient-to-br from-gold/20 to-gold/10 rounded-[12px] px-2.5 py-1 border border-gold/30">
                <span className="text-xs font-bold text-gold">{streakBadge}</span>
              </div>
            )}
          </div>
        </div>

        {/* Header Row - Filter & Points */}
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
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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

          {/* XP Display */}
          <div className="bg-gradient-to-br from-teal/20 to-teal/10 rounded-[12px] px-3 py-1.5 border border-teal/30 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-teal flex-shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-text-secondary font-medium">Total XP</span>
              <span className="text-base font-bold text-navy">{userPoints.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Streak Section */}
        <div className="flex items-center gap-3 mb-3">
          {/* Streak Icon & Number */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shadow-md ${
                userProgress.currentStreak === 0
                  ? 'bg-gray-200'
                  : 'bg-gradient-to-br from-coral to-coral-hover shadow-coral/20'
              }`}>
                <Flame className={`h-6 w-6 ${userProgress.currentStreak === 0 ? 'text-gray-400' : 'text-white'}`} />
              </div>
              <div className={`absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 shadow-sm border ${
                userProgress.currentStreak === 0
                  ? 'bg-white border-gray-300'
                  : 'bg-white border-coral'
              }`}>
                <span className={`text-base font-bold leading-none ${
                  userProgress.currentStreak === 0 ? 'text-gray-400' : 'text-coral'
                }`}>
                  {userProgress.currentStreak}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-text-secondary text-center mt-1 font-semibold">
              Day Streak
            </p>
          </div>

          {/* Daily Breakdown - Green check for completed, Red X for skipped, Special for today */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1.5">
              {last7Days.map((dayData, index) => {
                const isToday = index === 6;
                const isSkipped = !dayData.completed && !isToday;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <p className={`text-[10px] font-medium mb-1 ${
                      isToday ? 'text-navy font-bold' : dayData.completed ? 'text-green-600' : 'text-text-tertiary'
                    }`}>
                      {dayData.day}
                    </p>
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all ${
                        dayData.completed
                          ? 'bg-green-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                          : isToday
                          ? 'bg-gradient-to-br from-navy to-navy/80 shadow-md ring-2 ring-navy/30 ring-offset-1'
                          : 'bg-red-100 border border-red-300'
                      }`}
                    >
                      {dayData.completed ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : isToday ? (
                        <span className="text-xs font-bold text-white">
                          {dayData.date}
                        </span>
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    {dayData.completed && dayData.lessonsCount > 0 && (
                      <p className="text-[8px] text-green-600 font-bold mt-0.5">
                        +{dayData.lessonsCount}
                      </p>
                    )}
                    {isToday && (
                      <p className="text-[8px] text-navy font-bold mt-0.5">
                        Today
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-navy">
              Today's Goal Progress
              <span className="text-text-secondary font-normal ml-1.5">
                ({dailyGoal.current}/{dailyGoal.target} min)
              </span>
            </h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              dailyGoal.isComplete
                ? 'bg-teal text-white'
                : 'bg-navy text-white'
            }`}>
              {dailyGoal.percentage}%
            </span>
          </div>

          <Progress
            value={dailyGoal.percentage}
            className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5"
          />

          {weeklyGoal.current > 0 && (
            <p className="text-[10px] text-text-tertiary text-right mt-1">
              {weeklyGoal.current}/{weeklyGoal.target} days active this week
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
