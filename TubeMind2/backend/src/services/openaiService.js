import OpenAI from "openai";
import config from "../config/env.js";

let aiClient = null;

const getAIClient = () => {
    const key = config.groqApiKey || config.openaiApiKey;
    if (!key) throw new Error("AI API Key missing");

    if (!aiClient) {
        aiClient = new OpenAI({
            apiKey: key,
            baseURL: config.groqApiKey ? "https://api.groq.com/openai/v1" : undefined
        });
    }
    return aiClient;
};

export const summarizeTranscript = async ({ videoTitle, transcriptText }) => {
    const client = getAIClient();
    const model = config.groqApiKey ? "llama-3.1-8b-instant" : "gpt-4o-mini";

    const response = await client.chat.completions.create({
        model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: "You are a video analyst. Summarize into JSON: { shortSummary, detailedSummary, chapters: [{title, startSeconds, endSeconds}], keyConcepts: [{name, explanation}] }" },
            { role: "user", content: `Video: ${videoTitle}\nTranscript: ${transcriptText}` }
        ]
    });

    return JSON.parse(response.choices[0].message.content);
};
