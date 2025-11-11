"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Sparkles,
  RefreshCw,
  BookOpen,
  MessageCircle,
  Play,
  Users,
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
      id: "learn",
      icon: BookOpen,
      title: "Learn Path",
      color: "text-navy",
      bgColor: "bg-navy/10",
      hoverBg: "hover:bg-navy/20",
      path: "/learn",
    },
    {
      id: "explore",
      icon: Play,
      title: "Role Play",
      color: "text-teal",
      bgColor: "bg-teal/10",
      hoverBg: "hover:bg-teal/20",
      path: "/role",
    },
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
    <div className="w-full">
      {/* AI Greeting Card */}
      {/* <div className="flex items-start gap-3 mb-6 animate-fade-in-up">
        <div className="relative flex-shrink-0 mt-1">
          <Avatar className="h-12 w-12 bg-navy shadow-md">
            <AvatarImage src="/imgs/Aditi.png" alt="Aditi AI" />
            <AvatarFallback className="bg-navy">
              <Sparkles size={24} className="text-gold" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
        </div>
        <Card className="relative flex-1 border-gray-200 rounded-[20px] shadow-sm">
          <div className="absolute -left-1.5 top-4 w-3 h-3 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
          <CardContent className="p-4">
            <p className="text-text-primary text-sm leading-relaxed">
              Good morning, {userName}! You&apos;re on fire 🔥 Let&apos;s keep
              that streak going with today&apos;s lesson.
            </p>
          </CardContent>
        </Card>
      </div> */}

<StreakProgressWidget 
  userName={userName}
  currentStreak={5}
  userRank={3}
  userPoints={2650}
  weeklyGoalProgress={0}
  weeklyGoalCurrent={5}
  weeklyGoalTarget={7}
