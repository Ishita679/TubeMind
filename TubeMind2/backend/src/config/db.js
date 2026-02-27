import mongoose from "mongoose";
import config from "./env.js";

export const connectDB = async () => {
    if (!config.mongoUri) {
        console.warn("⚠️  MONGO_URI not set. Skipping database connection.");
        return;
    }
    try {
        await mongoose.connect(config.mongoUri);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
};
