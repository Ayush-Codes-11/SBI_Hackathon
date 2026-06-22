import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Type, Volume2 } from "lucide-react";
import { useCustomer } from "../context/CustomerContext";

const RESPONSES_EN = {
  loan: "Your education loan of up to 1.5 crore rupees has been pre-approved at 8.15% per annum. Shall I take you to the activation screen?",
  forex: "Your SBI Student Forex Card is ready for instant issue. You can lock rates in 15 currencies with zero markup fees.",
  insurance: "SBI Travel Insurance covers medical emergencies, trip cancellation, and baggage loss. Would you like to activate it now?",
  balance: "Your current savings account balance is one lakh twenty eight thousand four hundred and fifty rupees.",
  score: "Your credit score is 748, which is excellent. This qualifies you for our best loan rates.",
  hello: "Namaste! I am your SBI LifeAI assistant. I can help you with loans, forex cards, insurance, and more. How can I assist you today?",
  default: "I understand your request. Our banking advisors are here to help. Would you like me to connect you with a Relationship Manager?",
};

const RESPONSES_HI = {
  loan: "आपका शिक्षा ऋण डेढ़ करोड़ रुपये तक 8.15% प्रति वर्ष की दर पर पूर्व-अनुमोदित है। क्या मैं आपको सक्रियण स्क्रीन पर ले जाऊं?",
  forex: "आपका SBI स्टूडेंट फॉरेक्स कार्ड तुरंत जारी करने के लिए तैयार है। आप शून्य मार्कअप शुल्क के साथ 15 मुद्राओं में दरें लॉक कर सकते हैं।",
  insurance: "SBI यात्रा बीमा चिकित्सा आपात, यात्रा रद्दीकरण और सामान हानि को कवर करता है। क्या आप इसे अभी सक्रिय करना चाहेंगे?",
  balance: "आपके बचत खाते में वर्तमान शेष एक लाख अट्ठाईस हजार चार सौ पचास रुपये है।",
  score: "आपका क्रेडिट स्कोर 748 है, जो उत्कृष्ट है। यह आपको हमारी सर्वोत्तम ऋण दरों के लिए योग्य बनाता है।",
  hello: "नमस्ते! मैं आपका SBI LifeAI सहायक हूं। मैं ऋण, फॉरेक्स कार्ड, बीमा और अधिक में आपकी सहायता कर सकता हूं।",
  default: "मैं आपका अनुरोध समझता हूं। हमारे बैंकिंग सलाहकार आपकी सहायता के लिए यहां हैं। क्या मैं आपको एक संबंध प्रबंधक से जोड़ूं?",
};

function getResponse(transcript, lang) {
  const t = transcript.toLowerCase();
  const res = lang === "hi" ? RESPONSES_HI : RESPONSES_EN;
  if (t.includes("loan") || t.includes("ऋण") || t.includes("लोन")) return res.loan;
  if (t.includes("forex") || t.includes("card") || t.includes("फॉरेक्स")) return res.forex;
  if (t.includes("insurance") || t.includes("बीमा")) return res.insurance;
  if (t.includes("balance") || t.includes("शेष") || t.includes("बैलेंस")) return res.balance;
  if (t.includes("score") || t.includes("स्कोर") || t.includes("credit")) return res.score;
  if (t.includes("hello") || t.includes("hi") || t.includes("नमस्ते") || t.includes("हेलो")) return res.hello;
  return res.default;
}

