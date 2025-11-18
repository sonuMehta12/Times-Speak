# 🔄 Data Flow Architecture

This document explains how data flows through the application.

---

## 📊 Data Source

**Primary Data File:** `lib/data/units.ts`

Contains:
- Unit 1: Introduction (5 lessons)
- Unit 2: Workplace Communication (2 lessons)

Each lesson includes:
- `id`: Lesson identifier (e.g., "l1", "l2")
- `phrase`: Main phrase to learn
- `script`: Instructional script for the lesson
- `cueQuestion`: Multiple choice quiz question
- `roleplay`: Array of dialogue lines

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     App Layout                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         LessonContext Provider                        │   │
│  │  - Current Lesson State                               │   │
│  │  - User Progress                                      │   │
│  │  - Progress Methods                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Pages                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │   Home   │  │  Lesson  │  │   Quiz   │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ Roleplay │  │ Summary  │  │  Final   │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            localStorage Persistence                   │   │
│  │  Key: "languageLearningProgress"                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow by Feature

### **1. Home Page → Node Click**

```
User clicks Node 1
    ↓
LearningPath.tsx → handleNodeClick()
    ↓
Check node.status
    ↓
If locked: return (do nothing)
If active/completed: router.push(`/${unitId}/${lessonId}/lesson`)
    ↓
Navigate to Lesson Page
```

**Data Used:**
- `UNITS_DATA[0].lessons[0]` → First lesson
- `userProgress.units.unit_1_introduction.lessonsProgress.l1.steps` → Check completion status

---

### **2. Lesson Page Flow**

```
/[unitId]/[lessonId]/lesson
    ↓
Extract params: { unitId, lessonId }
    ↓
Fetch lesson data:
  const unit = UNITS_DATA.find(u => u.unitId === unitId)
  const lesson = unit.lessons.find(l => l.id === lessonId)
    ↓
Display:
  - lesson.phrase
  - lesson.script
    ↓
User completes lesson
    ↓
Call: completeLesson(lessonId)
    ↓
Update context:
  userProgress.units[unitId].lessonsProgress[lessonId].steps.lesson = true
    ↓
Save to localStorage
    ↓
Navigate to: `/${unitId}/${lessonId}/quiz`
```

**Context Methods Used:**
- `setCurrentLesson(unitId, lessonId)`
- `completeLesson(lessonId)`

---

### **3. Quiz Page Flow**

```
/[unitId]/[lessonId]/quiz
    ↓
Extract params: { unitId, lessonId }
    ↓
Fetch quiz data:
  const lesson = getCurrentLesson(unitId, lessonId)
  const quiz = lesson.cueQuestion
    ↓
Display:
  - quiz.question
  - quiz.options
    ↓
User selects answer
    ↓
Check: selectedIndex === quiz.correctIndex
    ↓
Calculate score: isCorrect ? 100 : 0
    ↓
Call: completeQuiz(lessonId, score)
    ↓
Update context:
  userProgress.units[unitId].lessonsProgress[lessonId].steps.quiz = true
  userProgress.units[unitId].lessonsProgress[lessonId].steps.quizScore = score
    ↓
Save to localStorage
    ↓
Navigate to: `/${unitId}/${lessonId}/roleplay`
```

**Context Methods Used:**
- `completeQuiz(lessonId, score)`

---

### **4. Roleplay Page Flow**

```
/[unitId]/[lessonId]/roleplay
    ↓
Extract params: { unitId, lessonId }
    ↓
Fetch roleplay data:
  const lesson = getCurrentLesson(unitId, lessonId)
  const roleplay = lesson.roleplay
    ↓
Transform data:
  const messages = roleplay.map(line => ({
    sender: line.speaker === "A" ? "ai" : "user",
    text: line.text
  }))
    ↓
Display conversation
    ↓
User completes roleplay
    ↓
Call: completeRoleplay(lessonId)
    ↓
Update context:
  userProgress.units[unitId].lessonsProgress[lessonId].steps.roleplay = true
  userProgress.units[unitId].lessonsProgress[lessonId].completed = true
  userProgress.units[unitId].lessonsProgress[lessonId].completedAt = new Date()
    ↓
Calculate XP: xpEarned = 50
    ↓
Update: userProgress.totalXP += 50
    ↓
Save to localStorage
    ↓
Navigate to: `/lesson-complete?lessonId=${lessonId}&unitId=${unitId}`
```

**Context Methods Used:**
- `completeRoleplay(lessonId)`

---

### **5. Summary Page Flow**

```
/lesson-complete?lessonId=l1&unitId=unit_1_introduction
    ↓
Extract query params
    ↓
Fetch progress:
  const progress = getLessonProgress(lessonId)
    ↓
Calculate rewards:
  - XP earned
  - Quiz score
  - Streaks
  - Badges
    ↓
Display summary
    ↓
Get next lesson:
  const nextLesson = getNextLesson(lessonId)
    ↓
Show next lesson card
    ↓
User clicks "Continue" or "Back to Home"
    ↓
Navigate accordingly
```

**Context Methods Used:**
- `getLessonProgress(lessonId)`
- `getNextLesson(lessonId)`

---

### **6. Progress & Unlocking**

```
Home Page loads
    ↓
LearningPath component renders
    ↓
For each lesson node:
  Check: isLessonUnlocked(lessonId)
    ↓
  If lessonId === "l1": return true (always unlocked)
  Else:
    Get previous lesson: prevLessonId = `l${lessonIndex - 1}`
    Check: userProgress.units[unitId].lessonsProgress[prevLessonId].steps.roleplay === true
    ↓
  Set node.status:
    - "completed" if all steps done
    - "active" if unlocked
    - "locked" if not unlocked
    ↓
Render node with appropriate style
```

