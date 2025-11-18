# 🤔 Technical Decisions & Rationale

This document records key technical decisions made during the project.

---

## 🏗️ Architecture Decisions

### **Decision 1: Use React Context API (Not Redux/Zustand)**

**Date:** 2025-11-17

**Decision:** Use React Context API for state management

**Rationale:**
- ✅ Lightweight and built into React
- ✅ Sufficient for POC scope
- ✅ No external dependencies
- ✅ Simple to implement and understand
- ✅ Good for small to medium state complexity

**Alternatives Considered:**
- Redux: Too heavy for POC, overkill for simple state
- Zustand: Additional dependency, not necessary for current scope
- Local state only: Would require prop drilling, hard to maintain

**Trade-offs:**
- Performance may degrade with very large state trees (not an issue for POC)
- Re-renders might not be as optimized as Zustand
- Acceptable for POC, can migrate later if needed

---

### **Decision 2: localStorage for Progress Persistence**

**Date:** 2025-11-17

**Decision:** Use localStorage for storing user progress

**Rationale:**
- ✅ No backend needed for POC
- ✅ Works offline
- ✅ Instant persistence
- ✅ Simple API
- ✅ Sufficient for single-user scenarios

**Alternatives Considered:**
- Firebase: Requires setup, authentication, network calls
- IndexedDB: More complex API, overkill for simple JSON
- Cookies: Size limitations, sent with every request

**Trade-offs:**
- Data only persists in one browser
- 5-10MB storage limit (more than enough for our needs)
- No cross-device sync (future enhancement)
- Can be cleared by user

**Future Migration Path:**
- Easy to swap localStorage with Firebase/Supabase later
- Keep the same Context API, just change persistence layer

---

### **Decision 3: Dynamic Routing with [unitId]/[lessonId]**

**Date:** 2025-11-17

**Decision:** Use `/[unitId]/[lessonId]/lesson` route structure

**Rationale:**
- ✅ Clean, RESTful URLs
- ✅ Easy to parse params
- ✅ SEO-friendly
- ✅ Shareable links
- ✅ Supports multiple units in future

**Alternatives Considered:**
- `/lesson?unitId=x&lessonId=y`: Ugly URLs, harder to read
- `/lesson/[id]` only: Would need to encode unit+lesson in single ID
- Numeric IDs: Less semantic, harder to debug

**Example URLs:**
- `/unit_1_introduction/l1/lesson`
- `/unit_1_introduction/l1/quiz`
- `/unit_1_introduction/l1/roleplay`

---

### **Decision 4: Fix UI As We Go (Not Separate Phase)**

**Date:** 2025-11-17

**Decision:** Fix UI issues incrementally while building features

**Rationale:**
- ✅ Faster feedback loop
- ✅ Prevents accumulation of UI debt
- ✅ Better developer experience
- ✅ Easier to test each feature fully before moving on

**Alternatives Considered:**
- Fix all UI in final polish phase: Risk of large refactors at the end
- Ignore UI for POC: Would make testing harder, poor demo quality

**Approach:**
- Fix critical UI issues as we build each page
- Document minor issues for batch fixing later
- Maintain UI quality throughout development

---

## 📊 Data Structure Decisions

### **Decision 5: Single `steps` Object for Lesson Progress**

**Date:** 2025-11-17

**Decision:** Track lesson progress with nested steps object

```typescript
steps: {
  lesson: boolean;
  quiz: boolean;
  roleplay: boolean;
  quizScore?: number;
}
```

**Rationale:**
- ✅ Clear structure
- ✅ Easy to check partial completion
- ✅ Supports step-by-step unlocking
- ✅ Simple to update individual steps

**Alternatives Considered:**
- Flat structure: `lessonCompleted`, `quizCompleted`, etc.
  - More verbose, harder to iterate
- Array of completed steps: `completedSteps: ["lesson", "quiz"]`
  - Less type-safe, harder to query

---

### **Decision 6: Keep CueQuestion Simple (Single Question per Lesson)**

**Date:** 2025-11-17

**Decision:** Each lesson has exactly one `cueQuestion` for individual quiz

**Rationale:**
- ✅ Matches current data structure
- ✅ Quick reinforcement after lesson
- ✅ Simple to implement
- ✅ Keeps individual quiz short (not overwhelming)

**Final Quiz:**
- Has all 7 quiz types (comprehensive assessment)
- Different from individual lesson quizzes

---

## 🎨 UI/UX Decisions

### **Decision 7: Summary Screen After Roleplay**

**Date:** 2025-11-17

**Decision:** Show lesson completion summary after roleplay (not after quiz)

**Rationale:**
- ✅ Roleplay is the final step
- ✅ User has completed full learning cycle
- ✅ Good point for celebration/rewards
- ✅ Natural transition back to home

**Summary Screen Includes:**
- XP earned
- Quiz score
- Time spent
- Badges/achievements
- Next lesson preview
- Motivational message

---

### **Decision 8: 7 Nodes in Learning Path**

**Date:** 2025-11-17

**Decision:** 5 lesson nodes + 1 final quiz + 1 final roleplay = 7 total nodes

