"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GraduationCap, 
  Briefcase, 
  Plane, 
  Users, 
  MoreHorizontal,
  Check,
  Play,
  Volume2
} from 'lucide-react';

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export default function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState('');
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('');

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handlePainPointToggle = (point: string) => {
    setSelectedPainPoints(prev =>
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  const handleComplete = () => {
    const onboardingData = {
      userName,
      selectedLanguage,
      selectedGoals,
      selectedField,
      selectedPainPoints,
      selectedLevel,
      completedAt: new Date().toISOString()
    };
    
    // Save onboarding data to localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userData', JSON.stringify(onboardingData));
    
    console.log('Onboarding completed!', onboardingData);
    
    // Navigate to home page
    router.push('/');
    
    // Call the completion callback
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Navigate to home page
    router.push('/');
    
    onComplete();
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria')
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  const AIPrompt: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => (
    <div className="flex items-start gap-3 mb-6">
      <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-teal">
        <AvatarImage 
          src="/imgs/Aditi.png" 
          alt="Aditi"
        />
        <AvatarFallback className="bg-gradient-to-br from-teal to-teal-hover text-white text-sm font-semibold">
          AI
        </AvatarFallback>
      </Avatar>
      <Card className="flex-1 border-gray-200 rounded-[20px] rounded-tl-none bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-text-primary leading-relaxed font-body flex-1">{children}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => speakText(children as string)}
              className="h-7 w-7 rounded-full hover:bg-teal/10 text-teal flex-shrink-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ));

  const renderStep = () => {
    switch (step) {
      // Step 1: Welcome
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-navy font-display">TimeSpeak</h1>
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
              
              {/* <Button
                variant="ghost"
                onClick={handleSkip}
                className="w-full text-text-secondary hover:text-navy rounded-[16px] font-semibold"
              >
                Skip for Now
              </Button> */}
            </div>
          </div>
        );
 // Step 2: Learn from Language
      case 2:
        const languages = [
          { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
          { code: 'en', name: 'English', flag: '🇬🇧' },
          { code: 'hing', name: 'Hinglish', flag: '🇮🇳🇬🇧' }
        ];
        
        return (
          <div className="space-y-6">
            <AIPrompt>
Which language do you want to learn English from?
            </AIPrompt>
            
            <div className="space-y-3">
              {languages.map(lang => (
                <Button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    handleNext();
                  }}
                  variant="outline"
                  className="w-full p-5 h-auto border-2 border-gray-200 rounded-[20px] hover:border-teal hover:bg-teal/5 transition-all justify-start gap-3"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-semibold text-text-primary font-body">{lang.name}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      // Step 3: Name
      case 3:
        return (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            <AIPrompt>
              Hi! To start, could you please tell me your name?
            </AIPrompt>
            
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2 font-body">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white text-text-primary font-body shadow-sm"
                placeholder="e.g., John Doe"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md"
            >
              Continue
            </Button>
          </form>
        );

     

      // Step 4: Goals
      case 4:
        const goals = [
          { id: 'education', name: 'Support my education', icon: GraduationCap, color: 'text-navy' },
          { id: 'career', name: 'Career growth', icon: Briefcase, color: 'text-coral' },
          { id: 'travel', name: 'Travel abroad', icon: Plane, color: 'text-teal' },
          { id: 'connect', name: 'Connect with people', icon: Users, color: 'text-gold' },
          { id: 'other', name: 'Others', icon: MoreHorizontal, color: 'text-text-secondary' },
        ];
        
        return (
          <div className="space-y-6">
            <AIPrompt>
              What's your main goal for learning English Speaking, {userName}? You can select multiple.
            </AIPrompt>
            
            <div className="space-y-3">
              {goals.map(goal => {
                const isSelected = selectedGoals.includes(goal.id);
                const Icon = goal.icon;
                
                return (
                  <Button
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    variant="outline"
                    className={`w-full p-4 h-auto border-2 rounded-[20px] transition-all justify-start gap-3 ${
                      isSelected
                        ? 'border-teal bg-teal/10 shadow-sm'
                        : 'border-gray-200 hover:border-teal hover:bg-teal/5'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-teal' : goal.color}`} />
                    <span className={`font-semibold font-body ${isSelected ? 'text-teal' : 'text-text-primary'}`}>
                      {goal.name}
                    </span>
                    {isSelected && <Check className="w-5 h-5 text-teal ml-auto" />}
                  </Button>
                );
              })}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={selectedGoals.length === 0}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        );

      // Step 5: Field Selection
      case 5:
        const fields = [
          'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Sales',
          'Engineering', 'Design', 'Customer Service', 'Hospitality', 'Manufacturing', 'Other'
        ];
        
        return (
          <div className="space-y-6">
            <AIPrompt>
              Perfect! To help tailor your experience, which field are you in?
            </AIPrompt>
            
            <div className="grid grid-cols-2 gap-3">
              {fields.map(field => (
                <Button
                  key={field}
                  onClick={() => {
                    setSelectedField(field);
                    handleNext();
                  }}
                  variant="outline"
                  className="p-4 h-auto border-2 border-gray-200 rounded-[16px] hover:border-teal hover:bg-teal/5 transition-all font-semibold text-text-primary font-body"
                >
                  {field}
                </Button>
              ))}
            </div>
            
            <p className="text-xs text-center text-text-secondary font-body pt-2">
              We match role-play scenarios tailored to your field.
            </p>
          </div>
        );

      // Step 6: Field Fact
      case 6:
        return (
          <div className="space-y-6">
            <AIPrompt>
              Excellent choice! Here's a quick fact for you, {userName}.
            </AIPrompt>
            
            <Card className="border-2 border-teal/30 bg-gradient-to-br from-teal/10 to-teal/5 rounded-[24px] shadow-md">
              <CardContent className="p-6 text-center space-y-3">
                <div className="text-4xl mb-2">💡</div>
                <p className="text-xl font-bold text-teal font-display leading-snug">
                  "People in {selectedField.toLowerCase()} with strong English skills earn up to 20% more on average."
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
// Step 7: English Level
      case 7:
        const levels = [
          { id: 'beginner', name: 'Beginner (A1-A2)', desc: 'I know basic words and simple sentences' },
          { id: 'intermediate', name: 'Intermediate (B1-B2)', desc: 'I can have conversations but struggle sometimes' },
          { id: 'advanced', name: 'Advanced (C1-C2)', desc: 'I speak well but want to sound more natural' },
          { id: 'native', name: 'Near-Native', desc: 'I speak fluently, just need minor improvements' }
        ];
        
        return (
          <div className="space-y-6">
            <AIPrompt>
              Almost there! What's your current English level, {userName}?
            </AIPrompt>
            
            <div className="space-y-3">
              {levels.map(level => (
                <Button
                  key={level.id}
                  onClick={() => {
                    setSelectedLevel(level.id);
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
      // Step 7: Pain Points
      case 8:
        const painPoints = [
          'Fear of being judged',
          'Run out of vocabulary',
          'Grammar mistakes',
          'Nervousness or anxiety',
          'Lack of practice',
          'Starting a conversation',
          'Finding the right words',
          'Explaining complex thoughts',
          'Telling stories',
          'Handling interruptions'
        ];
        
        return (
          <div className="space-y-6">
            <AIPrompt>
Thanks, {userName}! 😊 Tell me — what makes speaking feel hard for you? You can pick more than one.            </AIPrompt>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {painPoints.map(point => {
                const isSelected = selectedPainPoints.includes(point);
                
                return (
                  <Button
                    key={point}
                    onClick={() => handlePainPointToggle(point)}
                    variant="outline"
                    className={`w-full p-3 h-auto border-2 rounded-[16px] transition-all justify-start text-left ${
                      isSelected
                        ? 'border-coral bg-coral/10 shadow-sm'
                        : 'border-gray-200 hover:border-coral hover:bg-coral/5'
                    }`}
                  >
                    <span className={`text-sm font-semibold font-body ${isSelected ? 'text-coral' : 'text-text-primary'}`}>
                      {point}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-coral ml-auto" />}
                  </Button>
                );
              })}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={selectedPainPoints.length === 0}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        );

      // Step 8: Empathy Message
      case 9:
        return (
          <div className="space-y-6">
            <AIPrompt>
              You're not alone in this at all, {userName}.
            </AIPrompt>
            
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

      

      // Step 10: Final CTA
      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-bold text-navy font-display">
                You're All Set!
              </h2>
              <p className="text-sm text-text-secondary font-body">
                Watch this quick video to see how TimeSpeak works
              </p>
            </div>
            
            {/* Mobile Video Player - 9:16 aspect ratio */}
            <Card className="border-gray-200 rounded-[24px] overflow-hidden shadow-lg">
              <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
                <video
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=711&fit=crop"
                  controls
                  playsInline
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </Card>
            
            <Button
              onClick={handleComplete}
              className="w-full bg-coral text-white hover:bg-coral-hover py-4 rounded-[16px] font-semibold shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              Continue to App
            </Button>
            
            <p className="text-xs text-center text-text-secondary font-body">
              You can skip the video and start learning right away
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-bg-card overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-gray-200 rounded-[24px] shadow-md">
            <CardContent className="p-6">
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
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Step Content */}
              <div className="min-h-[450px] flex flex-col justify-center">
                {renderStep()}
              </div>

              {/* Back Button */}
              {step > 1 && step !== 10 && (
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  className="w-full text-center text-sm font-semibold text-text-secondary hover:text-navy transition-colors mt-4"
                >
                  Back
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
