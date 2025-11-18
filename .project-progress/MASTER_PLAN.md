# 🎯 Master Implementation Plan

## Language Learning App - Dynamic Data Flow Implementation

---

## 📋 Overview

### **Desired Learning Structure (Week 1)**

```
Home Page (Learning Path - 7 Nodes)
├── Node 1: Lesson 1 → Quiz 1 → Roleplay 1 → Summary
├── Node 2: Lesson 2 → Quiz 2 → Roleplay 2 → Summary
├── Node 3: Lesson 3 → Quiz 3 → Roleplay 3 → Summary
├── Node 4: Lesson 4 → Quiz 4 → Roleplay 4 → Summary
├── Node 5: Lesson 5 → Quiz 5 → Roleplay 5 → Summary
├── Node 6: Final Quiz (All 7 Quiz Types) → Summary
└── Node 7: Final Roleplay (Comprehensive) → Summary + Rewards
```

### **User Journey Flow**

```mermaid
graph TD
    A[Home - Click Node 1] --> B[/unit_1_introduction/l1/lesson]
    B --> C[Complete Lesson]
    C --> D[/unit_1_introduction/l1/quiz]
    D --> E[Complete Quiz]
    E --> F[/unit_1_introduction/l1/roleplay]
    F --> G[Complete Roleplay]
    G --> H[/lesson-complete Summary]
    H --> I[Home - Node 2 Unlocked]
    I --> J[Repeat for Nodes 2-5]
    J --> K[All 5 Lessons Complete]
    K --> L[Node 6 Unlocked - /final-quiz]
    L --> M[Complete Final Quiz]
    M --> N[Node 7 Unlocked - /final-roleplay]
    N --> O[Complete Final Roleplay]
    O --> P[Achievement/Certificate]
```

---

## 🏗️ Phase 1: Foundation (Data Flow Architecture)

### **Status:** 🔄 In Progress

### **1.1 Create Lesson Context Provider**

**File:** `lib/context/LessonContext.tsx`

**Purpose:**
- Manage global state for current lesson/unit
- Track user progress across all lessons
- Provide methods to update progress
- Persist data to localStorage

**Key Exports:**
```typescript
interface LessonContextType {
  // Current State
  currentLesson: Lesson | null;
  currentUnit: Unit | null;

  // Progress
  userProgress: UserProgress;

  // Methods
  setCurrentLesson: (unitId: string, lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  completeQuiz: (lessonId: string, score: number) => void;
  completeRoleplay: (lessonId: string) => void;
  isLessonUnlocked: (lessonId: string) => boolean;
  getNextLesson: (currentLessonId: string) => Lesson | null;

  // Progress Queries
  getLessonProgress: (lessonId: string) => LessonProgress;
  getTotalProgress: () => number; // 0-100%
  isFinalQuizUnlocked: () => boolean;
  isFinalRoleplayUnlocked: () => boolean;
}
```

**Implementation Details:**
- Use React Context API
- Store progress in state
- Auto-save to localStorage on every update
- Load from localStorage on mount
- Provide to entire app via `app/layout.tsx`

---

### **1.2 Create Progress Utility Functions**

**File:** `lib/utils/progress.ts`

**Functions:**

```typescript
// Calculate overall progress percentage
export function calculateProgress(unitId: string): number;

// Check if a lesson is unlocked
export function isLessonUnlocked(
  lessonId: string,
  progress: UserProgress
): boolean;

// Get next lesson in sequence
export function getNextLesson(
  currentLessonId: string,
  unitId: string
): Lesson | null;

// Save progress to localStorage
export function saveProgress(progress: UserProgress): void;

// Load progress from localStorage
export function loadProgress(): UserProgress | null;

// Initialize fresh progress
export function initializeProgress(): UserProgress;

// Check if all lessons in a unit are complete
export function isUnitComplete(
  unitId: string,
  progress: UserProgress
): boolean;

// Get current streak
export function calculateStreak(progress: UserProgress): number;

// Calculate XP earned
export function calculateXP(progress: UserProgress): number;
```

