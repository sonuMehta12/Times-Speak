// lib/utils/debug-helpers.ts
// Debug utilities for development - can be called from browser console

/**
 * Clear all learning progress and start fresh
 * Usage in browser console: window.clearProgress()
 */
export function clearLearningProgress() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('languageLearningProgress');
    console.log('✅ Learning progress cleared! Refresh the page to see changes.');
  }
}

/**
 * Clear user profile data
 * Usage in browser console: window.clearProfile()
 */
export function clearUserProfile() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile');
    console.log('✅ User profile cleared!');
  }
}

/**
 * Clear ALL app data (learning progress + profile + onboarding status)
 * Usage in browser console: window.clearAllData()
 */
export function clearAllAppData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('languageLearningProgress');
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('onboardingCompleted');
    console.log('✅ All app data cleared! You can now go through onboarding again.');
    console.log('Redirecting to onboarding...');
    window.location.href = '/onboarding';
  }
}

/**
 * Show current learning progress data
 * Usage in browser console: window.showProgress()
 */
export function showLearningProgress() {
  if (typeof window !== 'undefined') {
    const progress = localStorage.getItem('languageLearningProgress');
    if (progress) {
      const data = JSON.parse(progress);
      console.log('📊 Current Learning Progress:', data);
      console.log(`- Total XP: ${data.totalXP}`);
      console.log(`- Current Streak: ${data.currentStreak} days`);
      console.log(`- Longest Streak: ${data.longestStreak} days`);
      console.log(`- Last Active: ${data.lastActiveDate}`);
      console.log(`- Daily Goal: ${data.dailyGoalMinutes} minutes`);
      console.log(`- Activity Log:`, data.activityLog);
    } else {
      console.log('ℹ️ No learning progress found - fresh user!');
    }
  }
}

/**
 * Show current user profile
 * Usage in browser console: window.showProfile()
 */
export function showUserProfile() {
  if (typeof window !== 'undefined') {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      console.log('👤 User Profile:', JSON.parse(profile));
    } else {
      console.log('ℹ️ No user profile found');
    }
  }
}

// Expose functions to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).clearProgress = clearLearningProgress;
  (window as any).clearProfile = clearUserProfile;
  (window as any).clearAllData = clearAllAppData;
  (window as any).showProgress = showLearningProgress;
  (window as any).showProfile = showUserProfile;

  console.log('🔧 Debug helpers loaded! Available commands:');
  console.log('  - window.clearProgress() - Clear learning progress only');
  console.log('  - window.clearProfile() - Clear user profile only');
  console.log('  - window.clearAllData() - Clear everything and restart onboarding');
  console.log('  - window.showProgress() - View current learning progress');
  console.log('  - window.showProfile() - View current user profile');
}
