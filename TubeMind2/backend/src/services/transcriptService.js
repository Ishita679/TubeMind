import axios from "axios";

/**
 * SuperFetcher: Manual Extraction of YouTube Transcripts
 * Optimized to handle YouTube's latest security changes and rate limiting.
 */
export async function getTranscript(videoId) {
    try {
        console.log(`[SuperFetcher] Extraction started for: ${videoId}`);
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // 1. Fetch Video Page with varied User-Agent
        const agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1"
        ];

        let html;
        try {
            console.log("[SuperFetcher] Trying Desktop URL...");
            const res = await axios.get(videoUrl, {
                headers: {
                    "User-Agent": agents[0],
                    "Accept-Language": "en-US,en;q=0.9",
                    "X-Youtube-Client-Name": "1",
                    "X-Youtube-Client-Version": "2.20240224.00.00"
                }
            });
            html = res.data;
        } catch (e) {
            console.warn("[SuperFetcher] Desktop fetch failed, trying Mobile...");
            const res = await axios.get(`https://m.youtube.com/watch?v=${videoId}`, {
                headers: {
                    "User-Agent": agents[1],
                    "Accept-Language": "en-US,en;q=0.9"
                }
            });
            html = res.data;
        }

        // 2. Extract playerResponse JSON
        const playerMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/s);
        if (!playerMatch) {
            // Check if video is age-restricted or unavailable
            if (html.includes("sign in to confirm your age")) throw new Error("Video is age-restricted");
            if (html.includes("This video is private")) throw new Error("Video is private");
            throw new Error("Could not extract video metadata (IP might be throttled)");
        }

        let playerResponse = playerMatch ? JSON.parse(playerMatch[1]) : {};
        let captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

        // Fallback: Check ytInitialData if playerResponse fails
        if (!captionTracks || captionTracks.length === 0) {
            console.log("[SuperFetcher] PlayerResponse failed, trying InitialData...");
            const dataMatch = html.match(/ytInitialData\s*=\s*({.+?});/s);
            if (dataMatch) {
                const initialData = JSON.parse(dataMatch[1]);
                // Search for captions deep in the initialData tree
                // This is a common location in newer YouTube web layouts
                captionTracks = initialData.captions?.playerCaptionsTracklistRenderer?.captionTracks;
            }
        }

        if (!captionTracks || captionTracks.length === 0) {
            throw new Error("No transcripts found. (YouTube might be hiding them from this IP)");
        }

        // 3. Selection: Manual English > Auto English > First available
        const track = captionTracks.find(t => t.languageCode === 'en' && t.kind !== 'asr') ||
            captionTracks.find(t => t.languageCode === 'en') ||
            captionTracks[0];

        console.log(`[SuperFetcher] Selected track: ${track.languageCode} (${track.kind || 'manual'})`);

        // 4. Fetch the transcript data
        // We try JSON first, then XML
        const transcriptUrl = track.baseUrl + "&fmt=json3";
        let transcriptRes;
        try {
            transcriptRes = await axios.get(transcriptUrl, {
                headers: { "Referer": "https://www.youtube.com/" }
            });
        } catch (e) {
            if (e.response?.status === 429) throw new Error("YouTube has temporarily rate-limited the server. Please try again in a few minutes.");
            throw e;
        }

        let data = transcriptRes.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch { /* ignore */ }
        }

        // 5. Parse content
        let combinedText = "";
        if (data && data.events) {
            combinedText = data.events
                .filter(e => e.segs)
                .map(e => e.segs.map(s => s.utf8).join(""))
                .join(" ");
        } else if (typeof data === 'string' && data.includes('<text')) {
            const matches = data.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g);
            const chunks = [];
            for (const m of matches) {
                chunks.push(m[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
            }
            combinedText = chunks.join(" ");
        }

        const final = combinedText.replace(/\s+/g, " ").trim();
        if (final.length < 30) throw new Error("Transcript exists but content is too short to summarize");

        return splitIntoParagraphs(final);

    } catch (err) {
        console.error(`[SuperFetcher] Fatal: ${err.message}`);
        throw err; // Propagate the specific error message to the controller
    }
}

function splitIntoParagraphs(text, paragraphSize = 12) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += paragraphSize) {
        paragraphs.push(sentences.slice(i, i + paragraphSize).join(" ").trim());
    }
    return paragraphs.join("\n\n");
}
