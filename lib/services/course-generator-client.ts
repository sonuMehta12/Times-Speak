// lib/services/course-generator-client.ts
// Client-side course generation service using Gemini API

import { GoogleGenAI, Schema, Type } from "@google/genai";
import { UserProfile, ConversationAnalysis } from "../types/roleplay";
import { Unit } from "../types/language";
import { safeParseJSON } from "@/lib/utils/json-parser";
import { UNITS_DATA } from "@/lib/data/units";

/**
 * Get Gemini client using client-side API key
 */
const getClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment.");
  }
  return new GoogleGenAI({ apiKey });
};

const COURSE_GENERATION_MODEL = 'gemini-2.0-flash-exp';

/**
 * JSON Schema for course generation
 * Matches the Unit[] structure from lib/types/language.ts
 */
const COURSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    units: {
      type: Type.ARRAY,
      description: "Array of learning units (exactly 1 unit with 7 lessons)",
      items: {
        type: Type.OBJECT,
        properties: {
          unitId: {
            type: Type.STRING,
            description: "Unique unit identifier (e.g., 'unit_1_pronunciation_basics')"
          },
          title: {
            type: Type.STRING,
            description: "Unit title (e.g., 'Pronunciation Fundamentals')"
          },
          lessons: {
            type: Type.ARRAY,
            description: "Array of lessons within the unit (exactly 7 lessons)",
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.STRING,
                  description: "Unique lesson ID (e.g., 'l1')"
                },
                title: {
                  type: Type.STRING,
                  description: "Lesson title"
                },
                phrase: {
                  type: Type.STRING,
                  description: "Key phrase or concept for the lesson"
                },
                phraseMeaning: {
                  type: Type.STRING,
                  description: "Explanation of the phrase meaning"
                },
                script: {
                  type: Type.STRING,
                  description: "Teaching script for the lesson (2-3 sentences)"
                },
                phraseExplanations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phrase: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    }
                  },
                  description: "Optional breakdown of phrase components"
                },
                cueQuestion: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Exactly 3 answer options"
                    },
                    correctIndex: {
                      type: Type.NUMBER,
                      description: "Index of correct answer (0, 1, or 2)"
                    }
                  },
                  description: "Comprehension question with 3 options"
                },
                roleplay: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      speaker: {
                        type: Type.STRING,
                        description: "Either 'A' or 'B'"
                      },
                      text: { type: Type.STRING }
                    }
                  },
                  description: "Short dialogue demonstrating the phrase (2-3 turns)"
                },
                duration: {
                  type: Type.STRING,
                  description: "Estimated duration (always '5 min')"
                },
                category: {
                  type: Type.STRING,
                  description: "Lesson category in English (e.g., 'Conversation', 'Professional', 'Workplace', 'Introduction', 'Personal')"
                },
                subtitle: {
                  type: Type.STRING,
                  description: "Brief subtitle in Hinglish (Hindi-English mix) explaining the lesson's value"
                }
              },
              required: ["id", "title", "phrase", "phraseMeaning", "script", "cueQuestion", "roleplay", "duration", "category", "subtitle"]
            }
          }
        },
        required: ["unitId", "title", "lessons"]
      }
    },
    courseSummary: {
      type: Type.OBJECT,
      properties: {
        totalUnits: { type: Type.NUMBER },
        totalLessons: { type: Type.NUMBER },
        focusAreas: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top 3 skill areas this course targets"
        },
        estimatedDuration: {
          type: Type.STRING,
          description: "Total estimated time to complete (e.g., '2-3 weeks')"
        }
      },
      description: "Summary of the generated course"
    }
  },
  required: ["units", "courseSummary"]
};

/**
 * Input for course generation
 */
interface CourseGenerationInput {
  userData: UserProfile;
  assessmentResult: ConversationAnalysis;
  targetUnits?: number; // Default 1 (single unit with 7 lessons)
}

/**
 * Output from course generation
 */
interface GeneratedCourse {
  units: Unit[];
  courseSummary: {
    totalUnits: number;
    totalLessons: number;
    focusAreas: string[];
    estimatedDuration: string;
  };
}

