/**
 * mockSignals.js
 * Hardcoded customer signal sets — simulates what SBI CBS + YONO would provide.
 * No separate server process needed. Imported directly by the predict route.
 *
 * DATA SOURCES (all from SBI's own systems only):
 * - yonoSearchHistory : searches made INSIDE the YONO app
 * - transactions      : all debits via SBI CBS (UPI/card/ATM/NEFT all flow through here)
 * - salaryCredits     : NEFT/NACH credits to the SBI account
 * - creditScore       : CIBIL via written consent at account opening
 */

const MOCK_SIGNALS = {
  cust_001: {
    id: "cust_001",
    name: "Rahul Sharma",
    age: 22,
    city: "Delhi",
    creditScore: 748,
    salaryCredits: [45000, 45000, 47000], // last 3 months (₹)
    accountBalance: 128450,
    // All debits to the SBI account, categorised by CBS — any channel (UPI, card, ATM)
    transactions: [
      { month: "Oct", category: "Travel/Airlines", amount: 1200 },
      { month: "Nov", category: "Travel/Airlines", amount: 3400 },
      { month: "Dec", category: "Travel/Airlines", amount: 8900 },
      { month: "Dec", category: "Education/Coaching", amount: 12000 },
      { month: "Dec", category: "Forex/Currency", amount: 5000 },
    ],
    // Searches made inside the YONO banking app only (not browser history)
    yonoSearchHistory: [
      "Education loan for Germany",
      "IELTS preparation loan",
      "Forex card for students",
      "Study abroad insurance",
    ],
    existingProducts: ["Savings Account", "Debit Card"],
  },

  cust_002: {
    id: "cust_002",
    name: "Priya Menon",
    age: 31,
    city: "Bengaluru",
    creditScore: 812,
    salaryCredits: [95000, 95000, 98000],
    accountBalance: 842000,
    transactions: [
      { month: "Oct", category: "Real Estate Services", amount: 4200 },
      { month: "Nov", category: "Real Estate Services", amount: 3800 },
      { month: "Dec", category: "Real Estate Services", amount: 3100 },
      { month: "Dec", category: "Legal/Registration", amount: 15000 },
    ],
    yonoSearchHistory: [
      "Home loan EMI calculator",
      "MaxGain home loan eligibility",
      "Home insurance for loan",
    ],
    existingProducts: ["Savings Account", "Debit Card", "Mutual Funds"],
  },

  cust_003: {
    id: "cust_003",
    name: "Arjun & Kavya Singh",
    age: 28,
    city: "Pune",
    creditScore: 724,
    salaryCredits: [72000, 72000, 75000],
    accountBalance: 315000,
    transactions: [
      { month: "Oct", category: "Medical/Hospitals", amount: 2100 },
      { month: "Nov", category: "Baby/Child Products", amount: 3200 },
      { month: "Dec", category: "Medical/Hospitals", amount: 4500 },
      { month: "Dec", category: "Baby/Child Products", amount: 2800 },
    ],
    yonoSearchHistory: [
      "Child education plan SBI",
      "Smart Scholar premium calculator",
      "Maternity cover top-up",
    ],
    existingProducts: ["Joint Savings Account", "Home Loan"],
  },

  cust_004: {
    id: "cust_004",
    name: "Vikram Nair",
    age: 38,
    city: "Dubai → Kochi",
    creditScore: 789,
    salaryCredits: [185000, 185000, 190000],
    accountBalance: 2140000,
    transactions: [
      { month: "Oct", category: "International Airlines", amount: 25000 },
      { month: "Nov", category: "India Hotels", amount: 31000 },
      { month: "Dec", category: "India Hotels + Airlines", amount: 42000 },
      { month: "Dec", category: "Property Consultant", amount: 18000 },
    ],
    yonoSearchHistory: [
      "NRE to RFC account conversion",
      "FCNR maturity repatriation",
      "DTAA India UAE SBI form",
    ],
    existingProducts: ["NRE Account", "NRO FD", "FCNR Deposit"],
  },

  cust_005: {
    id: "cust_005",
    name: "Sunita Devi",
    age: 57,
    city: "Varanasi",
    creditScore: 801,
    salaryCredits: [62000, 62000, 0], // last credit = 0 → retirement signal
    accountBalance: 1890000,
    transactions: [
      { month: "Oct", category: "Pharmacy/Medical", amount: 800 },
      { month: "Nov", category: "Pharmacy/Medical", amount: 1200 },
      { month: "Dec", category: "Pharmacy/Medical", amount: 1800 },
    ],
    yonoSearchHistory: [
      "Wecare Senior FD rates",
      "SBI Annuity Deposit calculator",
      "Arogya Premier health cover",
    ],
    existingProducts: ["Savings Account", "PPF", "LIC Policy"],
  },
};

module.exports = { MOCK_SIGNALS };
