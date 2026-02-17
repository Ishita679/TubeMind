const config = require("../config/env");
const { SYSTEM_PROMPT, generateUserPrompt } = require("../utils/promptTemplates");

let openaiClient = null;

const getOpenAIClient = () => {
  if (!config.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is missing in .env file");
  }

  if (!openaiClient) {
    let OpenAI;
    try {
      OpenAI = require("openai");
    } catch (_err) {
      throw new Error("Missing dependency: install with `npm install openai`");
    }
    openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
  }

  return openaiClient;
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

const summarizeTranscript = async ({ videoTitle, transcriptText }) => {
  if (!transcriptText || !transcriptText.trim()) {
    throw new Error("Transcript text is required for summary generation");
  }

  const client = getOpenAIClient();
  const prompt = generateUserPrompt(videoTitle || "Untitled Video", transcriptText);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ]
  });

  const rawContent = response.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("OpenAI returned an empty response");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (_err) {
    throw new Error("OpenAI response was not valid JSON");
  }

  const normalized = normalizeSummaryPayload(parsed);
  if (!normalized.shortSummary || !normalized.detailedSummary) {
    throw new Error("OpenAI response missing required summary fields");
  }

  return normalized;
};

module.exports = { summarizeTranscript };
