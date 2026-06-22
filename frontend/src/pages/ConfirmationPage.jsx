import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, RotateCcw, UserCheck, Share2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";

/* Confetti particle */
const CONFETTI_COLORS = ["#1A73E8", "#00C6FF", "#00D68F", "#FFB347", "#FF4E6A", "#9B59B6"];

function Confetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

export default function ConfirmationPage() {
  const { selectedCustomer, t, language, getActivatedProducts, resetJourney } = useCustomer();
  const { prediction } = selectedCustomer;
  const activated = getActivatedProducts(selectedCustomer.id);
  const navigate = useNavigate();
  const hasPlayed = useRef(false);

  const activatedProducts = prediction.products.filter((p) => activated[p.id]);
  const allDone = activatedProducts.length === prediction.products.length;

  useEffect(() => {
    if (!hasPlayed.current && "speechSynthesis" in window) {
      hasPlayed.current = true;
      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(
          language === "hi"
            ? "बधाई हो! आपकी बैंकिंग यात्रा सफलतापूर्वक पूर्ण हो गई है।"
            : "Congratulations! Your banking journey has been completed successfully."
        );
        utter.lang = language === "hi" ? "hi-IN" : "en-IN";
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      }, 800);
    }
  }, [language]);

  return (
    <div className="page-container" style={{ maxWidth: 760, margin: "0 auto" }}>
      <Confetti />

      {/* Success hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={styles.hero}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={styles.checkIcon}
        >
          <CheckCircle2 size={48} color="#00D68F" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={styles.heroTitle}
        >
          {t("Journey Complete! 🎉", "यात्रा पूर्ण! 🎉")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={styles.heroSub}
        >
          {t(
            `Everything has been set up for your ${prediction.lifeEvent} journey. Welcome to a new chapter.`,
            `आपकी ${prediction.lifeEventHi} यात्रा के लिए सब कुछ तैयार हो गया है। एक नए अध्याय में आपका स्वागत है।`
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={styles.statsRow}
        >
          {[
            {
              value: activatedProducts.length || prediction.products.length,
              label: t("Products Activated", "उत्पाद सक्रिय"),
              color: "var(--color-success)",
            },
            {
              value: "3",
              label: t("Clicks Used", "क्लिक उपयोग"),
              color: "var(--color-primary-light)",
            },
            {
              value: "<1 min",
              label: t("Time Taken", "लिया गया समय"),
              color: "var(--color-warning)",
            },
          ].map((s) => (
            <div key={s.label} style={styles.statItem}>
              <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
              <div style={styles.statLbl}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Activated products list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={styles.productList}
      >
        <h3 style={styles.sectionTitle}>{t("Activated Products", "सक्रिय उत्पाद")}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {prediction.products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              style={styles.productRow}
            >
              <div
                style={{
                  ...styles.productDot,
                  background: activated[p.id] ? "var(--color-success)" : "var(--color-border)",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={styles.productName}>{language === "hi" ? p.nameHi : p.name}</div>
                <div style={styles.productRate}>{p.rate}</div>
              </div>
              {activated[p.id] ? (
                <CheckCircle2 size={18} color="var(--color-success)" />
              ) : (
                <span style={styles.pendingTag}>{t("Pending", "लंबित")}</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Escalation note */}
      {prediction.escalate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={styles.escalationNote}
        >
          <UserCheck size={18} color="var(--color-warning)" />
          <div>
            <div style={styles.escalationTitle}>
              {t("Relationship Manager Notified ✅", "संबंध प्रबंधक सूचित ✅")}
            </div>
            <div style={styles.escalationSub}>
              {t(
                "Your RM will contact you within 2 business hours to finalise the high-value loan details.",
                "आपका RM उच्च-मूल्य ऋण विवरण को अंतिम रूप देने के लिए 2 व्यावसायिक घंटों के भीतर आपसे संपर्क करेगा।"
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={styles.actions}
      >
        <button
          onClick={() => {
            resetJourney(selectedCustomer.id);
            navigate("/");
          }}
          className="btn btn-outline"
        >
          <RotateCcw size={15} />
          {t("Start Over", "फिर से शुरू करें")}
        </button>
        <button className="btn btn-ghost">
          <Share2 size={15} />
          {t("Share Summary", "सारांश शेयर करें")}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            alert(t("Summary downloaded! (Simulated)", "सारांश डाउनलोड हो गया! (सिमुलेटेड)"));
          }}
        >
          <Download size={15} />
          {t("Download Summary", "सारांश डाउनलोड करें")}
        </button>
      </motion.div>

      {/* Explore more */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={styles.exploreMore}
      >
        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
          {t("Explore more services", "अधिक सेवाएं देखें")}
        </span>
        <Link to="/life-event" style={styles.exploreLink}>
          {t("View Full Bundle", "पूरा बंडल देखें")}
          <ArrowRight size={13} />
        </Link>
      </motion.div>
    </div>
  );
}

const styles = {
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "40px 32px",
    background: "rgba(0, 214, 143, 0.05)",
    border: "1px solid rgba(0, 214, 143, 0.2)",
    borderRadius: "var(--radius-xl)",
    textAlign: "center",
  },
  checkIcon: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "rgba(0, 214, 143, 0.12)",
    border: "2px solid rgba(0, 214, 143, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 32px rgba(0,214,143,0.3)",
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
  },
  heroSub: {
    margin: 0,
    maxWidth: 480,
    fontSize: "0.92rem",
    lineHeight: 1.65,
  },
  statsRow: {
    display: "flex",
    gap: 32,
    marginTop: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statVal: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "1.75rem",
    lineHeight: 1,
  },
  statLbl: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  productList: {
    marginTop: 28,
    padding: "24px",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
  },
  productRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border)",
  },
  productDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "background 0.3s",
  },
  productName: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  productRate: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    marginTop: 2,
  },
  pendingTag: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    padding: "2px 8px",
    fontWeight: 600,
  },
  escalationNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 20,
    padding: "16px 20px",
    background: "rgba(255, 179, 71, 0.07)",
    border: "1px solid rgba(255, 179, 71, 0.25)",
    borderRadius: "var(--radius-lg)",
  },
  escalationTitle: {
    fontWeight: 700,
    fontSize: "0.92rem",
    color: "var(--color-warning)",
  },
  escalationSub: {
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    marginTop: 4,
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 28,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  exploreMore: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    paddingBottom: 40,
  },
  exploreLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--color-primary-light)",
    textDecoration: "none",
  },
};
