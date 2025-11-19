"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getScenarioById } from "@/lib/data/roleplay-scenarios";
import { getUserProfile } from "@/lib/data/user-profile";
import ScenarioGuide from "@/components/roleplay/ScenarioGuide";
import ChatInterface from "@/components/roleplay/ChatInterface";
import { Scenario, UserProfile } from "@/lib/types/roleplay";

type ViewMode = 'guide' | 'chat';

export default function RoleplayPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('guide');

  useEffect(() => {
    // Load scenario data
    const loadedScenario = getScenarioById(scenarioId);
    if (!loadedScenario) {
      // Scenario not found, redirect to explore
      router.push('/explore');
      return;
    }
    setScenario(loadedScenario);

    // Load user profile
    const profile = getUserProfile();
    setUserProfile(profile);
  }, [scenarioId, router]);

  if (!scenario || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading scenario...</p>
        </div>
      </div>
    );
  }

  const handleStartChat = () => {
    setViewMode('chat');
  };

  const handleBackToGuide = () => {
    setViewMode('guide');
  };

  const handleBackToExplore = () => {
    router.push('/explore');
  };

  if (viewMode === 'chat') {
    return (
      <ChatInterface
        scenario={scenario}
        userProfile={userProfile}
        onBack={handleBackToGuide}
      />
    );
  }

  return (
    <ScenarioGuide
      scenario={scenario}
      userProfile={userProfile}
      onStart={handleStartChat}
      onBack={handleBackToExplore}
    />
  );
}
