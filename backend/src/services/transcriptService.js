const { YoutubeTranscript } = require("youtube-transcript");

const getTranscript = async (videoId) => {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);

  // Convert into plain text
  const fullText = transcript.map((t) => t.text).join(" ");

  return fullText;
};

module.exports = { getTranscript };
