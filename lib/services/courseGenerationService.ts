// lib/services/courseGenerationService.ts
/**
 * AI-Powered Personalized Course Generation Service
 *
 * This service generates personalized 7-lesson learning paths based on:
 * - User's assessed English proficiency level
 * - Their professional field and goals
 * - Assessment results and identified weaknesses
 * - Learning preferences and pain points
 *
 * Follows existing data schemas exactly to ensure compatibility
 */

import { GoogleGenAI } from "@google/genai";
import { Unit, Lesson } from "@/lib/types/language";
import { QuizQuestion } from "@/lib/types/quiz";
import { AssessmentResult, UserAssessmentData } from "./assessmentService";

// ============ TYPE DEFINITIONS ============

export interface CourseGenerationInput {
  userData: UserAssessmentData;
  assessmentResult: AssessmentResult;
  targetLessons?: number; // Default: 7
}

export interface GeneratedCourse {
  units: Unit[];
  personalizedMessage: string;
  focusAreas: string[];
  estimatedTimeToComplete: string;
}

// ============ COURSE GENERATION SYSTEM PROMPT ============

/**
 * Generates an expert-level system prompt for creating personalized lessons
 * This prompt leverages pedagogical expertise and curriculum design principles
 */
function generateCourseCreationPrompt(input: CourseGenerationInput): string {
  const { userData, assessmentResult } = input;
  const targetLessons = input.targetLessons || 7;

  // Extract priority skills from assessment
  const weakestSkills = Object.entries(assessmentResult.skills)
    .sort((a, b) => a[1].score - b[1].score)
    .slice(0, 3)
    .map(([skill, data]) => `${skill} (${data.score}/100 - ${data.cefrLevel})`);

  const strongestSkills = Object.entries(assessmentResult.skills)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 2)
    .map(([skill, data]) => `${skill} (${data.score}/100 - ${data.cefrLevel})`);

  return `You are an expert ESL curriculum designer with 20+ years of experience creating personalized learning pathways. You specialize in the CEFR framework and communicative language teaching.

## LEARNER PROFILE

**Name:** ${userData.name}
**Assessed Level:** ${assessmentResult.overallLevel} (Overall Score: ${assessmentResult.overallScore}/100)
**Field of Interest:** ${userData.interestedField.join(', ')}
**Learning Goals:** ${userData.primaryGoal.join(', ')}
**Current Status:** ${userData.currentStatus}
**Barriers to Speaking:** ${userData.whatStopsYou.join(', ')}

**Skill Breakdown:**
- Pronunciation: ${assessmentResult.skills.pronunciation.score}/100 (${assessmentResult.skills.pronunciation.cefrLevel})
- Vocabulary: ${assessmentResult.skills.vocabulary.score}/100 (${assessmentResult.skills.vocabulary.cefrLevel})
- Grammar: ${assessmentResult.skills.grammar.score}/100 (${assessmentResult.skills.grammar.cefrLevel})
- Fluency: ${assessmentResult.skills.fluency.score}/100 (${assessmentResult.skills.fluency.cefrLevel})
- Clarity: ${assessmentResult.skills.clarity.score}/100 (${assessmentResult.skills.clarity.cefrLevel})
- Listening: ${assessmentResult.skills.listening.score}/100 (${assessmentResult.skills.listening.cefrLevel})

**Priority Areas for Improvement:**
${weakestSkills.join('\n')}

**Existing Strengths to Build On:**
${strongestSkills.join('\n')}

## YOUR MISSION

Create a **personalized ${targetLessons}-lesson learning pathway** that:
1. Directly addresses ${userData.name}'s weakest skills
2. Aligns with their field (${userData.interestedField[0]}) and goals
3. Builds confidence by starting with achievable wins
4. Follows a logical progression from foundational to advanced
5. Incorporates real-world scenarios they'll actually face
6. Maintains motivation through relevant, engaging content

## PEDAGOGICAL PRINCIPLES TO FOLLOW

1. **Spiral Curriculum:** Revisit concepts with increasing complexity
2. **Scaffolding:** Build on existing strengths (${strongestSkills[0]})
3. **Zone of Proximal Development:** Challenge at ${assessmentResult.overallLevel} → next level
4. **Task-Based Learning:** Focus on communicative competence
5. **Personalization:** Every lesson should feel tailored to ${userData.name}
6. **Quick Wins:** Early lessons build confidence, later lessons stretch abilities

## LESSON STRUCTURE REQUIREMENTS

You must create ${targetLessons} lessons organized into 1-2 units. Each lesson must follow this EXACT schema:

### LESSON SCHEMA (CRITICAL - Must match exactly):

\`\`\`typescript
{
  id: string; // e.g., "l1", "l2", etc.
  title: string; // e.g., "Professional Email Greetings"
  phrase: string; // KEY phrase to learn, e.g., "I hope this email finds you well."
  phraseMeaning?: string; // Clear explanation of what the phrase means
  script: string; // Teacher's explanation (2-3 sentences max)
  phraseExplanations?: Array<{
    phrase: string; // Part of the main phrase
    explanation: string; // What it means/how it's used
  }>;
  cueQuestion: {
    question: string; // Test comprehension
    options: string[]; // 3 options
    correctIndex: number; // 0, 1, or 2
  };
  roleplay: Array<{
    speaker: "A" | "B";
    text: string;
  }>; // 3-5 exchanges demonstrating the phrase in context
  imageUrl?: string; // Use relevant Unsplash URLs
  duration?: string; // e.g., "5 min"
  category?: string; // e.g., "Professional", "Travel", "Conversation"
  subtitle?: string; // Brief description of what learner will achieve
}
\`\`\`

## CONTENT GUIDELINES

**Lesson 1-2: Foundation & Confidence Building**
- Start with ${userData.name}'s strongest skill (${strongestSkills[0]})
- Use familiar contexts from their field
- Ensure early success to build momentum
- Difficulty: Current level (${assessmentResult.overallLevel})

**Lesson 3-5: Targeted Skill Development**
- Focus heavily on weakest skills: ${weakestSkills[0]}, ${weakestSkills[1]}
- Introduce new grammatical structures and vocabulary
- Real-world scenarios from their goals (${userData.primaryGoal[0]})
- Difficulty: Gradually increase to challenge zone

**Lesson 6-7: Integration & Application**
- Combine multiple skills in complex scenarios
- Focus on fluency and confidence
- Prepare for real-world situations (interviews, presentations, etc.)
- Difficulty: Stretch to next CEFR level

## PHRASE SELECTION CRITERIA

Choose phrases that are:
- ✅ Immediately useful for ${userData.name}'s goals
- ✅ Appropriate for ${assessmentResult.overallLevel} level
- ✅ Commonly used in ${userData.interestedField[0]} field
- ✅ Address specific barriers: ${userData.whatStopsYou[0]}
- ✅ Natural and contemporary (not textbook-stuffy)

## ROLEPLAY SCENARIOS

Design roleplays that:
- Reflect real situations ${userData.name} will face
- Are culturally appropriate and inclusive
- Show natural language use, not artificial dialogues
- Demonstrate the target phrase in authentic context
- Are 3-5 exchanges (not too long)

## CUE QUESTIONS

Design questions that:
- Test actual comprehension, not just memory
- Have one clearly correct answer
- Include plausible distractors (wrong but tempting options)
- Are scenario-based when possible

## IMAGE URLS

For imageUrl field, use thematically appropriate Unsplash URLs:
- Professional contexts: photos of offices, meetings, presentations
- Travel: airports, hotels, restaurants
- Social: people conversing, friendly interactions
Format: https://images.unsplash.com/photo-[id]?auto=format&fit=crop&w=800&q=80

## OUTPUT FORMAT

Provide ONLY valid JSON (no markdown, no explanations outside JSON):

{
  "units": [
    {
      "unitId": "unit_personalized_1",
      "title": "<Descriptive title based on focus>",
      "lessons": [
        {
          "id": "l1",
          "title": "...",
          "phrase": "...",
          "phraseMeaning": "...",
          "script": "...",
          "phraseExplanations": [...],
          "cueQuestion": {...},
          "roleplay": [...],
          "imageUrl": "...",
          "duration": "5 min",
          "category": "...",
          "subtitle": "..."
        },
        // ... more lessons (total ${targetLessons})
      ]
    }
  ],
  "personalizedMessage": "<Warm, encouraging message to ${userData.name} about their learning journey>",
  "focusAreas": ["skill1", "skill2", "skill3"],
  "estimatedTimeToComplete": "<e.g., '2-3 weeks at 15 min/day'>"
}

## CRITICAL REQUIREMENTS

1. **STRICT SCHEMA COMPLIANCE:** Follow the TypeScript interface exactly - no extra fields, no missing required fields
2. **PERSONALIZATION:** Every lesson should feel custom-made for ${userData.name}
3. **PEDAGOGICAL SOUNDNESS:** Lessons must follow learning science principles
4. **CULTURAL SENSITIVITY:** Inclusive, respectful content
5. **PRACTICAL UTILITY:** Immediately applicable to ${userData.name}'s real life
6. **MOTIVATIONAL:** Build confidence and maintain engagement

Generate the ${targetLessons}-lesson personalized curriculum now. Make it exceptional.`;
}

