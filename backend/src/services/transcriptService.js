import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Fetches the English transcript for a YouTube video.
 * Uses the `youtube-transcript` package which is more reliable than
 * `youtube-captions-scraper` for modern YouTube pages.
 *
 * Returns the full transcript as a readable string with paragraph breaks,
 * or null if no captions are available.
 */
export const getTranscript = async (videoId) => {
  try {
    // Attempt to fetch English captions
    const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });

    if (!items || items.length === 0) {
      return null;
    }

    // Group into paragraphs of ~12 caption items each for readability
    const CHUNK = 12;
    const paragraphs = [];
    for (let i = 0; i < items.length; i += CHUNK) {
      const chunk = items.slice(i, i + CHUNK);
      paragraphs.push(chunk.map((c) => c.text).join(' '));
    }

    return paragraphs.join('\n\n');

  } catch (firstErr) {
    console.warn('[youtube-transcript primary failed, trying without lang filter]:', firstErr.message);

    // Retry without a language filter (picks whatever captions are available)
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId);

      if (!items || items.length === 0) return null;

      const CHUNK = 12;
      const paragraphs = [];
      for (let i = 0; i < items.length; i += CHUNK) {
        paragraphs.push(items.slice(i, i + CHUNK).map((c) => c.text).join(' '));
      }
      return paragraphs.join('\n\n');

    } catch (secondErr) {
      console.error('[Transcript Error – both attempts failed]:', secondErr.message);
      return null;
    }
  }
};