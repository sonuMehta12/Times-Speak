// lib/utils/aditi-greetings.ts

import { UserProfile } from "../types/roleplay";

/**
 * Get a random greeting message from Aditi based on user context
 * Returns one of 6 contextual greetings
 */
export function getRandomAditiGreeting(userProfile: UserProfile): string {
  const userName = userProfile.name || 'there';
  const primaryGoal = userProfile.primaryGoal?.[0] || 'improve your English';
  const field = userProfile.interestedField?.[0] || 'your field';
  const currentStreak = userProfile.currentStreak || 0;

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  const greetings: string[] = [
    // Greeting 1: Time-based + Goal-focused
    `Good ${timeOfDay}, ${userName}! Ready to practice English? Let's work on helping you ${primaryGoal.toLowerCase()} today!`,

    // Greeting 2: Encouraging + Scenario-based
    `Hi ${userName}! I'm Aditi, your English practice partner. Want to try a work scenario, play a game, or just chat freely?`,

    // Greeting 3: Field-specific
    `Hey ${userName}! Let's practice some real-world English conversations about ${field}. What would you like to talk about today?`,

    // Greeting 4: Streak-aware (if they have a streak)
    currentStreak > 0
      ? `Welcome back, ${userName}! You're on a ${currentStreak}-day streak! Let's keep that momentum going. What shall we practice?`
      : `Hi ${userName}! Great to see you here. Let's start building your confidence in English. Ready to begin?`,

    // Greeting 5: Choice-driven
    `Hello ${userName}! What sounds good today - a work roleplay, vocabulary building, or natural conversation practice?`,

    // Greeting 6: Motivational + Direct
    `Hey ${userName}! Every conversation makes you better. Let's practice speaking English without fear. What's on your mind today?`,
  ];

  // Return a random greeting
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

/**
 * Get initial Hinglish translation for the greeting
 */
export function getGreetingHinglish(userProfile: UserProfile): string {
  const userName = userProfile.name || 'dost';

  const hinglishGreetings: string[] = [
    `Namaste ${userName}! Aaj hum English practice karenge. Ready ho?`,
    `Hi ${userName}! Main Aditi hoon, tumhari English teacher. Kya practice karna chahoge - work scenario, game, ya free chat?`,
    `Hey ${userName}! Chalo aaj kuch real conversations practice karte hain. Tumhe kis baare mein baat karni hai?`,
    `Welcome back ${userName}! Chalo apni English ko aur better banate hain. Kya practice karein aaj?`,
    `Hello ${userName}! Aaj kya karna hai - roleplay, vocabulary ya casual conversation?`,
    `Hey ${userName}! Har conversation se tum better ban rahe ho. Aaj kya discuss karenge?`,
  ];

  const randomIndex = Math.floor(Math.random() * hinglishGreetings.length);
  return hinglishGreetings[randomIndex];
}

/**
 * Get initial hint options for the greeting
 */
export function getGreetingHints(userProfile: UserProfile): string[] {
  const primaryGoal = userProfile.primaryGoal?.[0]?.toLowerCase() || 'practice speaking';

  const hintSets: string[][] = [
    [
      "I'd like to practice a work scenario.",
      "Let's work on job interview conversations.",
      "Can we do some free conversation practice?"
    ],
    [
      "I want to improve my professional communication.",
      "Let's practice speaking about my daily work.",
      "Can we play a vocabulary game to start?"
    ],
    [
      "I'd like to practice casual conversations.",
      "Help me prepare for an important meeting.",
      "Let's work on reducing my fear of speaking."
    ],
    [
      "I want to practice pronunciation and fluency.",
      "Can we roleplay a client pitch scenario?",
      "Let's just have a friendly chat to warm up."
    ],
    [
      "I need help with expressing my ideas clearly.",
      "Let's practice common workplace conversations.",
      "Can we work on my grammar and vocabulary?"
    ],
    [
      "I'd like to practice for job interviews.",
      "Let's do a customer service scenario.",
      "Can we just talk about my day?"
    ],
  ];

  const randomIndex = Math.floor(Math.random() * hintSets.length);
  return hintSets[randomIndex];
}