---

### **1.3 Update Type Definitions**

**File:** `lib/types/language.ts`

**Add New Types:**

```typescript
// Progress tracking for individual steps
export interface StepProgress {
  lesson: boolean;
  quiz: boolean;
  roleplay: boolean;
  quizScore?: number;
}

// Enhanced lesson progress
export interface LessonProgress {
  lessonId: string;
  steps: StepProgress;
  completed: boolean;
  completedAt?: string;
  xpEarned: number;
}

// Enhanced unit progress
export interface UnitProgress {
  unitId: string;
  lessonsProgress: Record<string, LessonProgress>;
  finalQuizCompleted: boolean;
  finalRoleplayCompleted: boolean;
  isCompleted: boolean;
  lastAccessedAt?: string;
}

// Overall user progress
export interface UserProgress {
  userId: string;
  units: Record<string, UnitProgress>;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  badges: string[];
}

// Reward data
export interface Reward {
  type: 'xp' | 'badge' | 'streak' | 'achievement';
  value: number | string;
  title: string;
  description: string;
  icon?: string;
}

// Summary data
export interface LessonSummary {
  lessonId: string;
  phrase: string;
  xpEarned: number;
  quizScore?: number;
  timeSpent?: string;
  rewards: Reward[];
  nextLesson?: Lesson;
}
```

---

## 🛣️ Phase 2: Dynamic Routing Structure

### **Status:** ⏸️ Pending

### **2.1 Create Dynamic Routes**

**New Route Structure:**

```
app/
├── [unitId]/
│   └── [lessonId]/
│       ├── lesson/
│       │   └── page.tsx          # Individual lesson
│       ├── quiz/
│       │   └── page.tsx          # Individual quiz
│       └── roleplay/
│           └── page.tsx          # Individual roleplay
├── final-quiz/
│   └── page.tsx                  # Final quiz (all 7 types)
├── final-roleplay/
│   └── page.tsx                  # Final roleplay
└── lesson-complete/
    └── page.tsx                  # Summary & rewards screen
```

**URL Examples:**
- `/unit_1_introduction/l1/lesson`
- `/unit_1_introduction/l1/quiz`
- `/unit_1_introduction/l1/roleplay`
- `/final-quiz`
- `/final-roleplay`
- `/lesson-complete?lessonId=l1&unitId=unit_1_introduction`

---

### **2.2 Update ConditionalLayout**

**File:** `components/ConditionalLayout.tsx`

**Add new routes to hide navbar/footer:**

```typescript
const HIDE_BOTH_ROUTES = [
  "/quiz",
  "/role",
  "/aditi",
  "/final-quiz",           // New
  "/final-roleplay",       // New
];

const HIDE_NAVBAR_ONLY_ROUTES = [
  "/lesson",
  "/lesson-complete",      // New
];

// Update to handle dynamic routes
const isDynamicLessonRoute = pathname.includes("/lesson");
const isDynamicQuizRoute = pathname.includes("/quiz");
const isDynamicRoleplayRoute = pathname.includes("/roleplay");
```

---

## 🎨 Phase 3: Update Home Page & Learning Path

### **Status:** ⏸️ Pending

### **3.1 Transform Learning Path Component**

**File:** `components/LearningPath.tsx`

**Changes:**

1. **Remove hardcoded lessons**
2. **Use UNITS_DATA to generate nodes**
3. **Add progress-based status**
4. **Implement click handlers**

**New Implementation:**

