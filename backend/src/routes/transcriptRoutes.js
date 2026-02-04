const express = require("express");
const { createTranscript, getTranscriptByVideo } = require("../controllers/transcriptController");

const router = express.Router();

router.post("/", createTranscript);
router.get("/:videoId", getTranscriptByVideo);

module.exports = router;
