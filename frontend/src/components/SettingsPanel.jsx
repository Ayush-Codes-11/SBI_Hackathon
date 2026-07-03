/**
 * SettingsPanel.jsx — YONO-style slide-in settings drawer
 *
 * Navigation wiring:
 *  My Accounts       → /accounts  (real page)
 *  Access Services   → /life-event (existing journey page)
 *  Logout            → clears customer, navigates to /
 *
 * Stub inline panels (no new routes needed):
 *  Manage Profile    → read-only profile card
 *  Settings          → notification + language toggles
 *  Update My Security → greyed-out fields + note
 *  Get Support       → call / chat / ticket buttons
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X, Landmark, UserCog, LayoutGrid, Settings, ShieldCheck,
  HeadphonesIcon, LogOut, ChevronRight, ChevronLeft, Wifi, Moon,
  User, MapPin, Star, Phone, MessageCircle, Ticket,
  BellRing, Languages, Lock, KeyRound, AlertOctagon,
} from "lucide-react";
import { useCustomer } from "../context/CustomerContext";

// ─── Menu definition ───────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id:      "accounts",
    icon:    Landmark,
    labelEn: "My Accounts",
    labelHi: "मेरे खाते",
    descEn:  "View balances & statements",
    descHi:  "शेष राशि और विवरण देखें",
    accent:  "#1A73E8",
    action:  "navigate",
    to:      "/accounts",
  },
  {
    id:      "profile",
    icon:    UserCog,
    labelEn: "Manage Profile",
    labelHi: "प्रोफ़ाइल प्रबंधित करें",
    descEn:  "Personal & nominee details",
    descHi:  "व्यक्तिगत और नॉमिनी विवरण",
    accent:  "#00C6FF",
    action:  "panel",
    panel:   "profile",
  },
  {
    id:      "services",
    icon:    LayoutGrid,
    labelEn: "Access Services",
    labelHi: "सेवाएं एक्सेस करें",
    descEn:  "Loans, cards & more",
    descHi:  "ऋण, कार्ड और अधिक",
    accent:  "#00D68F",
    action:  "navigate",
    to:      "/life-event",
  },
  {
    id:      "settings",
    icon:    Settings,
    labelEn: "Settings",
    labelHi: "सेटिंग्स",
    descEn:  "Preferences & notifications",
    descHi:  "प्राथमिकताएं और सूचनाएं",
    accent:  "#FFB347",
    action:  "panel",
    panel:   "settings",
  },
  {
    id:      "security",
    icon:    ShieldCheck,
    labelEn: "Update My Security",
    labelHi: "सुरक्षा अपडेट करें",
    descEn:  "MPIN, password & limits",
    descHi:  "MPIN, पासवर्ड और सीमाएं",
    accent:  "#9B59B6",
    action:  "panel",
    panel:   "security",
  },
  {
    id:      "support",
    icon:    HeadphonesIcon,
    labelEn: "Get Support",
    labelHi: "सहायता प्राप्त करें",
    descEn:  "Chat, call or raise a ticket",
    descHi:  "चैट, कॉल या टिकट करें",
    accent:  "#FF4E6A",
    action:  "panel",
    panel:   "support",
  },
];

// ─── Helper ─────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ─── Stub panel: Manage Profile ─────────────────────────────────────────────
function ProfilePanel({ customer, t, language }) {
  const { name, nameHi, age, city, creditScore, existingProducts } = customer;
  const rows = [
    { label: t("Name", "नाम"),          value: language === "hi" ? nameHi : name },
    { label: t("Age", "आयु"),           value: `${age} ${t("years", "वर्ष")}` },
    { label: t("City", "शहर"),          value: city },
    { label: t("Credit Score", "क्रेडिट स्कोर"), value: creditScore, highlight: creditScore >= 750 ? "#00D68F" : "#FFB347" },
    { label: t("Products", "उत्पाद"),   value: existingProducts.join(", ") },
  ];
  return (
    <div style={panel.wrap}>
      <div style={panel.title}>{t("Profile Details", "प्रोफ़ाइल विवरण")}</div>
      <div style={panel.card}>
        {rows.map(({ label, value, highlight }) => (
          <div key={label} style={panel.row}>
            <span style={panel.rowLabel}>{label}</span>
            <span style={{ ...panel.rowValue, color: highlight || "var(--text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={panel.note}>
        {t("This is a read-only view. Visit your home branch to update details.", "यह केवल-पठन दृश्य है। विवरण अपडेट करने के लिए अपनी गृह शाखा जाएं।")}
      </div>
    </div>
  );
}

// ─── Stub panel: Settings ────────────────────────────────────────────────────
function SettingsStubPanel({ t }) {
  const [notif, setNotif]   = useState(true);
  const [hindi, setHindi]   = useState(false);
  const [saved, setSaved]   = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={panel.wrap}>
      <div style={panel.title}>{t("Preferences", "प्राथमिकताएं")}</div>
      <div style={panel.card}>
        {/* Notifications toggle */}
        <div style={panel.row}>
          <div style={panel.rowLeft}>
            <BellRing size={15} color="#FFB347" />
            <span style={panel.rowLabel}>{t("Notifications", "सूचनाएं")}</span>
          </div>
          <button
            onClick={() => setNotif((v) => !v)}
            style={{ ...panel.toggle, background: notif ? "#1A73E8" : "rgba(255,255,255,0.1)" }}
            aria-label="Toggle notifications"
          >
            <div style={{ ...panel.toggleThumb, transform: notif ? "translateX(18px)" : "translateX(2px)" }} />
          </button>
        </div>
        {/* Hindi language toggle */}
        <div style={panel.row}>
          <div style={panel.rowLeft}>
            <Languages size={15} color="#00C6FF" />
            <span style={panel.rowLabel}>{t("Hindi Language", "हिंदी भाषा")}</span>
          </div>
          <button
            onClick={() => setHindi((v) => !v)}
            style={{ ...panel.toggle, background: hindi ? "#1A73E8" : "rgba(255,255,255,0.1)" }}
            aria-label="Toggle Hindi"
          >
            <div style={{ ...panel.toggleThumb, transform: hindi ? "translateX(18px)" : "translateX(2px)" }} />
          </button>
        </div>
      </div>
      <button onClick={save} style={panel.primaryBtn}>
        {saved ? `✓ ${t("Saved", "सेव हो गया")}` : t("Save preferences", "प्राथमिकताएं सेव करें")}
      </button>
    </div>
  );
}

