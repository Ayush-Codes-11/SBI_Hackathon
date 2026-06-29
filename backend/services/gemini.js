/**
 * gemini.js
 * Wraps the Gemini Flash SDK. Builds a structured prompt from customer signals
 * and returns a typed JSON prediction object.
 *
 * Model: gemini-2.5-flash (free tier, no credit card)
 */

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The product catalogue Gemini can recommend from
const PRODUCT_CATALOGUE = [
  { id: "edu_loan",         name: "SBI Education Loan",               icon: "GraduationCap", color: "#1A73E8" },
  { id: "forex_card",       name: "SBI Student Forex Card",           icon: "CreditCard",    color: "#00C6FF" },
  { id: "travel_insurance", name: "SBI Travel Insurance",             icon: "Shield",        color: "#00D68F" },
  { id: "student_account",  name: "SBI International Student Account",icon: "Landmark",      color: "#FFB347" },
  { id: "home_loan",        name: "SBI MaxGain Home Loan",            icon: "Home",          color: "#FF4E6A" },
  { id: "home_insurance",   name: "SBI Home Shield Insurance",        icon: "Shield",        color: "#1A73E8" },
  { id: "sip",              name: "SBI Mutual Fund SIP",              icon: "TrendingUp",    color: "#00D68F" },
  { id: "child_plan",       name: "SBI Life Smart Scholar",           icon: "Baby",          color: "#00D68F" },
  { id: "term_insurance",   name: "SBI Life eShield",                 icon: "Shield",        color: "#1A73E8" },
  { id: "recurring_deposit",name: "SBI Recurring Deposit",            icon: "PiggyBank",     color: "#FFB347" },
  { id: "resident_account", name: "SBI Resident Foreign Currency",    icon: "Landmark",      color: "#FFB347" },
  { id: "wealth_fd",        name: "SBI Wealth FD",                    icon: "Banknote",      color: "#1A73E8" },
  { id: "tax_advisory",     name: "SBI Tax Advisory Service",         icon: "FileText",      color: "#00D68F" },
  { id: "sr_citizen_fd",    name: "SBI Wecare Senior FD",             icon: "Banknote",      color: "#9B59B6" },
  { id: "health_insurance", name: "SBI Arogya Premier",               icon: "Heart",         color: "#FF4E6A" },
  { id: "pension_plan",     name: "SBI Annuity Deposit",              icon: "Calendar",      color: "#00D68F" },
];

function buildPrompt(signals) {
  const travelAmounts = signals.transactions
    .filter(t => t.category.toLowerCase().includes("travel") ||
                 t.category.toLowerCase().includes("airline") ||
                 t.category.toLowerCase().includes("hotel"))
    .map(t => `₹${t.amount} (${t.month})`).join(", ") || "none";

  const otherSpend = signals.transactions
    .filter(t => !t.category.toLowerCase().includes("travel") &&
                 !t.category.toLowerCase().includes("airline") &&
                 !t.category.toLowerCase().includes("hotel"))
    .map(t => `${t.category}: ₹${t.amount} (${t.month})`).join("; ") || "none";

  const salaryTrend = signals.salaryCredits[signals.salaryCredits.length - 1] === 0
    ? "Last month salary credit = ₹0 (retirement signal)"
    : `₹${signals.salaryCredits.join(" → ")} over last 3 months`;

  const productList = PRODUCT_CATALOGUE
    .map(p => `- id: "${p.id}", name: "${p.name}"`)
    .join("\n");

  return `You are an AI banking assistant for State Bank of India (SBI).
Analyse the following customer signals — all sourced exclusively from SBI's own systems
(Core Banking System transaction history, YONO app activity). No external data.

CUSTOMER PROFILE:
- Name: ${signals.name}, Age: ${signals.age}, City: ${signals.city}
- Credit Score: ${signals.creditScore}
- Account Balance: ₹${signals.accountBalance.toLocaleString("en-IN")}
- Salary Credits (last 3 months): ${salaryTrend}
- Existing Products: ${signals.existingProducts.join(", ")}

TRANSACTION SIGNALS (from SBI CBS — all channels: UPI, card, ATM, NEFT):
- Travel/Airlines/Hotels spend: ${travelAmounts}
- Other notable spend: ${otherSpend}

YONO APP SEARCH HISTORY (in-app only, not browser history):
${signals.yonoSearchHistory.map((s, i) => `${i + 1}. "${s}"`).join("\n")}

AVAILABLE PRODUCTS TO RECOMMEND (pick 2-4 most relevant):
${productList}

Based ONLY on the signals above, predict the most likely life event this customer
is experiencing or about to experience.

IMPORTANT RULES:
1. Return ONLY valid JSON — no markdown, no code blocks, no extra text.
2. escalate must be true if loanAmount > 5000000 (₹50 lakh) per RBI guidelines.
3. confidence must be 0-100.
4. Pick 2-4 products from the list above using their exact id values.
5. reasoning must be 1-2 sentences citing specific signals from the data above.
6. reasoningHi must be the same reasoning translated to Hindi.

Return this exact JSON structure:
{
  "lifeEvent": "<English event name>",
  "lifeEventHi": "<Hindi event name>",
  "confidence": <number>,
  "reasoning": "<1-2 sentences citing specific signals>",
  "reasoningHi": "<same in Hindi>",
  "escalate": <boolean>,
  "loanAmount": <number or 0>,
  "products": [
    {
      "id": "<product id from list>",
      "name": "<product name>",
      "icon": "<icon name>",
      "color": "<hex color>",
      "description": "<one sentence why this product fits this specific customer>",
      "descriptionHi": "<same in Hindi>",
      "rate": "<rate or price>",
      "badge": "<1-2 word badge like Pre-Approved / Recommended / Required>",
      "badgeHi": "<badge in Hindi>"
    }
  ]
}`;
}

async function predictLifeEvent(signals) {
  const prompt = buildPrompt(signals);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json", // forces valid JSON output
      temperature: 0.3,                     // low temp = consistent, structured
    },
  });

  const text = response.text;

  // Parse and validate
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Fallback: strip any accidental markdown fences
    const clean = text.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(clean);
  }

  // Validate escalation rule (RBI: >₹50L requires RM review)
  if (parsed.loanAmount > 5000000) {
    parsed.escalate = true;
    parsed.escalationReason =
      `Loan amount ₹${(parsed.loanAmount / 100000).toFixed(0)}L exceeds ₹50L threshold. Requires Relationship Manager review per RBI Digital Lending Guidelines 2022.`;
    parsed.escalationReasonHi =
      `ऋण राशि ₹${(parsed.loanAmount / 100000).toFixed(0)}L, ₹50L की सीमा से अधिक। RBI डिजिटल ऋण दिशानिर्देश 2022 के अनुसार RM समीक्षा आवश्यक।`;
  }

  return parsed;
}

module.exports = { predictLifeEvent };
