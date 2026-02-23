import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true, unique: true },
  shortSummary: { type: String, default: "" },
  detailedSummary: { type: String, default: "" },
  chapters: [{ title: String, startSeconds: Number, endSeconds: Number }],
  keyConcepts: [{ name: String, explanation: String }]
}, { timestamps: true });

export default mongoose.model("Summary", SummarySchema);