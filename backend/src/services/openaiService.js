import OpenAI from "openai";
import config from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import {
  SYSTEM_PROMPT,
  generateUserPromptWithSegments,
} from "../utils/promptTemplates.js";

// ── Initialise the OpenAI client ────────────────────────────
// Throws immediately if OPENAI_API_KEY is missing, so the app
// never starts in a broken state.
if (!config.openaiApiKey) {
  throw new Error(
    "[TubeMind] OPENAI_API_KEY is missing. Add it to .env and restart."
  );
}

const openai = new OpenAI({ apiKey: config.openaiApiKey });

// ── Main entry point ─────────────────────────────────────────
/**
 * Generate a structured summary from a video transcript.
 *
 * @param {string} videoTitle - The video's title
 * @param {Array} segments - Array of {startTime, endTime, text}
 * @returns {Promise<Object>} Parsed JSON matching the Summary schema
 * @throws {AppError} On API failure, invalid JSON, or missing fields
 */
export async function summarizeTranscript(videoTitle, segments) {
  try {
    const userPrompt = generateUserPromptWithSegments(videoTitle, segments);

    // ── Call OpenAI ──────────────────────────────────────────
    // response_format: json_object forces the model to return
    // valid JSON — it will never reply in plain text.
    const response = await openai.chat.completions.create({
      model: "gpt-4o",              // GPT-4o is the latest, best model
      temperature: 0.3,              // low = consistent outputs
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userPrompt },
      ],
    });

    const rawContent = response.choices[0]?.message?.content;

    if (!rawContent) {
      throw new AppError("OpenAI returned an empty response", 500);
    }

    // ── Parse & validate ─────────────────────────────────────
    const parsed = JSON.parse(rawContent);

    // Defensive check: ensure every required field exists.
    validateSummaryShape(parsed);

    return parsed;

  } catch (err) {
    // Re-throw AppErrors as-is (they're already formatted).
    if (err instanceof AppError) throw err;

    // OpenAI SDK errors: rate limits, auth failures, network issues.
    if (err.status === 429) {
      throw new AppError("OpenAI rate limit exceeded. Try again later.", 429);
    }
    if (err.status === 401) {
      throw new AppError("Invalid OpenAI API key.", 500);
    }

    // JSON parse errors or any other unexpected failures.
    console.error("[OpenAI Service Error]", err);
    throw new AppError("Failed to generate summary", 500);
  }
}

// ── Validate response shape ──────────────────────────────────
// Confirms the AI returned every field the Summary model expects.
// Throws if anything is missing or malformed.
function validateSummaryShape(obj) {
  const requiredFields = [
    "shortSummary",
    "detailedSummary",
    "keyPoints",
    "chapters",
    "keyConcepts",
    "actionableLearningPoints",
  ];

  for (const field of requiredFields) {
    if (!(field in obj)) {
      throw new AppError(`AI response missing field: ${field}`, 500);
    }
  }

  // Type checks
  if (typeof obj.shortSummary !== "string" || !obj.shortSummary.trim()) {
    throw new AppError("shortSummary must be a non-empty string", 500);
  }
  if (typeof obj.detailedSummary !== "string" || !obj.detailedSummary.trim()) {
    throw new AppError("detailedSummary must be a non-empty string", 500);
  }
  if (!Array.isArray(obj.keyPoints) || obj.keyPoints.length === 0) {
    throw new AppError("keyPoints must be a non-empty array", 500);
  }
  if (!Array.isArray(obj.chapters)) {
    throw new AppError("chapters must be an array", 500);
  }
  if (!Array.isArray(obj.keyConcepts)) {
    throw new AppError("keyConcepts must be an array", 500);
  }
  if (!Array.isArray(obj.actionableLearningPoints)) {
    throw new AppError("actionableLearningPoints must be an array", 500);
  }

  // Validate chapter structure
  for (const ch of obj.chapters) {
    if (!ch.title || typeof ch.startTime !== "number" || typeof ch.endTime !== "number") {
      throw new AppError("Each chapter must have title, startTime, endTime", 500);
    }
  }

  // Validate keyConcepts structure
  for (const kc of obj.keyConcepts) {
    if (!kc.concept || typeof kc.concept !== "string") {
      throw new AppError("Each keyConcept must have a concept string", 500);
    }
  }
}