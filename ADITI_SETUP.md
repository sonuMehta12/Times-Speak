# Aditi AI Tutor - Setup Guide

## Overview
Aditi is an AI-powered English conversation tutor that provides personalized learning experiences based on user profiles. The system uses Google's Gemini AI to generate dynamic responses with feedback, translations, and learning hints.

## Features Implemented ✅

### 1. **Dynamic User Profile Integration**
- Automatically loads user profile from localStorage (`lingoRoleplay_userProfile`)
- Personalizes prompts based on:
  - User's name, English level (A1-C2), and learning goals
  - Challenges (pronunciation, grammar, confidence)
  - Interested fields and career status
  - Native language (Hinglish support)

### 2. **Smart LLM Response System**
- **Message**: AI response with `**keyword**` highlighting for important vocabulary
- **Hinglish Translation**: Every response includes natural Hinglish translation
- **Hints**: 3 clickable response options (Simple, Professional, Engaging)
- **Feedback**: Grammar corrections with visual highlighting for errors/improvements

### 3. **Keyword Highlighting**
- AI marks important words/corrections with `**double asterisks**`
- Frontend parses and renders them in indigo color for visual emphasis
- Example: "You **bought** an apple" highlights the corrected word

### 4. **Random Greeting Messages**
- 6 different contextual greetings that vary based on:
  - Time of day (morning/afternoon/evening)
  - User's learning goals
  - Current streak
  - Interested field

### 5. **Interactive Input Methods**

#### Type Button
- Opens modal with textarea for typing messages
- Send button to submit

#### Speak Button
- Uses Web Speech Recognition API
- Records user's voice and converts to text
- Automatically sends the transcribed message to Aditi
- Visual indicator when recording (red pulsing button)

#### Hint Button
- Shows 3 AI-generated response options
- Labeled as Simple, Professional, Engaging
- Click to send the hint as your message

### 6. **Feedback System**
- AI analyzes user messages for errors
- Provides encouraging grades: "Good try!", "Excellent!", "Keep practicing!"
- Highlights errors in red and corrections in green
- Collapsible "View Feedback" section below user messages

### 7. **Text-to-Speech with Auto-Play**
- Every AI response includes audio
- **Auto-play**: Audio automatically plays after first user interaction (Type/Speak/Hint)
- Manual playback: Click the speaker icon on any message to hear it again
- Uses Gemini's TTS with "Kore" voice (female, clear English)
- Greeting message includes audio (click speaker icon to play manually first time)

### 8. **UI Improvements**
- ✅ Removed Chat/Call toggle - kept only Call button in header
- Clean, modern chat interface
- Smooth animations for modals and messages
- Mobile-responsive design (max-width: 393px)

## Architecture

### File Structure
```
lib/
├── types/
│   └── aditi.ts                    # TypeScript interfaces for Aditi
├── constants/
│   └── aditi-prompts.ts            # Dynamic prompt generation
├── services/
│   └── aditi-tutor.ts              # Gemini LLM integration
├── utils/
│   └── aditi-greetings.ts          # Random greeting generator
├── data/
│   └── user-profile.ts             # User profile helpers

app/
└── aditi/
    └── page.tsx                    # Main Aditi chat UI
```

### Data Flow
```
User Profile (localStorage)
    ↓
Dynamic System Instruction
    ↓
Gemini AI (with JSON schema)
    ↓
Structured Response (message, hinglish, hint, feedback)
    ↓
UI Rendering (with keyword highlighting)
```

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API key:**
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Copy and paste into `.env.local`

### 2. Install Dependencies
```bash
npm install @google/genai
```

### 3. User Profile Setup
Make sure users complete the onboarding flow at `/onboarding` which saves:
```typescript
{
  name: "John",
  level: "B2",
  nativeLanguage: "Hinglish (हिन्दी)",
  learningGoals: ["Speak confidently at work"],
  challenges: {
    primary: ["Fear of being judged"],
    conversation: ["Finding the right words"]
  },
  // ... more fields
}
```

### 4. Testing the Feature
1. Complete onboarding (or have existing user profile)
2. Navigate to `/aditi`
3. You should see a random greeting from Aditi
4. Try all 3 input methods:
   - **Type**: Click keyboard icon, type a message
   - **Speak**: Click mic icon, speak in English
   - **Hint**: Click lightbulb icon, choose a suggestion

## How It Works

### Prompt Engineering
The system instruction is dynamically generated for each user:

```typescript
generateSystemInstruction(userProfile) => `
Role: Expert AI English Tutor
Target User: ${userName} (${level}, ${challenges})
Output: JSON with message, hinglish, hint, feedback
Rules:
- Use **bolding** for corrections
- Provide 3 hint options
- Give feedback only when user makes errors
- Be encouraging and build confidence
`
```

### Response Schema
```json
{
  "message": "That sounds challenging. How did you **handle** that?",
  "hinglish": "Ye challenging hai. Tumne kaise handle kiya?",
  "hint": [
    "I broke it into smaller tasks.",
    "I prioritized and collaborated with my team.",
    "It was tough, but I focused. Have you faced this?"
  ],
  "feedback": {
    "grade": "Good try!",
    "original": "I <span>goed</span> to store",
    "corrected": "I <span>went</span> to the store"
  }
}
```

### Keyword Highlighting
```typescript
// AI marks keywords: "You **bought** an apple"
renderText(text) =>
  text.split(/(\*\*.*?\*\*)/)
      .map(part =>
        part.startsWith('**')
          ? <strong className="text-indigo-700">{keyword}</strong>
          : <span>{part}</span>
      )
```

## Browser Compatibility

### Speech Recognition
- ✅ Chrome, Edge (fully supported)
- ⚠️ Firefox (limited support)
- ❌ Safari (not supported)

The app shows an alert if Speech Recognition is unavailable.

## Customization

### Change AI Voice
Edit `lib/services/aditi-tutor.ts`:
```typescript
voiceConfig: {
  prebuiltVoiceConfig: {
    voiceName: "Kore" // Try: "Aoede", "Charon", "Fenrir"
  }
}
```

### Adjust AI Temperature
Higher = more creative, Lower = more consistent
```typescript
temperature: 0.8 // Range: 0.0 - 1.0
```

### Add More Greeting Messages
Edit `lib/utils/aditi-greetings.ts` and add to the `greetings` array.

## Troubleshooting

### "API Key is missing" Error
- Check `.env.local` has `NEXT_PUBLIC_GEMINI_API_KEY`
- Restart dev server after adding env variables

### No Audio Playback
- Check browser console for TTS errors
- Ensure Gemini API key has TTS enabled
- Try clicking the page first (browser audio policy)

### Speech Recognition Not Working
- Only works in Chrome/Edge
- Check microphone permissions
- Ensure HTTPS (required for production)

### Profile Not Loading
- Check localStorage key: `lingoRoleplay_userProfile`
- Complete onboarding flow to create profile
- Check browser console for JSON parse errors

## Future Enhancements
- [ ] Voice call feature (Gemini Live API)
- [ ] Conversation history persistence
- [ ] Progress tracking and analytics
- [ ] Multi-language support beyond Hinglish
- [ ] Roleplay scenario integration

## Credits
- **AI Model**: Google Gemini 2.0 Flash
- **TTS Voice**: Kore (Gemini TTS)
- **Speech Recognition**: Web Speech API
- **Framework**: Next.js 15, React 19, TypeScript
