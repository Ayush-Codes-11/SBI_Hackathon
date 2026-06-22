import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  CreditCard,
  Shield,
  Landmark,
  Home,
  TrendingUp,
  Baby,
  Banknote,
  FileText,
  Heart,
  Calendar,
  PiggyBank,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useCustomer } from "../context/CustomerContext";

const ICON_MAP = {
  GraduationCap, CreditCard, Shield, Landmark, Home,
  TrendingUp, Baby, Banknote, FileText, Heart, Calendar, PiggyBank,
};

export default function ProductCard({ product, activated = false, onActivate, delay = 0 }) {
  const { t } = useCustomer();
  const Icon = ICON_MAP[product.icon] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      style={{
        ...styles.card,
        ...(activated ? styles.cardActivated : {}),
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          ...styles.accentLine,
          background: activated
            ? "var(--gradient-success)"
            : `linear-gradient(90deg, ${product.color}, transparent)`,
        }}
      />

      {/* Icon + badge row */}
      <div style={styles.iconRow}>
        <div
          style={{
            ...styles.iconWrap,
            background: activated
              ? "rgba(0, 214, 143, 0.15)"
              : `${product.color}22`,
            border: `1px solid ${activated ? "rgba(0,214,143,0.3)" : product.color + "44"}`,
          }}
        >
          {activated ? (
            <CheckCircle2 size={20} color="var(--color-success)" />
          ) : (
            <Icon size={20} color={product.color} />
          )}
        </div>
        <span
          style={{
            ...styles.badge,
            background: activated ? "rgba(0,214,143,0.15)" : `${product.color}22`,
            color: activated ? "var(--color-success)" : product.color,
            border: `1px solid ${activated ? "rgba(0,214,143,0.3)" : product.color + "44"}`,
          }}
        >
          {activated
            ? t("✓ Activated", "✓ सक्रिय")
            : t(product.badge, product.badgeHi)}
        </span>
      </div>

      {/* Product name */}
      <h4 style={styles.productName}>
        {t(product.name, product.nameHi)}
      </h4>

      {/* Description */}
      <p style={styles.description}>
        {t(product.description, product.descriptionHi)}
      </p>

      {/* Rate */}
      <div style={styles.rateRow}>
        <span style={styles.rateLabel}>{t("Rate / Cost", "दर / लागत")}</span>
        <span style={{ ...styles.rateValue, color: product.color }}>
          {product.rate}
        </span>
      </div>

      {/* CTA */}
      {onActivate && (
        <motion.button
          whileHover={!activated ? { scale: 1.03 } : {}}
          whileTap={!activated ? { scale: 0.97 } : {}}
          onClick={() => !activated && onActivate(product.id)}
          disabled={activated}
          style={{
            ...styles.activateBtn,
            background: activated
              ? "rgba(0,214,143,0.1)"
              : `linear-gradient(135deg, ${product.color}, ${product.color}cc)`,
            color: activated ? "var(--color-success)" : "#fff",
            cursor: activated ? "default" : "pointer",
            border: activated ? "1px solid rgba(0,214,143,0.25)" : "none",
          }}
        >
          {activated
            ? t("Activated ✓", "सक्रिय ✓")
            : t("Activate Now", "अभी सक्रिय करें")}
        </motion.button>
      )}
    </motion.div>
  );
}

const styles = {
  card: {
    position: "relative",
    overflow: "hidden",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "all var(--transition-normal)",
  },
  cardActivated: {
    background: "rgba(0, 214, 143, 0.05)",
    border: "1px solid rgba(0, 214, 143, 0.2)",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  iconRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: "var(--radius-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badge: {
    padding: "3px 10px",
    borderRadius: "var(--radius-full)",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  productName: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: 1.3,
    margin: 0,
    fontFamily: "var(--font-body)",
  },
  description: {
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    lineHeight: 1.55,
    margin: 0,
    flex: 1,
  },
  rateRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
  },
  rateLabel: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  rateValue: {
    fontSize: "0.88rem",
    fontWeight: 700,
  },
  activateBtn: {
    width: "100%",
    padding: "11px",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontSize: "0.88rem",
    transition: "all var(--transition-normal)",
    marginTop: 4,
  },
};
