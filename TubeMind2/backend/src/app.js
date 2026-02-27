import express from "express";
import cors from "cors";
import transcriptApiRoute from "./routes/transcriptApiRoute.js";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use("/api/transcript", transcriptApiRoute);
app.use("/api/videos", videoRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server Error" });
});

export default app;