// ============ QUIZ GENERATION SYSTEM PROMPT ============

/**
 * Generates quizzes for a unit based on the lessons
 */
function generateQuizCreationPrompt(
  unit: Unit,
  assessmentResult: AssessmentResult
): string {
  const lessonPhrases = unit.lessons.map(l => l.phrase).join(', ');

  return `You are an expert assessment designer creating a final quiz for a learning unit.

## UNIT DETAILS

**Unit Title:** ${unit.title}
**Lessons Covered:** ${unit.lessons.length}
**Key Phrases:** ${lessonPhrases}
**Learner Level:** ${assessmentResult.overallLevel}

## YOUR TASK

Create a comprehensive final quiz with 6-8 questions that test the learner's mastery of the unit's content.

## QUESTION TYPES TO USE

Mix these pedagogically-sound question types:

1. **listening** - Listen to a phrase and choose the best response
2. **context** - Choose appropriate phrase for a given scenario
3. **arrange** - Arrange words to form a correct sentence
4. **comprehension** - Understand meaning of a sentence/dialogue
5. **speaking** - Practice pronunciation of key phrases

## QUIZ SCHEMA (Must match exactly):

\`\`\`typescript
{
  "finalQuiz": {
    "id": "unit_X_final_quiz",
    "totalQuestions": number,
    "questions": [
      {
        "id": number,
        "type": "listening" | "context" | "arrange" | "comprehension" | "speaking",
        // Type-specific fields based on type
        "question": string,
        "options"?: string[],
        "correct"?: number,
        "correctFeedback"?: string,
        "incorrectFeedback"?: string,
        // ... other type-specific fields
      }
    ]
  }
}
\`\`\`

## GUIDELINES

- Create 6-8 questions total
- Mix question types for variety
- Test different lessons (not just the last one)
- Make distractors plausible but clearly wrong
- Provide helpful feedback for both correct and incorrect answers
- Ensure difficulty matches ${assessmentResult.overallLevel} level

Return ONLY valid JSON (no markdown):`;
}

