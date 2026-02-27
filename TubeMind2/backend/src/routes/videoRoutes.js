import express from "express";
import { processVideo } from "../controllers/VideoController.js";
const router = express.Router();
router.post("/", processVideo);
export default router;