```typescript
const LearningPath = () => {
  const { userProgress, isLessonUnlocked, isFinalQuizUnlocked } = useLessonContext();
  const router = useRouter();

  // Get current unit (Unit 1 for now)
  const currentUnit = UNITS_DATA[0]; // unit_1_introduction

  // Map lessons to nodes
  const lessonNodes = currentUnit.lessons.map((lesson, index) => {
    const progress = userProgress.units[currentUnit.unitId]?.lessonsProgress[lesson.id];

    return {
      id: index + 1,
      lessonId: lesson.id,
      unitId: currentUnit.unitId,
      title: `Lesson ${index + 1}`,
      phrase: lesson.phrase,
      status: getNodeStatus(lesson.id, progress),
      xp: progress?.xpEarned || 50,
      duration: "5 min",
      type: "lesson" as const,
    };
  });

  // Add final quiz node
  const finalQuizNode = {
    id: 6,
    title: "Final Quiz",
    phrase: "Test Your Knowledge",
    status: isFinalQuizUnlocked() ? "active" : "locked",
    xp: 100,
    duration: "10 min",
    type: "final-quiz" as const,
  };

  // Add final roleplay node
  const finalRoleplayNode = {
    id: 7,
    title: "Final Roleplay",
    phrase: "Master Conversation",
    status: userProgress.units[currentUnit.unitId]?.finalQuizCompleted
      ? "active"
      : "locked",
    xp: 150,
    duration: "15 min",
    type: "final-roleplay" as const,
  };

  const nodes = [...lessonNodes, finalQuizNode, finalRoleplayNode];

  // Handle node click
  const handleNodeClick = (node: Node) => {
    if (node.status === "locked") return;

    if (node.type === "final-quiz") {
      router.push("/final-quiz");
    } else if (node.type === "final-roleplay") {
      router.push("/final-roleplay");
    } else {
      router.push(`/${node.unitId}/${node.lessonId}/lesson`);
    }
  };

  // ... rest of rendering logic
};

function getNodeStatus(
  lessonId: string,
  progress?: LessonProgress
): LessonStatus {
  if (progress?.completed) return "completed";
  if (isLessonUnlocked(lessonId)) return "active";
  return "locked";
}
```

---

## 📖 Phase 4: Dynamic Lesson Page

### **Status:** ⏸️ Pending

### **4.1 Create Dynamic Lesson Page**

**File:** `app/[unitId]/[lessonId]/lesson/page.tsx`

**Implementation:**

```typescript
export default async function LessonPage({
  params
}: {
  params: Promise<{ unitId: string; lessonId: string }>
}) {
  const { unitId, lessonId } = await params;

  // Fetch lesson data
  const unit = UNITS_DATA.find(u => u.unitId === unitId);
  const lesson = unit?.lessons.find(l => l.id === lessonId);

  if (!lesson) {
    redirect("/");
  }

  return <LessonContent lesson={lesson} unitId={unitId} />;
}
```

**Client Component:**

```typescript
"use client";

function LessonContent({ lesson, unitId }) {
  const { completeLesson } = useLessonContext();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = () => {
    completeLesson(lesson.id);
    router.push(`/${unitId}/${lesson.id}/quiz`);
  };

  // Use lesson.phrase and lesson.script
  // ... existing lesson UI logic
}
```

**UI Fixes:**
- [ ] Improve AI avatar responsiveness
- [ ] Better speech recognition feedback
- [ ] Fix mobile layout issues
- [ ] Add loading states

---

## 🎯 Phase 5: Dynamic Quiz Page

### **Status:** ⏸️ Pending

### **5.1 Individual Lesson Quiz**

**File:** `app/[unitId]/[lessonId]/quiz/page.tsx`

**Implementation:**

```typescript
export default async function QuizPage({
  params
}: {
  params: Promise<{ unitId: string; lessonId: string }>
}) {
  const { unitId, lessonId } = await params;

  // Fetch lesson data
  const unit = UNITS_DATA.find(u => u.unitId === unitId);
  const lesson = unit?.lessons.find(l => l.id === lessonId);

  if (!lesson) redirect("/");

  return <IndividualQuizContent lesson={lesson} unitId={unitId} />;
}
```

**Client Component:**