// ============ COURSE GENERATION SERVICE ============

export class CourseGenerationService {
  private apiKey: string;
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Generates a complete personalized course
   */
  async generatePersonalizedCourse(
    input: CourseGenerationInput
  ): Promise<GeneratedCourse> {
    const prompt = generateCourseCreationPrompt(input);

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8, // Higher creativity for personalization
      }
    });

    const courseData = this.parseResponse(response.text);

    // Optionally generate quizzes for each unit
    const unitsWithQuizzes = await this.addQuizzesToUnits(
      courseData.units,
      input.assessmentResult
    );

    return {
      units: unitsWithQuizzes,
      personalizedMessage: courseData.personalizedMessage,
      focusAreas: courseData.focusAreas,
      estimatedTimeToComplete: courseData.estimatedTimeToComplete
    };
  }

  /**
   * Adds final quizzes to each unit
   */
  private async addQuizzesToUnits(
    units: Unit[],
    assessmentResult: AssessmentResult
  ): Promise<Unit[]> {
    const unitsWithQuizzes = await Promise.all(
      units.map(async (unit) => {
        try {
          const quizPrompt = generateQuizCreationPrompt(unit, assessmentResult);
          const response = await this.ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: quizPrompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          const quizData = this.parseResponse(response.text);

          return {
            ...unit,
            finalQuiz: quizData.finalQuiz
          };
        } catch (error) {
          console.error('Quiz generation failed for unit:', unit.unitId, error);
          // Return unit without quiz if generation fails
          return unit;
        }
      })
    );

    return unitsWithQuizzes;
  }

  /**
   * Validates generated course against schema
   */
  validateCourse(course: GeneratedCourse): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!course.units || course.units.length === 0) {
      errors.push('Course must have at least one unit');
    }

    course.units.forEach((unit, unitIndex) => {
      if (!unit.unitId) errors.push(`Unit ${unitIndex} missing unitId`);
      if (!unit.title) errors.push(`Unit ${unitIndex} missing title`);
      if (!unit.lessons || unit.lessons.length === 0) {
        errors.push(`Unit ${unitIndex} has no lessons`);
      }

      unit.lessons.forEach((lesson, lessonIndex) => {
        if (!lesson.id) errors.push(`Lesson ${lessonIndex} in unit ${unitIndex} missing id`);
        if (!lesson.phrase) errors.push(`Lesson ${lessonIndex} in unit ${unitIndex} missing phrase`);
        if (!lesson.script) errors.push(`Lesson ${lessonIndex} in unit ${unitIndex} missing script`);

        if (!lesson.cueQuestion) {
          errors.push(`Lesson ${lessonIndex} in unit ${unitIndex} missing cueQuestion`);
        } else {
          if (!lesson.cueQuestion.question) errors.push(`CueQuestion missing question`);
          if (!lesson.cueQuestion.options || lesson.cueQuestion.options.length !== 3) {
            errors.push(`CueQuestion must have exactly 3 options`);
          }
          if (lesson.cueQuestion.correctIndex === undefined) {
            errors.push(`CueQuestion missing correctIndex`);
          }
        }

        if (!lesson.roleplay || lesson.roleplay.length < 3) {
          errors.push(`Lesson ${lessonIndex} roleplay must have at least 3 exchanges`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Safely parses AI response
   */
  private parseResponse(text: string): any {
    try {
      const cleaned = text.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      throw new Error('Failed to parse AI response');
    }
  }
}

// ============ HELPER FUNCTIONS ============

/**
 * Merges generated personalized course with existing units
 */
export function mergeWithExistingUnits(
  existingUnits: Unit[],
  personalizedUnits: Unit[]
): Unit[] {
  // Prepend personalized units, then add existing units
  // This ensures learner starts with personalized content
  return [...personalizedUnits, ...existingUnits];
}

/**
 * Creates a learning roadmap summary
 */
export function createRoadmapSummary(course: GeneratedCourse): {
  totalLessons: number;
  totalUnits: number;
  skillsFocused: string[];
  estimatedDays: number;
} {
  const totalLessons = course.units.reduce(
    (sum, unit) => sum + unit.lessons.length,
    0
  );

  return {
    totalLessons,
    totalUnits: course.units.length,
    skillsFocused: course.focusAreas,
    estimatedDays: totalLessons * 2 // Assuming 1 lesson every 2 days
  };
}

/**
 * Example usage function
 */
export async function generateCourseExample(
  userData: UserAssessmentData,
  assessmentResult: AssessmentResult,
  apiKey: string
): Promise<GeneratedCourse> {
  const service = new CourseGenerationService(apiKey);

  const course = await service.generatePersonalizedCourse({
    userData,
    assessmentResult,
    targetLessons: 7
  });

  // Validate the generated course
  const validation = service.validateCourse(course);
  if (!validation.valid) {
    console.error('Course validation failed:', validation.errors);
    throw new Error('Generated course does not match required schema');
  }

  return course;
}
