import express from "express";
import { getTranscriptByUrl } from "../controllers/transcriptApiController.js";

const router = express.Router();

/**
 * GET /api/transcript?url=<YOUTUBE_URL>
 *
 * Fetches video metadata + full transcript for any public YouTube video.
 * Does not require MongoDB or an AI API key.
 *
 * Query params:
 *   url (required) – full YouTube video URL
 *
 * Success: { success: true, videoDetails: {...}, transcript: "..." }
 * Error:   { success: false, message: "..." }
 */
router.get("/", getTranscriptByUrl);

export default router;
