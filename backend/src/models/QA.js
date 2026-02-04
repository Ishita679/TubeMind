const mongoose = require("mongoose");

const QASchema = new mongoose.Schema(
  {
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },

    question: { type: String, required: true },
    answer: { type: String, required: true },

    sources: [
      {
        startSeconds: Number,
        endSeconds: Number,
        textSnippet: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("QA", QASchema);
