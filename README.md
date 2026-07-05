# SBI Saarthi — AI Life Event Engine & Relationship Manager

> **SBI Hackathon Prototype** · Built with React + Node.js + Gemini 2.0 Flash

SBI Saarthi is an intelligent middleware overlay between SBI's Core Banking System (CBS) / YONO app activity and the customer journey. It predicts life events in real-time, recommends tailored product bundles, and includes a regulatory human-escalation layer — all within the look and feel of the real YONO app.

---

## 🎯 What It Does

| Signal Source | What It Reads | Legal Basis |
|---|---|---|
| YONO In-App Search History | Product searches, loan calculators inside YONO only | IT Act 2000 |
| CBS Transaction Data | MCC-categorised card spend (travel, education) via SBI core banking | RBI Digital Lending Guidelines 2022 |
| Salary Credits | NEFT/NACH credits to the SBI savings account | DPDP Act 2023 (consent-based) |
| CIBIL Credit Score | Fetched at account opening with customer consent | SEBI/IRDAI |

The AI engine (Gemini 2.0 Flash) analyses these signals and outputs a structured prediction: **life event → recommended product bundle → confidence score → escalation flag**.

---

## 🚀 Key Features

### 1. AI Life Event Prediction Engine
- Calls Google Gemini 2.0 Flash via REST API (header-auth for `AQ.` format keys)
- Exponential back-off retry logic for rate-limit handling
- Regex-based JSON extraction (no `responseMimeType` constraint)
- Graceful fallback to high-fidelity local profiles if API is unavailable

### 2. Evidence-Weighted Signal Feed
- **YONO Search History** — in-app searches only, not browser/Google
- **Travel Spend Trend** — MCC 3000–3999, 4411, 7011 (airlines, cruise, hotels)
- **Salary Credits** — NEFT/NACH stability; last-month = 0 signals retirement
- All data within SBI's own CBS ecosystem — zero cross-app data sharing

### 3. Hyper-Personalised Journey Stepper
- Guided activation workflow: pre-approved loan → forex card → student account → insurance
- Animated progress stepper with product cards, interest rates, and "Pre-Approved" badges
- Voice announcement on journey completion (Web Speech API)

### 4. YONO-Style Settings Panel
Exact replica of the real YONO app's settings drawer:

| Menu Item | Behaviour |
|---|---|
| My Accounts | Full page: balance, CBS transaction history, CIBIL score, products held |
| Manage Profile | Inline panel: read-only name, age, city, credit score, products |
| Access Services | Direct navigation to the guided product-bundle journey |
| Settings | Inline panel: notification + language toggles, Save confirmation |
| Update My Security | Inline panel: greyed-out MPIN/password fields + branch note |
| Get Support | Inline panel: Call 1800-11-2211, Chat, Raise a Ticket |
| Logout | Clears session, returns to home dashboard |

### 5. RBI Compliance — Human Escalation Layer
- Loans > ₹50L automatically set `escalate: true` per RBI Digital Lending Guidelines 2022
- Amber escalation banner on Confirmation page cites the guideline
- EmailJS integration fires a real email to the Relationship Manager inbox when triggered
- Console-log fallback if EmailJS keys are not configured (demo never breaks)

### 6. Bilingual UI (English / Hindi)
- Every string in the app has both `labelEn` and `labelHi` variants
- One-click language toggle in the Navbar
- Voice confirmation in the selected language

### 7. Bulletproof Offline Fallbacks
- Backend and frontend both fall back to `mockSignals.js` / `mockCustomers.js`
- 5 pre-loaded customer profiles cover all major life events
- Demo works without an internet connection or API key

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 8, Framer Motion, Lucide Icons, Vanilla CSS |
| Routing | React Router v6 |
| Backend | Node.js, Express, CORS |
| AI | Google Gemini 2.0 Flash (REST, `x-goog-api-key` header auth) |
| Email | EmailJS (optional — human escalation alerts) |
| Deployment | Vercel (frontend) / Render (backend) — _coming soon_ |

