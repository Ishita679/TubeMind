const express = require("express");
const {
  createVideo,
  getAllVideos,
  getVideoById,
  getVideoStatus
} = require("../controllers/VideoController.js");

const router = express.Router();

router.post("/", createVideo);
router.get("/", getAllVideos);
router.get("/:id/status", getVideoStatus);
router.get("/:id", getVideoById);

module.exports = router;
