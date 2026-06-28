/**
 * server.js — SBI LifeAI Backend
 * Express server with CORS for the Vite frontend on :5173
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const predictRouter = require("./routes/predict");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    // Add your Vercel URL here once deployed
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/predict", predictRouter);

// Health check — useful to verify server is up before recording the demo
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SBI LifeAI Backend",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 SBI LifeAI backend running on http://localhost:${PORT}`);
  console.log(`   Gemini API key: ${process.env.GEMINI_API_KEY ? "✅ configured" : "❌ MISSING — set GEMINI_API_KEY in .env"}`);
  console.log(`   Health check:   http://localhost:${PORT}/api/health\n`);
});
