"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Play, Loader2, MessageCircle } from 'lucide-react';
import MessageBubble from '@/components/common/MessageBubble';
import { saveUserProfile, updateUserProfile } from '@/lib/data/user-profile';
import { UserProfile, ConversationAnalysis, Message } from '@/lib/types/roleplay';
import AssessmentChat from '@/components/assessment/AssessmentChat';
import ResultsBreakdownPage from '@/components/roleplay/ResultsBreakdownPage';
import { gradeAssessment } from '@/lib/services/assessment-chat';
import { generatePersonalizedCourse, savePersonalizedCourse } from '@/lib/services/course-generator-client';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  // Assessment state
  const [assessmentMessages, setAssessmentMessages] = useState<any[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<ConversationAnalysis | null>(null);
  const [isGradingAssessment, setIsGradingAssessment] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState('');

  const totalSteps = 18; // Updated to include assessment flow steps
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
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

  // Handle assessment completion
  const handleAssessmentComplete = async (messages: any[]) => {
    setAssessmentMessages(messages);
    setIsGradingAssessment(true);
    setStep(17); // Auto-advance to grading loader

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
      setStep(18); // Auto-advance to results
    } catch (error) {
      console.error('Assessment grading failed:', error);
      setIsGradingAssessment(false);
      setStep(18); // Still advance with fallback
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
                onClick={() => router.push('/')}
                className="w-full text-text-secondary hover:text-navy rounded-[16px] font-semibold"
              >
                Visit Home Page
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

      // Step 9: What Stops You
      case 9:
        const barriers = [
          'Less chances to speak',
          'No comfortable environment',
          'Fear of being judged',
          'Afraid of accent',
          'Nervous—start sweating',
          'Freeze & forget words',
          'Run out of vocabulary',
          'Grammar mistakes',
          'Pronunciation not clear',
          'People speak too fast',
          'Background noise on calls',
          'Other'
        ];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="आपको आत्मविश्वास से बोलने से क्या रोकता है?"
            >
              What stops you from speaking confidently? Select all that apply.
            </MessageBubble>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {barriers.map(barrier => {
                const isSelected = whatStopsYou.includes(barrier);

                return (
                  <Button
                    key={barrier}
                    onClick={() => handleMultiSelect(barrier, whatStopsYou, setWhatStopsYou)}
                    variant="outline"
                    className={`w-full p-3 h-auto border-2 rounded-[16px] transition-all justify-start text-left ${
                      isSelected
                        ? 'border-coral bg-coral/10 shadow-sm'
                        : 'border-gray-200 hover:border-coral hover:bg-coral/5'
                    }`}
                  >
                    <span className={`text-sm font-semibold font-body ${isSelected ? 'text-coral' : 'text-text-primary'}`}>
                      {barrier}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-coral ml-auto" />}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={handleNext}
              disabled={whatStopsYou.length === 0}
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

      // Step 12: Hardest Part
      case 12:
        const hardParts = [
          'Starting a conversation',
          'Maintaining flow',
          'Finding the right words',
          'Understanding accents',
          'Explaining complex thoughts',
          'Handling interruptions',
          'Asking/answering follow‑ups',
          'Telling stories',
          'Summarising clearly'
        ];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="बोलने में सबसे कठिन हिस्सा क्या है?"
            >
              What's the hardest part of speaking for you? Select all that apply.
            </MessageBubble>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {hardParts.map(part => {
                const isSelected = hardestPart.includes(part);

                return (
                  <Button
                    key={part}
                    onClick={() => handleMultiSelect(part, hardestPart, setHardestPart)}
                    variant="outline"
                    className={`w-full p-3 h-auto border-2 rounded-[16px] transition-all justify-start text-left ${
                      isSelected
                        ? 'border-navy bg-navy/10 shadow-sm'
                        : 'border-gray-200 hover:border-navy hover:bg-navy/5'
                    }`}
                  >
                    <span className={`text-sm font-semibold font-body ${isSelected ? 'text-navy' : 'text-text-primary'}`}>
                      {part}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-navy ml-auto" />}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={handleNext}
              disabled={hardestPart.length === 0}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        );

      // Step 13: Feeling When Speak
      case 13:
        const feelings = [
          'Anxious & start sweating',
          'Freeze & forget',
          'I avoid speaking',
          'I speak but feel embarrassed',
          'Slightly nervous but okay',
          'Confident enough'
        ];

        return (
          <div className="space-y-6">
            <MessageBubble
              autoPlay={true}
              translation="जब आपको अंग्रेजी में बोलने की ज़रूरत होती है तो आप कैसा महसूस करते हैं?"
            >
              How do you feel when you need to speak English?
            </MessageBubble>

            <div className="space-y-3">
              {feelings.map(feeling => (
                <Button
                  key={feeling}
                  onClick={() => {
                    setFeelingWhenSpeak(feeling);
                    handleNext();
                  }}
                  variant="outline"
                  className="w-full p-4 h-auto border-2 border-gray-200 rounded-[20px] hover:border-teal hover:bg-teal/5 transition-all justify-start text-left font-semibold text-text-primary font-body"
                >
                  {feeling}
                </Button>
              ))}
            </div>
          </div>
        );

      // Step 14: English Level
      case 14:
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

      // Step 15: Assessment Introduction
      case 15:
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

            <Button
              onClick={handleNext}
              className="w-full bg-teal text-white hover:bg-teal-hover py-4 rounded-[16px] font-semibold shadow-md"
            >
              Start Assessment
            </Button>

            <p className="text-xs text-center text-text-secondary font-body">
              Don't worry, this is just to help us personalize your learning!
            </p>
          </div>
        );

      // Step 16: Assessment Chat (Full-Screen)
      case 16:
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

      // Step 17: Grading Loader
      case 17:
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

      // Step 18: Assessment Results (Final Step)
      case 18:
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
                onClick={() => setStep(15)}
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
                  setStep(15);
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
