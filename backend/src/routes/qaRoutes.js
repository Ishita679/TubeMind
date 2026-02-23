import express from "express";
import { createQA, getQAByVideo } from "../controllers/qaController.js";

const router = express.Router();

router.post("/", createQA);
router.get("/:videoId", getQAByVideo);

export default router;