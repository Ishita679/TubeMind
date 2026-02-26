import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import transcriptApiRoute from "./routes/transcriptApiRoute.js";
import transcriptRoutes from "./routes/transcriptRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import qaRoutes from "./routes/qaRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ── CORS (simple allow-all for development/public API) ───────────────────────
app.use(cors()); // Access-Control-Allow-Origin: *


// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/videos", videoRoutes);
// New lightweight transcript endpoint (no DB / AI key required)
app.use("/api/transcript", transcriptApiRoute);
// Legacy CRUD routes (require MongoDB)
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/qa", qaRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ status: "fail", message: "The requested resource was not found" });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;