```typescript
function IndividualQuizContent({ lesson, unitId }) {
  const { completeQuiz } = useLessonContext();
  const router = useRouter();

  const quiz = lesson.cueQuestion;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === quiz.correctIndex;
    const score = isCorrect ? 100 : 0;

    completeQuiz(lesson.id, score);

    setTimeout(() => {
      router.push(`/${unitId}/${lesson.id}/roleplay`);
    }, 2000);
  };

  // Single question quiz UI
}
```

---

### **5.2 Final Quiz**

**File:** `app/final-quiz/page.tsx`

**Implementation:**

```typescript
"use client";

export default function FinalQuizPage() {
  const { userProgress } = useLessonContext();

  // Check if unlocked
  if (!isFinalQuizUnlocked(userProgress)) {
    redirect("/");
  }

  // All 7 quiz types with NEW content
  const quizQuestions = [
    createListeningQuiz(),    // Type 1
    createGrammarQuiz(),      // Type 2
    createArrangeQuiz(),      // Type 3
    createPatternQuiz(),      // Type 4
    createAudioStressQuiz(),  // Type 5
    createComprehensionQuiz(),// Type 6
    createSpeakingQuiz(),     // Type 7
  ];

  // Use existing quiz components
  return <QuizFlow questions={quizQuestions} isFinal={true} />;
}
```

**UI Fixes:**
- [ ] Consistent question card styling
- [ ] Better transition animations
- [ ] Improve progress bar visibility
- [ ] Fix mobile quiz options layout

---

## 🎭 Phase 6: Dynamic Roleplay Page

### **Status:** ⏸️ Pending

### **6.1 Individual Lesson Roleplay**

**File:** `app/[unitId]/[lessonId]/roleplay/page.tsx`

**Implementation:**

```typescript
export default async function RoleplayPage({
  params
}: {
  params: Promise<{ unitId: string; lessonId: string }>
}) {
  const { unitId, lessonId } = await params;

  const unit = UNITS_DATA.find(u => u.unitId === unitId);
  const lesson = unit?.lessons.find(l => l.id === lessonId);

  if (!lesson) redirect("/");

  return <RoleplayContent lesson={lesson} unitId={unitId} />;
}
```

**Client Component:**

```typescript
function RoleplayContent({ lesson, unitId }) {
  const { completeRoleplay } = useLessonContext();
  const router = useRouter();

  // Transform roleplay data
  const messages = lesson.roleplay.map((line, index) => ({
    id: index,
    sender: line.speaker === "A" ? "ai" : "user",
    text: line.text,
    time: generateTime(index),
  }));

  const handleComplete = () => {
    completeRoleplay(lesson.id);
    router.push(`/lesson-complete?lessonId=${lesson.id}&unitId=${unitId}`);
  };

  // Use existing roleplay UI
}
```

---

### **6.2 Final Roleplay**

**File:** `app/final-roleplay/page.tsx`

**Implementation:**

```typescript
export default function FinalRoleplayPage() {
  const { userProgress, completeUnit } = useLessonContext();

  // Check if unlocked
  if (!userProgress.units.unit_1_introduction?.finalQuizCompleted) {
    redirect("/");
  }

  // Comprehensive roleplay combining all lessons
  const comprehensiveRoleplay = generateComprehensiveRoleplay();

  const handleComplete = () => {
    completeUnit("unit_1_introduction");
    router.push("/achievement");
  };

  return <RoleplayFlow messages={comprehensiveRoleplay} isFinal={true} />;
}
```

**UI Fixes:**
- [ ] Better chat bubble styling
- [ ] Improve hint system UI
- [ ] Fix recording feedback display
- [ ] Mobile chat layout improvements

---

## 🎁 Phase 7: Summary & Rewards Screen

### **Status:** ⏸️ Pending

### **7.1 Create Lesson Complete Summary**

**File:** `app/lesson-complete/page.tsx`

**Purpose:**
Show a cheerup message with:
- XP earned
- Quiz score
- Time spent
- Badges/achievements unlocked
- Next lesson preview
- Motivational message

**Implementation:**

