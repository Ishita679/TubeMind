import mongoose from "mongoose";

const transcriptSchema = new mongoose.Schema({
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    rawText: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Transcript", transcriptSchema);
