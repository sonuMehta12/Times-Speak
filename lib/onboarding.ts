// Onboarding utility functions

export interface UserData {
  userName: string;
  selectedLanguage: string;
  selectedGoals: string[];
  selectedField: string;
  selectedPainPoints: string[];
  selectedLevel: string;
  completedAt: string;
}

export const onboardingUtils = {
  // Check if onboarding is completed
  isOnboardingCompleted: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('onboardingCompleted') === 'true';
  },

  // Get user data
  getUserData: (): UserData | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  },

  // Save onboarding completion
  completeOnboarding: (userData: UserData): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
  },

  // Reset onboarding (for testing)
  resetOnboarding: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('userData');
  },

  // Get user name
  getUserName: (): string => {
    const userData = onboardingUtils.getUserData();
    return userData?.userName || 'User';
  }
};
