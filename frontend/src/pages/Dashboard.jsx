import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Plane,
  GraduationCap,
  CreditCard,
  Shield,
  ArrowRight,
  Activity,
  Clock,
  MapPin,
  Wifi,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
import LifeEventBanner from "../components/LifeEventBanner";

// Maps each product tag to an icon + relevance check per life event
const TILE_DEFINITIONS = [
  {
    id: "loans",
    icon: GraduationCap,
    labelEn: "Loans",
    labelHi: "ऋण",
    color: "#1A73E8",
    to: "/journey",
    relevantFor: ["Higher Education Abroad", "First Home Purchase"],
    tagEn: "Top Pick",
    tagHi: "शीर्ष चयन",
  },
  {
    id: "forex",
    icon: CreditCard,
    labelEn: "Forex Card",
    labelHi: "फॉरेक्स कार्ड",
    color: "#00C6FF",
    to: "/journey",
    relevantFor: ["Higher Education Abroad", "NRI Returning to India"],
    tagEn: "Recommended",
    tagHi: "अनुशंसित",
  },
  {
    id: "insure",
    icon: Shield,
    labelEn: "Insurance",
    labelHi: "बीमा",
    color: "#00D68F",
    to: "/life-event",
    relevantFor: [
      "Higher Education Abroad",
      "First Home Purchase",
      "Starting a Family",
      "Retirement Planning",
    ],
    tagEn: "Recommended",
    tagHi: "अनुशंसित",
  },
  {
    id: "invest",
    icon: TrendingUp,
    labelEn: "Invest / SIP",
    labelHi: "निवेश / SIP",
    color: "#FFB347",
    to: "/life-event",
    relevantFor: ["Starting a Family", "Retirement Planning", "NRI Returning to India"],
    tagEn: "Explore",
    tagHi: "देखें",
  },
];

// Mini sparkline component for the travel spend signal
function Sparkline({ values, color = "#FFB347" }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 64;
  const h = 28;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const lastX = parseFloat(pts[pts.length - 1].split(",")[0]);
  const lastY = parseFloat(pts[pts.length - 1].split(",")[1]);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Highlight endpoint */}
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
      {/* Glow dot */}
      <circle cx={lastX} cy={lastY} r="6" fill={color} opacity="0.15" />
    </svg>
  );
}

