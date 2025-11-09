"use client";

import React, { useState, useEffect } from 'react';
import OnboardingOverlay from './OnboardingOverlay';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export default function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
    
    setIsChecking(false);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-card">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  // Show onboarding overlay if not completed
  if (showOnboarding) {
    return <OnboardingOverlay onComplete={handleOnboardingComplete} />;
  }

  // Show normal app
  return <>{children}</>;
}
