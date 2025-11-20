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
