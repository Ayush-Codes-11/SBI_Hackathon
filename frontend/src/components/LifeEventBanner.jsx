import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, TrendingUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";

export default function LifeEventBanner() {
  const { selectedCustomer, t } = useCustomer();
  const { prediction } = selectedCustomer;
  const navigate = useNavigate();
  const [reasonOpen, setReasonOpen] = useState(false);

  const confidence = prediction.confidence;
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (confidence / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={styles.banner}
    >
      {/* Pulsing glow behind */}
      <div style={styles.glowOrb} />

      <div style={styles.content}>
        {/* Left: AI chip label */}
        <div style={styles.topRow}>
          <div style={styles.aiChip}>
            <Brain size={12} />
            {t("AI Life Event Detected", "AI जीवन घटना का पता लगाया")}
          </div>
          {prediction.escalate && (
            <div style={styles.escalateChip}>
              ⚠️ {t("RM Review Required", "RM समीक्षा आवश्यक")}
            </div>
          )}
        </div>

        {/* Main content row */}
        <div style={styles.mainRow}>
          {/* Confidence ring */}
          <div className="confidence-ring" style={{ flexShrink: 0 }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              {/* Track */}
              <circle
                cx="44" cy="44" r="36"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="6"
              />
              {/* Fill */}
              <motion.circle
                cx="44" cy="44" r="36"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - strokeDash }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1A73E8" />
                  <stop offset="100%" stopColor="#00C6FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="value">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {confidence}%
              </motion.span>
              <span className="label">{t("Confidence", "विश्वास")}</span>
            </div>
          </div>

          {/* Event info */}
          <div style={styles.eventInfo}>
            <div style={styles.eventLabel}>
              {t("Predicted Life Event", "पूर्वानुमानित जीवन घटना")}
            </div>
            <h2 style={styles.eventTitle}>
              {t(prediction.lifeEvent, prediction.lifeEventHi)}
            </h2>
            <div style={styles.signalsRow}>
              <TrendingUp size={12} color="var(--color-success)" />
              <span style={styles.signalsText}>
                {t(
                  `${prediction.products.length} products recommended · Updated just now`,
                  `${prediction.products.length} उत्पाद अनुशंसित · अभी अपडेट किया`
                )}
              </span>
            </div>

            {/* Reasoning toggle */}
            <button
              onClick={() => setReasonOpen((o) => !o)}
              style={styles.reasonToggle}
            >
              <ChevronDown
                size={13}
                style={{
                  transition: "transform 200ms",
                  transform: reasonOpen ? "rotate(180deg)" : "none",
                }}
              />
              {t("Why did AI detect this?", "AI ने इसे क्यों पहचाना?")}
            </button>

            {reasonOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={styles.reasoning}
              >
                {t(prediction.reasoning, prediction.reasoningHi)}
              </motion.div>
            )}
          </div>

          {/* CTA */}
          <div style={styles.ctaArea}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/life-event")}
              className="btn btn-primary btn-lg"
            >
              {t("View My Bundle", "मेरा बंडल देखें")}
              <ChevronRight size={16} />
            </motion.button>
            <p style={styles.ctaHint}>
              {t("Pre-approved · 3-click activation", "पूर्व-अनुमोदित · 3-क्लिक सक्रियण")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  banner: {
    position: "relative",
    overflow: "hidden",
    background: "rgba(26, 115, 232, 0.07)",
    border: "1px solid rgba(26, 115, 232, 0.25)",
    borderRadius: "var(--radius-xl)",
    padding: "28px 32px",
  },
  glowOrb: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(26,115,232,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  aiChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 12px",
    background: "rgba(26, 115, 232, 0.2)",
    border: "1px solid rgba(26, 115, 232, 0.35)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--color-primary-light)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    animation: "pulse-ring 2.5s ease-in-out infinite",
  },
  escalateChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 12px",
    background: "rgba(255, 78, 106, 0.15)",
    border: "1px solid rgba(255, 78, 106, 0.3)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--color-danger)",
    letterSpacing: "0.04em",
  },
  mainRow: {
    display: "flex",
    alignItems: "center",
    gap: 28,
    flexWrap: "wrap",
  },
  eventInfo: {
    flex: 1,
    minWidth: 200,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  eventLabel: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontWeight: 600,
  },
  eventTitle: {
    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    color: "var(--text-primary)",
    margin: 0,
    lineHeight: 1.2,
  },
  signalsRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  signalsText: {
    fontSize: "0.78rem",
    color: "var(--color-success)",
    fontWeight: 500,
  },
  reasonToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: "0.78rem",
    cursor: "pointer",
    padding: 0,
    marginTop: 4,
    fontFamily: "var(--font-body)",
  },
  reasoning: {
    marginTop: 8,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "var(--radius-md)",
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    borderLeft: "3px solid var(--color-primary)",
  },
  ctaArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  ctaHint: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textAlign: "center",
    margin: 0,
  },
};