**Context Methods Used:**
- `isLessonUnlocked(lessonId)`
- `getLessonProgress(lessonId)`

---

### **7. Final Quiz Unlock**

```
User completes Lesson 5 roleplay
    ↓
Context updates: l5.completed = true
    ↓
Home Page re-renders
    ↓
LearningPath checks: isFinalQuizUnlocked()
    ↓
Check all lessons:
  ["l1", "l2", "l3", "l4", "l5"].every(id =>
    userProgress.units.unit_1_introduction.lessonsProgress[id].completed === true
  )
    ↓
If true: Node 6 status = "active"
    ↓
User can click Final Quiz node
```

**Context Methods Used:**
- `isFinalQuizUnlocked()`

---

### **8. Final Roleplay Unlock**

```
User completes Final Quiz
    ↓
Context updates:
  userProgress.units.unit_1_introduction.finalQuizCompleted = true
    ↓
Home Page re-renders
    ↓
Node 7 status = "active"
    ↓
User can click Final Roleplay node
```

**Context Methods Used:**
- `completeFinalQuiz()`
- `isFinalRoleplayUnlocked()`

---

## 💾 localStorage Schema

### **Key:** `"languageLearningProgress"`

### **Value Structure:**

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
            "lesson": false,
            "quiz": false,
            "roleplay": false
          },
          "completed": false,
          "xpEarned": 0
        },
        "l3": { "...": "..." },
        "l4": { "...": "..." },
        "l5": { "...": "..." }
      },
      "finalQuizCompleted": false,
      "finalRoleplayCompleted": false,
      "isCompleted": false,
      "lastAccessedAt": "2025-11-17T12:00:00Z"
    }
  },
  "totalXP": 50,
  "currentStreak": 1,
  "longestStreak": 1,
  "lastActiveDate": "2025-11-17",
  "badges": []
}
```

---

## 🔄 Context API Structure

### **LessonContext Provider**

**Location:** `lib/context/LessonContext.tsx`

**State:**
```typescript
const [userProgress, setUserProgress] = useState<UserProgress>(initialProgress);
const [currentLesson, setCurrentLessonState] = useState<Lesson | null>(null);
```

**Methods:**

1. **setCurrentLesson(unitId, lessonId)**
   - Fetches lesson from UNITS_DATA
   - Updates currentLesson state

2. **completeLesson(lessonId)**
   - Updates `steps.lesson = true`
   - Saves to localStorage

3. **completeQuiz(lessonId, score)**
   - Updates `steps.quiz = true`
   - Saves `steps.quizScore = score`
   - Saves to localStorage

4. **completeRoleplay(lessonId)**
   - Updates `steps.roleplay = true`
   - Sets `completed = true`
   - Adds `xpEarned`
   - Updates `totalXP`
   - Updates `currentStreak`
   - Saves to localStorage

5. **isLessonUnlocked(lessonId)**
   - Returns boolean
   - Checks previous lesson completion

6. **isFinalQuizUnlocked()**
   - Returns boolean
   - Checks all 5 lessons completed

7. **isFinalRoleplayUnlocked()**
   - Returns boolean
   - Checks final quiz completed

8. **getLessonProgress(lessonId)**
   - Returns LessonProgress object

9. **getNextLesson(lessonId)**
   - Returns next Lesson or null

---

## 🎯 Data Transformation Examples

### **1. UNITS_DATA → Learning Nodes**

```typescript
// Input: UNITS_DATA[0].lessons
const lessons = [
  { id: "l1", phrase: "Hey! How's it going?", ... },
  { id: "l2", phrase: "Nice to meet you.", ... },
  // ...
];

// Output: Learning Path nodes
const nodes = lessons.map((lesson, index) => ({
  id: index + 1,
  lessonId: lesson.id,
  unitId: "unit_1_introduction",
  title: `Lesson ${index + 1}`,
  phrase: lesson.phrase,
  status: getLessonStatus(lesson.id),
  xp: 50,
  duration: "5 min",
}));
```

---

### **2. Lesson Roleplay → Message Format**

```typescript
// Input: lesson.roleplay
const roleplay = [
  { speaker: "A", text: "Hey! How's it going?" },
  { speaker: "B", text: "Good, thanks! How about you?" },
  { speaker: "A", text: "I'm good too!" }
];

// Output: Chat messages
const messages = roleplay.map((line, index) => ({
  id: index,
  sender: line.speaker === "A" ? "ai" : "user",
  text: line.text,
  time: generateTime(index),
}));
```

---

### **3. CueQuestion → Quiz Format**

```typescript
// Input: lesson.cueQuestion
const cueQuestion = {
  question: "Your friend says: 'Hey! How's it going?' Choose the best reply:",
  options: [
    "I'm going to the shop.",
    "Good, thanks! How about you?",
    "Repeat again."
  ],
  correctIndex: 1
};

// Output: Quiz question
const quizQuestion = {
  id: `quiz-${lessonId}`,
  type: "multiple-choice",
  question: cueQuestion.question,
  options: cueQuestion.options,
  correctAnswer: cueQuestion.options[cueQuestion.correctIndex],
  correctIndex: cueQuestion.correctIndex,
};
```

---

## 🚀 Performance Considerations

### **1. Context Optimization**
- Use `useMemo` for computed values
- Memoize expensive calculations
- Only re-render when necessary

### **2. localStorage**
- Debounce saves (don't save on every keystroke)
- Use async operations for large data
- Validate data on load

### **3. Data Fetching**
- All data is static (no API calls)
- UNITS_DATA is imported directly
- No loading states needed for data

---

**Last Updated:** 2025-11-17
