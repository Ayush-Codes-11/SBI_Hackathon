# SBI LifeAI: AI-Powered Life Event Engine & Relationship Manager

SBI LifeAI is a prototype for the SBI Hackathon. It acts as an intelligent middleware overlay between SBI's Core Banking System (CBS) / YONO app activity and the customer journey, predicting life events in real-time and recommending tailored product bundles with a regulatory human-escalation fallback.

## 🚀 Key Features

1. **AI Life Event Prediction Layer**: Integrated with the modern Google Gen AI SDK (`@google/genai`) querying `gemini-2.5-flash` to analyze customer signals (search history, salary trend, spend growth) and output structured JSON life event predictions.
2. **Evidence-Weighted Signal Feed**: Simulates real-time CBS and YONO signals:
   - *YONO Search History*: In-app searches for products, loan calculators, etc.
   - *Travel Spend Trend*: Merchant Category Code (MCC) travel spend growth over 3 months.
   - *Salary Credits*: NEFT/NACH stability and retirement indicators (last month credit = 0).
3. **Hyper-Personalized Journey Generator**: A guided stepper workflow (Pre-approved loans -> Forex cards -> Student accounts -> Insurance policies) to activate bundles in 3 clicks.
4. **RBI Regulatory Safety Net (Relationship Manager Escalation)**: Hardcoded compliance guardrail that overrides the AI and triggers a "Relationship Manager Review Required" badge in the UI for loans exceeding ₹50L per the Digital Lending Guidelines.
5. **Bulletproof Offline Fallbacks**: In case of venue network errors or missing keys, both the backend and frontend dynamically fall back to local high-fidelity prediction profiles in `mockCustomers.js` / `mockSignals.js`.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS/Vanilla CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, CORS
- **AI Integration**: Official `@google/genai` SDK (`gemini-2.5-flash` model)

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.

### Setup Instructions

1. Clone this repository (already done locally):
   ```bash
   git clone https://github.com/Ayush-Codes-11/SBI_Hackathon.git
   cd SBI_Hackathon
   ```

2. Configure Environment Variables:
   - Create a `.env` file inside the `backend/` directory:
     ```env
     GEMINI_API_KEY=your_google_ai_studio_api_key_here
     PORT=3001
     ```
   - Create a `.env` file inside the `frontend/` directory:
     ```env
     VITE_BACKEND_URL=http://localhost:3001
     ```

### Running the Application

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend server will run on `http://localhost:3001`.

2. **Start the Frontend Development Server**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   The Vite dev server will run on `http://localhost:5173`. Open this URL in your web browser.

---

## 💡 Demo Walkthrough Scenarios

1. **Customer 1 (Rahul Sharma - Higher Education)**: Search history shows IELTS/Germany searches; card travel spend increased 640%. Gemini predicts "Higher Education Abroad" and recommends a bundle (Education Loan, Forex card, Student account).
2. **Customer 2 (Priya Menon - Home Buyer)**: Search history shows home loan calculators. Gemini predicts "First Home Purchase". Recommended home loan amount is ₹75L, triggering the ₹50L guardrail and showing the **RM Escalation Required** flag in YONO.
3. **Customer 5 (Sunita Devi - Retirement)**: Last month salary credit is ₹0. YONO searches are for Senior citizen FDs. Gemini predicts "Retirement Planning" and recommends FDs & Health Insurance.
