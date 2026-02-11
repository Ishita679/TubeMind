import Video      from "../models/Video.js";
import Transcript from "../models/Transcript.js";
import Summary    from "../models/Summary.js";
import { AppError } from "../middleware/errorHandler.js";
import { summarizeTranscript } from "../services/openaiService.js";

// ── POST /api/video/summarize ────────────────────────────────
/**
 * Generate an AI summary for a video.
 *
 * Request body:
 *   { videoId: "507f1f77bcf86cd799439011" }
 *
 * Response:
 *   {
 *     status: "success",
 *     data: {
 *       video: { ...Video doc... },
 *       summary: { ...Summary doc... }
 *     }
 *   }
 *
 * Error cases:
 *   - 400: videoId missing or invalid ObjectId format
 *   - 404: Video or Transcript not found
 *   - 409: Summary already exists for this video
 *   - 500: OpenAI API failure or DB write failure
 */
const generateSummary = async (req, res, next) => {
  const { videoId } = req.body;

  // ── 1. Validate input ────────────────────────────────────
  if (!videoId) {
    return next(new AppError("videoId is required", 400));
  }

  // Mongoose will throw a CastError if videoId isn't a valid
  // ObjectId string.  We catch that in the error handler.

  try {
    // ── 2. Fetch Video ───────────────────────────────────────
    const video = await Video.findById(videoId);
    if (!video) {
      return next(new AppError("Video not found", 404));
    }

    // ── 3. Check if summary already exists ───────────────────
    // The unique constraint on Summary.videoId prevents duplicates
    // at the DB level, but we check here to give a better error.
    const existingSummary = await Summary.findOne({ videoId });
    if (existingSummary) {
      return next(
        new AppError("Summary already exists for this video", 409)
      );
    }

    // ── 4. Fetch Transcript ──────────────────────────────────
    const transcript = await Transcript.findOne({ videoId });
    if (!transcript) {
      return next(
        new AppError("Transcript not found. Transcribe the video first.", 404)
      );
    }

    if (!transcript.segments || transcript.segments.length === 0) {
      return next(new AppError("Transcript has no segments", 400));
    }

    // ── 5. Update video status → "summarizing" ───────────────
    video.status = "summarizing";
    await video.save();

    // ── 6. Call OpenAI ───────────────────────────────────────
    // This is where the magic happens. The service layer handles
    // retries, JSON validation, and error mapping.
    const aiResponse = await summarizeTranscript(
      video.title,
      transcript.segments
    );

    // ── 7. Save Summary to DB ────────────────────────────────
    const summary = await Summary.create({
      videoId: video._id,
      overview:       aiResponse.detailedSummary,  // maps to "overview" in schema
      keyPoints:      aiResponse.keyPoints,
      chapters:       aiResponse.chapters,
      keyConcepts:    aiResponse.keyConcepts,
      generatedBy:    "gpt-4o",
      modelTemperature: 0.3,
    });

    // ── 8. Update video status → "done" ──────────────────────
    video.status       = "done";
    video.errorMessage = null;   // clear any old error
    await video.save();

    // ── 9. Return success ────────────────────────────────────
    res.status(200).json({
      status: "success",
      data: {
        video,
        summary,
        // ── Extra fields not stored in DB ─────────────────────
        // These are derived from the AI response but not part of
        // the Summary schema.  The front-end might still want them.
        shortSummary:             aiResponse.shortSummary,
        actionableLearningPoints: aiResponse.actionableLearningPoints,
      },
    });

  } catch (err) {
    // ── Handle failures gracefully ───────────────────────────
    // If ANYTHING goes wrong after we set status="summarizing",
    // we mark the video as "failed" so the UI knows not to retry
    // indefinitely.
    try {
      const video = await Video.findById(videoId);
      if (video) {
        video.status       = "failed";
        video.errorMessage = err.message || "Summary generation failed";
        await video.save();
      }
    } catch (updateErr) {
      // If even the status update fails, just log and continue.
      console.error("[Video status update failed]", updateErr);
    }

    // Pass the original error to the global error handler.
    next(err);
  }
};

export default { generateSummary };