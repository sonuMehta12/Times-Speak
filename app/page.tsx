"use client";

import React, { useState, useEffect } from "react";
import StreakProgressWidget from "@/components/StreakProgressWidget";
import LearningPath from "@/components/LearningPath";

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
      <StreakProgressWidget
        userName={userName}
      />
      {/* Learning Path Section */}
      <LearningPath />
    </div>
  );
}
