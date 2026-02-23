import express from "express";
import { createTranscript, getTranscriptByVideo } from "../controllers/transcriptController.js";

const router = express.Router();

router.post("/", createTranscript);
router.get("/:videoId", getTranscriptByVideo);

export default router;