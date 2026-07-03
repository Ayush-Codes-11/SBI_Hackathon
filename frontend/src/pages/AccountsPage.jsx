import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, TrendingUp, TrendingDown, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";

// Category → colour map (reuses YONO palette)
const CAT_COLORS = {
  Travel:      "#00C6FF",
  Airlines:    "#00C6FF",
  Hotels:      "#9B59B6",
  Education:   "#1A73E8",
  Shopping:    "#FFB347",
  Food:        "#00D68F",
  ATM:         "#FF4E6A",
  Transfer:    "#00D68F",
  Salary:      "#00D68F",
  default:     "#888",
};

function catColor(cat) {
  for (const key of Object.keys(CAT_COLORS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return CAT_COLORS[key];
  }
  return CAT_COLORS.default;
}

export default function AccountsPage() {
  const navigate  = useNavigate();
  const { selectedCustomer, language, t } = useCustomer();
  const { name, nameHi, accountNumber, balance, creditScore, salaryCredits, travelSpend, existingProducts } = selectedCustomer;

  // Build transaction list from the signals data CustomerContext already holds
  const transactions = [
    // Salary credits (last 3 months)
    ...(salaryCredits || []).map((amt, i) => ({
      id:       `sal-${i}`,
      category: "Salary Credit",
      amount:   +amt,
      month:    ["3 months ago", "2 months ago", "Last month"][i] || `Month ${i + 1}`,
      type:     "credit",
    })),
    // Travel debits
    ...(travelSpend || []).map((amt, i) => ({
      id:       `trv-${i}`,
      category: "Travel / Airlines / Hotels",
      amount:   +amt,
      month:    ["3 months ago", "2 months ago", "Last month"][i] || `Month ${i + 1}`,
      type:     "debit",
    })),
  ].sort((a, b) => {
    const order = ["Last month", "2 months ago", "3 months ago"];
    return order.indexOf(a.month) - order.indexOf(b.month);
  });

  const months3 = (salaryCredits || []).reduce((s, v) => s + v, 0);

  return (
    <div className="page-container" style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        style={styles.backBtn}
      >
        <ArrowLeft size={16} />
        {t("Back to Dashboard", "डैशबोर्ड पर वापस")}
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={styles.header}
      >
        <div style={styles.headerIcon}>
          <Landmark size={24} color="#1A73E8" />
        </div>
        <div>
          <h1 style={styles.title}>{t("My Accounts", "मेरे खाते")}</h1>
          <div style={styles.subtitle}>
            {language === "hi" ? nameHi : name} · {accountNumber}
          </div>
        </div>
      </motion.div>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={styles.balanceCard}
      >
        <div style={styles.balanceLabel}>{t("Available Balance", "उपलब्ध शेष")}</div>
        <div style={styles.balanceAmount}>
          ₹{Number(balance).toLocaleString("en-IN")}
        </div>
        <div style={styles.balanceMeta}>
          <span>CIBIL: <strong style={{ color: creditScore >= 750 ? "#00D68F" : "#FFB347" }}>{creditScore}</strong></span>
          <span style={{ color: "var(--color-border)" }}>·</span>
          <span>{t("SBI Savings A/C", "SBI बचत खाता")}</span>
        </div>

        {/* Mini stat row */}
        <div style={styles.statRow}>
          <div style={styles.stat}>
            <TrendingUp size={14} color="#00D68F" />
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {t("3-month credits", "3 माह क्रेडिट")}
            </span>
            <strong style={{ color: "#00D68F", fontSize: "0.88rem" }}>
              ₹{months3.toLocaleString("en-IN")}
            </strong>
          </div>
          <div style={styles.stat}>
            <CreditCard size={14} color="#1A73E8" />
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {t("Products", "उत्पाद")}
            </span>
            <strong style={{ color: "#1A73E8", fontSize: "0.88rem" }}>
              {existingProducts.length}
            </strong>
          </div>
        </div>
      </motion.div>

      {/* Products held */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={styles.section}
      >
        <div style={styles.sectionTitle}>{t("Products Held", "वर्तमान उत्पाद")}</div>
        <div style={styles.tagRow}>
          {existingProducts.map((p) => (
            <span key={p} style={styles.tag}>{p}</span>
          ))}
        </div>
      </motion.div>

      {/* Transaction history */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={styles.section}
      >
        <div style={styles.sectionTitle}>{t("Recent Transactions", "हाल के लेनदेन")}</div>
        <div style={styles.txList}>
          {transactions.map((tx) => (
            <div key={tx.id} style={styles.txRow}>
              <div style={{ ...styles.txDot, background: catColor(tx.category) }} />
              <div style={styles.txInfo}>
                <span style={styles.txCat}>{tx.category}</span>
                <span style={styles.txMonth}>{tx.month}</span>
              </div>
              <div style={{
                ...styles.txAmount,
                color: tx.type === "credit" ? "#00D68F" : "#FF4E6A",
              }}>
                {tx.type === "credit" ? "+" : "−"}₹{Number(tx.amount).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
        <div style={styles.disclaimer}>
          {t(
            "Showing CBS transaction signals used by the AI engine. Full statement available in YONO app.",
            "AI इंजन द्वारा उपयोग किए गए CBS लेनदेन संकेत दिखाए जा रहे हैं। पूरा विवरण YONO ऐप में उपलब्ध है।"
          )}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
    padding: "8px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "rgba(26,115,232,0.12)",
    border: "1px solid rgba(26,115,232,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "var(--text-primary)",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    marginTop: 2,
    fontFamily: "monospace",
  },
  balanceCard: {
    padding: "24px 28px",
    background: "linear-gradient(135deg, rgba(26,115,232,0.15), rgba(0,198,255,0.08))",
    border: "1px solid rgba(26,115,232,0.25)",
    borderRadius: "var(--radius-xl, 16px)",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: "2.4rem",
    fontWeight: 800,
    color: "var(--text-primary)",
    fontFamily: "var(--font-display)",
    lineHeight: 1.1,
  },
  balanceMeta: {
    display: "flex",
    gap: 10,
    marginTop: 8,
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
  },
  statRow: {
    display: "flex",
    gap: 20,
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  section: {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px 24px",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
    marginBottom: 14,
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    padding: "4px 12px",
    background: "rgba(26,115,232,0.12)",
    border: "1px solid rgba(26,115,232,0.2)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.78rem",
    color: "var(--color-primary-light, #60a5fa)",
    fontWeight: 600,
  },
  txList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  txRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  txDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  txInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  txCat: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  txMonth: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
  },
  txAmount: {
    fontSize: "0.9rem",
    fontWeight: 700,
    flexShrink: 0,
  },
  disclaimer: {
    marginTop: 14,
    fontSize: "0.68rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
};
