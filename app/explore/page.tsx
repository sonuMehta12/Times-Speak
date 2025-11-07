"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  Sparkles,
  Briefcase,
  Plane,
  Utensils,
  ShoppingBag,
  Stethoscope,
  MessageSquare,
  Globe,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data with proper typing
interface FeaturedScenario {
  id: number;
  title: string;
  description: string;
  time: string;
  level: string;
  imageUrl: string;
  badge: string;
  badgeColor: "gold" | "coral" | "teal";
}

interface Category {
  id: string;
  label: string;
  icon: any;
}

interface Scenario {
  id: number;
  title: string;
  time: string;
  rating: number;
  level: string;
  imageUrl: string;
  learners: string;
}

const featuredScenarios: FeaturedScenario[] = [
  {
    id: 1,
    title: "Job Interview Masterclass",
    description:
      "Practice common interview questions with AI feedback on your responses.",
    time: "15-20 min",
    level: "Intermediate",
    imageUrl:
      "https://img.freepik.com/free-vector/job-interview-concept-illustration_114360-2186.jpg",
    badge: "Most Popular",
    badgeColor: "gold",
  },
  {
    id: 2,
    title: "Airport & Travel Essentials",
    description:
      "Navigate airports, hotels, and travel situations with confidence.",
    time: "10-15 min",
    level: "Beginner",
    imageUrl:
      "https://i.pinimg.com/736x/ec/9e/ed/ec9eed37831104a89527eb059e74fac1.jpg",
    badge: "Trending",
    badgeColor: "coral",
  },
  {
    id: 3,
    title: "Business Presentations",
    description: "Deliver compelling presentations with professional language.",
    time: "20-25 min",
    level: "Advanced",
    imageUrl: "https://source.unsplash.com/random/400x300?presentation,office",
    badge: "New",
    badgeColor: "teal",
  },
];

const categories: Category[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "interview", label: "Interview", icon: Briefcase },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "medical", label: "Medical", icon: Stethoscope },
  { id: "social", label: "Social", icon: MessageSquare },
];

const allScenarios: Scenario[] = [
  {
    id: 1,
    title: "Job Interview",
    time: "15 min",
    rating: 4.8,
    level: "Medium",
    imageUrl:
      "https://img.freepik.com/free-vector/job-interview-concept-illustration_114360-2186.jpg",
    learners: "5.8K",
  },
  {
    id: 2,
    title: "Music Talk",
    time: "10 min",
    rating: 4.9,
    level: "Easy",
    imageUrl:
      "https://thumbs.dreamstime.com/z/music-speech-illustration-vector-concept-flat-style-163450591.jpg",
    learners: "4.2K",
  },
  {
    id: 3,
    title: "Hotel Check-in",
    time: "12 min",
    rating: 4.7,
    level: "Easy",
    imageUrl:
      "https://img.freepik.com/free-vector/hotel-reception-concept-illustration_114360-2291.jpg",
    learners: "3.5K",
  },
  {
    id: 4,
    title: "Restaurant Order",
    time: "8 min",
    rating: 4.9,
    level: "Easy",
    imageUrl:
      "https://img.freepik.com/free-vector/visitors-sit-cafe-while-bartender-makes-cocktail-waitress-brings-food-vector-illustration_1284-69024.jpg",
    learners: "6.1K",
  },
  {
    id: 5,
    title: "Doctor Visit",
    time: "18 min",
    rating: 4.6,
    level: "Hard",
    imageUrl:
      "https://img.freepik.com/free-vector/doctor-patient-clinic_1308-47544.jpg",
    learners: "2.9K",
  },
  {
    id: 6,
    title: "Shopping Mall",
    time: "10 min",
    rating: 4.8,
    level: "Easy",
    imageUrl:
      "https://static.vecteezy.com/system/resources/previews/008/064/224/original/shopping-mall-illustration-free-vector.jpg",
    learners: "4.7K",
  },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const userName = "John";

  const getBadgeStyles = (color: "gold" | "coral" | "teal") => {
    const styles = {
      gold: "bg-gold text-navy",
      coral: "bg-coral text-white",
      teal: "bg-teal text-white",
    };
    return styles[color];
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-teal/10 text-teal border-teal/20",
      Medium: "bg-gold/10 text-navy border-gold/30",
      Hard: "bg-coral/10 text-coral border-coral/20",
      Beginner: "bg-teal/10 text-teal border-teal/20",
      Intermediate: "bg-gold/10 text-navy border-gold/30",
      Advanced: "bg-coral/10 text-coral border-coral/20",
    };
    return colors[level] || "bg-navy/10 text-navy border-navy/20";
  };

  return (
    <div className="w-full -mt-4 -mx-4">
      <main className="px-4 pb-6 pt-6 bg-bg-primary min-h-screen">
        {/* Featured Section */}
        <section className="mb-8 animate-fade-in-up">
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="flex-shrink-0 w-[85%] snap-center border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-[24px] overflow-hidden"
              >
                <div className="relative h-48 w-full bg-gradient-to-br from-navy/5 to-teal/5">
                  <img
                    src={scenario.imageUrl}
                    alt={scenario.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-3 left-3 ${getBadgeStyles(
                      scenario.badgeColor
                    )} border-0 rounded-[12px] shadow-md font-semibold`}
                  >
                    {scenario.badge}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                    {scenario.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{scenario.time}</span>
                    </div>
                    <Badge
                      className={`${getLevelColor(
                        scenario.level
                      )} border rounded-[12px]`}
                    >
                      {scenario.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Create Custom Card */}
        <Card
          className="mb-8 animate-fade-in-up border-2 border-dashed border-gold/30 hover:border-gold hover:shadow-md transition-all duration-300 cursor-pointer rounded-[24px] overflow-hidden bg-gradient-to-br from-gold/5 to-navy/5"
          style={{ animationDelay: "100ms" }}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-[16px] bg-gradient-to-br from-gold to-navy flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-display text-base font-bold text-navy mb-2">
              Create Custom Scenario
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Design your own role-play with AI assistance
            </p>
            <Button className="bg-navy text-white hover:bg-navy/90 rounded-[16px] font-semibold h-11">
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Categories Section */}
        <section
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="font-display text-lg font-bold text-navy mb-4">
            Categories
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant="outline"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex-col h-auto p-4 min-w-[100px] rounded-[20px] transition-all duration-300 ${
                    isActive
                      ? "bg-navy text-white border-navy shadow-md hover:bg-navy/90"
                      : "bg-white border-gray-200 hover:shadow-md hover:-translate-y-1"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-[16px] flex items-center justify-center mb-2 ${
                      isActive ? "bg-white/20" : "bg-navy/5"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isActive ? "text-white" : "text-navy"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isActive ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {cat.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </section>

        {/* All Scenarios Grid */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="font-display text-lg font-bold text-navy mb-4">
            All Scenarios
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {allScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-[16px] overflow-hidden"
              >
                <div className="relative h-32 w-full bg-gradient-to-br from-navy/5 to-teal/5">
                  <img
                    src={scenario.imageUrl}
                    alt={scenario.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${getLevelColor(
                      scenario.level
                    )} border rounded-[8px] text-xs`}
                  >
                    {scenario.level}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm text-text-primary mb-2 line-clamp-1">
                    {scenario.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{scenario.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-gold fill-gold" />
                      <span className="font-semibold">{scenario.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-text-secondary">
                    <Users className="h-3 w-3" />
                    <span>{scenario.learners} learners</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
