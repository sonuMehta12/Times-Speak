"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export default function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');

    // If not completed and not already on onboarding page, redirect
    if (!onboardingCompleted && pathname !== '/onboarding') {
      router.push('/onboarding');
    }

    setIsChecking(false);
  }, [pathname, router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-card">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  // Show normal app
  return <>{children}</>;
}
