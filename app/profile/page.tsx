"use client";

import React from 'react';
import { ChevronRight, LogOut, Bell, Shield, HelpCircle, Flame, Clock, BookOpen, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
  const userName = "John"; // Replace with actual user from auth/context

  const handleBack = () => {
    window.history.back();
    // Or use: router.push('/') if using next/navigation
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page
    console.log('Edit profile');
  };

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
    // Add logout logic
    console.log('Logout');
  };

  return (
    <div className="w-full">
     

      {/* User Info Section */}
      <section className="flex flex-col items-center text-center mb-8 animate-fade-in-down" style={{ animationDelay: '100ms' }}>
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 bg-coral border-4 border-white shadow-lg">
            <AvatarFallback className="bg-coral text-white font-bold text-5xl">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h2 className="font-display text-3xl font-bold text-navy mb-1">
          {userName}
        </h2>
        <p className="text-text-secondary text-sm mb-3">
          Joined November 2023
        </p>
        
      </section>

      {/* Stats Section */}
      <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h3 className="font-display text-lg font-bold text-navy mb-4">
          Your Progress
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard 
            icon={Flame} 
            value="3" 
            label="Day Streak" 
            color="bg-coral/10" 
            iconColor="text-coral" 
          />
          <StatCard 
            icon={Clock} 
            value="12h" 
            label="Time Learned" 
            color="bg-teal/10" 
            iconColor="text-teal" 
          />
          <StatCard 
            icon={BookOpen} 
            value="84" 
            label="Words Mastered" 
            color="bg-navy/10" 
            iconColor="text-navy" 
          />
        </div>
      </section>

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