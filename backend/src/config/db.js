import mongoose from "mongoose";
import config from "./env.js";

export const connectDB = async () => {
  if (!config.mongoUri) {
    // don't exit the process when there's no database – some endpoints (like
    // /api/transcript) work perfectly fine without Mongo.  This makes it easy
    // to run the backend in a "demo" or CI environment where a database is
    // not configured.
    console.warn("⚠️ MONGO_URI not set – skipping MongoDB connection.");
    return;
  }

  await mongoose.connect(config.mongoUri);
  console.log("✅ MongoDB connected");
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("🛑 MongoDB disconnected");
};