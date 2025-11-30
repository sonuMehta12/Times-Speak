# TimesSpeak AI Assessment & Personalized Course Generation
## Implementation Guide

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [What Was Improved](#what-was-improved)
4. [Implementation Steps](#implementation-steps)
5. [API Key Security](#api-key-security)
6. [Service Documentation](#service-documentation)
7. [Integration Guide](#integration-guide)
8. [Testing Strategy](#testing-strategy)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This implementation provides a **world-class AI-powered English assessment and personalized course generation system** designed with 20+ years of ESL teaching expertise.

### Key Features

✅ **Adaptive Assessment** - AI adjusts difficulty based on user's self-reported level (A1-C2 CEFR)
✅ **6-8 Turn Conversation** - More thorough than basic 3-4 turn assessments
✅ **Pedagogically Sound** - Based on communicative language teaching principles
✅ **Detailed Skill Breakdown** - Pronunciation, Vocabulary, Grammar, Fluency, Clarity, Listening
✅ **Personalized Course Generation** - 7 custom lessons based on assessment + user goals
✅ **Schema Compliant** - Generated courses match your existing data structures exactly
✅ **Hinglish Support** - Accessibility for Hindi speakers
✅ **Security First** - API keys handled server-side (not exposed to client)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ONBOARDING FLOW                          │
├─────────────────────────────────────────────────────────────┤
│  1. Questionnaire (14 steps)                                │
│     └─> Collect: name, level, goals, interests, barriers   │
│                                                              │
│  2. Pre-Assessment Modal                                     │
│     └─> Explain 2-min conversation with Sia                 │
│                                                              │
│  3. AI Assessment Chat (6-8 turns)                          │
│     └─> AssessmentService.startAssessment()                 │
│     └─> Adaptive conversation based on claimed level        │
│     └─> Real-time Hinglish translations                     │
│                                                              │
│  4. Analyzing Phase                                          │
│     └─> AssessmentService.gradeAssessment()                 │
│     └─> Generate CEFR-based skill scores                    │
│                                                              │
│  5. Course Generation (Loader)                               │
│     └─> CourseGenerationService.generatePersonalizedCourse()│
│     └─> Create 7 lessons tailored to user                   │
│                                                              │
│  6. Video Introduction (Optional)                            │
│                                                              │
│  7. Dashboard with Personalized Roadmap                      │
└─────────────────────────────────────────────────────────────┘
```

### Services Created

| Service | Purpose | Location |
|---------|---------|----------|
| **AssessmentService** | Conducts AI conversation & grades proficiency | `lib/services/assessmentService.ts` |
| **CourseGenerationService** | Generates personalized 7-lesson curriculum | `lib/services/courseGenerationService.ts` |

---

## ✨ What Was Improved

### Critique of Original Code

| Issue | Problem | Solution |
|-------|---------|----------|
| **1. API Key Exposure** | `process.env.API_KEY` used client-side | Server-side API route with env variables |
| **2. Short Assessment** | Only 3-4 conversation turns | Increased to 6-8 turns for better accuracy |
| **3. Generic Prompts** | Didn't leverage teaching expertise | Expert-level prompts with 20+ years ESL methodology |
| **4. No Level Adaptation** | Same difficulty for all claimed levels | Dynamic system prompts based on CEFR level |
| **5. Weak Grading** | Surface-level skill assessment | Deep CEFR-aligned rubrics with evidence-based scoring |
| **6. Basic Course Gen** | Generic lesson creation | Personalized to user's field, goals, and weaknesses |
| **7. SDK Misuse** | Inconsistent message format | Corrected to use proper Gemini SDK methods |

### New System Prompt Highlights

**Assessment Prompt:**
- **Level-Specific Strategies**: Different conversation tactics for A1 vs C2 learners
- **Conversation Flow**: Structured 8-turn progression (rapport → exploration → challenge → closure)
- **Adaptive Difficulty**: Real-time adjustment based on response quality
- **Pedagogical Observations**: Tracks grammar, vocabulary, fluency, coherence internally
- **Hinglish Accessibility**: Every response includes translation

**Course Generation Prompt:**
- **Personalization**: Uses assessment results, field, goals, and barriers
- **Pedagogical Progression**: Spiral curriculum, scaffolding, ZPD principles
- **Schema Compliance**: Enforces exact TypeScript interface structure
- **Lesson Sequencing**: Early wins → targeted improvement → integration
- **Real-World Relevance**: Scenarios from user's actual profession

---

## 🚀 Implementation Steps

### Step 1: Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Get Gemini API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create new project
   - Generate API key
   - Add to `.env.local`:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Add to `.gitignore`:**
   ```
   .env.local
   .env
   ```

### Step 2: Create Server-Side API Route

Create `app/api/assessment/route.ts`:

```typescript
// app/api/assessment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AssessmentService } from '@/lib/services/assessmentService';

const assessmentService = new AssessmentService(process.env.GEMINI_API_KEY!);

// Store active chat sessions (in production, use Redis or database)
const chatSessions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, userData, userMessage, conversationHistory } = body;

    switch (action) {
      case 'start':
        const { chatInstance, firstMessage } = await assessmentService.startAssessment(userData);
        const newSessionId = crypto.randomUUID();
        chatSessions.set(newSessionId, chatInstance);

        return NextResponse.json({
          sessionId: newSessionId,
          message: firstMessage
        });

      case 'sendMessage':
        const chat = chatSessions.get(sessionId);
        if (!chat) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const { aiMessage, isComplete } = await assessmentService.sendMessage(chat, userMessage);

        if (isComplete) {
          chatSessions.delete(sessionId); // Clean up
        }

        return NextResponse.json({ message: aiMessage, isComplete });

      case 'grade':
        const result = await assessmentService.gradeAssessment(conversationHistory, userData);
        return NextResponse.json({ result });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Assessment API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

Create `app/api/course-generation/route.ts`:

```typescript
// app/api/course-generation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CourseGenerationService } from '@/lib/services/courseGenerationService';

const courseService = new CourseGenerationService(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userData, assessmentResult, targetLessons } = await request.json();

    const course = await courseService.generatePersonalizedCourse({
      userData,
      assessmentResult,
      targetLessons: targetLessons || 7
    });

    // Validate course
    const validation = courseService.validateCourse(course);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Course validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Course Generation API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 3: Update Onboarding Component

Replace your onboarding component with a cleaner version that uses the API routes:

```typescript
// components/OnboardingFlow.tsx
import React, { useState } from 'react';

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [flowState, setFlowState] = useState<'questionnaire' | 'preAssessment' | 'chat' | 'analyzing' | 'loader' | 'complete'>('questionnaire');
  const [formData, setFormData] = useState({ /* ... */ });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Start assessment
  const startAssessment = async () => {
    const response = await fetch('/api/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
        userData: formData
      })
    });

    const { sessionId, message } = await response.json();
    setSessionId(sessionId);
    setMessages([message]);
    setFlowState('chat');
  };

  // Send message
  const sendMessage = async (userText: string) => {
    const userMsg = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    const response = await fetch('/api/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId,
        userMessage: userText
      })
    });

    const { message, isComplete } = await response.json();
    setMessages(prev => [...prev, message]);

    if (isComplete) {
      await gradeAssessment();
    }
  };

  // Grade assessment
  const gradeAssessment = async () => {
    setFlowState('analyzing');

    const response = await fetch('/api/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'grade',
        conversationHistory: messages,
        userData: formData
      })
    });

    const { result } = await response.json();
    setAssessmentResult(result);
    setFlowState('loader');
    await generateCourse(result);
  };

  // Generate course
  const generateCourse = async (result: any) => {
    const response = await fetch('/api/course-generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userData: formData,
        assessmentResult: result,
        targetLessons: 7
      })
    });

    const { course } = await response.json();

    // Save to localStorage
    localStorage.setItem('personalizedCourse', JSON.stringify(course));
    localStorage.setItem('userProfile', JSON.stringify({
      ...formData,
      assessmentResult: result
    }));

    setFlowState('complete');
  };

  // Render based on flowState...
}
```

### Step 4: Install Dependencies

```bash
npm install @google/genai
```

### Step 5: Type Safety

Ensure TypeScript paths are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🔒 API Key Security

### ❌ NEVER Do This (Client-Side Exposure):

```typescript
// BAD - Exposes API key to browser
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

