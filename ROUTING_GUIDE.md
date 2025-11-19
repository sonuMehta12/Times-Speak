# Roleplay Routing Guide

## ✅ Fixed Issues

1. **Syntax Error** - Fixed apostrophe in roleplay-scenarios.ts ✅
2. **Dynamic Routing** - Implemented proper Next.js routing structure ✅

---

## 🗺️ Routing Structure

### Before (❌ Old Way - In-Page State Management)
```
/explore
  ↓ (Click card - state change within page)
Listen Mode (Component swap)
  ↓ (Click start - state change within page)
Chat Mode (Component swap)
```

**Problem**: Everything was happening in one page with state management

---

### After (✅ New Way - Next.js Dynamic Routing)
```
/explore
  ↓ (Click card - navigate to /role/[id])
/role/interview-job-basic (Listen Mode - ScenarioGuide)
  ↓ (Click "Start Role-Play" - view toggle)
/role/interview-job-basic (Chat Mode - ChatInterface)
```

**Benefits**:
- ✅ Proper URL structure
- ✅ Browser back button works
- ✅ Can share direct links to scenarios
- ✅ Uses your existing `/role` page structure

---

## 📁 File Structure

```
app/
├── explore/
│   └── page.tsx                    # Scenario selection page
└── role/
    └── [id]/
        └── page.tsx                # Dynamic roleplay page (uses scenario ID)
```

---

## 🔄 Flow Diagram

```
User Journey:
┌────────────────────────────────────────────────────────────┐
│ 1. User visits /explore                                     │
│    - Sees featured & categorized roleplay cards            │
│    - Clicks "Job Interview" card                           │
└─────────────────┬──────────────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────────────┐
│ 2. Navigate to /role/interview-job-basic                   │
│    - ScenarioGuide component loads                         │
│    - Shows learning objective                              │
│    - Plays example conversation with TTS                   │
│    - User clicks "Ready! Start Role-Play Practice"         │
└─────────────────┬──────────────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────────────┐
│ 3. View switches to ChatInterface (same URL)               │
│    - AI starts conversation                                │
│    - User practices with voice/text                        │
│    - Gets real-time translations & suggestions             │
│    - Completes objective                                   │
└─────────────────┬──────────────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────────────┐
│ 4. User can:                                               │
│    - Click back → Returns to Listen Mode                   │
│    - Click back again → Returns to /explore                │
└────────────────────────────────────────────────────────────┘
```

---

## 🔧 How It Works

### 1. Explore Page (`/explore`)

```typescript
// When user clicks a roleplay card:
const handleSelectScenario = (scenario: Scenario) => {
  router.push(`/role/${scenario.id}`);
  // e.g., /role/interview-job-basic
};
```

### 2. Dynamic Role Page (`/role/[id]`)

```typescript
// On page load:
const params = useParams();
const scenarioId = params.id; // e.g., "interview-job-basic"

// Load scenario data from our database:
const scenario = getScenarioById(scenarioId);

// If scenario not found → redirect to /explore
if (!scenario) {
  router.push('/explore');
}

// Show two views (toggled by state):
// - viewMode === 'guide' → ScenarioGuide (Listen Mode)
// - viewMode === 'chat'  → ChatInterface (Practice Mode)
```

---

## 📊 Data Flow

```
Explore Page
    ↓ scenario.id
Dynamic Route (/role/[id])
    ↓ getScenarioById(id)
Load Scenario Data
    ↓
ScenarioGuide Component
    - scenario.exampleConversation
    - scenario.learningObjective
    - scenario.initialGreeting
    ↓ (User clicks "Start")
ChatInterface Component
    - Uses same scenario data
    - Streams AI responses
    - Plays TTS audio
```

---

## 🎯 Scenario IDs

All your scenarios have unique IDs:

| Category | Scenario ID | URL |
|----------|------------|-----|
| Interview | `interview-job-basic` | `/role/interview-job-basic` |
| Interview | `interview-presentation` | `/role/interview-presentation` |
| Travel | `travel-airport` | `/role/travel-airport` |
| Travel | `travel-hotel-checkin` | `/role/travel-hotel-checkin` |
| Restaurant | `restaurant-ordering` | `/role/restaurant-ordering` |
| Restaurant | `restaurant-cafe` | `/role/restaurant-cafe` |
| Shopping | `shopping-clothing` | `/role/shopping-clothing` |
| Shopping | `shopping-electronics` | `/role/shopping-electronics` |
| Medical | `medical-doctor-visit` | `/role/medical-doctor-visit` |
| Medical | `medical-pharmacy` | `/role/medical-pharmacy` |
| Social | `social-small-talk` | `/role/social-small-talk` |
| Social | `social-colleague-chat` | `/role/social-colleague-chat` |

---

## 🧪 Testing the Flow

### Test 1: Navigation from Explore
1. Go to `/explore`
2. Click any roleplay card
3. URL should change to `/role/[scenario-id]`
4. Should see Listen Mode (ScenarioGuide)

### Test 2: Listen → Practice Flow
1. On Listen Mode, click play conversation
2. Listen to example dialogue
3. Click "Ready! Start Role-Play Practice"
4. Should switch to Chat Mode (ChatInterface)
5. URL stays the same

### Test 3: Back Navigation
1. In Chat Mode, click back arrow
2. Should return to Listen Mode
3. Click back arrow again
4. Should return to `/explore`

### Test 4: Direct URL Access
1. Paste `/role/interview-job-basic` in browser
2. Should load directly to that scenario's Listen Mode
3. No need to go through explore page

### Test 5: Invalid Scenario
1. Try `/role/invalid-id`
2. Should redirect to `/explore`

---

## 🎨 Components Used

| Component | Purpose | Location |
|-----------|---------|----------|
| `RolePlayCard` | Displays scenario cards | `components/roleplay/RolePlayCard.tsx` |
| `ScenarioGuide` | Listen Mode UI | `components/roleplay/ScenarioGuide.tsx` |
| `ChatInterface` | Practice Mode UI | `components/roleplay/ChatInterface.tsx` |

---

## 🔍 Troubleshooting

### Issue: "Scenario not found" error
**Fix**: Check that the scenario ID in the URL matches an ID in `roleplay-scenarios.ts`

### Issue: Page doesn't load
**Fix**:
1. Verify the dynamic route folder exists: `app/role/[id]/`
2. Check that `page.tsx` is inside the `[id]` folder

### Issue: Back button doesn't work
**Fix**: Use `router.push()` for navigation, not state changes

### Issue: Can't share link to specific scenario
**Fix**: Make sure you're using the proper URL structure `/role/[id]`

---

## 📝 Summary

**What Changed:**
- ❌ Removed: State-based view switching in explore page
- ✅ Added: Dynamic route `/role/[id]` for each scenario
- ✅ Added: Proper Next.js routing with `useRouter` and `useParams`
- ✅ Added: Scenario lookup by ID from our data

**Benefits:**
- ✅ Shareable URLs for specific scenarios
- ✅ Browser back/forward buttons work naturally
- ✅ Better UX with proper navigation
- ✅ Follows Next.js best practices

---

**Your roleplay system is now fully integrated with proper routing! 🎉**

Click any card on `/explore` and it will navigate to the dynamic roleplay page!