```typescript
"use client";

export default function LessonCompletePage() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const unitId = searchParams.get("unitId");

  const { getLessonProgress, getNextLesson } = useLessonContext();
  const router = useRouter();

  const progress = getLessonProgress(lessonId);
  const nextLesson = getNextLesson(lessonId);

  const summary: LessonSummary = {
    lessonId,
    phrase: getCurrentLesson(unitId, lessonId).phrase,
    xpEarned: progress.xpEarned,
    quizScore: progress.steps.quizScore,
    rewards: [
      { type: 'xp', value: 50, title: 'XP Earned', icon: '⭐' },
      { type: 'streak', value: 3, title: 'Day Streak', icon: '🔥' },
    ],
    nextLesson,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-navy-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Success Animation */}
        <SuccessAnimation />

        {/* Cheerup Message */}
        <h1 className="text-4xl font-bold text-center mt-8">
          🎉 Amazing Work!
        </h1>
        <p className="text-xl text-center mt-4 text-gray-600">
          You've completed: "{summary.phrase}"
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <StatCard icon="⭐" title="XP Earned" value={summary.xpEarned} />
          <StatCard icon="📊" title="Quiz Score" value={`${summary.quizScore}%`} />
        </div>

        {/* Rewards Section */}
        <RewardsDisplay rewards={summary.rewards} />

        {/* Next Lesson Preview */}
        {nextLesson && (
          <NextLessonCard
            lesson={nextLesson}
            onClick={() => router.push(`/${unitId}/${nextLesson.id}/lesson`)}
          />
        )}

        {/* Back to Home */}
        <Button
          onClick={() => router.push("/")}
          className="w-full mt-6"
        >
          Back to Learning Path
        </Button>
      </div>
    </div>
  );
}
```

**Components to Create:**
- `SuccessAnimation` - Lottie or CSS animation
- `StatCard` - Display individual stats
- `RewardsDisplay` - Show earned rewards
- `NextLessonCard` - Preview next lesson

---

## 💾 Phase 8: Progress Tracking Implementation

### **Status:** ⏸️ Pending

### **8.1 Progress Data Structure**

**localStorage Key:** `"languageLearningProgress"`

**Data Format:**

```json
{
  "userId": "user_12345",
  "units": {
    "unit_1_introduction": {
      "unitId": "unit_1_introduction",
      "lessonsProgress": {
        "l1": {
          "lessonId": "l1",
          "steps": {
            "lesson": true,
            "quiz": true,
            "roleplay": true,
            "quizScore": 100
          },
          "completed": true,
          "completedAt": "2025-11-17T10:30:00Z",
          "xpEarned": 50
        },
        "l2": {
          "lessonId": "l2",
          "steps": {
            "lesson": true,
            "quiz": false,
            "roleplay": false
          },
          "completed": false,
          "xpEarned": 20
        }
      },
      "finalQuizCompleted": false,
      "finalRoleplayCompleted": false,
      "isCompleted": false
    }
  },
  "totalXP": 70,
  "currentStreak": 3,
  "longestStreak": 5,
  "lastActiveDate": "2025-11-17",
  "badges": ["first_lesson", "quiz_master"]
}
```

---

### **8.2 Unlock Logic**

```typescript
// Lesson 1 is always unlocked
// Lesson N unlocks when Lesson N-1 roleplay is complete

function isLessonUnlocked(lessonId: string, progress: UserProgress): boolean {
  const unit = progress.units.unit_1_introduction;

  if (lessonId === "l1") return true; // First lesson always unlocked

  const lessonIndex = parseInt(lessonId.substring(1)); // "l2" -> 2
  const prevLessonId = `l${lessonIndex - 1}`; // "l1"

  const prevProgress = unit?.lessonsProgress[prevLessonId];

  return prevProgress?.steps.roleplay === true;
}

// Final quiz unlocks when all 5 lessons are complete
function isFinalQuizUnlocked(progress: UserProgress): boolean {
  const unit = progress.units.unit_1_introduction;

  return ["l1", "l2", "l3", "l4", "l5"].every(
    id => unit?.lessonsProgress[id]?.completed === true
  );
}

// Final roleplay unlocks when final quiz is complete
function isFinalRoleplayUnlocked(progress: UserProgress): boolean {
  return progress.units.unit_1_introduction?.finalQuizCompleted === true;
}
```