### ✅ ALWAYS Do This (Server-Side):

```typescript
// GOOD - API key stays on server
// app/api/assessment/route.ts
const service = new AssessmentService(process.env.GEMINI_API_KEY!);
```

### Best Practices

1. **Use `.env.local`** - Never commit to git
2. **Server-Side API Routes** - All AI calls happen server-side
3. **Environment Variables** - Use `GEMINI_API_KEY` (no `NEXT_PUBLIC_` prefix)
4. **Production**: Use platform-specific secrets (Vercel Env Variables, AWS Secrets Manager, etc.)

---

## 📚 Service Documentation

### AssessmentService

```typescript
import { AssessmentService } from '@/lib/services/assessmentService';

const service = new AssessmentService(apiKey);

// 1. Start assessment
const { chatInstance, firstMessage } = await service.startAssessment(userData);

// 2. Send user messages
const { aiMessage, isComplete } = await service.sendMessage(chatInstance, userText);

// 3. Grade conversation
const result = await service.gradeAssessment(conversationHistory, userData);
```

**AssessmentResult Structure:**

```typescript
{
  overallLevel: "B1", // CEFR level
  overallScore: 65, // 0-100
  skills: {
    pronunciation: { score: 60, cefrLevel: "B1", details: {...} },
    vocabulary: { score: 70, cefrLevel: "B2", details: {...} },
    grammar: { score: 55, cefrLevel: "B1", details: {...} },
    fluency: { score: 68, cefrLevel: "B1", details: {...} },
    clarity: { score: 72, cefrLevel: "B2", details: {...} },
    listening: { score: 65, cefrLevel: "B1", details: {...} }
  },
  conversationHistory: [...],
  recommendedStartingPoint: "unit_2_workplace",
  learningPriorities: ["grammar", "pronunciation", "fluency"]
}
```

