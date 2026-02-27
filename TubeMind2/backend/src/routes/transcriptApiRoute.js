import express from "express";
import { getTranscriptByUrl } from "../controllers/transcriptApiController.js";
const router = express.Router();
router.get("/", getTranscriptByUrl);
export default router;
