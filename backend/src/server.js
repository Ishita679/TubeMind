const express = require("express");
const config = require("./config/env");
const { connectDB } = require("./config/db");
const videoRoutes = require("./routes/videoRoutes");
const transcriptRoutes = require("./routes/transcriptRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const qaRoutes = require("./routes/qaRoutes");

const app = express();

app.use(express.json());
app.use("/api/videos", videoRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/qa", qaRoutes);



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