### CourseGenerationService

```typescript
import { CourseGenerationService } from '@/lib/services/courseGenerationService';

const service = new CourseGenerationService(apiKey);

const course = await service.generatePersonalizedCourse({
  userData,
  assessmentResult,
  targetLessons: 7
});

// Validate generated course
const validation = service.validateCourse(course);
if (!validation.valid) {
  console.error(validation.errors);
}
```

**GeneratedCourse Structure:**

```typescript
{
  units: [
    {
      unitId: "unit_personalized_1",
      title: "Professional Communication Foundations",
      lessons: [
        {
          id: "l1",
          title: "Email Greetings",
          phrase: "I hope this email finds you well.",
          phraseMeaning: "...",
          script: "...",
          phraseExplanations: [...],
          cueQuestion: {...},
          roleplay: [...],
          imageUrl: "...",
          duration: "5 min",
          category: "Professional",
          subtitle: "..."
        }
        // ... 6 more lessons
      ],
      finalQuiz: {...} // Auto-generated
    }
  ],
  personalizedMessage: "Hi Rahul! Your learning path focuses on...",
  focusAreas: ["grammar", "pronunciation", "professional_vocabulary"],
  estimatedTimeToComplete: "2-3 weeks at 15 min/day"
}
```

---

## 🔧 Integration Guide

### Loading Personalized Course on Dashboard

```typescript
// app/page.tsx or dashboard component
import { useEffect, useState } from 'react';
import { UNITS_DATA } from '@/lib/data/units';

export default function Dashboard() {
  const [units, setUnits] = useState(UNITS_DATA);

  useEffect(() => {
    // Load personalized course if available
    const savedCourse = localStorage.getItem('personalizedCourse');
    if (savedCourse) {
      const { units: personalizedUnits } = JSON.parse(savedCourse);
      // Prepend personalized units to existing units
      setUnits([...personalizedUnits, ...UNITS_DATA]);
    }
  }, []);

  return (
    <div>
      {units.map(unit => (
        <UnitCard key={unit.unitId} unit={unit} />
      ))}
    </div>
  );
}
```

