"use client";

import React from 'react';
import { Flame, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLessonContext } from '@/lib/context/LessonContext';
import {
  getLast7Days,
  getDailyGoalProgress,
  getWeeklyGoalProgress
} from '@/lib/utils/progress';

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
  const { userProgress } = useLessonContext();

  // Calculate real data from user progress
  const dailyGoal = getDailyGoalProgress(userProgress);
  const weeklyGoal = getWeeklyGoalProgress(userProgress);
  const last7DaysActivities = getLast7Days(userProgress);

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


  return (
    <Card className="mb-6 border-gray-200 rounded-[24px] shadow-md overflow-hidden animate-fade-in-up">
      <CardContent className="p-4">
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
