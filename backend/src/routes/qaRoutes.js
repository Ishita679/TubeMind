const express = require("express");
const { createQA, getQAByVideo } = require("../controllers/qaController");

const router = express.Router();

router.post("/", createQA);
router.get("/:videoId", getQAByVideo);

module.exports = router;
