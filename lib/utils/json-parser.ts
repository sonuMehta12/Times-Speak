// lib/utils/json-parser.ts
// Robust JSON parsing utility with validation and error recovery

/**
 * Safely parse JSON with validation and fallback
 *
 * @param text - The text to parse as JSON
 * @param fallback - Fallback value to return if parsing fails
 * @param debugLabel - Label for debugging/logging purposes
 * @returns Parsed JSON object or fallback value
 */
export function safeParseJSON<T>(text: string, fallback: T, debugLabel?: string): T {
  try {
    // Trim whitespace
    const trimmed = text.trim();

    // Check if text looks like JSON
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.error(`[${debugLabel || 'JSON Parser'}] Response is not JSON format:`, trimmed.substring(0, 200));
      return fallback;
    }

    // Attempt to parse
    const parsed = JSON.parse(trimmed);
    return parsed as T;
  } catch (e) {
    const error = e as Error;
    console.error(`[${debugLabel || 'JSON Parser'}] JSON parsing failed:`, {
      error: error.message,
      textPreview: text.substring(0, 500),
      textLength: text.length
    });

    // Try to salvage partial JSON by finding the last complete object
    if (text.includes('{') && error.message.includes('Unterminated')) {
      console.warn(`[${debugLabel || 'JSON Parser'}] Attempting to salvage partial JSON...`);
      try {
        // Find the last properly closed brace
        let depth = 0;
        let lastValidIndex = -1;

        for (let i = 0; i < text.length; i++) {
          if (text[i] === '{') depth++;
          if (text[i] === '}') {
            depth--;
            if (depth === 0) lastValidIndex = i;
          }
        }

        if (lastValidIndex > 0) {
          const salvaged = text.substring(0, lastValidIndex + 1);
          const parsed = JSON.parse(salvaged);
          console.log(`[${debugLabel || 'JSON Parser'}] Successfully salvaged partial JSON`);
          return parsed as T;
        }
      } catch (salvageErr) {
        console.error(`[${debugLabel || 'JSON Parser'}] Salvage attempt failed`);
      }
    }

    return fallback;
  }
}
