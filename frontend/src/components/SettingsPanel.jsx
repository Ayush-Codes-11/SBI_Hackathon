import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Landmark,
  UserCog,
  LayoutGrid,
  Settings,
  ShieldCheck,
  HeadphonesIcon,
  LogOut,
  ChevronRight,
  Wifi,
  Moon,
} from "lucide-react";
import { useCustomer } from "../context/CustomerContext";

// YONO-style menu items matching the real SBI YONO app
const MENU_ITEMS = [
  {
    id: "accounts",
    icon: Landmark,
    labelEn: "My Accounts",
    labelHi: "मेरे खाते",
    descEn: "View balances & statements",
    descHi: "शेष राशि और विवरण देखें",
    accent: "#1A73E8",
  },
  {
    id: "profile",
    icon: UserCog,
    labelEn: "Manage Profile",
    labelHi: "प्रोफ़ाइल प्रबंधित करें",
    descEn: "Personal & nominee details",
    descHi: "व्यक्तिगत और नॉमिनी विवरण",
    accent: "#00C6FF",
  },
  {
    id: "services",
    icon: LayoutGrid,
    labelEn: "Access Services",
    labelHi: "सेवाएं एक्सेस करें",
    descEn: "Loans, cards & more",
    descHi: "ऋण, कार्ड और अधिक",
    accent: "#00D68F",
  },
  {
    id: "settings",
    icon: Settings,
    labelEn: "Settings",
    labelHi: "सेटिंग्स",
    descEn: "Preferences & notifications",
    descHi: "प्राथमिकताएं और सूचनाएं",
    accent: "#FFB347",
  },
  {
    id: "security",
    icon: ShieldCheck,
    labelEn: "Update My Security",
    labelHi: "सुरक्षा अपडेट करें",
    descEn: "MPIN, password & limits",
    descHi: "MPIN, पासवर्ड और सीमाएं",
    accent: "#9B59B6",
  },
  {
    id: "support",
    icon: HeadphonesIcon,
    labelEn: "Get Support",
    labelHi: "सहायता प्राप्त करें",
    descEn: "Chat, call or raise a ticket",
    descHi: "चैट, कॉल या टिकट करें",
    accent: "#FF4E6A",
  },
];

export default function SettingsPanel({ isOpen, onClose }) {
  const { selectedCustomer, language, t } = useCustomer();
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (id) => {
    setActiveItem(id);
    // Reset after animation — items are non-functional in prototype
    setTimeout(() => setActiveItem(null), 600);
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
            onClick={onClose}
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
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                {/* Avatar */}
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
                    {language === "hi"
                      ? selectedCustomer.nameHi
                      : selectedCustomer.name}
                  </div>
                  <div style={styles.userAcc}>
                    {t("A/C", "खाता")} {selectedCustomer.accountNumber}
                  </div>
                </div>
              </div>
              <button onClick={onClose} style={styles.closeBtn} aria-label="Close settings">
                <X size={18} />
              </button>
            </div>

            {/* Status chips */}
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

            {/* Divider */}
            <div style={styles.divider} />

            {/* Menu items */}
            <nav style={styles.menu}>
              {MENU_ITEMS.map(({ id, icon: Icon, labelEn, labelHi, descEn, descHi, accent }) => (
                <motion.button
                  key={id}
                  onClick={() => handleItemClick(id)}
                  style={{
                    ...styles.menuItem,
                    background:
                      activeItem === id
                        ? `rgba(${hexToRgb(accent)}, 0.12)`
                        : "transparent",
                  }}
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

            {/* Divider */}
            <div style={styles.divider} />

            {/* Logout */}
            <motion.button
              style={styles.logoutBtn}
              whileHover={{ background: "rgba(255, 78, 106, 0.12)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              <LogOut size={16} color="var(--color-danger)" />
              <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>
                {t("Logout", "लॉगआउट")}
              </span>
            </motion.button>

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

// Helper: convert hex to "r, g, b" string for rgba()
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

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
    margin: "4px 0",
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
    transition: "all 0.15s ease",
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
  drawerFooter: {
    marginTop: "auto",
    padding: "16px 20px",
    borderTop: "1px solid var(--color-border)",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  footerText: {
    fontSize: "0.68rem",
    color: "var(--text-muted)",
    fontFamily: "monospace",
  },
};