// ─── Stub panel: Update My Security ─────────────────────────────────────────
function SecurityPanel({ t }) {
  const fields = [
    { icon: KeyRound, label: t("Change MPIN", "MPIN बदलें") },
    { icon: Lock,     label: t("Change Password", "पासवर्ड बदलें") },
    { icon: AlertOctagon, label: t("Transaction Limits", "लेनदेन सीमाएं") },
  ];
  return (
    <div style={panel.wrap}>
      <div style={panel.title}>{t("Security Settings", "सुरक्षा सेटिंग्स")}</div>
      <div style={panel.card}>
        {fields.map(({ icon: Icon, label }) => (
          <div key={label} style={{ ...panel.row, opacity: 0.4, cursor: "not-allowed" }}>
            <div style={panel.rowLeft}>
              <Icon size={15} color="#9B59B6" />
              <span style={panel.rowLabel}>{label}</span>
            </div>
            <Lock size={13} color="var(--text-muted)" />
          </div>
        ))}
      </div>
      <div style={panel.infoBox}>
        🏦 {t(
          "Security settings are managed through your home branch.",
          "सुरक्षा सेटिंग्स आपकी गृह शाखा के माध्यम से प्रबंधित की जाती हैं।"
        )}
      </div>
    </div>
  );
}

// ─── Stub panel: Get Support ─────────────────────────────────────────────────
function SupportPanel({ t }) {
  const options = [
    { icon: Phone,         label: t("Call 1800-11-2211", "1800-11-2211 पर कॉल करें"),  color: "#00D68F" },
    { icon: MessageCircle, label: t("Chat with us", "हमसे चैट करें"),                  color: "#00C6FF" },
    { icon: Ticket,        label: t("Raise a ticket", "टिकट दर्ज करें"),               color: "#FFB347" },
  ];
  return (
    <div style={panel.wrap}>
      <div style={panel.title}>{t("Customer Support", "ग्राहक सेवा")}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            style={{ ...panel.supportBtn, borderColor: `rgba(${hexToRgb(color)}, 0.3)` }}
          >
            <div style={{ ...panel.supportIcon, background: `rgba(${hexToRgb(color)}, 0.12)` }}>
              <Icon size={16} color={color} />
            </div>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {label}
            </span>
          </button>
        ))}
      </div>
      <div style={panel.note}>{t("Available 24×7 · SBI Official Channels", "24×7 उपलब्ध · SBI आधिकारिक चैनल")}</div>
    </div>
  );
}

