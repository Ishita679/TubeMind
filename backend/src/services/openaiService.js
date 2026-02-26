import OpenAI from "openai";
import config from "../config/env.js";
import { SYSTEM_PROMPT, generateUserPrompt } from "../utils/promptTemplates.js";

let aiClient = null;

// HIJACKED: This now points to Groq using the OpenAI SDK!
const getAIClient = () => {
  if (!config.groqApiKey) {
    throw new Error(
      "GROQ_API_KEY is not set in backend/.env. " +
      "Get a free key at https://console.groq.com/ and add GROQ_API_KEY=<your_key> to the .env file."
    );
  }
  if (!aiClient) {
    aiClient = new OpenAI({
      apiKey: config.groqApiKey,
      baseURL: "https://api.groq.com/openai/v1" // Redirects the package away from OpenAI
    });
  }
  return aiClient;
};

const normalizeNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const normalizeSummaryPayload = (payload) => {
  const chapters = Array.isArray(payload.chapters) ? payload.chapters : [];
  const keyConcepts = Array.isArray(payload.keyConcepts) ? payload.keyConcepts : [];

  return {
    shortSummary: typeof payload.shortSummary === "string" ? payload.shortSummary.trim() : "",
    detailedSummary: typeof payload.detailedSummary === "string" ? payload.detailedSummary.trim() : "",
    chapters: chapters.map((chapter) => ({
      title: typeof chapter.title === "string" ? chapter.title.trim() : "",
      startSeconds: normalizeNumber(chapter.startSeconds, normalizeNumber(chapter.startTime, 0)),
      endSeconds: normalizeNumber(chapter.endSeconds, normalizeNumber(chapter.endTime, 0))
    })),
    keyConcepts: keyConcepts.map((concept) => ({
      name: typeof concept.name === "string" ? concept.name.trim() : "",
      explanation: typeof concept.explanation === "string" ? concept.explanation.trim() : ""
    }))
  };
};

export const summarizeTranscript = async ({ videoTitle, transcriptText }) => {
  if (!transcriptText || !transcriptText.trim()) throw new Error("Transcript text is required");

  const client = getAIClient();
  const prompt = generateUserPrompt(videoTitle || "Untitled Video", transcriptText);

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // Using Meta's Llama 3 on Groq
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("AI returned an empty response");

    let parsed;
    try { parsed = JSON.parse(rawContent); }
    catch (_err) { throw new Error("AI response was not valid JSON"); }

    const normalized = normalizeSummaryPayload(parsed);
    if (!normalized.shortSummary || !normalized.detailedSummary) {
      throw new Error("AI response missing required summary fields");
    }

    return normalized;

  } catch (err) {
    console.error("[AI Generation Error]:", err.message);
    throw err;
  }
};