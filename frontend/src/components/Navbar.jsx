import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Globe, Bell, Zap, User,
  LayoutDashboard, Brain, GitBranch, CheckCircle2, Settings,
} from "lucide-react";
import { useCustomer } from "../context/CustomerContext";
import { MOCK_CUSTOMERS } from "../data/mockCustomers";
import SettingsPanel from "./SettingsPanel";

const NAV_LINKS = [
  { to: "/",             icon: LayoutDashboard, labelEn: "Dashboard",    labelHi: "डैशबोर्ड" },
  { to: "/life-event",   icon: Brain,           labelEn: "Life Events",  labelHi: "जीवन घटनाएं" },
  { to: "/journey",      icon: GitBranch,       labelEn: "My Journey",   labelHi: "मेरी यात्रा" },
  { to: "/confirmation", icon: CheckCircle2,    labelEn: "Confirmation", labelHi: "पुष्टि" },
];

export default function Navbar() {
  const { selectedCustomer, setSelectedCustomer, isLoadingCustomer, language, toggleLanguage, t } = useCustomer();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const dropRef  = useRef(null);

  const notifCount = selectedCustomer.prediction.escalate ? 1 : 0;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>

          {/* ── Logo ── */}
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <Zap size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <span style={styles.logoTextMain}>SBI</span>
              <span style={styles.logoTextSub}> LifeAI</span>
            </div>
          </Link>

          {/* ── Nav links ── */}
          <div style={styles.navLinks}>
            {NAV_LINKS.map(({ to, icon: Icon, labelEn, labelHi }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{ ...styles.navLink, ...(active ? styles.navLinkActive : {}) }}
                >
                  <Icon size={15} />
                  {t(labelEn, labelHi)}
                  {active && <motion.div layoutId="nav-pill" style={styles.activePill} />}
                </Link>
              );
            })}
          </div>

          {/* ── Right controls ── */}
          <div style={styles.controls}>

            {/* Language toggle */}
            <button onClick={toggleLanguage} style={styles.controlBtn} title="Toggle language">
              <Globe size={16} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                {language === "en" ? "EN" : "HI"}
              </span>
            </button>

            {/* Settings gear */}
            <button
              onClick={() => setSettingsOpen(true)}
              style={styles.controlBtn}
              title="Settings & Profile"
              aria-label="Open settings"
            >
              <Settings size={16} />
            </button>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen((o) => !o)} style={styles.controlBtn}>
                <Bell size={16} />
                {notifCount > 0 && <span style={styles.notifBadge}>{notifCount}</span>}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={styles.notifDropdown}
                  >
                    {notifCount > 0 ? (
                      <div style={styles.notifItem}>
                        <span style={{ color: "var(--color-danger)" }}>⚠️</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                            {t("RM Escalation Required", "RM समीक्षा आवश्यक")}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                            {selectedCustomer.name} — {t("High-value loan", "उच्च-मूल्य ऋण")}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {t("No new notifications", "कोई नई सूचना नहीं")}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Customer switcher */}
            <div style={{ position: "relative" }} ref={dropRef}>
              {!dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={styles.switcherHint}
                >
                  {t("↓ Try other profiles", "↓ प्रोफ़ाइल बदलें")}
                </motion.div>
              )}

              <motion.button
                onClick={() => setDropdownOpen((o) => !o)}
                style={{ ...styles.customerBtn, borderColor: dropdownOpen ? "rgba(26,115,232,0.4)" : undefined }}
                whileHover={{ borderColor: "rgba(26,115,232,0.35)" }}
              >
                {!dropdownOpen && (
                  <motion.div
                    animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                    style={styles.switcherPulseRing}
                  />
                )}
                <div
                  style={{
                    ...styles.avatar,
                    background: isLoadingCustomer ? "var(--color-surface-3)" : selectedCustomer.avatarColor,
                    transition: "background 0.3s",
                  }}
                >
                  {isLoadingCustomer ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                    />
                  ) : selectedCustomer.avatar}
                </div>
                <div style={styles.customerInfo}>
                  <span style={styles.customerName}>
                    {language === "hi" ? selectedCustomer.nameHi : selectedCustomer.name}
                  </span>
                  <span style={styles.customerAcc}>{selectedCustomer.accountNumber}</span>
                </div>
                <ChevronDown
                  size={14}
                  color="var(--text-secondary)"
                  style={{ transition: "transform 200ms", transform: dropdownOpen ? "rotate(180deg)" : "none" }}
                />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={styles.dropdown}
                  >
                    <div style={styles.dropdownHeader}>
                      <User size={12} />
                      {t("Switch Customer Profile", "ग्राहक प्रोफ़ाइल बदलें")}
                    </div>
                    {MOCK_CUSTOMERS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCustomer(c); setDropdownOpen(false); }}
                        style={{ ...styles.dropdownItem, ...(c.id === selectedCustomer.id ? styles.dropdownItemActive : {}) }}
                      >
                        <div style={{ ...styles.avatarSm, background: c.avatarColor }}>
                          {c.avatar}
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                            {language === "hi" ? c.nameHi : c.name}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {language === "hi" ? c.prediction.lifeEventHi : c.prediction.lifeEvent}{" "}
                            · {c.prediction.confidence}%
                          </div>
                        </div>
                        {c.prediction.escalate && (
                          <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--color-danger)" }}>
                            ⚠️ RM
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>{/* end controls */}
        </div>{/* end inner */}
      </nav>

      {/* YONO Settings side drawer */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "var(--navbar-height)",
    background: "rgba(6, 15, 30, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--color-border)",
    zIndex: 1000,
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    height: "100%",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    flexShrink: 0,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "var(--gradient-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "var(--shadow-glow-blue)",
  },
  logoTextMain: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "1.15rem",
    color: "var(--text-primary)",
  },
  logoTextSub: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "1.15rem",
    background: "var(--gradient-primary)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: "var(--radius-full)",
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all var(--transition-fast)",
    position: "relative",
    whiteSpace: "nowrap",
  },
  navLinkActive: {
    color: "var(--text-primary)",
    background: "rgba(26, 115, 232, 0.12)",
  },
  activePill: {
    position: "absolute",
    inset: 0,
    borderRadius: "var(--radius-full)",
    background: "rgba(26, 115, 232, 0.08)",
    border: "1px solid rgba(26, 115, 232, 0.2)",
    zIndex: -1,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
    flexShrink: 0,
  },
  controlBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "8px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    color: "var(--text-secondary)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    position: "relative",
  },
  notifBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--color-danger)",
    boxShadow: "0 0 6px var(--color-danger)",
  },
  notifDropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    minWidth: 260,
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    zIndex: 2000,
    overflow: "hidden",
  },
  notifItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "12px 16px",
  },
  customerBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 12px 6px 6px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    maxWidth: 220,
    position: "relative",
  },
  switcherPulseRing: {
    position: "absolute",
    inset: -3,
    borderRadius: "var(--radius-full)",
    border: "2px solid rgba(26, 115, 232, 0.5)",
    pointerEvents: "none",
  },
  switcherHint: {
    position: "absolute",
    top: -22,
    right: 0,
    fontSize: "0.62rem",
    color: "var(--color-primary-light)",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    pointerEvents: "none",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "#fff",
    flexShrink: 0,
  },
  avatarSm: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.65rem",
    fontWeight: 800,
    color: "#fff",
    flexShrink: 0,
  },
  customerInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  customerName: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 120,
  },
  customerAcc: {
    fontSize: "0.68rem",
    color: "var(--text-muted)",
    fontFamily: "monospace",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 280,
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    zIndex: 2000,
    overflow: "hidden",
    padding: "6px",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 10px",
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px",
    borderRadius: "var(--radius-md)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "background var(--transition-fast)",
    color: "var(--text-primary)",
  },
  dropdownItemActive: {
    background: "rgba(26, 115, 232, 0.12)",
  },
};
