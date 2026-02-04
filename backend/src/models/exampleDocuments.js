/**
 * TubeMind Example Documents (for understanding)
 * ------------------------------------------------
 * This file is NOT used by the backend.
 * It is only for reference.
 */

const exampleVideo = {
  _id: "65f0abc12345678900000001",
  videoId: "dQw4w9WgXcQ",
  title: "Learn Express.js in 30 Minutes",
  channelName: "Code With TubeMind",
  durationSeconds: 1800,
  createdAt: "2026-02-04T10:00:00.000Z",
  updatedAt: "2026-02-04T10:00:00.000Z"
};

const exampleTranscript = {
  _id: "65f0abc12345678900000002",
  video: "65f0abc12345678900000001",
  rawText: "Hello everyone, welcome to this Express.js tutorial...",
  createdAt: "2026-02-04T10:05:00.000Z",
  updatedAt: "2026-02-04T10:05:00.000Z"
};

const exampleSummary = {
  _id: "65f0abc12345678900000003",
  video: "65f0abc12345678900000001",

  shortSummary: "This video explains Express.js basics and how to build APIs.",
  detailedSummary:
    "In this video, we learn how Express works, how to create routes, and how middleware works...",

  chapters: [
    { title: "Intro", startSeconds: 0, endSeconds: 60 },
    { title: "Express Setup", startSeconds: 60, endSeconds: 300 },
    { title: "Routes + Controllers", startSeconds: 300, endSeconds: 900 }
  ],

  keyConcepts: [
    { name: "Middleware", explanation: "Functions that run before route handlers." },
    { name: "Routing", explanation: "Mapping URLs to backend functions." }
  ],

  createdAt: "2026-02-04T10:10:00.000Z",
  updatedAt: "2026-02-04T10:10:00.000Z"
};

const exampleQA = {
  _id: "65f0abc12345678900000004",
  video: "65f0abc12345678900000001",

  question: "What is middleware in Express?",
  answer:
    "Middleware is a function that runs before the final route handler. It can modify request/response or stop the request.",

  sources: [
    {
      startSeconds: 420,
      endSeconds: 480,
      textSnippet: "Middleware runs between request and response..."
    }
  ],

  createdAt: "2026-02-04T10:15:00.000Z",
  updatedAt: "2026-02-04T10:15:00.000Z"
};

module.exports = {
  exampleVideo,
  exampleTranscript,
  exampleSummary,
  exampleQA
};
