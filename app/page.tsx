"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Clock,
  Sparkles,
  RefreshCw,
  BookOpen,
  MessageCircle,
  Play,
  Users,
Drama,
  Flame,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import StreakProgressWidget from "@/components/StreakProgressWidget";
import LearningPath from "@/components/LearningPath";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("John");
  const [filterType, setFilterType] = useState("level");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

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

  const levelFilters = ["All", "Beginner", "Intermediate", "Advanced"];
  const categoryFilters = ["All", "Business", "Travel", "Casual", "Academic"];
  const currentFilters =
    filterType === "level" ? levelFilters : categoryFilters;

  const quickCategories = [
    {
      id: "speak",
      icon: MessageCircle,
      title: "Conversation",
      color: "text-coral",
      bgColor: "bg-coral/10",
      hoverBg: "hover:bg-coral/20",
      path: "/aditi",
    },
    {
      id: "explore",
      icon: Drama,
      title: "Role Play",
      color: "text-teal",
      bgColor: "bg-teal/10",
      hoverBg: "hover:bg-teal/20",
      path: "/role",
    },
    {
      id: "learn",
      icon: BookOpen,
      title: "Learn Path",
      color: "text-navy",
      bgColor: "bg-navy/10",
      hoverBg: "hover:bg-navy/20",
      path: "/learn",
    } 
  ];

  const todaysLessons = [
    {
      id: 1,
      title: "Meeting a new Colleague",
      category: "Business",
      level: "B2",
      image: "/imgs/Meeting a new calleague.png",
      quoteParts: ["I work, ", "microsoft where I", "", "."],
      fillIns: 2,
      learners: "5.8K",
      progress: 33,
      completed: 5,
      total: 15,
    },
    {
      id: 2,
      title: "Ordering at a Restaurant",
      category: "Travel",
      level: "A2",
      image: "/imgs/Ording at restaurant.avif",
      quoteParts: ["I would like to order ", "."],
      fillIns: 1,
      learners: "4.2K",
      progress: 0,
      completed: 0,
      total: 12,
    },
  ];

  const currentLesson = todaysLessons[currentLessonIndex];

  const handleSwapLesson = () => {
    setCurrentLessonIndex((prev) => (prev + 1) % todaysLessons.length);
  };

  const tutorCards = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=225&fit=crop",
      phrase: "Let's circle back on this",
      title: "Professional Meeting Phrases You Need to Know",
      tutor: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "Business English Expert",
      },
      learners: 234,
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1489844097929-c8d5b91c456e?w=400&h=225&fit=crop",
      phrase: "I'm over the moon!",
      title: "Express Excitement Like a Native Speaker",
      tutor: {
        name: "Mike Chen",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "Conversation Coach",
      },
      learners: 189,
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=225&fit=crop",
      phrase: "Could you shed some light on this?",
      title: "Asking Questions Professionally in Academic Settings",
      tutor: {
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "Academic Writing Tutor",
      },
      learners: 312,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <StreakProgressWidget 
        userName={userName}
        currentStreak={5}
        userRank={3}
        userPoints={2650}
        weeklyGoalProgress={0}
        weeklyGoalCurrent={5}
        weeklyGoalTarget={7}
      />

      {/* Learning Path Section */}
      <LearningPath />
    </div>
  );
}
