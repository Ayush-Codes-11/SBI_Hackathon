/**
 * api.js — frontend service layer
 * Calls the Express backend. Falls back to mock data if backend is offline
 * (so the demo never fully breaks even on bad WiFi at the venue).
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

/**
 * Request a Gemini-powered life event prediction for a customer.
 * @param {string} customerId  e.g. "cust_001"
 * @returns {Promise<{prediction: object, fromCache: boolean}>}
 */
export async function fetchPrediction(customerId) {
  const res = await fetch(`${BACKEND_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
    signal: AbortSignal.timeout(15000), // 15s timeout — Gemini is usually < 3s
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Backend error ${res.status}`);
  }

  return res.json(); // { customerId, customerName, prediction }
}

/**
 * Health check — used to detect if backend is up before making a predict call.
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