**Rationale:**
- ✅ Represents "Week 1" of learning
- ✅ Clear structure
- ✅ Final assessments provide sense of accomplishment
- ✅ Easy to visualize progress

**Node Structure:**
```
Nodes 1-5: Individual lessons (lesson → quiz → roleplay)
Node 6: Final quiz (all 7 quiz types)
Node 7: Final roleplay (comprehensive)
```

---

## 🔄 Flow Decisions

### **Decision 9: Auto-Navigate After Completion**

**Date:** 2025-11-17

**Decision:** Automatically navigate to next step after completing current step

**Flow:**
```
Lesson complete → Navigate to Quiz
Quiz complete → Navigate to Roleplay
Roleplay complete → Navigate to Summary
Summary → User chooses (next lesson or home)
```

**Rationale:**
- ✅ Smooth user experience
- ✅ Clear learning path
- ✅ Reduces friction
- ✅ Maintains momentum

**Alternative Considered:**
- Manual navigation with buttons: More clicks, interrupts flow

---

### **Decision 10: Locked Nodes Cannot Be Clicked**

**Date:** 2025-11-17

**Decision:** Locked nodes are disabled and show lock icon

**Rationale:**
- ✅ Clear visual feedback
- ✅ Prevents confusion
- ✅ Encourages sequential learning
- ✅ Gamification element (unlock progression)

**Visual States:**
- **Locked:** Gray, lock icon, no hover effect
- **Active:** Gold, star icon, clickable
- **Completed:** Teal, checkmark, clickable (for review)

---

## 🎮 Gamification Decisions

### **Decision 11: XP System**

**Date:** 2025-11-17

**Decision:** Award XP for completing lessons and quizzes

**XP Values:**
- Lesson completion: 20 XP
- Quiz completion: 10 XP (+ bonus for perfect score)
- Roleplay completion: 20 XP
- **Total per lesson:** 50 XP
- Final quiz: 100 XP
- Final roleplay: 150 XP

**Rationale:**
- ✅ Simple math
- ✅ Clear progression
- ✅ Motivates completion

---

### **Decision 12: Streak Tracking**

**Date:** 2025-11-17

**Decision:** Track daily learning streaks

**Rules:**
- Completes at least one lesson step per day → Streak continues
- Miss a day → Streak resets to 0
- Display current streak and longest streak

**Rationale:**
- ✅ Encourages daily practice
- ✅ Build habit formation
- ✅ Simple to understand

---

### **Decision 13: Badges/Achievements**

**Date:** 2025-11-17

**Decision:** Award badges for milestones

**Initial Badges:**
- "First Lesson" - Complete first lesson
- "Quiz Master" - Get 100% on any quiz
- "Conversation Starter" - Complete first roleplay
- "Week 1 Complete" - Finish all 5 lessons + final assessments
- "Perfect Score" - 100% on final quiz

**Rationale:**
- ✅ Tangible rewards
- ✅ Sense of achievement
- ✅ Shareable (future: social media)

---

## 🧪 Testing Decisions

### **Decision 14: Manual Testing for POC**

**Date:** 2025-11-17

**Decision:** Use manual testing, no automated tests for POC

**Rationale:**
- ✅ Faster development for POC
- ✅ Can add tests later
- ✅ Focus on feature implementation first

**Testing Approach:**
- Manual end-to-end testing
- Test each flow as we build it
- Document test cases in TESTING.md

**Future:**
- Add unit tests for utilities
- Add integration tests for critical flows
- Add E2E tests with Playwright

---

## 📱 Responsive Design Decisions

### **Decision 15: Mobile-First Approach**

**Date:** 2025-11-17

**Decision:** Design and fix UI for mobile first, then desktop

**Rationale:**
- ✅ Most users likely on mobile
- ✅ Easier to scale up than down
- ✅ Forces simple, focused designs

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🔮 Future Considerations

### **Things We're NOT Doing Now (But Might Later):**

1. **Authentication:**
   - For POC: Single user, no login
   - Future: User accounts, social login

2. **Backend API:**
   - For POC: Static data, localStorage
   - Future: Database, API endpoints

3. **Cross-Device Sync:**
   - For POC: Progress only on one device
   - Future: Cloud sync via Firebase

4. **Social Features:**
   - For POC: Individual progress only
   - Future: Leaderboards, sharing, friends

5. **Content Management:**
   - For POC: Hardcoded in units.ts
   - Future: CMS, dynamic content loading

6. **Analytics:**
   - For POC: No tracking
   - Future: Learning analytics, insights

7. **Accessibility:**
   - For POC: Basic accessibility
   - Future: Full WCAG 2.1 AA compliance

8. **Offline Support:**
   - For POC: Works offline (localStorage)
   - Future: Service Worker, better offline experience

---

## 📝 Decision Review Process

**When to revisit decisions:**
- After POC is complete and demo'd
- When scaling to more users
- When adding new features
- When performance becomes an issue

**How to update this document:**
- Add new decisions as they're made
- Mark outdated decisions as "Superseded"
- Link to implementation PRs/commits

---

**Last Updated:** 2025-11-17
