/**
 * emailjs.js — Human Escalation Layer
 *
 * When the AI flags escalate:true (loan > ₹50L), fires a real email to
 * a "Relationship Manager" inbox. Demonstrates RBI regulatory compliance
 * (Digital Lending Guidelines 2022) to the judges.
 *
 * Setup (free, no credit card):
 * 1. Sign up at emailjs.com with Google
 * 2. Add Service → Gmail → note SERVICE_ID
 * 3. Create Template with these variables: {{to_name}}, {{customer_name}},
 *    {{customer_id}}, {{life_event}}, {{loan_amount}}, {{confidence}},
 *    {{reasoning}} → note TEMPLATE_ID
 * 4. Go to Account → Public Key → note PUBLIC_KEY
 * 5. Add to frontend/.env:
 *    VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *    VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *    VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
 *    VITE_RM_EMAIL=your-rm-inbox@gmail.com
 */

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const RM_EMAIL    = import.meta.env.VITE_RM_EMAIL || "rm.sbi.lifeai@gmail.com";

/**
 * Send an escalation alert email to the Relationship Manager.
 * Returns true on success, false on failure (non-blocking for UX).
 *
 * @param {object} customer  — selected customer object
 * @param {object} prediction — Gemini prediction output
 */
export async function sendEscalationEmail(customer, prediction) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("[emailjs] EmailJS env vars not set — skipping real email, logging to console instead.");
    console.log("📧 [MOCK RM ESCALATION EMAIL]");
    console.log(`   To: Relationship Manager <${RM_EMAIL}>`);
    console.log(`   Customer: ${customer.name} (${customer.id})`);
    console.log(`   Life Event: ${prediction.lifeEvent}`);
    console.log(`   Loan Amount: ₹${(prediction.loanAmount / 100000).toFixed(0)}L`);
    console.log(`   Confidence: ${prediction.confidence}%`);
    console.log(`   Reason: ${prediction.reasoning}`);
    return false;
  }

  try {
    // Load EmailJS SDK dynamically (keeps bundle small — only fetched when needed)
    const emailjs = await import("@emailjs/browser");
    await emailjs.init(PUBLIC_KEY);

    const loanCrore = prediction.loanAmount >= 10000000
      ? `₹${(prediction.loanAmount / 10000000).toFixed(2)} Cr`
      : `₹${(prediction.loanAmount / 100000).toFixed(0)} L`;

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email:       RM_EMAIL,
      to_name:        "Relationship Manager",
      customer_name:  customer.name,
      customer_id:    customer.id,
      account_no:     customer.accountNumber,
      life_event:     prediction.lifeEvent,
      loan_amount:    loanCrore,
      confidence:     `${prediction.confidence}%`,
      reasoning:      prediction.reasoning,
      escalation_reason: prediction.escalationReason || "Loan amount exceeds ₹50L threshold.",
      timestamp:      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    console.log("[emailjs] ✅ Escalation email sent to RM inbox");
    return true;
  } catch (err) {
    console.error("[emailjs] ❌ Failed to send escalation email:", err.message);
    return false;
  }
}
