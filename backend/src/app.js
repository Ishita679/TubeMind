import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import transcriptRoutes from "./routes/transcriptRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import qaRoutes from "./routes/qaRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/qa", qaRoutes);

app.use((_req, res) => {
  res.status(404).json({ status: "fail", message: "The requested resource was not found" });
});

app.use(errorHandler);

export default app;