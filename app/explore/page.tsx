"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Briefcase,
  Plane,
  Utensils,
  ShoppingBag,
  Stethoscope,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scenario } from "@/lib/types/roleplay";
import { getFeaturedScenarios, getScenariosByCategory } from "@/lib/data/roleplay-scenarios";
import RolePlayCard from "@/components/roleplay/RolePlayCard";

// Category configuration
interface Category {
  id: string;
  label: string;
  icon: any;
}

const categories: Category[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "interview", label: "Interview", icon: Briefcase },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "medical", label: "Medical", icon: Stethoscope },
  { id: "social", label: "Social", icon: MessageSquare },
];

export default function ExplorePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");

  // Get scenarios based on active category
  const displayedScenarios = getScenariosByCategory(activeCategory);
  const featuredScenarios = getFeaturedScenarios();

  // Navigate to dynamic role page
  const handleSelectScenario = (scenario: Scenario) => {
    router.push(`/role/${scenario.id}`);
  };

  return (
    <div className="w-full">
      <main className="pb-6 bg-bg-primary min-h-screen">
        {/* Featured Section */}
        <section className="mb-8 animate-fade-in-up">
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredScenarios.map((scenario) => (
              <RolePlayCard
                key={scenario.id}
                scenario={scenario}
                onSelect={handleSelectScenario}
                variant="featured"
              />
            ))}
          </div>
        </section>

        {/* Create Custom Card */}
        <div className="px-4">
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
        </div>

        {/* Categories Section */}
        <section
          className="mb-6 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="font-display text-lg font-bold text-navy mb-4 px-4">
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
          <h2 className="font-display text-lg font-bold text-navy mb-4 px-4">
            {activeCategory === 'all' ? 'All Scenarios' : `${categories.find(c => c.id === activeCategory)?.label} Scenarios`}
          </h2>
          <div className="grid grid-cols-2 gap-4 px-4">
            {displayedScenarios.map((scenario) => (
              <RolePlayCard
                key={scenario.id}
                scenario={scenario}
                onSelect={handleSelectScenario}
                variant="grid"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
