const mongoose = require("mongoose");

const TranscriptSchema = new mongoose.Schema(
  {
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true, unique: true },
    rawText: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transcript", TranscriptSchema);
