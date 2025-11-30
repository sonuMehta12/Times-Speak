"use client";

import React, { useState, useEffect } from "react";
import StreakProgressWidget from "@/components/StreakProgressWidget";
import DailyLessonCard from "@/components/DailyLessonCard";
import QuickAccessGrid from "@/components/QuickAccessGrid";
import BestRolePlays from "@/components/BestRolePlays";
import DailyChallenge from "@/components/DailyChallenge";

export default function Home() {
  const [userName, setUserName] = useState("John");

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUserName(parsedData.userName || 'John');
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Streak & Progress */}
      <StreakProgressWidget userName={userName} />

      {/* Hero Daily Lesson */}
      <DailyLessonCard />

      {/* Quick Actions Grid */}
      <QuickAccessGrid />

      {/* Best Role Plays Horizontal Scroll */}
      <BestRolePlays />

      {/* Daily Challenge Quiz */}
      <DailyChallenge />
    </div>
  );
}
