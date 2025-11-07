"use client";

import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Mic,
  Play,
  CheckCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LessonPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        alert("Great job! Your pronunciation was 95% accurate. 🎉");
      }, 3000);
    }
  };

  const unitLessons = [
    {
      id: 1,
      number: "Lesson 1",
      title: "Greetings & Basic Phrases",
      duration: "5 min",
      emoji: "👋",
      status: "completed",
    },
    {
      id: 2,
      number: "Lesson 2",
      title: "Introducing Yourself",
      duration: "6 min",
      emoji: "👤",
      status: "current",
    },
    {
      id: 3,
      number: "Lesson 3",
      title: "Talking About Hobbies",
      duration: "6 min",
      emoji: "🎨",
      status: "locked",
    },
    {
      id: 4,
      number: "Lesson 4",
      title: "Asking Questions",
      duration: "7 min",
      emoji: "❓",
      status: "locked",
    },
    {
      id: 5,
      number: "Lesson 5",
      title: "Small Talk Basics",
      duration: "8 min",
      emoji: "💬",
      status: "locked",
    },
    {
      id: 6,
      number: "Lesson 6",
      title: "Making Plans",
      duration: "7 min",
      emoji: "📅",
      status: "locked",
    },
  ];

  const moreLessons = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop",
      phrase: "Let's grab a coffee sometime",
      title: "Casual Invitations",
      tutor: { name: "Emma Wilson", avatar: "https://i.pravatar.cc/150?img=5" },
      learners: 156,
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop",
      phrase: "Could you help me with this?",
      title: "Polite Requests",
      tutor: { name: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=3" },
      learners: 203,
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=225&fit=crop",
      phrase: "I appreciate your time",
      title: "Expressing Gratitude",
      tutor: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      learners: 289,
    },
  ];

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Video Section */}
      <div
        className="relative bg-black"
        style={{
          // force full-bleed regardless of parent container padding/margins
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
          height: "50vh",
          top: 0,
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=0&rel=0"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-[12px] px-4 py-3 flex items-center justify-between">
          <span className="text-white text-sm opacity-90">2:34 / 5:12</span>
          <Play className="h-5 w-5 text-white" />
        </div>
      </div>
      {/* Lesson Header */}
      <div className="mb-5">
        <p className="text-[13px] text-text-secondary font-medium tracking-wide mb-2">
          Unit 1 • Lesson 2 of 6
        </p>
        <h2 className="text-[26px] font-bold text-text-primary font-display mb-2 leading-tight">
          Introducing Yourself
        </h2>
        <p className="text-[15px] text-text-secondary">
          Learn how to introduce yourself confidently in English
        </p>
      </div>
      {/* Tabs Section */}
      <div className="mb-6">
        {/* Simple Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("practice")}
            className={`flex-1 pb-3 text-[15px] font-semibold transition-all ${
              activeTab === "practice"
                ? "text-navy border-b-2 border-navy"
                : "text-text-secondary"
            }`}
          >
            Practice
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 pb-3 text-[15px] font-semibold transition-all ${
              activeTab === "quiz"
                ? "text-navy border-b-2 border-navy"
                : "text-text-secondary"
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => setActiveTab("roleplay")}
            className={`flex-1 pb-3 text-[15px] font-semibold transition-all ${
              activeTab === "roleplay"
                ? "text-navy border-b-2 border-navy"
                : "text-text-secondary"
            }`}
          >
            Role Play
          </button>
        </div>

        {/* Practice Tab */}
        {activeTab === "practice" && (
          <Card className="border-gray-200 shadow-sm rounded-[20px]">
            <CardContent className="p-8 min-h-[320px] flex flex-col items-center justify-center text-center">
              <p className="text-[22px] font-semibold text-text-primary mb-6 leading-relaxed">
                "Hi, I'm{" "}
                <span className="text-navy border-b-2 border-navy/30 border-dashed">
                  Rahul
                </span>
                . Nice to{" "}
                <span className="text-teal border-b-2 border-teal/30 border-dashed">
                  meet
                </span>{" "}
                you."
              </p>
              <Button
                size="icon"
                onClick={handleRecording}
                className={`h-20 w-20 rounded-full mb-6 transition-all duration-300 ${
                  isRecording
                    ? "bg-error hover:bg-error animate-pulse shadow-lg shadow-error/30"
                    : "bg-navy hover:bg-navy-hover shadow-lg shadow-navy/30"
                }`}
              >
                <Mic className="h-8 w-8 text-white" />
              </Button>
              <p className="text-[14px] text-text-secondary">
                Tap the microphone and speak the phrase
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quiz Tab */}
        {activeTab === "quiz" && (
          <Card className="border-gray-200 shadow-sm rounded-[20px]">
            <CardContent className="p-8 min-h-[320px] flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-[24px] font-bold text-text-primary font-display mb-3">
                Quick Quiz
              </h3>
              <p className="text-[15px] text-text-secondary mb-7 leading-relaxed max-w-xs">
                Test your understanding of this lesson with 5 questions
              </p>
              <Button
                className="bg-navy hover:bg-navy-hover text-white px-10 h-12 rounded-[16px] font-semibold shadow-md"
                onClick={() =>
                  alert(
                    "Starting quiz...\n\nQuestion 1 of 5: What is the correct way to introduce yourself?"
                  )
                }
              >
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Role Play Tab */}
        {activeTab === "roleplay" && (
          <Card className="border-gray-200 shadow-sm rounded-[20px]">
            <CardContent className="p-8 min-h-[320px] flex flex-col items-center justify-center text-center">
              <div className="w-[100px] h-[100px] rounded-full bg-navy/10 flex items-center justify-center mb-5 text-5xl">
                ☕
              </div>
              <h3 className="text-[22px] font-bold text-text-primary font-display mb-2">
                Meeting at a Cafe
              </h3>
              <p className="text-[14px] text-text-secondary mb-6">
                Practice introducing yourself to someone new
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  className="flex-1 bg-navy hover:bg-navy-hover text-white h-12 rounded-[16px] font-semibold"
                  onClick={() =>
                    alert(
                      "Starting role play conversation...\n\nYour turn: Introduce yourself to Sarah!"
                    )
                  }
                >
                  🎭 Start Conversation
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 border-0 h-12 rounded-[16px] font-semibold"
                  onClick={() =>
                    confirm("Mark this role play as complete?") &&
                    alert("✓ Role play marked as complete! Great job! 🎉")
                  }
                >
                  ✓ Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Unit Lessons Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-bold text-text-primary font-display">
            Unit 1: Introductions
          </h3>
          <button className="text-[14px] text-navy font-semibold flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {unitLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className={`border-gray-200 rounded-[20px] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
                lesson.status === "current" ? "ring-2 ring-navy shadow-md" : ""
              }`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`w-20 h-14 rounded-[12px] flex items-center justify-center text-3xl flex-shrink-0 ${
                    lesson.status === "current"
                      ? "bg-gradient-to-br from-navy/20 to-teal/20"
                      : "bg-gradient-to-br from-navy/10 to-teal/10"
                  }`}
                >
                  {lesson.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-text-secondary font-medium mb-1">
                    {lesson.number}
                  </p>
                  <p
                    className={`text-[15px] font-semibold truncate mb-1 ${
                      lesson.status === "current"
                        ? "text-navy"
                        : "text-text-primary"
                    }`}
                  >
                    {lesson.title}
                  </p>
                  <p className="text-[12px] text-text-tertiary">
                    {lesson.duration}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lesson.status === "completed"
                      ? "bg-success"
                      : lesson.status === "current"
                      ? "bg-navy"
                      : "bg-gray-200"
                  }`}
                >
                  {lesson.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : lesson.status === "current" ? (
                    <Play className="h-3 w-3 text-white ml-0.5" />
                  ) : (
                    <Lock className="h-3 w-3 text-text-tertiary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Creator Section */}
      <div className="mb-6">
        <Card className="border-gray-200 rounded-[20px] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-navy to-teal text-white font-bold text-xl">
                S
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-[12px] text-text-secondary mb-1">Created by</p>
              <p className="text-[18px] font-bold text-text-primary font-display mb-1">
                Stacy
              </p>
              <p className="text-[13px] text-text-secondary">
                Expert English Coach • 15K followers
              </p>
            </div>
            <Button className="bg-navy hover:bg-navy-hover text-white px-5 h-10 rounded-full font-semibold">
              Follow
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* More Lessons Carousel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-bold text-text-primary font-display">
            More Lessons
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollCarousel("left")}
              className="h-8 w-8 rounded-full border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollCarousel("right")}
              className="h-8 w-8 rounded-full border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {moreLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="flex-shrink-0 w-[280px] border-gray-200 rounded-[20px] hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer snap-start"
            >
              <CardContent className="p-4">
                <div className="relative aspect-video rounded-[16px] overflow-hidden group mb-3 border border-gray-200">
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold text-[16px] text-navy mb-2 font-display">
                  {lesson.title}
                </h4>
                <p className="text-[14px] text-text-secondary italic mb-3">
                  "{lesson.phrase}"
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-100">
                      <AvatarImage
                        src={lesson.tutor.avatar}
                        alt={lesson.tutor.name}
                      />
                      <AvatarFallback>
                        {lesson.tutor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium text-text-primary">
                      {lesson.tutor.name}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-gray-200 rounded-[12px] text-xs"
                  >
                    {lesson.learners} learners
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>{" "}
    </div>
  );
}
