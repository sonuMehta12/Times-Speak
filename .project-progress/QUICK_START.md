# 🚀 Quick Start Guide

**For developers joining the project or resuming work**

---

## 📁 Project Structure

```
project/
├── .project-progress/          # 📊 All project documentation
│   ├── README.md              # Overview and navigation
│   ├── MASTER_PLAN.md         # Complete implementation plan
│   ├── PROGRESS.md            # Daily progress tracking
│   ├── DATA_FLOW.md           # Data architecture
│   ├── DECISIONS.md           # Technical decisions
│   └── QUICK_START.md         # This file
│
├── app/                        # Next.js 15 App Router
│   ├── page.tsx               # Home page with learning path
│   ├── lesson/page.tsx        # Static lesson page (to be replaced)
│   ├── quiz/page.tsx          # Static quiz page (to be replaced)
│   └── role/page.tsx          # Static roleplay page (to be replaced)
│
├── components/
│   ├── LearningPath.tsx       # Learning path with nodes (needs update)
│   └── ...                    # Other UI components
│
└── lib/
    ├── data/
    │   ├── units.ts           # ✅ NEW: Lesson data
    │   └── learning-categories.ts  # ✅ NEW: Categories
    ├── types/
    │   └── language.ts        # ✅ NEW: Type definitions
    └── context/               # 🔄 TO CREATE
        └── LessonContext.tsx  # To be created in Phase 1
```

---

## 🎯 Current Status

**Phase:** Phase 1 - Foundation (Starting)
**Progress:** 0% of implementation
**Documentation:** 100% complete

### ✅ Completed
- Project planning and documentation
- Data structure design (units.ts, language.ts)
- Architecture decisions

### 🔄 Next Up
- Create LessonContext provider
- Create progress utility functions
- Update type definitions

---

## 🏁 Getting Started

### **1. Read the Documentation**

Before coding, read these files in order:

1. **[README.md](.project-progress/README.md)** - Project overview (5 min)
2. **[MASTER_PLAN.md](.project-progress/MASTER_PLAN.md)** - Full implementation plan (15 min)
3. **[DATA_FLOW.md](.project-progress/DATA_FLOW.md)** - Understand data flow (10 min)

**Total: 30 minutes** to understand the full project

---

### **2. Set Up Development Environment**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

### **3. Explore Current Data**

**Check the new data structure:**

```typescript
// lib/data/units.ts
import { UNITS_DATA } from "@/lib/data/units";

console.log(UNITS_DATA);
// Output: Array of units with lessons
```

**Check type definitions:**

```typescript
// lib/types/language.ts
import { Unit, Lesson, UserProgress } from "@/lib/types/language";
```

---

## 🛠️ Phase 1: Next Steps (Start Here!)

### **Task 1: Create LessonContext**

**File to create:** `lib/context/LessonContext.tsx`

**What it does:**
- Manages global state for lessons and progress
- Provides methods to update progress
- Handles localStorage persistence

