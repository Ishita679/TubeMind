import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const testYoutubeApi = async () => {
    const key = process.env.YOUTUBE_API_KEY;
    const videoId = 'dQw4w9WgXcQ';
    console.log(`Testing YouTube API with key: ${key?.slice(0, 5)}...`);

    try {
        const url = "https://www.googleapis.com/youtube/v3/videos";
        const res = await axios.get(url, {
            params: {
                part: "snippet,contentDetails",
                id: videoId,
                key: key,
            }
        });
        console.log("SUCCESS!");
        console.log("Title:", res.data.items[0]?.snippet?.title);
    } catch (err) {
        console.error("FAILED:", err.response?.data?.error || err.message);
    }
};

testYoutubeApi();
