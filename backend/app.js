import express        from "express";
import healthRoutes   from "./src/routes/HealthRoutes.js";
import errorHandler   from "./middleware/errorHandler.js";

const app = express();

// ── 1. Built-in middleware ───────────────────────────────────
app.use(express.json());                        // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// ── 2. Route mounting ────────────────────────────────────────
app.use("/api/health", healthRoutes);

// ── 3. 404 — must sit AFTER every real route ─────────────────
app.use((_req, res) => {
  res.status(404).json({
    status:  "fail",
    message: "The requested resource was not found",
  });
});

// ── 4. Global error handler — must be the LAST middleware ────
app.use(errorHandler);

export default app;