### Displaying Assessment Results

```typescript
// components/AssessmentResults.tsx
export function AssessmentResults({ result }: { result: AssessmentResult }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(result.skills).map(([skill, data]) => (
        <SkillCard
          key={skill}
          title={data.details.title}
          score={data.score}
          level={data.cefrLevel}
          strength={data.details.strength}
          improvement={data.details.improvement}
        />
      ))}
    </div>
  );
}
```

---

## 🧪 Testing Strategy

### 1. Test Different CEFR Levels

Test the assessment with different claimed levels:

```typescript
const testCases = [
  { englishLevel: 'Beginner', expectedAdaptation: 'Simple questions, present tense' },
  { englishLevel: 'B2', expectedAdaptation: 'Abstract topics, mixed tenses' },
  { englishLevel: 'C1', expectedAdaptation: 'Sophisticated vocabulary, debate' }
];
```

### 2. Validate Schema Compliance

```typescript
import { CourseGenerationService } from '@/lib/services/courseGenerationService';

const service = new CourseGenerationService(apiKey);
const validation = service.validateCourse(generatedCourse);

console.assert(validation.valid, validation.errors.join(', '));
```

### 3. Manual Quality Checks

- [ ] Conversation feels natural (not robotic)
- [ ] Hinglish translations are accurate
- [ ] Difficulty adapts to user responses
- [ ] Grading is evidence-based
- [ ] Generated lessons are relevant to user's field
- [ ] Lessons follow logical progression
- [ ] All required schema fields are present

---

## 🐛 Troubleshooting

### Issue: "API Key not defined"

**Solution:** Check `.env.local` file exists and contains `GEMINI_API_KEY`

```bash
# Verify file exists
cat .env.local

# Restart dev server
npm run dev
```

### Issue: "JSON Parse Error"

**Cause:** AI sometimes returns markdown code blocks

**Solution:** The services already handle this with `cleanAndParseJSON()` utility

### Issue: "Generated course doesn't match schema"

**Solution:** Use built-in validation

```typescript
const validation = courseService.validateCourse(course);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  // Regenerate or use fallback
}
```

### Issue: "Assessment takes too long"

**Possible causes:**
1. API rate limits
2. Network latency
3. Model timeout

**Solutions:**
- Add loading states
- Implement timeout handling
- Cache chat sessions properly

---

## 📊 Monitoring & Analytics

### Track Key Metrics

```typescript
// Track assessment completion rate
analytics.track('assessment_started', { userId, level: userData.englishLevel });
analytics.track('assessment_completed', { userId, overallLevel: result.overallLevel });

// Track course generation
analytics.track('course_generated', {
  userId,
  lessonsCount: course.units[0].lessons.length,
  focusAreas: course.focusAreas
});
```

### Error Logging

```typescript
try {
  await service.startAssessment(userData);
} catch (error) {
  console.error('Assessment failed:', error);
  // Send to error tracking service (Sentry, etc.)
  captureException(error, {
    context: { userId, userData }
  });
}
```

---

## 🚀 Next Steps

1. **Implement API routes** (`app/api/assessment/route.ts`, `app/api/course-generation/route.ts`)
2. **Update onboarding component** to use API instead of client-side AI
3. **Test with real users** at different English levels
4. **Gather feedback** on assessment accuracy
5. **Iterate on prompts** based on results
6. **Add analytics** to track completion rates
7. **Optimize performance** (caching, streaming responses)

---

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review service documentation
3. Verify schema compliance with validation methods
4. Check browser console and server logs

---

**Built with pedagogical expertise and cutting-edge AI.**
**Make English learning personalized, effective, and delightful.**
