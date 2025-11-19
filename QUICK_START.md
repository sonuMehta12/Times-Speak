# 🚀 Quick Start Guide - LingoRoleplay

## Step 1: Add Your API Key

Open `.env.local` and paste your Gemini API key:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

Get your key here: https://aistudio.google.com/app/apikey

## Step 2: Restart Server

```bash
npm run dev
```

## Step 3: Test It!

1. Go to `/explore` page
2. Click any roleplay card
3. Listen to the example conversation
4. Click "Start Role-Play Practice"
5. Chat with the AI!

---

## 🎯 What Each File Does

### Data Layer
- **`lib/types/roleplay.ts`** - TypeScript interfaces
- **`lib/data/user-profile.ts`** - Rahul's profile (B2 level, Hindi native)
- **`lib/data/roleplay-scenarios.ts`** - 13+ scenarios with translations

### Service Layer
- **`lib/services/gemini.ts`** - AI chat + TTS audio generation

### Component Layer
- **`components/roleplay/RolePlayCard.tsx`** - Scenario cards
- **`components/roleplay/ScenarioGuide.tsx`** - Listen Mode (example conversation)
- **`components/roleplay/ChatInterface.tsx`** - Role-Play Mode (AI chat)

### Page Layer
- **`app/explore/page.tsx`** - Main explore page with all scenarios

---

## 🎨 How It Works

### Flow: Selection → Listen → Practice

```
1. USER clicks scenario card on /explore
   ↓ Navigate to /role/[scenario-id]
2. LISTEN MODE loads (ScenarioGuide)
   - Shows learning objective
   - Plays example conversation with TTS
   - User hears perfect flow
   ↓ USER clicks "Start Role-Play"
3. ROLE-PLAY MODE starts (ChatInterface)
   - AI sends greeting
   - User responds (text or voice)
   - AI adapts responses to B2 level
   - Provides translations + suggestions
   - Tracks objective completion
```

### Routing Structure

- `/explore` - Browse all roleplay scenarios by category
- `/role/[id]` - Dynamic roleplay page (Listen → Practice)
  - Example: `/role/interview-job-basic`
  - Example: `/role/travel-airport`

### AI Response Pipeline

```
1. User sends message
   ↓
2. Gemini receives:
   - System prompt (role, objective, user profile)
   - Chat history
   - User's message
   ↓
3. Gemini streams back JSON:
   {
     role_response: "AI's reply",
     translation: "Hindi translation",
     suggestions: ["Option 1", "Option 2", "Option 3"],
     objective_completed: false
   }
   ↓
4. UI displays text + plays TTS audio
```

---

## 📊 Scenario Categories

1. **Interview** - Job interviews, presentations
2. **Travel** - Airport, hotel check-in
3. **Restaurant** - Ordering food, coffee shops
4. **Shopping** - Clothing, electronics
5. **Medical** - Doctor visits, pharmacy
6. **Social** - Small talk, office conversations

All scenarios have:
- Example dialogues in English
- Hindi translations
- Learning tips
- Clear objectives

---

## 🎤 Features

### Auto-Play Audio ✅
- Toggle on/off in chat header
- Plays AI responses automatically
- Uses Gemini TTS (fallback: browser TTS)

### Voice Input ✅
- Click mic button
- Speak your response
- Auto-transcribes to text
- Works in Chrome/Edge

### Translations ✅
- Toggle Hindi translation for any message
- Helps with comprehension
- Doesn't break conversation flow

### Smart Suggestions ✅
- AI suggests 3 response options
- Click to use
- Helps when stuck
- Adapted to B2 level

---

## 🐛 Common Issues

### "API key not defined" error
→ Add key to `.env.local` and restart server

### Audio not playing
→ Browser TTS fallback activates automatically

### Voice input not working
→ Use Chrome or Edge browser

### Scenarios not showing
→ Check console for import errors

---

## 🎓 For Rahul's Learning Goals

This system is specifically designed for Rahul's needs:

✅ **Builds confidence** - No judgment, just practice
✅ **Professional focus** - Interview & business scenarios
✅ **Addresses challenges** - Natural conversation flow practice
✅ **B2 Level appropriate** - Vocabulary and complexity matched
✅ **Hindi support** - Translations when needed
✅ **Real-world situations** - Practical, useful scenarios

---

## 📝 Quick Reference

### Add New Scenario
Edit `lib/data/roleplay-scenarios.ts` → Add object to array

### Change User Profile
Edit `lib/data/user-profile.ts` → Update `INITIAL_USER_PROFILE`

### Modify AI Behavior
Edit `lib/services/gemini.ts` → Update `buildSystemPrompt()`

### Change Colors/Design
Components use your existing design tokens:
- `bg-navy`, `bg-teal`, `bg-gold`, `bg-coral`
- `rounded-[24px]`, `rounded-[16px]`, etc.

---

That's it! You're ready to practice English with AI! 🎉
