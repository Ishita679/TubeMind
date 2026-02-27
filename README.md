# TubeMind Monorepo

Welcome to the TubeMind project repository. This repository contains two versions of the TubeMind application, an AI-powered YouTube assistant that helps users extract transcripts, summarize content, and interact with video data.

## 📂 Project Structure

The repository is organized into two main project folders and a presentation document:

```text
TubeMind/
├── TubeMind/              # Previous Project Version
│   ├── backend/          # Node.js/Express server (Previous)
│   └── frontend/         # React/Vite/Tailwind UI (Previous)
├── TubeMind2/             # Current/Present Project Version
│   ├── backend/          # Node.js/Express server (Current)
│   └── frontend/         # React/Vite/Tailwind UI (Current)
└── present.tex            # Project Presentation (LaTeX)
```

---

## 🚀 Key Features

### 1. YouTube Transcript Extraction
*   Fetches real-time transcripts from YouTube videos using multiple fallback methods (`youtubei.js`, `youtube-transcript`, `youtube-captions-scraper`).
*   Handles both manual and auto-generated captions.

### 2. AI Summarization & Q&A
*   Integrates with **OpenAI GPT** models to generate concise summaries of long videos.
*   Allows users to ask questions related to the video content (Q&A feature).

### 3. Data Management
*   Uses **MongoDB** (via Mongoose) to store video metadata, transcripts, and generated summaries for quick retrieval.

### 4. Modern UI/UX
*   Built with **React 19** and **Vite**.
*   Responsive and premium design using **Tailwind CSS**.
*   Smooth animations powered by **Framer Motion**.
*   Consistent dark-red themed interface.

---

## 🛠️ How to Run

Each version (TubeMind and TubeMind2) has its own frontend and backend. Follow these steps for the version you wish to run:

### 1. Backend Setup
Navigate to the desired backend directory (e.g., `TubeMind2/backend`):
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**: Create a `.env` file and add the following:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    OPENAI_API_KEY=your_openai_api_key
    ```
3.  **Start the server**:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
Navigate to the desired frontend directory (e.g., `TubeMind2/frontend`):
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the development server**:
    ```bash
    npm run dev
    ```

---

## 📚 Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI** | OpenAI API |
| **APIs** | YouTubei.js, YTDL-Core, YouTube Transcript API |

---

## 📄 Presentation
The `present.tex` file contains the LaTeX source code for the project presentation. This can be compiled using any standard LaTeX editor (like Overleaf or TeXworks) to generate the project documentation or slides.
