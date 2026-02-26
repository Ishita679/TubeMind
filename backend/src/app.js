import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import transcriptApiRoute from "./routes/transcriptApiRoute.js";
import transcriptRoutes from "./routes/transcriptRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import qaRoutes from "./routes/qaRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

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