import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Zap, Calculator, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
import ProductCard from "../components/ProductCard";
import WorkflowStepper from "../components/WorkflowStepper";
import EscalationBadge from "../components/EscalationBadge";

export default function JourneyPage() {
  const { selectedCustomer, t, activateProduct, getActivatedProducts, language } = useCustomer();
  const { prediction } = selectedCustomer;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [emiAmount, setEmiAmount] = useState("");
  const [emiTenure, setEmiTenure] = useState(60);

  const activated = getActivatedProducts(selectedCustomer.id);
  const products = prediction.products;

  const steps = [
    ...products.map((p) => ({
      id: p.id,
      labelEn: p.name.replace("SBI ", ""),
      labelHi: p.nameHi?.replace("SBI ", "") || p.name.replace("SBI ", ""),
    })),
    { id: "emi", labelEn: "EMI Calculator", labelHi: "EMI कैलकुलेटर" },
  ];

  const currentProduct = products[currentStep];
  const isEmiStep = currentStep === products.length;
  const allActivated = products.every((p) => activated[p.id]);

  const handleActivate = (productId) => {
    activateProduct(selectedCustomer.id, productId);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      navigate("/confirmation");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  // EMI calculation
  const calcEmi = () => {
    const principal = parseFloat(emiAmount) || 1500000;
    const rate = 0.0815 / 12;
    const n = emiTenure;
    const emi = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    return Math.round(emi).toLocaleString("en-IN");
  };

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            {t("Your Banking Journey", "आपकी बैंकिंग यात्रा")}
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>
            {t(
              "Activate each product in sequence. Everything is pre-approved — just review and confirm.",
              "प्रत्येक उत्पाद को क्रमशः सक्रिय करें। सब कुछ पूर्व-अनुमोदित है — बस समीक्षा करें और पुष्टि करें।"
            )}
          </p>
        </div>
        {allActivated && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/confirmation")}
            className="btn btn-success btn-lg"
          >
            <Zap size={16} />
            {t("Complete Journey", "यात्रा पूरी करें")}
          </motion.button>
        )}
      </motion.div>

      {/* Stepper */}
      <div style={{ marginTop: 28 }}>
        <WorkflowStepper
          steps={steps}
          currentStep={currentStep}
          onNext={handleNext}
        />
      </div>

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

      {/* Step Content */}
      <div style={{ marginTop: 32 }}>
        <AnimatePresence mode="wait">
          {!isEmiStep ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.stepContentHeader}>
                <h3 style={{ margin: 0 }}>
                  {t("Step", "चरण")} {currentStep + 1}:{" "}
                  {language === "hi" ? currentProduct?.nameHi : currentProduct?.name}
                </h3>
                {activated[currentProduct?.id] && (
                  <div style={styles.activatedChip}>
                    <Check size={12} />
                    {t("Activated", "सक्रिय")}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 20, maxWidth: 420 }}>
                <ProductCard
                  product={currentProduct}
                  activated={!!activated[currentProduct?.id]}
                  onActivate={handleActivate}
                />
              </div>

              {/* Pre-filled mock form */}
              {!activated[currentProduct?.id] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={styles.prefillBox}
                >
                  <div style={styles.prefillHeader}>
                    <Zap size={13} color="var(--color-primary-light)" />
                    {t("Pre-filled from your Digital Twin", "आपके डिजिटल ट्विन से पूर्व-भरा")}
                  </div>
                  <div style={styles.prefillGrid}>
                    {[
                      { key: t("Full Name", "पूरा नाम"), val: language === "hi" ? selectedCustomer.nameHi : selectedCustomer.name },
                      { key: t("Account No.", "खाता नंबर"), val: selectedCustomer.accountNumber },
                      { key: t("Credit Score", "क्रेडिट स्कोर"), val: selectedCustomer.creditScore },
                      { key: t("City", "शहर"), val: selectedCustomer.city },
                    ].map(({ key, val }) => (
                      <div key={key} style={styles.prefillRow}>
                        <span style={styles.prefillKey}>{key}</span>
                        <span style={styles.prefillVal}>{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* EMI Calculator Step */
            <motion.div
              key="emi"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ margin: "0 0 20px" }}>
                <Calculator size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
                {t("EMI Calculator", "EMI कैलकुलेटर")}
              </h3>
              <div style={styles.emiCard}>
                <div style={styles.emiInputs}>
                  <div style={styles.emiField}>
                    <label style={styles.emiLabel}>{t("Loan Amount (₹)", "ऋण राशि (₹)")}</label>
                    <input
                      type="number"
                      className="input"
                      value={emiAmount}
                      onChange={(e) => setEmiAmount(e.target.value)}
                      placeholder="1500000"
                    />
                  </div>
                  <div style={styles.emiField}>
                    <label style={styles.emiLabel}>
                      {t(`Tenure: ${emiTenure} months`, `कार्यकाल: ${emiTenure} महीने`)}
                    </label>
                    <input
                      type="range"
                      min={12}
                      max={120}
                      step={12}
                      value={emiTenure}
                      onChange={(e) => setEmiTenure(+e.target.value)}
                      style={{ width: "100%", accentColor: "var(--color-primary)" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      <span>12m</span><span>120m</span>
                    </div>
                  </div>
                </div>
                <div style={styles.emiResult}>
                  <div style={styles.emiResultLabel}>{t("Estimated Monthly EMI", "अनुमानित मासिक EMI")}</div>
                  <div style={styles.emiResultValue}>₹{calcEmi()}</div>
                  <div style={styles.emiResultSub}>
                    {t("at 8.15% p.a. interest rate", "8.15% प्रति वर्ष ब्याज दर पर")}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div style={styles.navButtons}>
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="btn btn-outline"
        >
          <ChevronLeft size={16} />
          {t("Previous", "पिछला")}
        </button>
        <button
          onClick={handleNext}
          className="btn btn-primary"
        >
          {currentStep < steps.length - 1
            ? t("Next Step", "अगला चरण")
            : t("Finish Journey →", "यात्रा समाप्त करें →")}
          {currentStep < steps.length - 1 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
  },
  stepContentHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  activatedChip: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 12px",
    background: "rgba(0, 214, 143, 0.12)",
    border: "1px solid rgba(0, 214, 143, 0.3)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "var(--color-success)",
  },
  prefillBox: {
    marginTop: 20,
    padding: "16px 20px",
    background: "rgba(26, 115, 232, 0.06)",
    border: "1px solid rgba(26, 115, 232, 0.2)",
    borderRadius: "var(--radius-lg)",
    maxWidth: 420,
  },
  prefillHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--color-primary-light)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 12,
  },
  prefillGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  prefillRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid var(--color-border)",
  },
  prefillKey: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  prefillVal: {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    fontFamily: "monospace",
  },
  navButtons: {
    display: "flex",
    gap: 12,
    marginTop: 32,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  emiCard: {
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
    padding: "28px",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
  },
  emiInputs: {
    flex: 1,
    minWidth: 220,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  emiField: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  emiLabel: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  emiResult: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
    minWidth: 180,
    padding: "24px",
    background: "rgba(26, 115, 232, 0.08)",
    border: "1px solid rgba(26, 115, 232, 0.2)",
    borderRadius: "var(--radius-lg)",
    textAlign: "center",
  },
  emiResultLabel: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  emiResultValue: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "2rem",
    background: "var(--gradient-primary)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  emiResultSub: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
};
