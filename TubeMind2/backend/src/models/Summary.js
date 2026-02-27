import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    shortSummary: { type: String },
    detailedSummary: { type: String },
    chapters: [{
        title: String,
        startSeconds: Number,
        endSeconds: Number
    }],
    keyConcepts: [{
        name: String,
        explanation: String
    }]
}, { timestamps: true });

export default mongoose.model("Summary", summarySchema);
