import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, UserCheck, Phone } from "lucide-react";
import { useCustomer } from "../context/CustomerContext";

export default function EscalationBadge({ loanAmount, reasonEn, reasonHi }) {
  const { t } = useCustomer();

  const formatAmount = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={styles.wrapper}
    >
      {/* Animated border glow */}
      <div style={styles.glowBorder} />

      <div style={styles.inner}>
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
          transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
          style={styles.iconWrap}
        >
          <AlertTriangle size={22} color="var(--color-warning)" />
        </motion.div>

        {/* Text */}
        <div style={styles.textBlock}>
          <div style={styles.title}>
            {t("Human Escalation Required", "मानव समीक्षा आवश्यक")}
          </div>
          <div style={styles.subtitle}>
            {reasonEn
              ? t(reasonEn, reasonHi)
              : t(
                  `Loan amount ${formatAmount(loanAmount)} exceeds ₹50L threshold — escalated per RBI guidelines.`,
                  `ऋण राशि ${formatAmount(loanAmount)} ₹50L सीमा से अधिक है — RBI दिशानिर्देशों के अनुसार।`
                )}
          </div>
        </div>

        {/* Status chips */}
        <div style={styles.chips}>
          <div style={styles.chip}>
            <UserCheck size={12} color="var(--color-success)" />
            <span style={{ color: "var(--color-success)" }}>
              {t("RM Notified ✓", "RM सूचित ✓")}
            </span>
          </div>
          <div style={{ ...styles.chip, borderColor: "rgba(26,115,232,0.3)" }}>
            <Phone size={12} color="var(--color-primary-light)" />
            <span style={{ color: "var(--color-primary-light)" }}>
              {t("Response within 2 hrs", "2 घंटे में प्रतिक्रिया")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    background: "rgba(255, 179, 71, 0.06)",
    border: "1px solid rgba(255, 179, 71, 0.3)",
  },
  glowBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: "var(--radius-lg)",
    background:
      "linear-gradient(90deg, rgba(255,179,71,0.15) 0%, transparent 50%, rgba(255,78,106,0.1) 100%)",
    pointerEvents: "none",
  },
  inner: {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    padding: "20px 24px",
    flexWrap: "wrap",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: "var(--radius-md)",
    background: "rgba(255, 179, 71, 0.12)",
    border: "1px solid rgba(255, 179, 71, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 200,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "1rem",
    color: "var(--color-warning)",
  },
  subtitle: {
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    lineHeight: 1.55,
  },
  chips: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flexShrink: 0,
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    background: "rgba(0, 214, 143, 0.08)",
    border: "1px solid rgba(0, 214, 143, 0.25)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.72rem",
    fontWeight: 700,
  },
};
