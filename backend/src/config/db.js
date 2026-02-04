const mongoose = require("mongoose");
const config = require("./env");

const connectDB = async () => {
  if (!config.mongoUri) {
    throw new Error("❌ MONGO_URI is missing in .env file");
  }

  await mongoose.connect(config.mongoUri);

  console.log("✅ MongoDB connected");
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("🛑 MongoDB disconnected");
};

module.exports = { connectDB, disconnectDB };