**Reference:** See [MASTER_PLAN.md Phase 1.1](.project-progress/MASTER_PLAN.md#11-create-lesson-context-provider)

**Estimated time:** 2 hours

---

### **Task 2: Create Progress Utilities**

**File to create:** `lib/utils/progress.ts`

**What it does:**
- Helper functions for progress calculations
- Unlock logic
- localStorage save/load
- XP and streak calculations

**Reference:** See [MASTER_PLAN.md Phase 1.2](.project-progress/MASTER_PLAN.md#12-create-progress-utility-functions)

**Estimated time:** 1 hour

---

### **Task 3: Update Type Definitions**

**File to update:** `lib/types/language.ts`

**What to add:**
- `StepProgress` interface
- Enhanced `LessonProgress`
- Enhanced `UserProgress`
- `Reward` interface
- `LessonSummary` interface

**Reference:** See [MASTER_PLAN.md Phase 1.3](.project-progress/MASTER_PLAN.md#13-update-type-definitions)

**Estimated time:** 30 minutes

---

## 📚 Key Concepts

### **Data Flow in a Nutshell:**

1. **Home Page** → User clicks Node 1
2. **Navigate** → `/unit_1_introduction/l1/lesson`
3. **Complete Lesson** → Context updates → Navigate to Quiz
4. **Complete Quiz** → Context updates → Navigate to Roleplay
5. **Complete Roleplay** → Context updates → Navigate to Summary
6. **Summary** → Show rewards → Return to Home
7. **Home Page** → Node 2 now unlocked

### **Progress Tracking:**

```typescript
// Each lesson has 3 steps
steps: {
  lesson: boolean,    // Completed lesson instruction
  quiz: boolean,      // Completed quiz
  roleplay: boolean   // Completed roleplay
}

// All steps complete = lesson complete
// Lesson complete = next lesson unlocks
// All 5 lessons complete = Final Quiz unlocks
// Final Quiz complete = Final Roleplay unlocks
```

---

## 🗺️ Development Roadmap

### **Week 1 (Days 1-5): Core Features**
- ✅ Day 1: Planning & documentation (DONE)
- 🔄 Day 2: Phase 1 - Context & utilities (NEXT)
- ⏸️ Day 3: Phase 2 - Dynamic routing
- ⏸️ Day 4: Phase 4 - Dynamic lesson page
- ⏸️ Day 5: Phase 5 - Dynamic quiz page

### **Week 2 (Days 6-10): Polish & Testing**
- ⏸️ Day 6: Phase 6 - Dynamic roleplay page
- ⏸️ Day 7: Phase 3 - Learning path updates
- ⏸️ Day 8: Phase 7 - Summary & rewards
- ⏸️ Day 9: Phase 8 - Progress tracking
- ⏸️ Day 10: Phase 9 & 10 - Flow & testing

---

## 🐛 Troubleshooting

### **Issue: Can't find UNITS_DATA**

```typescript
// Make sure you import from the correct path
import { UNITS_DATA } from "@/lib/data/units";
```

### **Issue: Type errors**

```typescript
// Make sure to import types
import { Unit, Lesson } from "@/lib/types/language";
```

### **Issue: Routes not working**

- Make sure you're using Next.js 15 App Router syntax
- Check that dynamic route folders are named correctly: `[unitId]`, `[lessonId]`

---

## 📖 Common Patterns

### **1. Getting Current Lesson Data**

```typescript
const unit = UNITS_DATA.find(u => u.unitId === unitId);
const lesson = unit?.lessons.find(l => l.id === lessonId);
```

### **2. Checking if Lesson is Unlocked**

```typescript
const { isLessonUnlocked } = useLessonContext();
const unlocked = isLessonUnlocked(lessonId);
```

### **3. Completing a Step**

```typescript
const { completeLesson, completeQuiz, completeRoleplay } = useLessonContext();

// After lesson
completeLesson(lessonId);

// After quiz
completeQuiz(lessonId, score);

// After roleplay
completeRoleplay(lessonId);
```

### **4. Navigating Between Pages**

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();

// Navigate to quiz
router.push(`/${unitId}/${lessonId}/quiz`);

// Navigate to home
router.push("/");
```

---

## 🎨 UI Guidelines

### **Colors (from Tailwind config)**
- **Navy:** `#0F172A` - Primary dark color
- **Teal:** `#14B8A6` - Success, completed states
- **Coral:** `#FF6B6B` - Accent, errors
- **Gold:** `#FFD700` - Active, current lesson

### **Node States**
- **Locked:** Gray background, lock icon, no interaction
- **Active:** Gold accent, star icon, clickable
- **Completed:** Teal background, checkmark, clickable

### **Animations**
- Use `transition-all duration-300` for smooth transitions
- Celebrate completions with success animations
- Provide loading states for async operations

---

## 📞 Need Help?

### **Documentation References**

- **Full Plan:** [MASTER_PLAN.md](.project-progress/MASTER_PLAN.md)
- **Data Flow:** [DATA_FLOW.md](.project-progress/DATA_FLOW.md)
- **Decisions:** [DECISIONS.md](.project-progress/DECISIONS.md)
- **Progress:** [PROGRESS.md](.project-progress/PROGRESS.md)

### **Code References**

- **Data:** `lib/data/units.ts`
- **Types:** `lib/types/language.ts`
- **Current Home:** `app/page.tsx`
- **Current Lesson:** `app/lesson/page.tsx`

---

## ✅ Pre-Development Checklist

Before starting Phase 1, make sure you have:

- [ ] Read MASTER_PLAN.md (Phase 1 section)
- [ ] Read DATA_FLOW.md (Context API section)
- [ ] Explored UNITS_DATA structure
- [ ] Understood the 7-node learning path
- [ ] Understood the lesson → quiz → roleplay flow
- [ ] Set up development environment
- [ ] Tested current app runs without errors

---

## 🚀 Ready to Start?

**Next file to create:**
📄 `lib/context/LessonContext.tsx`

**Start with:**
```typescript
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProgress, Lesson, Unit } from "@/lib/types/language";
import { UNITS_DATA } from "@/lib/data/units";

// ... follow MASTER_PLAN.md Phase 1.1
```

**Good luck! 🎉**

---

**Last Updated:** 2025-11-17
