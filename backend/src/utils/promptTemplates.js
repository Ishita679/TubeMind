/**
 * ================================================================
 *  Prompt Templates for OpenAI GPT-4o
 * ================================================================
 *
 * These prompts are CRITICAL to output quality. Every word matters.
 * The AI is instructed to return valid JSON matching the exact
 * shape the Summary model expects.
 *
 * Key design decisions:
 * - Temperature: 0.3 (low) — we want consistency, not creativity
 * - JSON mode enforced via { type: "json_object" }
 * - Timestamps are REQUIRED for chapters and keyConcepts so the
 *   UI can offer "jump to timestamp" navigation
 * - actionableLearningPoints are NEW (not in the schema yet) —
 *   these are concrete takeaways the viewer can apply immediately
 * ================================================================
 */

// ── System message ───────────────────────────────────────────
// Sets the AI's role and constraints. This is sent ONCE per
// conversation.
export const SYSTEM_PROMPT = `You are an expert content analyst specialising in educational video summarisation.

Your job is to analyse YouTube video transcripts and produce structured, actionable summaries.

Output ONLY valid JSON. Do NOT include any preamble, explanation, or markdown fences.

The JSON must match this exact structure:

{
  "shortSummary": "string (1-2 sentences, <200 chars)",
  "detailedSummary": "string (2-3 paragraphs, comprehensive)",
  "keyPoints": ["string", "string", ...],
  "chapters": [
    {
      "title": "string",
      "startTime": number (seconds),
      "endTime": number (seconds),
      "summary": "string (1-2 sentences)"
    }
  ],
  "keyConcepts": [
    {
      "concept": "string (term or topic)",
      "timestamp": number (seconds, first mention) | null
    }
  ],
  "actionableLearningPoints": ["string", "string", ...]
}

Rules:
- shortSummary: elevator pitch, maximum 200 characters
- detailedSummary: 2-3 paragraphs covering main themes
- keyPoints: 3-7 bullet-style takeaways
- chapters: logical sections with accurate timestamps (start/end)
- keyConcepts: important terms with their first appearance timestamp
- actionableLearningPoints: concrete steps the viewer can take NOW

Timestamps MUST be in seconds. Be precise. Use the transcript's timing data.`;

// ── User message generator ──────────────────────────────────
// This is the actual request with the transcript data.
// `videoTitle` and `transcript` are passed in dynamically.
export function generateUserPrompt(videoTitle, transcript) {
  return `Analyse the following YouTube video transcript and produce a structured summary.

Video Title: "${videoTitle}"

Full Transcript:
${transcript}

Return ONLY the JSON object. No explanation. No markdown fences.`;
}

// ── Alternative: segment-aware prompt ───────────────────────
// If you're passing the transcript as an array of {startTime, endTime, text}
// objects rather than a flat string, use this version instead.
// The AI can see the exact timestamps and will produce more accurate
// chapter boundaries.
export function generateUserPromptWithSegments(videoTitle, segments) {
  // Build a human-readable transcript with inline timestamps.
  const transcriptText = segments
    .map((seg) => `[${seg.startTime}s - ${seg.endTime}s] ${seg.text}`)
    .join("\n");

  return `Analyse the following YouTube video transcript and produce a structured summary.

Video Title: "${videoTitle}"

Transcript (with timestamps):
${transcriptText}

Use the timestamps to determine accurate chapter boundaries and concept appearances.

Return ONLY the JSON object. No explanation. No markdown fences.`;
}