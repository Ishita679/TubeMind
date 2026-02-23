import { getSubtitles } from 'youtube-captions-scraper';

export const getTranscript = async (videoId) => {
  try {
    const captions = await getSubtitles({
      videoID: videoId,
      lang: 'en' // Strictly look for English captions
    });
    
    if (!captions || captions.length === 0) {
      return null;
    }
    
    // Glues all the text together just like before
    return captions.map((c) => c.text).join(" ");
    
  } catch (err) {
    console.error("[New Scraper Error]:", err.message);
    return null;
  }
};