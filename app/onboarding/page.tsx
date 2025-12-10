"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Play, Loader2, MessageCircle } from 'lucide-react';
import MessageBubble from '@/components/common/MessageBubble';
import { saveUserProfile, updateUserProfile, INITIAL_USER_PROFILE } from '@/lib/data/user-profile';
import { cn } from '@/lib/utils';
import { UserProfile, ConversationAnalysis, Message } from '@/lib/types/roleplay';
import AssessmentChat from '@/components/assessment/AssessmentChat';
import ResultsBreakdownPage from '@/components/roleplay/ResultsBreakdownPage';
import { gradeAssessment } from '@/lib/services/assessment-chat';
import { generatePersonalizedCourse, savePersonalizedCourse } from '@/lib/services/course-generator-client';
import { stopAudio } from '@/lib/services/aditi-tutor';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form state
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [interestedField, setInterestedField] = useState<string[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<string[]>([]);
  const [whatStopsYou, setWhatStopsYou] = useState<string[]>([]);
  const [fearOfSpeaking, setFearOfSpeaking] = useState('');
  const [hardestPart, setHardestPart] = useState<string[]>([]);
  const [feelingWhenSpeak, setFeelingWhenSpeak] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const [speakingChallenges, setSpeakingChallenges] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  // Assessment state
  const [assessmentMessages, setAssessmentMessages] = useState<any[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<ConversationAnalysis | null>(null);
  const [isGradingAssessment, setIsGradingAssessment] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState('');

  const totalSteps = 16; // Reduced from 18 (consolidated 3 questionnaire steps into 1)
  const progress = (step / totalSteps) * 100;

  // Consolidated questionnaire options
  const emotionalBarriers = [
    'Fear of being judged or making mistakes',
    'Feel anxious & start sweating',
    'Freeze & forget what to say',
    'Nervous about my accent',
    'Avoid speaking situations',
    'Feel embarrassed when speaking'
  ];

  const practicalChallenges = [
    'Not enough practice opportunities',
    'No comfortable practice environment',
    'Run out of vocabulary mid-conversation',
    'Make grammar mistakes',
    'Unclear pronunciation',
    'Hard to start conversations',
    'Hard to maintain flow',
    'Finding right words takes time',
    'Understanding accents',
    'Explaining complex thoughts',
    'Fast speakers / background noise',
    'Other'
  ];

  // Cleanup audio whenever step changes
  useEffect(() => {
    return () => {
      // Stop Web Speech API
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      // Stop Gemini TTS
      stopAudio();
    };
  }, [step]);

  const handleNext = () => {
    // Stop any playing TTS before changing steps
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Stop Gemini TTS
    stopAudio();
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    // Stop any playing TTS before changing steps
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Stop Gemini TTS
    stopAudio();
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleMultiSelect = (value: string, currentValues: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter(v => v !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  const handleComplete = async () => {
    // Map onboarding data to UserProfile format
    const userProfile: UserProfile = {
      name: userName,
      level: englishLevel === 'beginner' ? 'A2' : englishLevel === 'intermediate' ? 'B1' : englishLevel === 'advanced' ? 'C1' : 'C2',
      nativeLanguage: 'Hinglish (हिन्दी)',
      learningGoals: primaryGoal,
      challenges: {
        primary: whatStopsYou,
        conversation: hardestPart,
      },
      challengesContext: `${userName} is learning English to ${primaryGoal.join(', ')}. Main challenges include: ${whatStopsYou.join(', ')}. When speaking, they feel: ${feelingWhenSpeak}.`,

      // Enhanced onboarding fields
      gender,
      ageRange,
      currentStatus,
      interestedField,
      primaryGoal,
      whatStopsYou,
      fearOfSpeaking,
      hardestPart,
      feelingWhenSpeak,
      englishLevel,

      // Initialize progress tracking fields
      joinDate: new Date().toISOString(),
      currentStreak: 0,
      totalTimeMinutes: 0,
      roleplayCompleted: 0,
      lastActiveDate: new Date().toISOString(),
      
      // Include assessment data if available
      assessmentResult: assessmentResult || undefined,
      assessmentCompletedAt: assessmentResult ? new Date().toISOString() : undefined,
      hasPersonalizedCourse: true,
      courseGeneratedAt: new Date().toISOString(),
    };

    // Clear any existing learning progress for fresh start
    localStorage.removeItem('languageLearningProgress');
    
    // Save to localStorage using the unified profile system
    saveUserProfile(userProfile);
    localStorage.setItem('onboardingCompleted', 'true');

    console.log('Onboarding completed! Starting fresh.', userProfile);

    // Generate personalized course in the background if assessment result exists
    if (assessmentResult) {
      generatePersonalizedCourse({
        userData: userProfile,
        assessmentResult: assessmentResult,
        targetUnits: 1,
      }).then(course => {
        savePersonalizedCourse(course);
        console.log('Personalized course generated successfully');
      }).catch(error => {
        console.error('Background course generation failed:', error);
        // Continue anyway, user can use default units
      });
    }

    // Navigate to home page
    router.push('/');
  };

  // Handle skip to home (bypasses onboarding with default profile)
  const handleSkipToHome = () => {
    // Save default profile to localStorage
    saveUserProfile(INITIAL_USER_PROFILE);
    // Mark onboarding as complete
    localStorage.setItem('onboardingCompleted', 'true');
    // Save basic user data
    localStorage.setItem('userData', JSON.stringify({
      userName: INITIAL_USER_PROFILE.name || 'User',
      onboardingCompleted: true
    }));
    // Navigate to home
    router.push('/');
  };

  // Handle skip assessment (for demo purposes)
  const handleSkipAssessment = async () => {
    // Skip directly to completion without assessment
    await handleComplete();
  };

  // Map consolidated challenges to individual fields
  const mapConsolidatedChallenges = (challenges: string[]) => {
    // Map to emotional barriers (whatStopsYou)
    const emotional = challenges.filter(c =>
      emotionalBarriers.includes(c)
    );

    // Map to practical challenges (hardestPart)
    const practical = challenges.filter(c =>
      practicalChallenges.includes(c)
    );

    // Derive feeling from selection
    let feeling = 'Slightly nervous but okay';
    if (challenges.includes('Feel anxious & start sweating')) {
      feeling = 'Anxious & start sweating';
    } else if (challenges.includes('Freeze & forget what to say')) {
      feeling = 'Freeze & forget';
    } else if (challenges.includes('Avoid speaking situations')) {
      feeling = 'I avoid speaking';
    } else if (challenges.includes('Feel embarrassed when speaking')) {
      feeling = 'I speak but feel embarrassed';
    }

    return { emotional, practical, feeling };
  };

  // Handle assessment completion
  const handleAssessmentComplete = async (messages: any[]) => {
    setAssessmentMessages(messages);
    setIsGradingAssessment(true);
    setStep(15); // Auto-advance to grading loader (was Step 17)

    try {
      // Build user profile for assessment
      const userProfile: UserProfile = {
        name: userName,
        level: englishLevel === 'beginner' ? 'A2' : englishLevel === 'intermediate' ? 'B1' : englishLevel === 'advanced' ? 'C1' : 'C2',
        nativeLanguage: 'Hinglish (हिन्दी)',
        learningGoals: primaryGoal,
        challenges: {
          primary: whatStopsYou,
          conversation: hardestPart,
        },
        challengesContext: `${userName} is learning English to ${primaryGoal.join(', ')}.`,
        gender,
        ageRange,
        currentStatus,
        interestedField,
        primaryGoal,
        whatStopsYou,
        fearOfSpeaking,
        hardestPart,
        feelingWhenSpeak,
        englishLevel,
      };

      // Convert assessment messages to Message format for grading
      const messagesToGrade: Message[] = messages.map((msg, idx) => ({
        id: String(idx),
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
        timestamp: Date.now(),
      }));

      // Grade the assessment
      const result = await gradeAssessment(userProfile, messagesToGrade);
      setAssessmentResult(result);
      setIsGradingAssessment(false);
      setStep(16); // Auto-advance to results (was Step 18)
    } catch (error) {
      console.error('Assessment grading failed:', error);
      setIsGradingAssessment(false);
      setStep(16); // Still advance with fallback (was Step 18)
    }
  };

  // Real AI course generation (replaces fake simulation)
  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);

    try {
      // Build complete user profile
      const userProfile: UserProfile = {
        name: userName,
        level: englishLevel === 'beginner' ? 'A2' : englishLevel === 'intermediate' ? 'B1' : englishLevel === 'advanced' ? 'C1' : 'C2',
        nativeLanguage: 'Hinglish (हिन्दी)',
        learningGoals: primaryGoal,
        challenges: {
          primary: whatStopsYou,
          conversation: hardestPart,
        },
        challengesContext: `${userName} is learning English to ${primaryGoal.join(', ')}. Main challenges include: ${whatStopsYou.join(', ')}. When speaking, they feel: ${feelingWhenSpeak}.`,
        gender,
        ageRange,
        currentStatus,
        interestedField,
        primaryGoal,
        whatStopsYou,
        fearOfSpeaking,
        hardestPart,
        feelingWhenSpeak,
        englishLevel,
        joinDate: new Date().toISOString(),
        currentStreak: 0,
        totalTimeMinutes: 0,
        roleplayCompleted: 0,
        lastActiveDate: new Date().toISOString(),
        assessmentResult: assessmentResult || undefined,
        assessmentCompletedAt: assessmentResult ? new Date().toISOString() : undefined,
        hasPersonalizedCourse: true,
        courseGeneratedAt: new Date().toISOString(),
      };

      if (!assessmentResult) {
        console.warn('No assessment result available for course generation');
        // Fallback to fake delay if no assessment
        setTimeout(() => setGenerationComplete(true), 4000);
        return;
      }

      // Generate personalized course using AI (1 unit with 7 lessons)
      const course = await generatePersonalizedCourse({
        userData: userProfile,
        assessmentResult: assessmentResult,
        targetUnits: 1,  // Changed from 7 - we now generate 1 unit with 7 lessons
      });

      // Save course to localStorage
      savePersonalizedCourse(course);

      // Save updated user profile with assessment data
      saveUserProfile(userProfile);

      setGenerationComplete(true);
    } catch (error) {
      console.error('Course generation failed:', error);
      // Still mark as complete even if generation fails (will use default units)
      setTimeout(() => setGenerationComplete(true), 2000);
    }
  };

  const renderStep = () => {
    switch (step) {
      // Step 1: Welcome
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-navy font-display">TimesSpeak</h1>
              <p className="text-base text-text-secondary font-body">
                Start your English learning journey.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleNext}
                className="w-full bg-coral text-white hover:bg-coral-hover py-6 rounded-[16px] font-semibold shadow-md"
              >
                Continue with SSO
              </Button>

              <Button
                variant="ghost"
                onClick={handleSkipToHome}
                className="w-full text-text-secondary hover:text-navy rounded-[16px] font-semibold"
              >
                Skip to Home
              </Button>
            </div>
          </div>
        );

      // Step 2: Name
      case 2:
        const validateName = () => {
          const trimmedName = userName.trim();
          if (!trimmedName) {
            setNameError('Please enter your name');
            return false;
          }
          if (trimmedName.length < 2) {
            setNameError('Name must be at least 2 characters');
            return false;
          }
          if (trimmedName.length > 50) {
            setNameError('Name must be less than 50 characters');
            return false;
          }
          if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
            setNameError('Name can only contain letters and spaces');
            return false;
          }
          setNameError('');
          return true;
        };

        const handleNameSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (validateName()) {
            handleNext();
          }
        };

        return (
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="नमस्ते! शुरू करने के लिए, क्या आप कृपया मुझे अपना नाम बता सकते हैं?"
            >
              Hi! To start, could you please tell me your name?
            </MessageBubble>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2 font-body">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (nameError) setNameError('');
                }}
                onBlur={validateName}
                className={`w-full px-4 py-3 border-2 rounded-[16px] focus:outline-none focus:ring-2 bg-white text-text-primary font-body shadow-sm transition-colors ${
                  nameError
                    ? 'border-error focus:ring-error focus:border-error'
                    : 'border-gray-200 focus:ring-teal focus:border-transparent'
                }`}
                placeholder="e.g., Priya"
              />
              {nameError && (
                <p className="mt-2 text-sm text-error font-body animate-fade-in">
                  {nameError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md"
            >
              Continue
            </Button>
          </form>
        );

      // Step 3: Gender
      case 3:
        const genders = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation={`बढ़िया, ${userName}! आप किस लिंग से पहचान रखते हैं?`}
            >
              Great to meet you, {userName}! What is your gender?
            </MessageBubble>

            <div className="space-y-3">
              {genders.map(g => (
                <Button
                  key={g}
                  onClick={() => {
                    setGender(g);
                    handleNext();
                  }}
                  variant="outline"
                  className="w-full p-4 h-auto border-2 border-gray-200 rounded-[20px] hover:border-teal hover:bg-teal/5 transition-all justify-start font-semibold text-text-primary font-body"
                >
                  {g}
                </Button>
              ))}
            </div>
          </div>
        );

      // Step 4: Age Range
      case 4:
        const ageRanges = ['13–17', '18–22', '23–27', '28–34', '35–44', '45–54', '55+'];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="आपकी उम्र क्या है?"
            >
              What's your age range?
            </MessageBubble>

            <div className="grid grid-cols-2 gap-3">
              {ageRanges.map(age => (
                <Button
                  key={age}
                  onClick={() => {
                    setAgeRange(age);
                    handleNext();
                  }}
                  variant="outline"
                  className="p-4 h-auto border-2 border-gray-200 rounded-[16px] hover:border-teal hover:bg-teal/5 transition-all font-semibold text-text-primary font-body"
                >
                  {age}
                </Button>
              ))}
            </div>
          </div>
        );

      // Step 5: Current Status
      case 5:
        const statuses = ['Student', 'Recent graduate', 'Fresher', 'Working professional', 'Job seeker'];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="आप अभी क्या कर रहे हैं?"
            >
              What's your current status?
            </MessageBubble>

            <div className="space-y-3">
              {statuses.map(status => (
                <Button
                  key={status}
                  onClick={() => {
                    setCurrentStatus(status);
                    handleNext();
                  }}
                  variant="outline"
                  className="w-full p-4 h-auto border-2 border-gray-200 rounded-[20px] hover:border-teal hover:bg-teal/5 transition-all justify-start font-semibold text-text-primary font-body"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        );

      // Step 6: Interested Field
      case 6:
        const fields = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering', 'Customer Service', 'Hospitality', 'Manufacturing', 'Other'];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="आप किस क्षेत्र में रुचि रखते हैं या काम करते हैं?"
            >
              Which field are you interested in or working in? You can select multiple.
            </MessageBubble>

            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {fields.map(field => {
                const isSelected = interestedField.includes(field);

                return (
                  <Button
                    key={field}
                    onClick={() => handleMultiSelect(field, interestedField, setInterestedField)}
                    variant="outline"
                    className={`p-4 h-auto border-2 rounded-[16px] transition-all font-semibold font-body ${
                      isSelected
                        ? 'border-teal bg-teal/10 text-teal shadow-sm'
                        : 'border-gray-200 hover:border-teal hover:bg-teal/5 text-text-primary'
                    }`}
                  >
                    {field}
                    {isSelected && <Check className="w-4 h-4 ml-1 inline" />}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={handleNext}
              disabled={interestedField.length === 0}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        );

      // Step 7: Field Fact
      case 7:
        const fieldName = interestedField[0] || 'your field';

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation={`बहुत अच्छा! यहाँ ${fieldName} के बारे में एक रोचक तथ्य है।`}
            >
              Excellent choice! Here's a quick fact for you, {userName}.
            </MessageBubble>

            <Card className="border-2 border-teal/30 bg-gradient-to-br from-teal/10 to-teal/5 rounded-[24px] shadow-md">
              <CardContent className="p-6 text-center space-y-3">
                <div className="text-4xl mb-2">💡</div>
                <p className="text-xl font-bold text-teal font-display leading-snug">
                  "People in {fieldName.toLowerCase()} with strong English skills earn up to 20% more on average."
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={handleNext}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md"
            >
              Continue
            </Button>
          </div>
        );

      // Step 8: Primary Goal
      case 8:
        const goals = [
          'Clear job interviews',
          'Pass English exam',
          'Move to new place',
          'Speak confidently at work',
          'Presentations & public speaking',
          'Talk to seniors/leadership',
          'Client calls & sales',
          'Study/immigration exams (IELTS/TOEFL/PTE/Duolingo)',
          'Group discussions (campus/placements)',
          'Networking & small talk',
          'Travel abroad',
          'Social/dating',
          'Create content (YouTube/Reels/Podcasts)',
          'Academic performance',
          'Improve email & writing',
          'Other'
        ];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="आप अंग्रेजी क्यों सीखना चाहते हैं? आप कई विकल्प चुन सकते हैं।"
            >
              What's your primary goal for learning English? Select all that apply.
            </MessageBubble>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {goals.map(goal => {
                const isSelected = primaryGoal.includes(goal);

                return (
                  <Button
                    key={goal}
                    onClick={() => handleMultiSelect(goal, primaryGoal, setPrimaryGoal)}
                    variant="outline"
                    className={`w-full p-3 h-auto border-2 rounded-[16px] transition-all justify-start text-left ${
                      isSelected
                        ? 'border-teal bg-teal/10 shadow-sm'
                        : 'border-gray-200 hover:border-teal hover:bg-teal/5'
                    }`}
                  >
                    <span className={`text-sm font-semibold font-body ${isSelected ? 'text-teal' : 'text-text-primary'}`}>
                      {goal}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-teal ml-auto" />}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={handleNext}
              disabled={primaryGoal.length === 0}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        );

      // Step 9: Consolidated Speaking Challenges (replaces old Steps 9, 12, 13)
      case 9:
        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="आपकी अंग्रेजी बोलने की यात्रा में क्या चुनौतियां हैं?"
            >
              What challenges do you face in your English speaking journey? Select all that apply.
            </MessageBubble>

            {/* Emotional Barriers Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-navy">How do you feel when speaking?</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {emotionalBarriers.map(challenge => {
                  const isSelected = speakingChallenges.includes(challenge);

                  return (
                    <Button
                      key={challenge}
                      onClick={() => handleMultiSelect(challenge, speakingChallenges, setSpeakingChallenges)}
                      variant="outline"
                      className={cn(
                        "w-full p-3 h-auto border-2 rounded-[16px] transition-all justify-start text-left",
                        isSelected
                          ? "border-coral bg-coral/10 shadow-sm"
                          : "border-gray-200 hover:border-coral hover:bg-coral/5"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-semibold font-body",
                        isSelected ? "text-coral" : "text-text-primary"
                      )}>
                        {challenge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-coral ml-auto" />}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Practical Challenges Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-navy">What's technically difficult for you?</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {practicalChallenges.map(challenge => {
                  const isSelected = speakingChallenges.includes(challenge);

                  return (
                    <Button
                      key={challenge}
                      onClick={() => handleMultiSelect(challenge, speakingChallenges, setSpeakingChallenges)}
                      variant="outline"
                      className={cn(
                        "w-full p-3 h-auto border-2 rounded-[16px] transition-all justify-start text-left",
                        isSelected
                          ? "border-coral bg-coral/10 shadow-sm"
                          : "border-gray-200 hover:border-coral hover:bg-coral/5"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-semibold font-body",
                        isSelected ? "text-coral" : "text-text-primary"
                      )}>
                        {challenge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-coral ml-auto" />}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => {
                // Map consolidated challenges to legacy fields
                const { emotional, practical, feeling } = mapConsolidatedChallenges(speakingChallenges);
                setWhatStopsYou(emotional);
                setHardestPart(practical);
                setFeelingWhenSpeak(feeling);
                handleNext();
              }}
              disabled={speakingChallenges.length === 0}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        );

      // Step 10: Empathy Message
      case 10:
        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation={`${userName}, आप इसमें बिल्कुल अकेले नहीं हैं।`}
            >
              You're not alone in this at all, {userName}.
            </MessageBubble>

            <Card className="border-2 border-success/30 bg-gradient-to-br from-success/10 to-success/5 rounded-[24px] shadow-md">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-bold text-success font-display text-center">
                  "Totally normal — 7 in 10 learners pick the same challenges."
                </p>
                <div className="h-px bg-success/20"></div>
                <p className="text-sm text-text-primary font-body text-center leading-relaxed">
                  The good news? Our users see a <span className="text-success font-bold">60% improvement in confidence</span> with just 10 minutes of daily practice.
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={handleNext}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md"
            >
              Continue
            </Button>
          </div>
        );

      // Step 11: Fear of Speaking First
      case 11:
        const fearOptions = ['Yes', 'Sometimes', 'No'];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="क्या आपको पहले बोलने में डर लगता है?"
            >
              Do you fear speaking first in conversations?
            </MessageBubble>

            <div className="space-y-3">
              {fearOptions.map(option => (
                <Button
                  key={option}
                  onClick={() => {
                    setFearOfSpeaking(option);
                    handleNext();
                  }}
                  variant="outline"
                  className="w-full p-4 h-auto border-2 border-gray-200 rounded-[20px] hover:border-navy hover:bg-navy/5 transition-all justify-center font-bold text-navy font-body"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      // Step 12: English Level (was Step 14)
      case 12:
        const levels = [
          { id: 'beginner', name: 'Beginner (A1-A2)', desc: 'I know basic words and simple sentences' },
          { id: 'intermediate', name: 'Intermediate (B1-B2)', desc: 'I can have conversations but struggle sometimes' },
          { id: 'advanced', name: 'Advanced (C1-C2)', desc: 'I speak well but want to sound more natural' },
          { id: 'native', name: 'Near-Native', desc: 'I speak fluently, just need minor improvements' }
        ];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation={`लगभग हो गया! ${userName}, आपका वर्तमान अंग्रेजी स्तर क्या है?`}
            >
              Almost there! What's your current English level, {userName}?
            </MessageBubble>

            <div className="space-y-3">
              {levels.map(level => (
                <Button
                  key={level.id}
                  onClick={() => {
                    setEnglishLevel(level.id);
                    handleNext();
                  }}
                  variant="outline"
                  className="w-full p-4 h-auto border-2 border-gray-200 rounded-[20px] hover:border-navy hover:bg-navy/5 transition-all flex-col items-start"
                >
                  <span className="font-bold text-navy font-body mb-1">{level.name}</span>
                  <span className="text-xs text-text-secondary font-body">{level.desc}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      // Step 13: Assessment Introduction (was Step 15)
      case 13:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="text-5xl mb-2">🎯</div>
              <h2 className="text-2xl font-bold text-navy font-display">
                Let's Check Your Skills
              </h2>
              <p className="text-sm text-text-secondary font-body">
                Quick 2-minute conversation to understand your current level better
              </p>
            </div>

            <Card className="border-2 border-teal/20 bg-gradient-to-br from-teal/5 to-white rounded-[24px] shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy mb-1 font-body">What to Expect</h3>
                    <ul className="text-sm text-text-secondary space-y-2 font-body">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-teal mt-0.5 flex-shrink-0" />
                        <span>5 friendly conversation questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-teal mt-0.5 flex-shrink-0" />
                        <span>Type or speak your answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-teal mt-0.5 flex-shrink-0" />
                        <span>Get detailed skill breakdown</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-teal mt-0.5 flex-shrink-0" />
                        <span>Personalized course based on results</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={handleNext}
                className="w-full bg-teal text-white hover:bg-teal-hover py-4 rounded-[16px] font-semibold shadow-md"
              >
                Start Assessment
              </Button>

              <Button
                onClick={handleSkipAssessment}
                variant="ghost"
                className="w-full text-sm text-text-secondary hover:text-navy hover:bg-gray-100 py-3 rounded-[16px] font-semibold transition-colors"
              >
                Skip Assessment (Demo Mode)
              </Button>
            </div>

            <p className="text-xs text-center text-text-secondary font-body">
              Don't worry, this is just to help us personalize your learning!
            </p>
          </div>
        );

      // Step 14: Assessment Chat (was Step 16)
      case 14:
        return (
          <div className="fixed inset-0 bg-bg-primary z-50">
            <AssessmentChat
              userProfile={{
                name: userName,
                level: englishLevel === 'beginner' ? 'A2' : englishLevel === 'intermediate' ? 'B1' : englishLevel === 'advanced' ? 'C1' : 'C2',
                nativeLanguage: 'Hinglish (हिन्दी)',
                learningGoals: primaryGoal,
                challenges: {
                  primary: whatStopsYou,
                  conversation: hardestPart,
                },
                challengesContext: `${userName} is learning English to ${primaryGoal.join(', ')}.`,
                gender,
                ageRange,
                currentStatus,
                interestedField,
                primaryGoal,
                whatStopsYou,
                fearOfSpeaking,
                hardestPart,
                feelingWhenSpeak,
                englishLevel,
              }}
              onComplete={handleAssessmentComplete}
            />
          </div>
        );

      // Step 15: Grading Loader (was Step 17)
      case 15:
        return (
          <div className="space-y-6 text-center">
            <div className="text-5xl mb-2">📊</div>
            <h2 className="text-2xl font-bold text-navy font-display">
              Analyzing Your Performance
            </h2>
            <p className="text-sm text-text-secondary font-body">
              Evaluating your pronunciation, vocabulary, grammar, fluency, clarity, and listening skills...
            </p>
            <div className="flex justify-center items-center gap-3 mt-6">
              <Loader2 className="h-6 w-6 text-teal animate-spin" />
              <p className="text-sm font-semibold text-teal font-body">
                Processing assessment...
              </p>
            </div>
          </div>
        );

      // Step 16: Assessment Results (was Step 18, Final Step)
      case 16:
        if (!assessmentResult) {
          // Fallback if no results
          return (
            <div className="space-y-6 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-navy font-display mb-2">
                Assessment Incomplete
              </h2>
              <p className="text-sm text-text-secondary font-body mb-4">
                Something went wrong with the assessment.
              </p>
              <Button
                onClick={() => setStep(13)}
                className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold"
              >
                Retry Assessment
              </Button>
            </div>
          );
        }

        return (
          <div className="fixed inset-0 z-50 bg-white">
            <ResultsBreakdownPage
              userName={userName}
              analysis={assessmentResult}
              onNavigate={(destination) => {
                if (destination === 'explore') {
                  handleComplete();
                } else if (destination === 'retake') {
                  setAssessmentResult(null);
                  setStep(13);
                }
              }}
              onBack={handleComplete}
              continueButtonText="Start Learning Journey"
            />
          </div>
        );

      // Commented out - Step 19: AI Personalization Loader
      // case 19:
      //   if (!isGenerating && !generationComplete) {
      //     handleGenerateRoadmap();
      //   }

      //   return (
      //     <div className="space-y-6">
      //       <div className="text-center space-y-3">
      //         <div className="text-5xl mb-2">🎯</div>
      //         <h2 className="text-2xl font-bold text-navy font-display">
      //           {generationComplete ? 'All Set!' : 'Creating Your Journey'}
      //         </h2>

      //         {!generationComplete ? (
      //           <>
      //             <p className="text-sm text-text-secondary font-body">
      //               We're creating your personalized learning roadmap...
      //             </p>

      //             <div className="space-y-4 mt-6">
      //               <div className="flex items-center justify-center gap-3">
      //                 <Loader2 className="h-5 w-5 text-teal animate-spin" />
      //                 <p className="text-sm font-semibold text-teal font-body">
      //                   Analyzing your goals...
      //                 </p>
      //               </div>

      //               <div className="flex items-center justify-center gap-3 opacity-60">
      //                 <Loader2 className="h-5 w-5 text-coral animate-spin" />
      //                 <p className="text-sm font-semibold text-coral font-body">
      //                   Selecting right scenarios...
      //                 </p>
      //               </div>

      //               <div className="flex items-center justify-center gap-3 opacity-40">
      //                 <Loader2 className="h-5 w-5 text-navy animate-spin" />
      //                 <p className="text-sm font-semibold text-navy font-body">
      //                   Preparing your journey...
      //                 </p>
      //               </div>
      //             </div>
      //           </>
      //         ) : (
      //           <Card className="border-2 border-teal/30 bg-gradient-to-br from-teal/10 to-teal/5 rounded-[24px] shadow-md mt-6">
      //             <CardContent className="p-6 text-center space-y-3">
      //               <div className="text-4xl mb-2">✨</div>
      //               <p className="text-lg font-bold text-teal font-display">
      //                 All set! We're ready for your first lesson.
      //               </p>
      //               <p className="text-sm text-text-secondary font-body">
      //                 Your personalized learning path is ready, {userName}!
      //               </p>
      //             </CardContent>
      //           </Card>
      //         )}
      //       </div>

      //       {generationComplete && (
      //         <Button
      //           onClick={handleNext}
      //           className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md"
      //         >
      //           Continue
      //         </Button>
      //       )}
      //     </div>
      //   );

      // Commented out - Step 20: Video Introduction
      // case 20:
      //   return (
      //     <div className="space-y-6">
      //       <div className="text-center space-y-3">
      //         <div className="text-5xl">🎉</div>
      //         <h2 className="text-2xl font-bold text-navy font-display">
      //           One Last Thing!
      //         </h2>
      //         <p className="text-sm text-text-secondary font-body">
      //           Watch this quick video to see how TimesSpeak works
      //         </p>
      //       </div>

      //       {/* Video Player */}
      //       <Card className="border-gray-200 rounded-[24px] overflow-hidden shadow-lg">
      //         <div className="relative aspect-video bg-gradient-to-br from-navy via-teal to-coral flex items-center justify-center">
      //           <div className="absolute inset-0 flex items-center justify-center">
      //             <div className="text-center text-white">
      //               <Play className="w-16 h-16 mb-4 mx-auto opacity-50" />
      //               <p className="text-sm font-semibold mb-2 font-body">Introduction Video</p>
      //               <p className="text-xs opacity-80 font-body">Coming Soon</p>
      //             </div>
      //           </div>
      //         </div>
      //       </Card>

      //       <Button
      //         onClick={handleComplete}
      //         className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md"
      //       >
      //         Start Learning
      //       </Button>

      //       <p className="text-xs text-center text-text-secondary font-body">
      //         Skip the intro and start your learning journey
      //       </p>
      //     </div>
      //   );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-primary">
      <div className="w-full max-w-md mx-auto p-6">
        {/* Progress Bar */}
        {step > 1 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-text-secondary font-body">
                Step {step - 1} of {totalSteps - 1}
              </span>
              <span className="text-xs font-bold text-teal font-body">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal to-teal-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[450px] flex flex-col justify-center">
          {renderStep()}
        </div>

        {/* Back Button */}
        {step > 1 && step < 16 && (
          <Button
            onClick={handleBack}
            variant="ghost"
            className="w-full text-center text-sm font-semibold text-text-secondary hover:text-navy transition-colors mt-4"
          >
            Back
          </Button>
        )}
      </div>

    </div>
  );
}