---

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/Ayush-Codes-11/SBI_Hackathon.git
cd SBI_Hackathon
```

### 2. Configure environment variables

**`backend/.env`**
```env
GEMINI_API_KEY=AQ.your_key_here
PORT=3001
```

**`frontend/.env`**
```env
VITE_BACKEND_URL=http://localhost:3001
```

> **Note on API key format:** Google AI Studio now issues `AQ.` prefix keys (post-June 2026).  
> These **must** use the `x-goog-api-key` request header — the `?key=` query parameter does not work with this format. The backend handles this automatically.

**`frontend/.env` (optional — EmailJS escalation)**
```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
VITE_RM_EMAIL=rm-inbox@yourbank.com
```

### 3. Start the backend
```bash
cd backend
npm install
node server.js
# → Running on http://localhost:3001
```

### 4. Start the frontend
```bash
cd ../frontend
npm install
npm run dev
# → Running on http://localhost:5173
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🎬 Demo Walkthrough

### Customer 1 — Rahul Sharma (Higher Education Abroad)
- YONO searches: "Education loan for Germany", "IELTS preparation loan", "Forex card for students"
- Travel spend: 640% growth over 3 months
- **Prediction**: Higher Education Abroad · 92% confidence
- **Bundle**: SBI Education Loan + Forex Card + Global Student Account + Study Abroad Insurance

### Customer 2 — Priya Menon (First Home Purchase) ⚠️ RM Escalation
- YONO searches: "Home loan calculator", "Pradhan Mantri Awas Yojana"
- Salary credits stable at ₹95,000/month
- **Prediction**: First Home Purchase · 88% confidence
- **Bundle**: ₹75L Home Loan → triggers **RM Escalation** (exceeds ₹50L threshold)

### Customer 3 — Arjun Patel (Business Expansion)
- YONO searches: "GST registration loan", "SME credit line"
- **Prediction**: Business Expansion · 85% confidence
- **Bundle**: SBI SME Credit Line + Business Current Account + Trade Finance

### Customer 4 — Meera Krishnan (Wedding Planning)
- YONO searches: "Wedding loan", "Gold loan"
- **Prediction**: Family Wedding · 79% confidence
- **Bundle**: SBI Personal Loan + SBI Gold Loan + Wedding Insurance

### Customer 5 — Sunita Devi (Retirement Planning)
- Last month salary credit: ₹0 (retirement signal)
- YONO searches: "Senior citizen FD", "Pension scheme"
- **Prediction**: Retirement Planning · 95% confidence
- **Bundle**: Senior Citizen FD + SBI Annuity + Mediclaim + Will Services

---

## 📁 Project Structure

```
SBI_Hackathon/
├── backend/
│   ├── server.js               # Express server, CORS, dotenv
│   ├── routes/
│   │   └── predict.js          # POST /api/predict
│   └── services/
│       ├── gemini.js           # Gemini REST client, retry logic
│       └── mockSignals.js      # Fallback signal profiles
│
└── frontend/
    └── src/
        ├── App.jsx             # BrowserRouter, all routes
        ├── context/
        │   └── CustomerContext.jsx  # Global state, API orchestration
        ├── data/
        │   └── mockCustomers.js     # 5 customer profiles + predictions
        ├── components/
        │   ├── Navbar.jsx           # Top nav, language toggle, settings gear
        │   ├── SettingsPanel.jsx    # YONO-style drawer, all 7 menu items wired
        │   ├── Footer.jsx
        │   └── VoiceAssistant.jsx
        ├── pages/
        │   ├── Dashboard.jsx        # Main AI prediction display
        │   ├── AccountsPage.jsx     # Balance + CBS transaction history
        │   ├── LifeEventPage.jsx    # Life event detail
        │   ├── JourneyPage.jsx      # Product bundle stepper
        │   └── ConfirmationPage.jsx # Journey complete + RM escalation banner
        └── services/
            ├── api.js               # Backend fetch wrapper
            └── emailjs.js           # RM escalation email
```

---

## ⚖️ Privacy & Compliance

- **No external app data**: Only SBI's own CBS, YONO search history, and CIBIL (consent-based)
- **RBI Digital Lending Guidelines 2022**: Loans > ₹50L require human RM review — enforced in code
- **DPDP Act 2023**: Consent-based data processing only
- **Zero third-party payment app data**: PhonePe, Google Pay, UPI from other apps are explicitly excluded

---

## 👥 Team

Built for **SBI Hackathon 2026** — 3-minute demo prototype showcasing how AI can be integrated responsibly into India's largest public sector bank without compromising privacy or regulatory compliance.

---

*SBI Saarthi · v2.1.0*
