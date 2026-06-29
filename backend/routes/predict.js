/**
 * predict.js
 * POST /api/predict
 * Fetches customer signals from mockSignals.js, calls Gemini,
 * returns the typed JSON prediction to the frontend.
 */

const express = require("express");
const router = express.Router();
const { MOCK_SIGNALS } = require("../services/mockSignals");
const { predictLifeEvent } = require("../services/gemini");

router.post("/", async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "customerId is required" });
  }

  const signals = MOCK_SIGNALS[customerId];
  if (!signals) {
    return res.status(404).json({ error: `No signals found for customer: ${customerId}` });
  }

  try {
    console.log(`[predict] Running Gemini prediction for ${customerId} (${signals.name})...`);
    const prediction = await predictLifeEvent(signals);
    console.log(`[predict] ✅ Life event: "${prediction.lifeEvent}" (${prediction.confidence}% confidence)`);

    return res.json({
      customerId,
      customerName: signals.name,
      prediction,
    });
  } catch (err) {
    console.error(`[predict] ❌ Gemini call failed:`, err.message);

    // Safety net fallback directly inside backend route
    if (signals.prediction) {
      console.log(`[predict] ⚠️ Serving fallback prediction statically for ${customerId}`);
      return res.json({
        customerId,
        customerName: signals.name,
        prediction: signals.prediction,
        fallback: true,
      });
    }

    // Return a structured error so frontend can fall back to mock data gracefully
    return res.status(503).json({
      error: "AI prediction temporarily unavailable",
      detail: err.message,
      fallback: true,
    });
  }
});

module.exports = router;
