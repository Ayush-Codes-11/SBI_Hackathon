/**
 * gemini.js
 * Calls Gemini directly via REST (no SDK) — avoids SDK auth issues.
 * Uses gemini-2.0-flash which is confirmed available on free tier.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";
// AQ. keys (Google's new format since June 2026) must use the x-goog-api-key
// header — NOT the ?key= query parameter used by the old AIzaSy keys.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// The product catalogue Gemini can recommend from
const PRODUCT_CATALOGUE = [
  { id: "edu_loan",          name: "SBI Education Loan",                icon: "GraduationCap", color: "#1A73E8" },
  { id: "forex_card",        name: "SBI Student Forex Card",            icon: "CreditCard",    color: "#00C6FF" },
  { id: "travel_insurance",  name: "SBI Travel Insurance",              icon: "Shield",        color: "#00D68F" },
  { id: "student_account",   name: "SBI International Student Account", icon: "Landmark",      color: "#FFB347" },
  { id: "home_loan",         name: "SBI MaxGain Home Loan",             icon: "Home",          color: "#FF4E6A" },
  { id: "home_insurance",    name: "SBI Home Shield Insurance",         icon: "Shield",        color: "#1A73E8" },
  { id: "sip",               name: "SBI Mutual Fund SIP",               icon: "TrendingUp",    color: "#00D68F" },
  { id: "child_plan",        name: "SBI Life Smart Scholar",            icon: "Baby",          color: "#00D68F" },
  { id: "term_insurance",    name: "SBI Life eShield",                  icon: "Shield",        color: "#1A73E8" },
  { id: "recurring_deposit", name: "SBI Recurring Deposit",             icon: "PiggyBank",     color: "#FFB347" },
  { id: "resident_account",  name: "SBI Resident Foreign Currency",     icon: "Landmark",      color: "#FFB347" },
  { id: "wealth_fd",         name: "SBI Wealth FD",                     icon: "Banknote",      color: "#1A73E8" },
  { id: "tax_advisory",      name: "SBI Tax Advisory Service",          icon: "FileText",      color: "#00D68F" },
  { id: "sr_citizen_fd",     name: "SBI Wecare Senior FD",              icon: "Banknote",      color: "#9B59B6" },
  { id: "health_insurance",  name: "SBI Arogya Premier",                icon: "Heart",         color: "#FF4E6A" },
  { id: "pension_plan",      name: "SBI Annuity Deposit",               icon: "Calendar",      color: "#00D68F" },
];

function buildPrompt(signals) {
  const travelAmounts = signals.transactions
    .filter(t => ["travel", "airline", "hotel"].some(k => t.category.toLowerCase().includes(k)))
    .map(t => `Rs.${t.amount} (${t.month})`).join(", ") || "none";

  const otherSpend = signals.transactions
    .filter(t => !["travel", "airline", "hotel"].some(k => t.category.toLowerCase().includes(k)))
    .map(t => `${t.category}: Rs.${t.amount} (${t.month})`).join("; ") || "none";

  const salaryTrend = signals.salaryCredits[signals.salaryCredits.length - 1] === 0
    ? "Last month salary credit = Rs.0 (retirement signal)"
    : `Rs.${signals.salaryCredits.join(" to ")} over last 3 months`;

  const productList = PRODUCT_CATALOGUE
    .map(p => `- id: "${p.id}", name: "${p.name}"`)
    .join("\n");

  return `OUTPUT RAW JSON ONLY. No explanation, no markdown, no code fences. Just the JSON object.

You are an AI banking assistant for State Bank of India (SBI).
Analyse the customer signals below and predict the most likely life event.

CUSTOMER PROFILE:
- Name: ${signals.name}, Age: ${signals.age}, City: ${signals.city}
- Credit Score: ${signals.creditScore}
- Account Balance: Rs.${signals.accountBalance}
- Salary Credits (last 3 months): ${salaryTrend}
- Existing Products: ${signals.existingProducts.join(", ")}

TRANSACTION SIGNALS (SBI CBS - UPI/card/ATM/NEFT all included):
- Travel/Airlines/Hotels: ${travelAmounts}
- Other spend: ${otherSpend}

YONO IN-APP SEARCHES (not browser history):
${signals.yonoSearchHistory.map((s, i) => `${i + 1}. ${s}`).join("\n")}

PRODUCTS TO CHOOSE FROM (pick 2-4):
${productList}

RULES:
- escalate = true if loanAmount > 5000000 (RBI requirement)
- confidence: 0-100
- reasoning: 1-2 sentences citing the signals above
- reasoningHi: same in Hindi

REQUIRED JSON STRUCTURE (output this and nothing else):
{"lifeEvent":"<English>","lifeEventHi":"<Hindi>","confidence":<number>,"reasoning":"<1-2 sentences>","reasoningHi":"<Hindi>","escalate":<boolean>,"loanAmount":<number>,"products":[{"id":"<id>","name":"<name>","icon":"<icon>","color":"<hex>","description":"<why for this customer>","descriptionHi":"<Hindi>","rate":"<rate>","badge":"<badge>","badgeHi":"<Hindi badge>"}]}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGeminiWithRetry(body, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,   // AQ. keys require header auth
      },
      body: JSON.stringify(body),
    });

    if (response.status === 429) {
      const waitMs = attempt * 5000; // 5s, 10s, 15s
      console.log(`[gemini] Rate limited (429). Retrying in ${waitMs / 1000}s... (attempt ${attempt}/${retries})`);
      await sleep(waitMs);
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    return response.json();
  }
  throw new Error("Gemini rate limit exceeded after retries. Try again in a minute.");
}

async function predictLifeEvent(signals) {
  const prompt = buildPrompt(signals);

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,   // low = consistent JSON structure
    },
  };

  const data = await callGeminiWithRetry(body);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty output");

  // Extract JSON — handle plain text, markdown fences, or leading explanation
  let parsed;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in Gemini response");
  parsed = JSON.parse(jsonMatch[0]);


  // Enforce RBI escalation rule: loans > Rs.50L need RM review
  if (parsed.loanAmount > 5000000) {
    parsed.escalate = true;
    parsed.escalationReason = `Loan amount Rs.${(parsed.loanAmount / 100000).toFixed(0)}L exceeds Rs.50L threshold. Requires Relationship Manager review per RBI Digital Lending Guidelines 2022.`;
    parsed.escalationReasonHi = `ऋण राशि ₹${(parsed.loanAmount / 100000).toFixed(0)}L, ₹50L की सीमा से अधिक। RBI डिजिटल ऋण दिशानिर्देश 2022 के अनुसार RM समीक्षा आवश्यक।`;
  }

  return parsed;
}

module.exports = { predictLifeEvent };
