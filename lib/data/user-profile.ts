// lib/data/user-profile.ts

import { UserProfile } from '../types/roleplay';

/**
 * Default user profile - Rahul's configuration
 * This profile is optimized for upper-intermediate learners
 * who need confidence building in real-world conversations
 */
export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Rahul',
  level: 'B2', // Upper-Intermediate
  nativeLanguage: 'Hinglish (हिन्दी)',

  learningGoals: [
    'Speak English confidently at work and with strangers',
    'Communicate clearly in meetings and presentations',
    'Express ideas and thoughts with confidence and clarity',
    'Sound professional and articulate in work settings',
  ],

  challenges: {
    primary: [
      'Self-conscious about accent when speaking',
      'Gets nervous during English conversations',
      'Runs out of vocabulary mid-conversation',
      'Worries about making grammar mistakes',
      'Uncertain about pronunciation of certain words',
    ],
    conversation: [
      'Difficulty starting conversations naturally',
      'Struggles to maintain conversation flow',
      "Often can't find the right words in the moment",
      'Hard time explaining complex thoughts clearly',
      'Hesitates or pauses too much while speaking',
    ],
  },

  challengesContext:
    'Rahul has strong English fundamentals but lacks confidence in real-time speaking situations. ' +
    'He overthinks his accent and grammar, which makes him nervous and causes hesitation. ' +
    'He knows more vocabulary than he actually uses because he\'s afraid of making mistakes. ' +
    'In meetings, he has good ideas but struggles to articulate them clearly and confidently. ' +
    'He needs practice with spontaneous conversation and building fluency without the fear of judgment. ' +
    'He benefits most from natural conversation practice that builds his confidence gradually.',

  // Enhanced onboarding fields with default values
  gender: 'Male',
  ageRange: '23–27',
  currentStatus: 'Fresher',
  interestedField: ['Technology'],
  primaryGoal: ['Speak confidently at work', 'Clear job interviews'],
  whatStopsYou: ['Fear of being judged', 'Run out of vocabulary', 'Grammar mistakes'],
  fearOfSpeaking: 'Sometimes',
  hardestPart: ['Starting a conversation', 'Finding the right words'],
  feelingWhenSpeak: 'Slightly nervous but okay',
  englishLevel: 'intermediate',
};

/**
 * Helper function to get user profile from localStorage or return default
 */
export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;

  try {
    const stored = localStorage.getItem('lingoRoleplay_userProfile');
    if (stored) {
      return JSON.parse(stored) as UserProfile;
    }
  } catch (error) {
    console.error('Error loading user profile from localStorage:', error);
  }

  return INITIAL_USER_PROFILE;
}

/**
 * Helper function to save user profile to localStorage
 */
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('lingoRoleplay_userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile to localStorage:', error);
  }
}

/**
 * Helper function to update specific fields of user profile
 */
export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const currentProfile = getUserProfile();
  const updatedProfile = { ...currentProfile, ...updates };
  saveUserProfile(updatedProfile);
  return updatedProfile;
}

/**
 * Helper function to increment roleplay completed count
 */
export function incrementRoleplayCount(): void {
  const profile = getUserProfile();
  const updatedProfile = {
    ...profile,
    roleplayCompleted: (profile.roleplayCompleted || 0) + 1,
    lastActiveDate: new Date().toISOString(),
  };
  saveUserProfile(updatedProfile);
}

/**
 * Helper function to add learning time in minutes
 */
export function addLearningTime(minutes: number): void {
  const profile = getUserProfile();
  const updatedProfile = {
    ...profile,
    totalTimeMinutes: (profile.totalTimeMinutes || 0) + minutes,
    lastActiveDate: new Date().toISOString(),
  };
  saveUserProfile(updatedProfile);
}

/**
 * Helper function to update streak and last active date
 * Call this when user completes any learning activity
 */
export function updateStreak(): void {
  const profile = getUserProfile();
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

  // Get last active date
  const lastActive = profile.lastActiveDate
    ? new Date(profile.lastActiveDate).toISOString().split('T')[0]
    : null;

  let newStreak = profile.currentStreak || 0;

  if (!lastActive) {
    // First activity ever
    newStreak = 1;
  } else if (lastActive === today) {
    // Already active today, don't change streak
    return;
  } else {
    // Calculate days difference
    const lastDate = new Date(lastActive);
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day - increment streak
      newStreak = (profile.currentStreak || 0) + 1;
    } else {
      // Missed days - reset streak to 1
      newStreak = 1;
    }
  }

  const updatedProfile = {
    ...profile,
    currentStreak: newStreak,
    lastActiveDate: now.toISOString(),
  };
  saveUserProfile(updatedProfile);
}

/**
 * Helper function to get formatted learning time
 */
export function getFormattedLearningTime(profile: UserProfile): string {
  const minutes = profile.totalTimeMinutes || 0;

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Helper function to get formatted join date
 */
export function getFormattedJoinDate(profile: UserProfile): string {
  if (!profile.joinDate) {
    return 'Recently joined';
  }

  const joinDate = new Date(profile.joinDate);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };

  return `Joined ${joinDate.toLocaleDateString('en-US', options)}`;
}