/>

      {/* Today's Lesson Card */}
      <Card
        className="mb-6 overflow-hidden animate-fade-in-up border-gray-200 rounded-[24px] shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        style={{ animationDelay: "150ms" }}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          // Only navigate if the click wasn't on a button or its children
          if (!(e.target instanceof HTMLButtonElement) && !(e.target as HTMLElement).closest('button')) {
            router.push("/lesson");
          }
        }}
      >
        <CardContent className="p-5 pb-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-xs font-semibold uppercase tracking-wide">
              Today&apos;s Lesson
            </span>
            <div className="flex gap-2">
              <Badge className="bg-teal/10 text-teal hover:bg-teal/10 border-0 rounded-xl">
                {currentLesson.category}
              </Badge>
              <Badge className="bg-navy/10 text-navy hover:bg-navy/10 border-0 rounded-xl">
                {currentLesson.level}
              </Badge>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-navy font-display text-xl font-bold mb-4">
            {currentLesson.title}
          </h2>

          {/* Thumbnail Image */}
          <div className="relative h-40 rounded-[20px] overflow-hidden mb-4 border border-gray-200">
            <Image
              src={currentLesson.image}
              alt={currentLesson.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
              <Users size={14} />
              <span>{currentLesson.learners}</span>
            </div>
          </div>

          {/* Quote */}
          <p className="text-text-primary text-base mb-5 text-center italic">
            &quot;{currentLesson.quoteParts.map((part, index) => (
              <span key={index}>
                {part}
                {index < currentLesson.quoteParts.length - 1 && (
                  <span className="text-navy font-semibold border-b-2 border-dashed border-navy/30">
                    ______
                  </span>
                )}
              </span>
            ))}&quot;
          </p>

          {/* Progress Bar */}
          {/* <div className="mb-5">
            <div className="flex justify-between items-center text-xs text-text-secondary mb-2.5">
              <span className="font-medium">
                {currentLesson.completed} of {currentLesson.total} min completed
              </span>
              <span className="font-bold text-teal">
                {currentLesson.progress}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-200">
              <div
                className="absolute top-0 left-0 h-full bg-teal rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentLesson.progress}%` }}
              ></div>
            </div>
          </div> */}

          {/* Buttons */}
          <div className="flex items-stretch gap-2.5">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                router.push("/lesson");
              }}
              className="flex-grow bg-coral text-white hover:bg-coral-hover active:bg-coral-active h-12 rounded-[16px] font-semibold shadow-sm"
            >
              {currentLesson.progress > 0
                ? "Continue Learning"
                : "Start Learning"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleSwapLesson();
              }}
              className="h-12 w-12 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-[16px]"
              aria-label="Swap lesson"
            >
              <RefreshCw size={20} className="text-text-secondary" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Practice Section */}
      <section
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "300ms" }}
      >
        <h2 className="text-lg font-bold text-navy mb-4 font-display">
          Quick Practice
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {quickCategories.map((cat) => (
            <Button
              key={cat.id}
              variant="outline"
              onClick={() => router.push(cat.path)}
              className="h-auto flex-col p-4 bg-white border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95 rounded-[20px]"
            >
              <div
                className={`w-12 h-12 rounded-[16px] ${cat.bgColor} ${cat.hoverBg} flex items-center justify-center mb-2 transition-colors`}
              >
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                {cat.title}
              </span>
            </Button>
          ))}
        </div>
      </section>

      {/* Learning Feed */}
      <section
        className="animate-fade-in-up"
        style={{ animationDelay: "450ms" }}
      >
        <h2 className="text-lg font-bold text-navy mb-4 font-display">
          Learning Feed
        </h2>

        {/* Filter Section */}
        <Card className="p-4 mb-4 border-gray-200 rounded-[20px] shadow-sm">
          <div className="inline-flex bg-gray-100 rounded-[12px] p-1 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType("level");
                setSelectedFilter("All");
              }}
              className={`rounded-[10px] ${
                filterType === "level"
                  ? "bg-white text-navy shadow-sm"
                  : "text-text-secondary hover:text-navy"
              }`}
            >
              Level
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType("category");
                setSelectedFilter("All");
              }}
              className={`rounded-[10px] ${
                filterType === "category"
                  ? "bg-white text-navy shadow-sm"
                  : "text-text-secondary hover:text-navy"
              }`}
            >
              Categories
            </Button>
          </div>
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2">
              {currentFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={`rounded-full whitespace-nowrap ${
                    selectedFilter === filter
                      ? "bg-navy text-white hover:bg-navy-hover shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200 border-0"
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Tutor Cards */}
        <div className="space-y-4">
          {tutorCards.map((card) => (
            <Card
              key={card.id}
              className="overflow-hidden border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer rounded-[24px]"
            >
              <CardContent className="p-5">
                <h3 className="font-display text-lg text-navy font-bold mb-4">
                  {card.title}
                </h3>
                <div className="relative aspect-video rounded-[16px] overflow-hidden group mb-4 border border-gray-200">
                  <Image
                    src={card.thumbnail}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="font-body text-base text-text-primary italic mb-2">
                    &quot;{card.phrase}&quot;
                  </p>
                  <p className="font-body text-text-secondary text-sm">
                    Makes{" "}
                    <span className="border-b-2 border-dashed border-gray-300">
                      ______
                    </span>
                    .
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-gray-100">
                      <AvatarImage
                        src={card.tutor.avatar}
                        alt={card.tutor.name}
                      />
                      <AvatarFallback>
                        {card.tutor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">
                        {card.tutor.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {card.tutor.role}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5 border-gray-200 rounded-[12px]"
                  >
                    <Users className="w-4 h-4" />
                    <span>{card.learners}</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Hidden Reset Onboarding Button for Testing */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            if (confirm('Reset onboarding? This will clear all user data and restart the onboarding flow.')) {
              localStorage.removeItem('onboardingCompleted');
              localStorage.removeItem('userData');
              router.push('/onboarding');
            }
          }}
          variant="outline"
          className="opacity-20 hover:opacity-100 transition-opacity text-xs px-3 py-2 rounded-[8px]"
        >
          Reset Onboarding
        </Button>
      </div>
    </div>
  );
}