/**
 * Build the prompt for course generation based on user data and assessment
 */
function buildCoursePrompt(input: CourseGenerationInput): string {
  const { userData, assessmentResult, targetUnits = 1 } = input;

  // Extract weak skills (score < 70)
  const weakSkills = Object.entries(assessmentResult.skills)
    .filter(([_, details]) => details.score < 70)
    .map(([skill, details]) => `${skill} (${details.score}/100): ${details.improvement}`)
    .join('\n  - ');

  // Extract strong skills (score >= 80)
  const strongSkills = Object.entries(assessmentResult.skills)
    .filter(([_, details]) => details.score >= 80)
    .map(([skill, _]) => skill)
    .join(', ');

  // Prioritize skills by score (lowest first)
  const sortedSkills = Object.entries(assessmentResult.skills)
    .sort((a, b) => a[1].score - b[1].score)
    .map(([skill, details]) => ({
      name: skill,
      score: details.score,
      improvement: details.improvement,
      coachTip: details.coachTip
    }));

  const topPriorities = sortedSkills.slice(0, 3).map(s => s.name).join(', ');

  return `You are an expert English course designer for Hindi-speaking learners. Generate a personalized 1-unit English learning course with exactly 7 lessons based on the user's profile and assessment results.

**USER PROFILE:**
- Name: ${userData.name}
- CEFR Level: ${userData.level} (Self-reported), Assessed: ${assessmentResult.cefrLevel}
- Native Language: ${userData.nativeLanguage}
- Professional Field: ${userData.interestedField?.join(', ') || 'General'}
- Learning Goals: ${userData.learningGoals?.join(', ') || 'Improve English communication'}
- Current Status: ${userData.currentStatus || 'Professional'}
- Age Range: ${userData.ageRange || 'Adult'}

**ASSESSMENT RESULTS:**
- Overall Score: ${assessmentResult.overallScore}/100
- AI Coach Insight: ${assessmentResult.aiCoachInsight}

**SKILL BREAKDOWN (Prioritized by Need):**
${sortedSkills.map(s => `- ${s.name}: ${s.score}/100 - ${s.improvement}`).join('\n')}

**IDENTIFIED WEAKNESSES:**
  - ${weakSkills || 'No major weaknesses identified'}

**STRONG AREAS:**
${strongSkills || 'Still building foundational skills'}

**TOP PRIORITIES:** ${topPriorities}

---

**COURSE GENERATION INSTRUCTIONS:**

Generate exactly **1 unit** with **exactly 7 lessons**. The unit should:

1. **Target Specific Weaknesses:** Focus on the lowest-scoring skills first (${topPriorities})
2. **Professional Relevance:** Tailor examples to ${userData.interestedField?.join(', ') || 'general professional'} contexts
3. **Progressive Difficulty:** Start with basics, gradually increase complexity across the 7 lessons
4. **Practical Application:** Real-world phrases relevant to ${userData.currentStatus || 'professional'} life

**UNIT STRUCTURE:**
- Unit Title: Should reflect the primary focus area (e.g., "English Communication Basics")
- 7 Lessons: Progressive skill building from foundational to intermediate
- Final Quiz: 6-8 questions covering all 7 lessons (DO NOT generate finalRoleplay)

**CRITICAL LANGUAGE REQUIREMENTS:**

For each lesson, follow these language rules STRICTLY:

1. **phrase**: ALWAYS in English (this is what the user is learning)
   - Example: "Hey! How's it going?"

2. **title**: ALWAYS in English (lesson name)
   - Example: "Casual Greetings"

3. **phraseMeaning**: ALWAYS in Hinglish (Hindi-English mix)
   - Use natural conversational Hinglish mixing Hindi and English words
   - Example: "Yeh ek casual aur friendly tarika hai kisi ko greet karne ka aur puchhne ka ki woh kaise hain."

4. **subtitle**: ALWAYS in Hinglish
   - Natural conversational Hinglish
   - Example: "Dost aur colleagues ke saath daily conversations ke liye friendly greetings seekhiye."

5. **category**: ALWAYS in English
   - Use ONLY: "Conversation", "Professional", "Introduction", "Personal", "Workplace"

6. **script**: ALWAYS in English (teaching instructions)
   - Example: "Let's learn a friendly way to greet people at work..."

7. **roleplay dialogues**: ALWAYS in English (they're practicing English)

8. **cueQuestion**: ALWAYS in English (testing comprehension)

9. **duration**: Always "5 min" for all lessons

10. **DO NOT include imageUrl** - this field is deprecated

**HINGLISH WRITING GUIDE:**

Good Hinglish examples:
- "Dost aur colleagues ke saath friendly greetings seekhiye"
- "Pehli baar kisi se mile toh yeh polite phrase use karein"
- "Apne profession ke baare mein confidently baat karein"
- "Apne hobbies share karke meaningful connections banayein"
- "Office mein professionally help maangein"
- "Jab aapko research ya sochne ke liye time chahiye tab professionally respond karein"

Avoid:
- Pure Hindi without English words
- Pure English (this defeats the purpose)
- Unnatural mixing (keep it conversational)

**LESSON DESIGN PRINCIPLES:**

1. **Phrase Selection**:
   - Relevant to ${userData.interestedField?.join('/') || 'professional'} field
   - Appropriate for ${assessmentResult.cefrLevel} level
   - Common real-world usage

2. **Script Writing**:
   - Concise (2-3 sentences)
   - Encouraging tone
   - Pronunciation tips if needed

3. **Cue Questions**:
   - Realistic scenarios
   - 3 options (1 correct, 2 common mistakes)
   - Test practical usage

4. **Roleplay Dialogues**:
   - 2-3 turn exchanges
   - Natural professional conversations
   - Brief and focused

5. **Categories**:
   - Use ONLY: "Conversation", "Professional", "Introduction", "Personal", "Workplace"

**FINAL UNIT QUIZ:**

Generate a comprehensive final quiz with 6-8 questions covering all 7 lessons:
- Include question types: listening, context, arrange, comprehension, speaking
- Test understanding across all lessons
- Provide helpful feedback for each question

DO NOT generate finalRoleplay field - only finalQuiz is needed.

**PERSONALIZATION:**

- Fear of speaking: ${userData.fearOfSpeaking || 'Sometimes'}
  → Include confidence-building lessons

- Hardest parts: ${userData.hardestPart?.join(', ') || 'various'}
  → Design lessons targeting these challenges

- Learning goals: ${userData.learningGoals?.join(', ') || 'general'}
  → Ensure phrases support these goals

**QUALITY STANDARDS:**

✓ Each lesson must have complete, valid data matching the schema
✓ Dialogues must sound natural and native-like
✓ Questions must have one clearly correct answer
✓ Progressive skill building across all 7 lessons
✓ phraseMeaning and subtitle MUST be in natural Hinglish
✓ All other fields (phrase, title, category, script) MUST be in English

Generate the complete course now in valid JSON matching the schema.`;
}