export default function Dashboard() {
  const { selectedCustomer, t, language, isLoadingCustomer } = useCustomer();
  const navigate = useNavigate();

  const { prediction, creditScore, salaryCredits, balance, city, travelSpend, searchHistory } =
    selectedCustomer;

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const avgSalary = Math.round(
    salaryCredits.filter(Boolean).reduce((a, b) => a + b, 0) /
      (salaryCredits.filter(Boolean).length || 1)
  );

  const travelGrowthPct = travelSpend.length >= 2
    ? Math.round(((travelSpend[travelSpend.length - 1] - travelSpend[0]) / travelSpend[0]) * 100)
    : 0;

  const relevantEvent = prediction.lifeEvent;
  const tiles = TILE_DEFINITIONS.map((tile) => ({
    ...tile,
    isRelevant: tile.relevantFor.includes(relevantEvent),
  }));

  // Signal recency: last item is most recent
  const signalWeights = [0.4, 0.6, 0.75, 1.0]; // opacity per position
  const recentSearches = [...searchHistory].reverse();

  return (
    <div className="page-container" style={{ position: "relative" }}>

      {/* ── Loading overlay when switching customer ── */}
      <AnimatePresence>
        {isLoadingCustomer && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={styles.loadingOverlay}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            >
              <Loader2 size={32} color="var(--color-primary-light)" />
            </motion.div>
            <span style={styles.loadingText}>
              {t("Re-running AI analysis…", "AI विश्लेषण चल रहा है…")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HERO: Life Event Banner (first thing on page) ── */}
      <motion.div
        key={selectedCustomer.id + "-banner"}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LifeEventBanner />
      </motion.div>

      {/* ── 2. Stat strip (compact, below the hero) ── */}
      <motion.div
        key={selectedCustomer.id + "-stats"}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={styles.statStrip}
      >
        {[
          {
            label: t("Balance", "शेष"),
            value: formatCurrency(balance),
            color: "var(--color-success)",
          },
          {
            label: t("Credit Score", "क्रेडिट स्कोर"),
            value: `${creditScore} · ${t(creditScore >= 750 ? "Excellent" : "Good", creditScore >= 750 ? "उत्कृष्ट" : "अच्छा")}`,
            color: "var(--color-primary-light)",
          },
          {
            label: t("Avg. Salary", "औसत वेतन"),
            value: formatCurrency(avgSalary),
            color: "var(--color-warning)",
          },
          {
            label: t("City", "शहर"),
            value: city,
            color: "var(--text-secondary)",
          },
        ].map((s, i) => (
          <div key={s.label} style={styles.statPill}>
            <span style={styles.statPillLabel}>{s.label}</span>
            <span style={{ ...styles.statPillValue, color: s.color }}>{s.value}</span>
          </div>
        ))}
        <div style={styles.statPill}>
          <Wifi size={11} color="var(--color-success)" />
          <span style={{ fontSize: "0.72rem", color: "var(--color-success)", fontWeight: 700 }}>
            {t("Twin Live", "ट्विन लाइव")}
          </span>
        </div>
      </motion.div>

      {/* ── 3. Contextual Quick Access ── */}
      <motion.div
        key={selectedCustomer.id + "-tiles"}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        style={{ marginTop: 28 }}
      >
        <div style={styles.sectionHeaderRow}>
          <h3 style={styles.sectionTitle}>
            {t("Relevant for Your Journey", "आपकी यात्रा के लिए प्रासंगिक")}
          </h3>
          <span style={styles.sectionHint}>
            {t(
              `Personalised for: ${prediction.lifeEvent}`,
              `के लिए: ${prediction.lifeEventHi}`
            )}
          </span>
        </div>

        <div style={styles.tilesRow}>
          {tiles.map(({ id, icon: Icon, labelEn, labelHi, color, to, isRelevant, tagEn, tagHi }, i) => (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isRelevant ? 1 : 0.35, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.35 }}
              whileHover={isRelevant ? { y: -3, scale: 1.03 } : {}}
              whileTap={isRelevant ? { scale: 0.97 } : {}}
              onClick={() => isRelevant && navigate(to)}
              style={{
                ...styles.tile,
                ...(isRelevant ? styles.tileActive : styles.tileDimmed),
                borderColor: isRelevant ? color + "55" : "var(--color-border)",
              }}
            >
              {/* Relevance highlight stripe */}
              {isRelevant && (
                <div style={{ ...styles.tileStripe, background: color }} />
              )}
              <div
                style={{
                  ...styles.tileIcon,
                  background: isRelevant ? color + "22" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isRelevant ? color + "44" : "var(--color-border)"}`,
                }}
              >
                <Icon size={20} color={isRelevant ? color : "var(--text-muted)"} />
              </div>
              <div style={styles.tileMeta}>
                <span style={{
                  ...styles.tileLabel,
                  color: isRelevant ? "var(--text-primary)" : "var(--text-muted)",
                }}>
                  {t(labelEn, labelHi)}
                </span>
                {isRelevant ? (
                  <span style={{ ...styles.tileTag, background: color + "22", color, borderColor: color + "44" }}>
                    {t(tagEn, tagHi)}
                  </span>
                ) : (
                  <span style={styles.tileTagDimmed}>{t("Not relevant", "प्रासंगिक नहीं")}</span>
                )}
              </div>
              {isRelevant && <ArrowRight size={13} color={color} />}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── 4. Evidence-weighted Signal Feed ── */}
      <motion.div
        key={selectedCustomer.id + "-signals"}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{ marginTop: 32 }}
      >
        <div style={styles.sectionHeaderRow}>
          <h3 style={styles.sectionTitle}>
            <Activity size={15} color="var(--color-primary-light)" style={{ marginRight: 6 }} />
            {t("Evidence Accumulating", "प्रमाण जमा हो रहे हैं")}
          </h3>
          <span style={styles.sectionHint}>
            {t("Most recent · strongest weight", "सबसे हालिया · सबसे मजबूत")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>

          {/* Travel Spend — HERO SIGNAL (most weight, full treatment) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            style={styles.signalHero}
          >
            <div style={styles.signalHeroLeft}>
              <div style={styles.signalIconWrap}>
                <Plane size={16} color="var(--color-warning)" />
              </div>
              <div style={styles.signalTextBlock}>
                <div style={styles.signalStrength}>
                  <span style={styles.signalStrengthDot} />
                  {t("Strongest signal · Travel Spend", "सबसे मजबूत संकेत · यात्रा खर्च")}
                </div>
                <div style={styles.signalHeroTitle}>
                  ₹{travelSpend[travelSpend.length - 1].toLocaleString("en-IN")}
                  <span style={styles.signalGrowthBadge}>
                    +{travelGrowthPct}% {t("last 3 mo", "3 महीने में")}
                  </span>
                </div>
                <div style={styles.signalMeta}>
                  <Clock size={10} />
                  {t("Updated this month", "इस महीने अपडेट")}
                </div>
              </div>
            </div>
            <div style={styles.sparklineWrap}>
              <Sparkline values={travelSpend} color="var(--color-warning)" />
              <span style={styles.sparklineLabel}>{t("3-month trend", "3 महीने का ट्रेंड")}</span>
            </div>
          </motion.div>

          {/* Search History signals — fading opacity by recency */}
          {recentSearches.map((sig, i) => {
            const opacity = 0.42 + (((recentSearches.length - 1 - i) / (recentSearches.length - 1)) * 0.58);
            const isRecent = i === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
                style={{
                  ...styles.signalRow,
                  opacity,
                  borderColor: isRecent
                    ? "rgba(26, 115, 232, 0.3)"
                    : "rgba(26, 115, 232, 0.1)",
                  background: isRecent
                    ? "rgba(26, 115, 232, 0.07)"
                    : "rgba(26, 115, 232, 0.03)",
                }}
              >
                <div style={{
                  ...styles.signalRowDot,
                  background: isRecent ? "var(--color-primary)" : "var(--text-muted)",
                  boxShadow: isRecent ? "0 0 6px var(--color-primary)" : "none",
                }} />
                <Search size={12} color={isRecent ? "var(--color-primary-light)" : "var(--text-muted)"} />
                <span style={{ ...styles.signalRowText, fontWeight: isRecent ? 600 : 400 }}>
                  {sig}
                </span>
                <div style={styles.signalRowRight}>
                  {isRecent && (
                    <span style={styles.recentTag}>{t("Recent", "हालिया")}</span>
                  )}
                  <span style={{
                    ...styles.signalTypeBadge,
                    opacity: isRecent ? 1 : 0.6,
                  }}>
                    {t("Search", "खोज")}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Salary signal — stable, lower visual weight */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + recentSearches.length * 0.06, duration: 0.35 }}
            style={{ ...styles.signalRow, opacity: 0.55, background: "rgba(0,214,143,0.04)", borderColor: "rgba(0,214,143,0.12)" }}
          >
            <div style={{ ...styles.signalRowDot, background: "var(--color-success)" }} />
            <TrendingUp size={12} color="var(--color-success)" />
            <span style={styles.signalRowText}>
              {t(
                `Salary stable: ₹${avgSalary.toLocaleString("en-IN")}/mo (3-month average)`,
                `वेतन स्थिर: ₹${avgSalary.toLocaleString("en-IN")}/माह (3-महीने का औसत)`
              )}
            </span>
            <span style={{ ...styles.signalTypeBadge, background: "rgba(0,214,143,0.1)", color: "var(--color-success)", borderColor: "rgba(0,214,143,0.2)", opacity: 0.7 }}>
              {t("Income", "आय")}
            </span>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    background: "rgba(6, 15, 30, 0.82)",
    backdropFilter: "blur(8px)",
    borderRadius: "var(--radius-xl)",
    minHeight: 320,
  },
  loadingText: {
    fontSize: "0.88rem",
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  statStrip: {
    display: "flex",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
    alignItems: "center",
  },
  statPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    whiteSpace: "nowrap",
  },
  statPillLabel: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  statPillValue: {
    fontSize: "0.82rem",
    fontWeight: 700,
  },
  sectionHeaderRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 0,
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.95rem",
    fontWeight: 700,
    margin: 0,
    color: "var(--text-primary)",
  },
  sectionHint: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  tilesRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginTop: 12,
  },
  tile: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 14px",
    border: "1px solid",
    borderRadius: "var(--radius-lg)",
    fontFamily: "var(--font-body)",
    textAlign: "left",
    overflow: "hidden",
    transition: "all var(--transition-normal)",
  },
  tileActive: {
    background: "var(--color-surface)",
    cursor: "pointer",
  },
  tileDimmed: {
    background: "rgba(255,255,255,0.02)",
    cursor: "not-allowed",
    filter: "grayscale(0.4)",
  },
  tileStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 3,
    height: "100%",
    borderRadius: "3px 0 0 3px",
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: "var(--radius-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tileMeta: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    minWidth: 0,
  },
  tileLabel: {
    fontSize: "0.82rem",
    fontWeight: 700,
    lineHeight: 1.2,
  },
  tileTag: {
    display: "inline-block",
    fontSize: "0.62rem",
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: "var(--radius-full)",
    border: "1px solid",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    alignSelf: "flex-start",
    whiteSpace: "nowrap",
  },
  tileTagDimmed: {
    display: "inline-block",
    fontSize: "0.62rem",
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  // ── Hero signal (travel spend) ──
  signalHero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: "rgba(255, 179, 71, 0.07)",
    border: "1px solid rgba(255, 179, 71, 0.3)",
    borderRadius: "var(--radius-lg)",
    gap: 16,
    flexWrap: "wrap",
  },
  signalHeroLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  signalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: "var(--radius-sm)",
    background: "rgba(255,179,71,0.15)",
    border: "1px solid rgba(255,179,71,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  signalTextBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  signalStrength: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.68rem",
    fontWeight: 700,
    color: "var(--color-warning)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  signalStrengthDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--color-warning)",
    boxShadow: "0 0 6px var(--color-warning)",
    animation: "pulse-dot 1.5s ease-in-out infinite",
  },
  signalHeroTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "1.35rem",
    color: "var(--text-primary)",
    lineHeight: 1,
    flexWrap: "wrap",
  },
  signalGrowthBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "3px 10px",
    background: "rgba(255,179,71,0.15)",
    border: "1px solid rgba(255,179,71,0.35)",
    borderRadius: "var(--radius-full)",
    color: "var(--color-warning)",
    fontFamily: "var(--font-body)",
  },
  signalMeta: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: "0.7rem",
    color: "var(--text-muted)",
  },
  sparklineWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  sparklineLabel: {
    fontSize: "0.62rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  // ── Regular signal rows ──
  signalRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: "var(--radius-md)",
    border: "1px solid",
    transition: "opacity var(--transition-normal)",
    flexWrap: "wrap",
  },
  signalRowDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "all var(--transition-normal)",
  },
  signalRowText: {
    flex: 1,
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    minWidth: 140,
  },
  signalRowRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginLeft: "auto",
    flexShrink: 0,
  },
  recentTag: {
    fontSize: "0.62rem",
    fontWeight: 700,
    padding: "2px 7px",
    background: "rgba(26,115,232,0.15)",
    border: "1px solid rgba(26,115,232,0.3)",
    borderRadius: "var(--radius-full)",
    color: "var(--color-primary-light)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  signalTypeBadge: {
    fontSize: "0.62rem",
    fontWeight: 700,
    padding: "2px 7px",
    background: "rgba(26,115,232,0.08)",
    border: "1px solid rgba(26,115,232,0.15)",
    borderRadius: "var(--radius-full)",
    color: "var(--color-primary-light)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
};
