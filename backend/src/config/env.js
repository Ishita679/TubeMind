import dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  openaiApiKey: process.env.OPENAI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  youtubeApiKey: process.env.YOUTUBE_API_KEY
});

export default config;