import app from "./app.js";
import config from "./config/env.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  try {
    console.log("⏳ TubeMind starting up...");
    await connectDB();

    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`🌱 Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();