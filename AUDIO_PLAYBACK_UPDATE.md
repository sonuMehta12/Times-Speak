# Audio Auto-Playback Implementation

## Changes Made

### 1. Fixed TTS Model Error ✅
**Issue**: `ApiError: Model does not support requested modality: AUDIO`

**Solution**: Updated model name in [lib/services/aditi-tutor.ts](lib/services/aditi-tutor.ts:19)
```typescript
// Before (incorrect):
const TTS_MODEL = 'gemini-2.0-flash-exp';

// After (correct):
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
```

This matches the TTS model used in the roleplay scenario service.

### 2. Implemented Auto-Play Feature ✅

#### Greeting Message Audio
- TTS audio is generated for the initial greeting when user loads `/aditi`
- Audio is stored in the message's `audioBase64` field
- User can click the speaker icon to play it manually

#### AI Response Auto-Play
- After user sends their **first message** (via Type/Speak/Hint), auto-play is enabled
- All subsequent AI responses automatically play their audio
- This complies with browser auto-play policies (requires user interaction)

**Implementation Details** ([app/aditi/page.tsx](app/aditi/page.tsx)):
```typescript
// Track if user has interacted (enables auto-play)
const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

// Enable auto-play on first message
const handleSendMessage = async (messageText: string) => {
  if (!autoPlayEnabled) {
    setAutoPlayEnabled(true); // ← Enables auto-play
  }
  // ... send message logic
}

// Auto-play AI response audio
if (audioBase64 && autoPlayEnabled) {
  await playAudioFromBase64(audioBase64);
}
```

### 3. Browser Auto-Play Policy Compliance

**Why Not Auto-Play Greeting?**
Modern browsers block auto-play audio until the user interacts with the page. This prevents annoying auto-play ads.

**How We Handle It**:
1. **First Load**: Greeting message has audio but doesn't auto-play
   - User can click speaker icon to hear it
2. **After First Interaction**: Auto-play is enabled
   - All AI responses play automatically
   - Provides seamless conversation experience

### 4. Audio Playback Flow

```
User visits /aditi
    ↓
Greeting generated with TTS audio
    ↓
User clicks Type/Speak/Hint (first interaction)
    ↓
autoPlayEnabled = true
    ↓
User sends message
    ↓
AI responds with audio
    ↓
Audio plays automatically ✨
    ↓
Continues for all subsequent responses
```

## Files Modified

1. **[lib/services/aditi-tutor.ts](lib/services/aditi-tutor.ts)**
   - Fixed TTS model name to `gemini-2.5-flash-preview-tts`

2. **[app/aditi/page.tsx](app/aditi/page.tsx)**
   - Added `autoPlayEnabled` state
   - Added TTS generation for greeting message
   - Implemented auto-play after first user interaction
   - Added auto-play logic for AI responses

3. **[ADITI_SETUP.md](ADITI_SETUP.md)**
   - Updated documentation for auto-play feature

## Testing

### Test Scenario 1: Greeting Audio
1. Navigate to `/aditi`
2. See greeting message
3. Click speaker icon on greeting → Audio plays ✅

### Test Scenario 2: Auto-Play
1. Navigate to `/aditi`
2. Click "Type" or "Speak" or "Hint" button
3. Send a message
4. Wait for AI response
5. Audio should play automatically ✅
6. Send another message
7. Audio should play automatically again ✅

### Test Scenario 3: Manual Playback
1. Send multiple messages
2. Click speaker icon on any previous message
3. Audio should play ✅

## Browser Compatibility

| Browser | Auto-Play Support | Notes |
|---------|------------------|--------|
| Chrome  | ✅ Yes | Works after first interaction |
| Firefox | ✅ Yes | Works after first interaction |
| Safari  | ⚠️ Partial | May require additional user gesture |
| Edge    | ✅ Yes | Works after first interaction |

## Error Handling

The implementation includes error handling for:
- TTS generation failures (logs error, continues without audio)
- Audio playback failures (logs error, doesn't block conversation)
- Missing API key (throws clear error message)

## Comparison with Roleplay Scenario

Both implementations now use:
- Same TTS model: `gemini-2.5-flash-preview-tts`
- Same voice: "Kore"
- Same audio format: PCM 16-bit, 24kHz, mono
- Same playback method: Web Audio API

The only difference is:
- **Roleplay**: Streams audio sentence-by-sentence during AI generation
- **Aditi**: Generates full response audio, then plays once complete

## Future Enhancements

- [ ] Add audio playback queue for rapid responses
- [ ] Add playback speed control (0.75x, 1x, 1.25x, 1.5x)
- [ ] Add option to disable auto-play in settings
- [ ] Add visual indicator when audio is playing
- [ ] Add support for offline TTS fallback

## API Key Requirements

Make sure `.env.local` has:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

The API key must have access to:
- ✅ Gemini 2.0 Flash (for chat)
- ✅ Gemini 2.5 Flash Preview TTS (for audio)

Get your key at: https://aistudio.google.com/app/apikey
