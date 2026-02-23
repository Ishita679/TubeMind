import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: "" },
  channelName: { type: String, default: "" },
  durationSeconds: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Video", VideoSchema);