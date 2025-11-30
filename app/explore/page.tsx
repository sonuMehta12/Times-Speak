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
        {/* Categories Section */}
        <section
          className="mb-6 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
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
          {/* <h2 className="font-display text-lg font-bold text-navy mb-4 px-4">
            {activeCategory === 'all' ? 'All Scenarios' : `${categories.find(c => c.id === activeCategory)?.label} Scenarios`}
          </h2> */}
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