/**
 * Validates that the generated course matches expected structure
 */
function validateCourse(course: GeneratedCourse): void {
  if (!course.units || !Array.isArray(course.units)) {
    throw new Error("Invalid course: missing or invalid 'units' array");
  }

  if (course.units.length === 0) {
    throw new Error("Invalid course: units array is empty");
  }

  // Validate exactly 1 unit with 7 lessons
  if (course.units.length !== 1) {
    console.warn(`Expected 1 unit, got ${course.units.length}. Using first unit only.`);
    course.units = [course.units[0]];
  }

  if (course.units[0].lessons.length !== 7) {
    console.warn(`Expected 7 lessons in unit, got ${course.units[0].lessons.length}`);
  }

  // Ensure no finalRoleplay
  if (course.units[0].finalRoleplay) {
    console.log('Removing finalRoleplay from generated unit');
    delete course.units[0].finalRoleplay;
  }

  course.units.forEach((unit, idx) => {
    if (!unit.unitId || !unit.title) {
      throw new Error(`Invalid unit at index ${idx}: missing unitId or title`);
    }

    if (!unit.lessons || !Array.isArray(unit.lessons)) {
      throw new Error(`Invalid unit ${unit.unitId}: missing or invalid 'lessons' array`);
    }

    if (unit.lessons.length === 0) {
      throw new Error(`Invalid unit ${unit.unitId}: lessons array is empty`);
    }

    unit.lessons.forEach((lesson, lessonIdx) => {
      if (!lesson.id || !lesson.phrase || !lesson.script || !lesson.cueQuestion || !lesson.roleplay) {
        throw new Error(`Invalid lesson at unit ${unit.unitId}, lesson ${lessonIdx}: missing required fields`);
      }

      if (!Array.isArray(lesson.roleplay) || lesson.roleplay.length === 0) {
        throw new Error(`Invalid lesson ${lesson.id}: roleplay must be non-empty array`);
      }

      if (!lesson.cueQuestion.options || lesson.cueQuestion.options.length !== 3) {
        throw new Error(`Invalid lesson ${lesson.id}: cue question must have exactly 3 options`);
      }

      if (typeof lesson.cueQuestion.correctIndex !== 'number' ||
          lesson.cueQuestion.correctIndex < 0 ||
          lesson.cueQuestion.correctIndex > 2) {
        throw new Error(`Invalid lesson ${lesson.id}: correctIndex must be 0, 1, or 2`);
      }
    });
  });

  console.log(`✓ Course validation passed: ${course.units.length} units, ${course.courseSummary.totalLessons} lessons`);
}

