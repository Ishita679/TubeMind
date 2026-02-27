import axios from "axios";

export async function fetchTranscriptManual(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const { data: html } = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }
    });

    const regexMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/s);
    if (!regexMatch) throw new Error("Could not find ytInitialPlayerResponse");

    const playerResponse = JSON.parse(regexMatch[1]);
    const captions = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captions || captions.length === 0) throw new Error("No transcripts found");

    const track = captions.find(c => c.languageCode === 'en') || captions[0];
    let transcriptUrl = track.baseUrl;

    // Force JSON format for easier parsing if not already
    if (!transcriptUrl.includes('fmt=json3')) {
        transcriptUrl += '&fmt=json3';
    }

    console.log(`[Scraper] Fetching from: ${transcriptUrl.slice(0, 50)}...`);
    const { data: transcriptData } = await axios.get(transcriptUrl);
    console.log(`[Scraper] Transcript Data Start: ${String(transcriptData).slice(0, 100)}`);

    let data = transcriptData;
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { /* ignore */ }
    }

    // If it's JSON (fmt=json3)
    if (data && data.events) {
        const text = data.events
            .filter(e => e.segs)
            .map(e => e.segs.map(s => s.utf8).join(""))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
        if (text) return text;
    }

    // Fallback: XML Regex if it returned XML despite fmt=json3
    const xml = typeof transcriptData === 'string' ? transcriptData : JSON.stringify(transcriptData);
    const regex = /<text[^>]*>([\s\S]*?)<\/text>/g;
    const items = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
        items.push(match[1]);
    }

    if (items.length === 0) throw new Error("Transcript empty");
    return items.join(" ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}
