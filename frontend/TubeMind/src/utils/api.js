import axios from "axios";
import { API_BASE } from "../constants";
import { extractVideoId } from "./helpers";

// ── API client with base URL ───────────────────────────────────────────────────
const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 60000, // 60 second timeout for AI calls
});

/**
 * Process a YouTube URL through the backend pipeline:
 *   1. Extract metadata via YouTube Data API
 *   2. Fetch transcript via youtube-captions-scraper
 *   3. Summarise via Llama 3.3 on Groq
 *
 * Backend endpoint: POST /api/videos
 * Body: { videoId: string }
 * Response: { message, summary: { shortSummary, detailedSummary, chapters, keyConcepts } }
 *
 * ALSO fetches the video record separately via GET /api/videos/:videoId
 * to get title, channelName, durationSeconds
 */
export async function processVideoAPI(url) {
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error("Could not extract video ID from URL.");

    try {
        // 1. Trigger the full pipeline (transcript + summary)
        const { data: pipelineResult } = await api.post("/api/videos", { videoId });

        // 2. Fetch video metadata
        let videoMeta = null;
        try {
            const { data: videoData } = await api.get(`/api/videos/${videoId}`);
            videoMeta = videoData;
        } catch {
            // Non-fatal: metadata might not be critical
        }

        const summary = pipelineResult.summary;
        const transcript = pipelineResult.transcript || null; // raw text from backend

        return {
            videoId,
            title: videoMeta?.title || "Unknown Title",
            channel: videoMeta?.channelName || "Unknown Channel",
            durationSeconds: videoMeta?.durationSeconds || 0,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            summary,    // { shortSummary, detailedSummary, chapters, keyConcepts }
            transcript, // raw transcript text (or null)
        };
    } catch (err) {
        const message =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to process video. Please try again.";
        throw new Error(message);
    }
}

/**
 * Fallback dummy data for when the backend is unavailable (dev/demo mode).
 * Returns same shape as processVideoAPI().
 */
export async function getDummyData(url) {
    await new Promise((r) => setTimeout(r, 2200));
    const videoId = extractVideoId(url) || "dQw4w9WgXcQ";
    return {
        videoId,
        title: "The Future of Artificial Intelligence — Full Lecture",
        channel: "MIT OpenCourseWare",
        durationSeconds: 5077, // 1h 24m 37s
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        summary: {
            shortSummary:
                "This lecture explores rapid AI advancements, focusing on large language models, ethical challenges around AI alignment, and societal impacts of automation. It calls for responsible development while highlighting AI's vast potential in healthcare and climate science.",
            detailedSummary:
                "The lecture begins with an overview of AI's remarkable recent progress, particularly in natural language processing and computer vision. The emergence of large language models (LLMs)—trained on massive datasets—has been a defining development.\n\nThe speaker dedicates significant time to ethical considerations, especially AI alignment—ensuring AI behaves according to human values. Techniques like Reinforcement Learning from Human Feedback (RLHF) show promise but remain incomplete solutions. Transparency, interpretability, and bias mitigation remain open challenges.\n\nEconomic impacts are addressed seriously: AI-driven automation threatens to displace millions of workers, necessitating thoughtful policy responses. Conversely, AI's potential to address climate change, improve disease diagnosis, and reduce poverty is highlighted as a source of optimism.\n\nThe lecture concludes with a reflection on artificial general intelligence (AGI), noting that timelines remain highly uncertain. The speaker emphasises that today's choices about AI development will have profound, multigenerational consequences.",
            chapters: [
                { title: "Introduction & AI Progress Overview", startSeconds: 0, endSeconds: 130 },
                { title: "Large Language Models", startSeconds: 130, endSeconds: 525 },
                { title: "AI Alignment & Ethics", startSeconds: 525, endSeconds: 845 },
                { title: "Economic Impact of Automation", startSeconds: 845, endSeconds: 1245 },
                { title: "Applications: Healthcare & Climate", startSeconds: 1245, endSeconds: 1920 },
                { title: "The Road to AGI", startSeconds: 1920, endSeconds: 2145 },
            ],
            keyConcepts: [
                { name: "Large Language Models", explanation: "AI systems trained on vast text datasets capable of understanding and generating human language at a high level." },
                { name: "AI Alignment", explanation: "The challenge of ensuring artificial intelligence systems act in accordance with human values and intentions." },
                { name: "RLHF", explanation: "Reinforcement Learning from Human Feedback – a technique to steer AI models toward helpful, harmless behaviour using human preferences." },
                { name: "Artificial General Intelligence (AGI)", explanation: "A hypothetical AI with human-level cognitive ability across all domains; timelines for its arrival are deeply uncertain." },
                { name: "Automation Displacement", explanation: "The economic risk that AI and robotics replace large numbers of human jobs, requiring proactive policy solutions." },
            ],
        },
        transcript:
            "Welcome to today's lecture on the future of artificial intelligence.\n\n" +
            "Over the past several years, we have witnessed an extraordinary acceleration in the capabilities of AI systems. " +
            "The development of large language models — trained on hundreds of billions of tokens of text — represents a qualitative leap beyond what was possible just a decade ago. " +
            "Systems like GPT, Claude, and Llama can now engage in nuanced reasoning, write code, draft legal documents, and hold conversations that are often indistinguishable from those with a human expert.\n\n" +
            "But capability advances bring responsibility. One of the central challenges our field faces is the problem of AI alignment — how do we ensure that a system optimising for a given objective actually does what we intend and value? " +
            "This is not merely a technical question; it is a deeply philosophical one, touching on ethics, political theory, and the nature of human flourishing.\n\n" +
            "Reinforcement Learning from Human Feedback, or RLHF, has emerged as one of the most promising practical approaches. " +
            "By collecting human preferences on model outputs and using these signals to fine-tune the model, researchers have been able to significantly reduce harmful, misleading, and unhelpful outputs. " +
            "But it is not a complete solution. Human annotators have biases; the preference data is expensive to collect; and edge cases remain challenging.\n\n" +
            "The economic implications of AI are just as consequential as the technical ones. Automation has always displaced workers — the industrial revolution, mechanised agriculture, the rise of computers — but AI may do so at a scale and speed that outpaces society's ability to adapt. " +
            "Policy responses will be critical: universal basic income, retraining programmes, and international coordination on AI deployment all deserve serious consideration.\n\n" +
            "On the optimistic side, AI offers the prospect of radically accelerating scientific progress. " +
            "In healthcare, AI-assisted diagnostics and drug discovery could save millions of lives. " +
            "In climate science, machine learning models are improving the accuracy of climate projections and optimising renewable energy grids.\n\n" +
            "What about artificial general intelligence — AGI? The honest answer is that nobody knows when or whether we will achieve it. " +
            "Estimates from leading researchers range from a decade to never. What matters more than precise predictions is building the institutions, norms, and technical safeguards that will allow us to navigate this transition safely, whatever its timeline.\n\n" +
            "To summarise: AI is neither a utopian miracle nor an existential catastrophe waiting to happen — it is a powerful technology whose trajectory will be determined by the choices we make today. " +
            "I encourage each of you to engage with these questions not merely as technologists but as citizens, ethicists, and stewards of the future.",
    };
}
