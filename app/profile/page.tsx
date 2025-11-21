"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut, Bell, Shield, HelpCircle, Flame, Clock, Target, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUserProfile, getFormattedLearningTime, getFormattedJoinDate } from '@/lib/data/user-profile';
import { UserProfile } from '@/lib/types/roleplay';

// Settings Row Component
const SettingsRow: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}> = ({ icon: Icon, label, onClick }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 h-auto bg-bg-elevated rounded-[16px] hover:bg-gray-200 hover:shadow-sm transition-all active:scale-[0.98] border border-gray-200"
  >
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 bg-navy/10 rounded-[12px] flex items-center justify-center">
        <Icon className="h-5 w-5 text-navy" />
      </div>
      <span className="font-semibold text-text-primary text-base">
        {label}
      </span>
    </div>
    <ChevronRight className="h-5 w-5 text-text-tertiary" />
  </Button>
);

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  iconColor: string;
}> = ({ icon: Icon, value, label, color, iconColor }) => (
  <Card className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-200 flex flex-col items-center gap-2 text-center transition-all hover:-translate-y-1 hover:shadow-md">
    <CardContent className="p-0 flex flex-col items-center gap-2">
      <div className={`h-12 w-12 rounded-[12px] flex items-center justify-center ${color}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="font-bold text-2xl text-navy font-display">
          {value}
        </p>
        <p className="text-xs text-text-secondary font-medium">
          {label}
        </p>
      </div>
    </CardContent>
  </Card>
);

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load user profile from localStorage
  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
  }, []);

  const handleAccountSettings = () => {
    console.log('Account settings');
  };

  const handleNotifications = () => {
    console.log('Notifications');
  };

  const handlePrivacy = () => {
    console.log('Privacy & Security');
  };

  const handleHelp = () => {
    console.log('Help & Support');
  };

  const handleLogout = () => {
    // Clear all user data to restart flow
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('lingoRoleplay_userProfile');
    localStorage.removeItem('userData');

    // Reload the page to trigger onboarding
    window.location.reload();
  };

  // Show loading state while profile loads
  if (!userProfile) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
     

      {/* User Info Section */}
      <section className="flex flex-col items-center text-center mb-8 animate-fade-in-down" style={{ animationDelay: '100ms' }}>
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 bg-coral border-4 border-white shadow-lg">
            <AvatarFallback className="bg-coral text-white font-bold text-5xl">
              {userProfile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h2 className="font-display text-3xl font-bold text-navy mb-1">
          {userProfile.name}
        </h2>
        <p className="text-text-secondary text-sm mb-2">
          {getFormattedJoinDate(userProfile)}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full">
            {userProfile.level} - {userProfile.englishLevel === 'beginner' ? 'Beginner' : userProfile.englishLevel === 'intermediate' ? 'Intermediate' : userProfile.englishLevel === 'advanced' ? 'Advanced' : 'Near-Native'}
          </span>
        </div>
        {userProfile.currentStatus && (
          <p className="text-text-secondary text-xs">
            {userProfile.currentStatus}
            {userProfile.interestedField && userProfile.interestedField.length > 0 && ` • ${userProfile.interestedField.join(', ')}`}
          </p>
        )}
      </section>

      {/* Stats Section */}
      <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h3 className="font-display text-lg font-bold text-navy mb-4">
          Your Progress
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Flame}
            value={userProfile.currentStreak?.toString() || '0'}
            label="Day Streak"
            color="bg-coral/10"
            iconColor="text-coral"
          />
          <StatCard
            icon={Clock}
            value={getFormattedLearningTime(userProfile)}
            label="Time Learned"
            color="bg-teal/10"
            iconColor="text-teal"
          />
          <StatCard
            icon={Target}
            value={userProfile.roleplayCompleted?.toString() || '0'}
            label="Roleplays"
            color="bg-navy/10"
            iconColor="text-navy"
          />
        </div>
      </section>

      {/* Learning Journey Section */}
      {userProfile.learningGoals && userProfile.learningGoals.length > 0 && (
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <h3 className="font-display text-lg font-bold text-navy mb-4">
            Your Learning Goals
          </h3>
          <Card className="bg-gradient-to-br from-teal/5 to-coral/5 border-2 border-gray-200 rounded-[20px] shadow-sm">
            <CardContent className="p-5 space-y-3">
              {userProfile.learningGoals.slice(0, 3).map((goal, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal"></div>
                  </div>
                  <p className="text-sm text-text-primary font-medium leading-relaxed">
                    {goal}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Challenges Section */}
      {userProfile.challenges?.primary && userProfile.challenges.primary.length > 0 && (
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="font-display text-lg font-bold text-navy mb-4">
            Working On
          </h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.challenges.primary.slice(0, 4).map((challenge, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-white border-2 border-gray-200 rounded-[12px] text-xs font-semibold text-text-secondary hover:border-coral hover:text-coral transition-colors"
              >
                {challenge}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Settings Section */}
      <section className="space-y-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h3 className="font-display text-lg font-bold text-navy mb-4">
          Settings & More
        </h3>
        <SettingsRow 
          icon={UserIcon} 
          label="Account Settings" 
          onClick={handleAccountSettings} 
        />
        <SettingsRow 
          icon={Bell} 
          label="Notifications" 
          onClick={handleNotifications} 
        />
        <SettingsRow 
          icon={Shield} 
          label="Privacy & Security" 
          onClick={handlePrivacy} 
        />
        <SettingsRow 
          icon={HelpCircle} 
          label="Help & Support" 
          onClick={handleHelp} 
        />
      </section>

      {/* Logout Button */}
      <section className="mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 h-auto bg-error/10 text-error hover:bg-error/20 font-semibold rounded-[16px] transition-all active:scale-[0.98] border border-error/20"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </section>
    </div>
  );
}