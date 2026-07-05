import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, Sparkles, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
import ProductCard from "../components/ProductCard";
import EscalationBadge from "../components/EscalationBadge";

export default function LifeEventPage() {
  const { selectedCustomer, t, language } = useCustomer();
  const { prediction } = selectedCustomer;
  const navigate = useNavigate();
  const [reasonOpen, setReasonOpen] = useState(false);

  const confidence = prediction.confidence;
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (confidence / 100) * circumference;

  return (
    <div className="page-container">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.pageHeader}
      >
        <div style={styles.breadcrumb}>
          <Brain size={14} color="var(--color-primary-light)" />
          <span>{t("AI Analysis", "AI विश्लेषण")}</span>
          <ChevronRight size={12} color="var(--text-muted)" />
          <span style={{ color: "var(--text-primary)" }}>
            {t("Life Event Report", "जीवन घटना रिपोर्ट")}
          </span>
        </div>
        <h1 style={styles.pageTitle}>
          {t("Your Life Event Profile", "आपकी जीवन घटना प्रोफ़ाइल")}
        </h1>
        <p style={styles.pageSubtitle}>
          {t(
            "Based on real-time analysis of your financial signals, here is what SBI Saarthi has detected and recommends for you.",
            "आपके वित्तीय संकेतों के रीयल-टाइम विश्लेषण के आधार पर, यहां SBI Saarthi ने जो पता लगाया और अनुशंसित किया है।"
          )}
        </p>
      </motion.div>

      {/* Event Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={styles.eventHero}
      >
        {/* Large confidence ring */}
        <div style={styles.heroLeft}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="url(#heroGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - strokeDash }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
              />
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1A73E8" />
                  <stop offset="100%" stopColor="#00C6FF" />
                </linearGradient>
              </defs>
            </svg>
            <div style={styles.ringCenter}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={styles.ringValue}
              >
                {confidence}%
              </motion.span>
              <span style={styles.ringLabel}>{t("Match", "मिलान")}</span>
            </div>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.eventTag}>
            <Sparkles size={12} />
            {t("Predicted Life Event", "पूर्वानुमानित जीवन घटना")}
          </div>
          <h2 style={styles.eventTitle}>
            {language === "hi" ? prediction.lifeEventHi : prediction.lifeEvent}
          </h2>

          {/* Signal bars */}
          <div style={styles.signalBars}>
            {[
              { label: t("Search Signals", "सर्च संकेत"), value: 95 },
              { label: t("Spend Pattern", "खर्च पैटर्न"), value: 88 },
              { label: t("Salary Stability", "वेतन स्थिरता"), value: 92 },
            ].map(({ label, value }) => (
              <div key={label} style={styles.signalBar}>
                <div style={styles.signalBarMeta}>
                  <span style={styles.signalBarLabel}>{label}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-primary-light)", fontWeight: 700 }}>{value}%</span>
                </div>
                <div className="progress-track" style={{ height: 4 }}>
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{ height: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Reasoning */}
          <button onClick={() => setReasonOpen((o) => !o)} style={styles.reasonBtn}>
            <BarChart2 size={13} />
            {reasonOpen
              ? t("Hide AI Reasoning", "AI तर्क छुपाएं")
              : t("Show AI Reasoning", "AI तर्क देखें")}
          </button>
          {reasonOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={styles.reasonBox}
            >
              {t(prediction.reasoning, prediction.reasoningHi)}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Escalation */}
      {prediction.escalate && (
        <div style={{ marginTop: 24 }}>
          <EscalationBadge
            loanAmount={prediction.loanAmount}
            reasonEn={prediction.escalationReason}
            reasonHi={prediction.escalationReasonHi}
          />
        </div>
      )}

      {/* Product Bundle */}
      <div style={{ marginTop: 40 }}>
        <div style={styles.bundleHeader}>
          <div>
            <h2 style={{ margin: 0 }}>
              {t("Your Recommended Bundle", "आपका अनुशंसित बंडल")}
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>
              {t(
                "Pre-approved products tailored specifically for your life event.",
                "आपकी जीवन घटना के लिए विशेष रूप से तैयार पूर्व-अनुमोदित उत्पाद।"
              )}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/journey")}
            className="btn btn-primary"
            style={{ flexShrink: 0 }}
          >
            {t("Start My Journey", "मेरी यात्रा शुरू करें")}
            <ChevronRight size={16} />
          </motion.button>
        </div>

        <div className="grid-4" style={{ marginTop: 20 }}>
          {prediction.products.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={0.08 * i} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 8,
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  pageTitle: {
    margin: 0,
  },
  pageSubtitle: {
    margin: 0,
    maxWidth: 600,
    fontSize: "0.9rem",
  },
  eventHero: {
    display: "flex",
    gap: 32,
    flexWrap: "wrap",
    alignItems: "center",
    padding: "32px",
    background: "rgba(26, 115, 232, 0.06)",
    border: "1px solid rgba(26, 115, 232, 0.2)",
    borderRadius: "var(--radius-xl)",
    marginTop: 24,
    position: "relative",
    overflow: "hidden",
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  ringCenter: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  ringValue: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "1.5rem",
    color: "var(--text-primary)",
    lineHeight: 1,
  },
  ringLabel: {
    fontSize: "0.62rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: 2,
  },
  heroRight: {
    flex: 1,
    minWidth: 240,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  eventTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 12px",
    background: "rgba(26, 115, 232, 0.15)",
    border: "1px solid rgba(26, 115, 232, 0.3)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--color-primary-light)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },
  eventTitle: {
    margin: 0,
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
  },
  signalBars: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 4,
  },
  signalBar: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  signalBarMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signalBarLabel: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  reasonBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    padding: 0,
  },
  reasonBox: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "var(--radius-md)",
    fontSize: "0.83rem",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    borderLeft: "3px solid var(--color-primary)",
    overflow: "hidden",
  },
  bundleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },
};
