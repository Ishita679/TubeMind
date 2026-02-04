const express = require("express");
const { createSummary, getSummaryByVideo } = require("../controllers/summaryController");

const router = express.Router();

router.post("/", createSummary);
router.get("/:videoId", getSummaryByVideo);

module.exports = router;