---

## 🔄 Phase 9: Navigation Flow Implementation

### **Status:** ⏸️ Pending

### **Complete Flow:**

```
1. Home Page → Click Node 1
   ↓
2. /unit_1_introduction/l1/lesson (Lesson Page)
   → Complete lesson
   ↓
3. /unit_1_introduction/l1/quiz (Quiz Page)
   → Complete quiz
   ↓
4. /unit_1_introduction/l1/roleplay (Roleplay Page)
   → Complete roleplay
   ↓
5. /lesson-complete?lessonId=l1&unitId=unit_1_introduction
   → View summary & rewards
   ↓
6. Home Page (Node 2 now unlocked)

... Repeat for Lessons 2-5 ...

7. After all 5 lessons complete
   → Node 6 unlocks
   ↓
8. /final-quiz (All 7 quiz types)
   → Complete final quiz
   ↓
9. Home Page (Node 7 now unlocked)
   ↓
10. /final-roleplay (Comprehensive roleplay)
    → Complete final roleplay
    ↓
11. /achievement (Certificate & celebration)
```

---

## 🧪 Phase 10: Testing & Polish

### **Status:** ⏸️ Pending

### **Testing Checklist:**

**End-to-End Flow:**
- [ ] Complete Lesson 1 → Quiz 1 → Roleplay 1
- [ ] Verify Lesson 2 unlocks
- [ ] Complete all 5 lessons
- [ ] Verify Final Quiz unlocks
- [ ] Complete Final Quiz
- [ ] Verify Final Roleplay unlocks
- [ ] Complete Final Roleplay
- [ ] Verify achievement/certificate

**Progress Persistence:**
- [ ] Refresh page mid-lesson → progress saved
- [ ] Complete lesson → close browser → reopen → progress loaded
- [ ] Node status persists correctly

**UI/UX:**
- [ ] All pages responsive on mobile
- [ ] Smooth transitions between pages
- [ ] Loading states during navigation
- [ ] Error handling for invalid routes

**Data Integrity:**
- [ ] Cannot access locked lessons
- [ ] Cannot access final quiz before completing lessons
- [ ] Progress updates correctly in real-time
- [ ] XP and streaks calculate correctly

---

## 📊 Success Metrics

### **POC is complete when:**

✅ User can complete full learning path (Nodes 1-7)
✅ Progress persists across sessions
✅ Nodes lock/unlock based on completion
✅ All 7 quiz types work in final quiz
✅ Summary screens show rewards
✅ UI is polished and responsive

---

## 🚀 Implementation Timeline

**Quick Win Strategy (POC):**

| Day | Phase | Hours | Tasks |
|-----|-------|-------|-------|
| 1 | Phase 1 | 3h | Context + Utilities |
| 2 | Phase 2 | 2h | Dynamic Routing |
| 3 | Phase 4 | 3h | Dynamic Lesson Page |
| 4 | Phase 5.1 | 2h | Individual Quiz |
| 5 | Phase 6.1 | 2h | Individual Roleplay |
| 6 | Phase 3 | 3h | Learning Path Updates |
| 7 | Phase 7 | 3h | Summary & Rewards |
| 8 | Phase 8 | 2h | Progress Tracking |
| 9 | Phase 5.2 + 6.2 | 4h | Final Quiz + Roleplay |
| 10 | Phase 9 + 10 | 4h | Flow + Testing |

**Total: ~28 hours over 10 days**

---

## 📝 Notes

- **UI fixes:** Done incrementally as we build each page
- **Final quiz content:** Create new questions for all 7 types
- **Gamification:** XP, badges, streaks, cheerup messages
- **Data source:** All from `lib/data/units.ts` (no API needed for POC)

---

**Last Updated:** 2025-11-17
