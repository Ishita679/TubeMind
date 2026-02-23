import express from "express";
import { createVideo, getAllVideos, getVideoById, getVideoStatus } from "../controllers/videoController.js";

const router = express.Router();

router.post("/", createVideo);
router.get("/", getAllVideos);
router.get("/:id/status", getVideoStatus);
router.get("/:id", getVideoById);

export default router;