/**
 * Generate a personalized English learning course based on user assessment
 *
 * @param input User data and assessment results
 * @returns Generated course with units and lessons
 */
export async function generatePersonalizedCourse(
  input: CourseGenerationInput
): Promise<GeneratedCourse> {
  const client = getClient();

  try {
    const prompt = buildCoursePrompt(input);

    console.log('Generating personalized course with Gemini...');

    const response = await client.models.generateContent({
      model: COURSE_GENERATION_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: COURSE_SCHEMA,
        temperature: 0.8, // Creative but consistent
        maxOutputTokens: 4096, // Limit response size to prevent truncation issues
      },
    });

    const courseText = response.text || '{}';

    // Use safe JSON parser with fallback to default units
    const course = safeParseJSON<GeneratedCourse>(
      courseText,
      {
        units: UNITS_DATA,
        courseSummary: {
          totalUnits: UNITS_DATA.length,
          totalLessons: UNITS_DATA.reduce((sum, u) => sum + u.lessons.length, 0),
          focusAreas: ['Conversation', 'Grammar', 'Vocabulary'],
          estimatedDuration: '2-3 weeks'
        }
      },
      'Course Generator'
    );

    // Validate the generated course
    validateCourse(course);

    console.log(`✓ Course generated successfully: ${course.courseSummary.totalUnits} units, ${course.courseSummary.totalLessons} lessons`);

    return course;
  } catch (error) {
    console.error('Course generation failed:', error);
    throw new Error(`Failed to generate personalized course: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save generated course to localStorage
 */
export function savePersonalizedCourse(course: GeneratedCourse): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('personalizedCourse', JSON.stringify(course));
    console.log('✓ Personalized course saved to localStorage');
  } catch (error) {
    console.error('Failed to save personalized course:', error);
  }
}

/**
 * Load personalized course from localStorage
 */
export function loadPersonalizedCourse(): GeneratedCourse | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('personalizedCourse');
    if (stored) {
      const course = JSON.parse(stored) as GeneratedCourse;
      console.log('✓ Personalized course loaded from localStorage');
      return course;
    }
  } catch (error) {
    console.error('Failed to load personalized course:', error);
  }

  return null;
}

/**
 * Clear personalized course from localStorage
 */
export function clearPersonalizedCourse(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('personalizedCourse');
    console.log('✓ Personalized course cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear personalized course:', error);
  }
}