export default function VoiceAssistant() {
  const { language, t } = useCustomer();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState("voice"); // "voice" | "text"
  const [textInput, setTextInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const recogRef = useRef(null);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language === "hi" ? "hi-IN" : "en-IN";
    utter.rate = 0.92;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleTranscript = (text) => {
    setTranscript(text);
    const res = getResponse(text, language);
    setResponse(res);
    setTimeout(() => speak(res), 300);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please use Chrome.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = language === "hi" ? "hi-IN" : "en-IN";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      handleTranscript(text);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recog.start();
    recogRef.current = recog;
    setListening(true);
    setTranscript("");
    setResponse("");
  };

  const stopListening = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleTranscript(textInput.trim());
    setTextInput("");
  };

  useEffect(() => {
    return () => {
      recogRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen((o) => !o)}
        style={{
          ...styles.fab,
          background: open ? "var(--gradient-danger)" : "var(--gradient-primary)",
          boxShadow: open
            ? "var(--shadow-glow-red)"
            : "var(--shadow-glow-blue)",
        }}
        title={t("Voice Assistant", "वॉयस असिस्टेंट")}
      >
        {open ? <X size={22} /> : <Mic size={22} />}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={styles.fabRing}
          />
        )}
      </motion.button>

      {/* Voice Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={styles.panel}
          >
            {/* Header */}
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>
                <div style={styles.aiDot} />
                <span>{t("SBI LifeAI Voice", "SBI LifeAI वॉयस")}</span>
              </div>
              <div style={styles.langToggleRow}>
                <button
                  onClick={() => setMode((m) => (m === "voice" ? "text" : "voice"))}
                  style={styles.modeBtn}
                >
                  {mode === "voice" ? <Type size={13} /> : <Mic size={13} />}
                  {mode === "voice"
                    ? t("Type instead", "टाइप करें")
                    : t("Use voice", "वॉयस उपयोग करें")}
                </button>
              </div>
            </div>

            {/* Waveform / mic area */}
            {mode === "voice" && (
              <div style={styles.micArea}>
                {listening ? (
                  <div className="waveform">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="waveform-bar"
                        style={{
                          height: `${20 + Math.random() * 24}px`,
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : speaking ? (
                  <div style={styles.speakingIndicator}>
                    <Volume2 size={18} color="var(--color-success)" />
                    <span style={{ color: "var(--color-success)", fontSize: "0.82rem" }}>
                      {t("Speaking...", "बोल रहा है...")}
                    </span>
                  </div>
                ) : (
                  <div style={styles.micHint}>
                    {t("Tap mic to speak", "बोलने के लिए माइक दबाएं")}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={listening ? stopListening : startListening}
                  style={{
                    ...styles.micBtn,
                    background: listening
                      ? "var(--gradient-danger)"
                      : "var(--gradient-primary)",
                    boxShadow: listening
                      ? "0 0 20px rgba(255,78,106,0.4)"
                      : "0 0 20px rgba(26,115,232,0.4)",
                  }}
                >
                  {listening ? (
                    <MicOff size={20} color="#fff" />
                  ) : (
                    <Mic size={20} color="#fff" />
                  )}
                </motion.button>
              </div>
            )}

            {/* Text mode */}
            {mode === "text" && (
              <form onSubmit={handleTextSubmit} style={styles.textForm}>
                <input
                  className="input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t("Ask me anything...", "कुछ भी पूछें...")}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  {t("Send", "भेजें")}
                </button>
              </form>
            )}

            {/* Transcript */}
            {transcript && (
              <div style={styles.transcript}>
                <span style={styles.transcriptLabel}>{t("You said:", "आपने कहा:")}</span>
                <span style={styles.transcriptText}>"{transcript}"</span>
              </div>
            )}

            {/* Response */}
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.response}
              >
                <div style={styles.responseLabel}>
                  <div style={styles.aiDot} />
                  {t("SBI LifeAI", "SBI LifeAI")}
                </div>
                <p style={styles.responseText}>{response}</p>
              </motion.div>
            )}

            {/* Quick prompts */}
            <div style={styles.quickPrompts}>
              <span style={styles.quickLabel}>{t("Try asking:", "पूछने की कोशिश करें:")}</span>
              <div style={styles.chipRow}>
                {[
                  { en: "Loan details", hi: "ऋण विवरण" },
                  { en: "My balance", hi: "मेरा शेष" },
                  { en: "Forex card", hi: "फॉरेक्स कार्ड" },
                ].map(({ en, hi }) => (
                  <button
                    key={en}
                    onClick={() => handleTranscript(language === "hi" ? hi : en)}
                    style={styles.chip}
                  >
                    {language === "hi" ? hi : en}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    zIndex: 900,
    color: "#fff",
  },
  fabRing: {
    position: "absolute",
    inset: -4,
    borderRadius: "50%",
    border: "2px solid var(--color-primary)",
    pointerEvents: "none",
  },
  panel: {
    position: "fixed",
    bottom: 100,
    right: 32,
    width: 340,
    background: "rgba(12, 30, 53, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
    padding: 20,
    zIndex: 900,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "var(--shadow-lg)",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  panelTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--color-success)",
    boxShadow: "0 0 6px var(--color-success)",
    animation: "pulse-dot 2s ease-in-out infinite",
  },
  langToggleRow: {
    display: "flex",
    gap: 6,
  },
  modeBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    color: "var(--text-secondary)",
    fontSize: "0.72rem",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  micArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "12px 0",
  },
  micHint: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  speakingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  micBtn: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    transition: "all var(--transition-normal)",
  },
  textForm: {
    display: "flex",
    gap: 8,
  },
  transcript: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "var(--radius-md)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  transcriptLabel: {
    fontSize: "0.68rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  transcriptText: {
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    fontStyle: "italic",
  },
  response: {
    padding: "12px 14px",
    background: "rgba(26, 115, 232, 0.08)",
    border: "1px solid rgba(26, 115, 232, 0.2)",
    borderRadius: "var(--radius-md)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  responseLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--color-primary-light)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  responseText: {
    fontSize: "0.83rem",
    color: "var(--text-secondary)",
    lineHeight: 1.55,
    margin: 0,
  },
  quickPrompts: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  quickLabel: {
    fontSize: "0.68rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  chipRow: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  chip: {
    padding: "5px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-full)",
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    transition: "all var(--transition-fast)",
  },
};
