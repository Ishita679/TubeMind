import express from "express";
import { createSummary, getSummaryByVideo } from "../controllers/summaryController.js";

const router = express.Router();

router.post("/", createSummary);
router.get("/:videoId", getSummaryByVideo);

export default router;