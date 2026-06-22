import React from "react";
import { Shield, Phone } from "lucide-react";
import { useCustomer } from "../context/CustomerContext";

export default function Footer() {
  const { t } = useCustomer();
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        {/* Left: regulatory note */}
        <div style={styles.left}>
          <Shield size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span>
            © {year} State Bank of India.{" "}
            {t(
              "Regulated by the Reserve Bank of India. Investments subject to market risk.",
              "भारतीय रिज़र्व बैंक द्वारा विनियमित। निवेश बाजार जोखिम के अधीन।"
            )}
          </span>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Right: fraud hotline — always visible */}
        <a href="tel:1930" style={styles.fraudLine}>
          <Phone size={12} color="var(--color-danger)" />
          <span style={{ color: "var(--color-danger)", fontWeight: 800 }}>1930</span>
          <span>{t("Cyber Fraud Helpline", "साइबर धोखाधड़ी हेल्पलाइन")}</span>
        </a>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: 64,
    borderTop: "1px solid var(--color-border)",
    background: "rgba(4, 10, 20, 0.9)",
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "14px 32px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
    flex: 1,
    minWidth: 240,
  },
  divider: {
    width: 1,
    height: 16,
    background: "var(--color-border)",
    flexShrink: 0,
  },
  fraudLine: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    padding: "4px 10px",
    background: "rgba(255,78,106,0.07)",
    border: "1px solid rgba(255,78,106,0.2)",
    borderRadius: "var(--radius-full)",
    transition: "all 150ms",
    flexShrink: 0,
  },
};
