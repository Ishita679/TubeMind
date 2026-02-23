import mongoose from "mongoose";
import config from "./env.js";

export const connectDB = async () => {
  if (!config.mongoUri) {
    throw new Error("❌ MONGO_URI is missing in .env file");
  }
  await mongoose.connect(config.mongoUri);
  console.log("✅ MongoDB connected");
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("🛑 MongoDB disconnected");
};