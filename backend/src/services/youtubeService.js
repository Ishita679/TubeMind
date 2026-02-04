const axios = require("axios");
const config = require("../config/env");

const getVideoDetails = async (videoId) => {
  const url = "https://www.googleapis.com/youtube/v3/videos";

  const res = await axios.get(url, {
    params: {
      part: "snippet,contentDetails",
      id: videoId,
      key: process.env.YOUTUBE_API_KEY
    }
  });

  if (!res.data.items.length) return null;

  const item = res.data.items[0];

  return {
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    duration: item.contentDetails.duration
  };
};

module.exports = { getVideoDetails };