// ─── Panel container with back button ───────────────────────────────────────
function SubPanel({ id, customer, t, language, onBack }) {
  const Panel =
    id === "profile"  ? <ProfilePanel customer={customer} t={t} language={language} /> :
    id === "settings" ? <SettingsStubPanel t={t} /> :
    id === "security" ? <SecurityPanel t={t} /> :
    id === "support"  ? <SupportPanel t={t} /> :
    null;

  return (
    <motion.div
      key={id}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 360, damping: 32 }}
      style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Sub-panel back button */}
      <button onClick={onBack} style={styles.subBack}>
        <ChevronLeft size={16} />
        {t("Back", "वापस")}
      </button>
      <div style={{ overflowY: "auto", flex: 1, padding: "0 12px 24px" }}>
        {Panel}
      </div>
    </motion.div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
export default function SettingsPanel({ isOpen, onClose }) {
  const { selectedCustomer, setSelectedCustomer, language, t } = useCustomer();
  const navigate  = useNavigate();
  const [activePanel, setActivePanel] = useState(null); // panel id or null

  const handleClose = () => {
    setActivePanel(null);
    onClose();
  };

  const handleItem = (item) => {
    if (item.action === "navigate") {
      handleClose();
      navigate(item.to);
    } else {
      setActivePanel(item.panel);
    }
  };

  const handleLogout = () => {
    handleClose();
    // Reset to first customer (index 0) simulates "logout to home"
    // We navigate to / and CustomerContext shows the switcher prompt
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={styles.backdrop}
          />

          {/* Drawer */}
          <motion.div
            key="settings-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={styles.drawer}
          >
            {/* ── Header (always visible) ── */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div
                  style={{
                    ...styles.avatar,
                    background: selectedCustomer.avatarColor || "var(--gradient-primary)",
                  }}
                >
                  {selectedCustomer.avatar}
                </div>
                <div>
                  <div style={styles.userName}>
                    {language === "hi" ? selectedCustomer.nameHi : selectedCustomer.name}
                  </div>
                  <div style={styles.userAcc}>
                    {t("A/C", "खाता")} {selectedCustomer.accountNumber}
                  </div>
                </div>
              </div>
              <button onClick={handleClose} style={styles.closeBtn} aria-label="Close settings">
                <X size={18} />
              </button>
            </div>

            {/* ── Status chips ── */}
            <div style={styles.chips}>
              <div style={styles.chip}>
                <Wifi size={11} style={{ color: "#00D68F" }} />
                <span>{t("Online Banking", "ऑनलाइन बैंकिंग")}</span>
              </div>
              <div style={styles.chip}>
                <Moon size={11} style={{ color: "#9B59B6" }} />
                <span>{t("Dark Mode", "डार्क मोड")}</span>
              </div>
            </div>

            <div style={styles.divider} />

            {/* ── Content area: menu list OR sub-panel ── */}
            <AnimatePresence mode="wait">
              {!activePanel ? (
                /* Main menu list */
                <motion.div
                  key="menu"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
                >
                  <nav style={styles.menu}>
                    {MENU_ITEMS.map(({ id, icon: Icon, labelEn, labelHi, descEn, descHi, accent, ...rest }) => (
                      <motion.button
                        key={id}
                        onClick={() => handleItem({ id, icon: Icon, labelEn, labelHi, descEn, descHi, accent, ...rest })}
                        style={styles.menuItem}
                        whileHover={{ x: 4, background: `rgba(${hexToRgb(accent)}, 0.08)` }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div style={{ ...styles.menuIcon, background: `rgba(${hexToRgb(accent)}, 0.15)` }}>
                          <Icon size={16} color={accent} />
                        </div>
                        <div style={styles.menuText}>
                          <span style={styles.menuLabel}>{t(labelEn, labelHi)}</span>
                          <span style={styles.menuDesc}>{t(descEn, descHi)}</span>
                        </div>
                        <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </motion.button>
                    ))}
                  </nav>

                  <div style={styles.divider} />

                  {/* Logout */}
                  <motion.button
                    style={styles.logoutBtn}
                    whileHover={{ background: "rgba(255, 78, 106, 0.12)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} color="var(--color-danger)" />
                    <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>
                      {t("Logout", "लॉगआउट")}
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                /* Active sub-panel */
                <SubPanel
                  id={activePanel}
                  customer={selectedCustomer}
                  t={t}
                  language={language}
                  onBack={() => setActivePanel(null)}
                />
              )}
            </AnimatePresence>

            {/* Footer */}
            <div style={styles.drawerFooter}>
              <div style={styles.footerText}>SBI YONO LifeAI · v2.1.0</div>
              <div style={styles.footerText}>
                {t("Customer ID:", "ग्राहक ID:")} {selectedCustomer.id}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Inline panel shared styles ───────────────────────────────────────────────
const panel = {
  wrap: { padding: "4px 0" },
  title: {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 14,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    gap: 10,
  },
  rowLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  rowValue: {
    fontSize: "0.85rem",
    fontWeight: 700,
    textAlign: "right",
    maxWidth: 160,
    wordBreak: "break-word",
  },
  note: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
    fontStyle: "italic",
    textAlign: "center",
    padding: "0 4px",
  },
  infoBox: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    background: "rgba(155,89,182,0.08)",
    border: "1px solid rgba(155,89,182,0.2)",
    borderRadius: 10,
    padding: "12px 14px",
    lineHeight: 1.5,
  },
  primaryBtn: {
    width: "100%",
    padding: "13px",
    background: "rgba(26,115,232,0.15)",
    border: "1px solid rgba(26,115,232,0.3)",
    borderRadius: 10,
    color: "#60a5fa",
    fontWeight: 700,
    fontSize: "0.88rem",
    cursor: "pointer",
    marginTop: 4,
    transition: "all 0.15s",
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s",
    padding: 0,
    flexShrink: 0,
  },
  toggleThumb: {
    position: "absolute",
    top: 2,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.2s",
  },
  supportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.15s",
    textAlign: "left",
  },
  supportIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

// ─── Drawer layout styles ─────────────────────────────────────────────────────
const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(4px)",
    zIndex: 1100,
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: 340,
    background: "var(--color-surface-1)",
    borderLeft: "1px solid var(--color-border)",
    zIndex: 1200,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 20px 16px",
    background: "linear-gradient(135deg, rgba(26,115,232,0.12), rgba(0,198,255,0.06))",
    borderBottom: "1px solid var(--color-border)",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: 800,
    color: "#fff",
    flexShrink: 0,
    border: "2px solid rgba(255,255,255,0.15)",
  },
  userName: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: 1.2,
  },
  userAcc: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    fontFamily: "monospace",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--color-border)",
    color: "var(--text-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chips: {
    display: "flex",
    gap: 8,
    padding: "12px 20px",
    flexShrink: 0,
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.7rem",
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  divider: {
    height: 1,
    background: "var(--color-border)",
    flexShrink: 0,
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 12px",
    gap: 2,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "12px 10px",
    borderRadius: "var(--radius-md)",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    background: "transparent",
    color: "var(--text-primary)",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  menuText: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  menuLabel: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    lineHeight: 1.3,
  },
  menuDesc: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    lineHeight: 1.3,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "calc(100% - 24px)",
    margin: "8px 12px",
    padding: "12px 14px",
    borderRadius: "var(--radius-md)",
    border: "1px solid rgba(255, 78, 106, 0.2)",
    background: "rgba(255, 78, 106, 0.06)",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  subBack: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "14px 20px 10px",
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "0.82rem",
    fontWeight: 600,
    flexShrink: 0,
    borderBottom: "1px solid var(--color-border)",
    width: "100%",
    textAlign: "left",
  },
  drawerFooter: {
    marginTop: "auto",
    padding: "16px 20px",
    borderTop: "1px solid var(--color-border)",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flexShrink: 0,
  },
  footerText: {
    fontSize: "0.68rem",
    color: "var(--text-muted)",
    fontFamily: "monospace",
  },
};
