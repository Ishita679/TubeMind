TubeMind - AI Video Distiller
Tubemind is a project designed to extract, transcribe, and summarize YouTube videos using high-performance AI models.

Follow these steps to get the server running locally on your machine
1. Prerequisites
   -> Node.js (v18 or higher)
   -> MongoDB Atlas account
   -> Groq API Key (for Llama 3.3 summarization)
   
2. Installation
   Clone the repository and install the dependencies
   `git clone <repo link>`
   `cd TubeMind/backend`
   `npm install`
   
3. Environment Variables
Create a .env file in the root of the /backend directory and add your credentials:
Code snippet
`PORT=3000`
`MONGODB_URI=your_mongodb_atlas_connection_string`
`GROQ_API_KEY=your_groq_api_key`
`NODE_ENV=development`

4. Running the Server in auto-reload (development mode):
   `Bash npm run dev`
The server will start at http://localhost:3000
