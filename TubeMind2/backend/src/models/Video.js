import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    channelName: { type: String },
    durationSeconds: { type: Number },
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);
