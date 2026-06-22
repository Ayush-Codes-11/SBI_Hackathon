import React from "react";
import { motion } from "framer-motion";
import { Check, Calculator } from "lucide-react";
import { useCustomer } from "../context/CustomerContext";

export default function WorkflowStepper({ steps, currentStep, onNext }) {
  const { t } = useCustomer();
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div style={styles.wrapper}>
      {/* Progress bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressMeta}>
          <span style={styles.progressLabel}>
            {t("Journey Progress", "यात्रा प्रगति")}
          </span>
          <span style={styles.progressCount}>
            {currentStep} / {steps.length} {t("steps", "चरण")}
          </span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div style={styles.stepsRow}>
        {steps.map((step, idx) => {
          const done = idx < currentStep;
          const active = idx === currentStep;
          const future = idx > currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Connector line */}
              {idx > 0 && (
                <div
                  style={{
                    ...styles.connector,
                    background: done
                      ? "var(--gradient-primary)"
                      : "rgba(255,255,255,0.06)",
                  }}
                />
              )}

              <div style={styles.stepItem}>
                <motion.div
                  animate={
                    active
                      ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 2 } }
                      : {}
                  }
                  style={{
                    ...styles.stepCircle,
                    background: done
                      ? "var(--gradient-primary)"
                      : active
                      ? "rgba(26, 115, 232, 0.2)"
                      : "rgba(255,255,255,0.04)",
                    border: done
                      ? "none"
                      : active
                      ? "2px solid var(--color-primary)"
                      : "1px solid var(--color-border)",
                    boxShadow: active ? "var(--shadow-glow-blue)" : "none",
                  }}
                >
                  {done ? (
                    <Check size={14} color="#fff" strokeWidth={3} />
                  ) : (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        color: active ? "var(--color-primary-light)" : "var(--text-muted)",
                      }}
                    >
                      {idx + 1}
                    </span>
                  )}
                </motion.div>
                <span
                  style={{
                    ...styles.stepLabel,
                    color: done
                      ? "var(--color-success)"
                      : active
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {t(step.labelEn, step.labelHi)}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: "20px 24px",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
  },
  progressSection: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  progressCount: {
    fontSize: "0.82rem",
    color: "var(--color-primary-light)",
    fontWeight: 700,
  },
  stepsRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 0,
    overflowX: "auto",
    paddingBottom: 4,
  },
  connector: {
    height: 2,
    flex: 1,
    marginTop: 16,
    minWidth: 20,
    transition: "background 0.4s",
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
  },
  stepLabel: {
    fontSize: "0.68rem",
    textAlign: "center",
    maxWidth: 72,
    lineHeight: 1.3,
    transition: "color 0.3s",
  },
};
