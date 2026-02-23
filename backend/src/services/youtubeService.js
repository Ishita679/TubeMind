import axios from "axios";
import config from "../config/env.js";

// Helper function to convert ISO 8601 duration (e.g., PT36M3S) to total seconds
const parseDurationToSeconds = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  
  return hours * 3600 + minutes * 60 + seconds;
};

export const getVideoDetails = async (videoId) => {
  const url = "https://www.googleapis.com/youtube/v3/videos";
  const res = await axios.get(url, {
    params: {
      part: "snippet,contentDetails",
      id: videoId,
      key: config.youtubeApiKey
    }
  });

  if (!res.data.items.length) return null;
  const item = res.data.items[0];

  return {
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    // Convert the weird string to a clean number here!
    duration: parseDurationToSeconds(item.contentDetails.duration) 
  };
};