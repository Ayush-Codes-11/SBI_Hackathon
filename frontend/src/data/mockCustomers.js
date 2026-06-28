/**
 * Mock customer profiles with pre-computed AI predictions.
 * These simulate what the Gemini API will return in Phase 3 backend work.
 *
 * ─── DATA SOURCES (all within SBI ecosystem — no external data used) ───────
 *
 * 1. yonoSearchHistory  → Search queries made INSIDE the YONO / SBI app only
 *                         (product search, loan calculator, branch locator etc.)
 *                         NOT browser history. NOT Google search.
 *
 * 2. travelSpend        → MCC-categorised spend on SBI Debit/Credit cards
 *                         (MCC 3000–3999 Airlines, 4411 Cruise, 7011 Hotels)
 *                         NOT PhonePe / Google Pay / UPI data from other apps.
 *
 * 3. salaryCredits      → NEFT/NACH credits to the SBI savings/current account
 *                         as visible in core banking — bank's own transaction data.
 *
 * 4. creditScore        → Fetched from CIBIL/Experian via customer's written
 *                         consent during account opening (RBI mandate).
 *
 * 5. balance            → SBI account balance — core banking, always legitimate.
 *
 * Legal basis: IT Act 2000, RBI Master Direction on Digital Lending 2022,
 *              DPDP Act 2023 (consent-based processing), SEBI/IRDAI as applicable.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const MOCK_CUSTOMERS = [
  {
    id: "cust_001",
    name: "Rahul Sharma",
    nameHi: "राहुल शर्मा",
    age: 22,
    accountNumber: "XXXX-XXXX-4821",
    creditScore: 748,
    salaryCredits: [45000, 45000, 47000],
    balance: 128450,
    city: "Delhi",
    avatar: "RS",
    avatarColor: "#1A73E8",

    // Searches made inside YONO app (product search / loan calculator)
    yonoSearchHistory: [
      "Education loan for Germany",
      "IELTS preparation loan",
      "Forex card for students",
      "Study abroad insurance",
    ],
    yonoSearchHistoryHi: [
      "जर्मनी के लिए शिक्षा ऋण",
      "IELTS तैयारी ऋण",
      "छात्रों के लिए फॉरेक्स कार्ड",
      "विदेश अध्ययन बीमा",
    ],

    // SBI account transaction history — all channels (UPI, card, ATM, NEFT) flow
    // through CBS; travel-category debits identified by merchant name / MCC / VPA
    travelSpend: [1200, 3400, 8900],   // ₹ per month, last 3 months

    existingProducts: ["Savings Account", "Debit Card"],

    prediction: {
      lifeEvent: "Higher Education Abroad",
      lifeEventHi: "विदेश में उच्च शिक्षा",
      confidence: 92,
      reasoning:
        "YONO app search history shows repeated queries for education loans and student forex products. SBI account transaction history (all channels: UPI, card, ATM) shows travel-category spend rose 640% over 3 months. Salary credits stable — student planning departure.",
      reasoningHi:
        "YONO ऐप में शिक्षा ऋण और स्टूडेंट फॉरेक्स उत्पादों की बार-बार खोजें। SBI खाते के लेनदेन इतिहास (UPI, कार्ड, ATM सभी चैनल) में यात्रा-श्रेणी खर्च 3 महीनों में 640% बढ़ा। वेतन क्रेडिट स्थिर हैं।",
      products: [
        {
          id: "edu_loan",
          name: "SBI Education Loan",
          nameHi: "SBI शिक्षा ऋण",
          icon: "GraduationCap",
          description: "Up to ₹1.5 Cr for studies abroad. Moratorium till course completion.",
          descriptionHi: "विदेश में पढ़ाई के लिए ₹1.5 करोड़ तक। कोर्स पूरा होने तक मोरेटोरियम।",
          rate: "8.15% p.a.",
          badge: "Pre-Approved",
          badgeHi: "पूर्व-अनुमोदित",
          color: "#1A73E8",
        },
        {
          id: "forex_card",
          name: "SBI Student Forex Card",
          nameHi: "SBI स्टूडेंट फॉरेक्स कार्ड",
          icon: "CreditCard",
          description: "Lock rates in 15 currencies. Zero markup fees for students.",
          descriptionHi: "15 मुद्राओं में दरें लॉक करें। छात्रों के लिए शून्य मार्कअप शुल्क।",
          rate: "Zero markup",
          badge: "Instant Issue",
          badgeHi: "तुरंत जारी",
          color: "#00C6FF",
        },
        {
          id: "travel_insurance",
          name: "SBI Travel Insurance",
          nameHi: "SBI यात्रा बीमा",
          icon: "Shield",
          description: "Comprehensive cover for medical, trip cancellation & baggage loss.",
          descriptionHi: "चिकित्सा, यात्रा रद्दीकरण और सामान हानि के लिए व्यापक कवर।",
          rate: "₹899/year",
          badge: "Recommended",
          badgeHi: "अनुशंसित",
          color: "#00D68F",
        },
        {
          id: "student_account",
          name: "SBI International Student Account",
          nameHi: "SBI अंतर्राष्ट्रीय छात्र खाता",
          icon: "Landmark",
          description: "Free remittance, dedicated NRI helpline, multi-currency support.",
          descriptionHi: "मुफ्त रेमिटेंस, समर्पित NRI हेल्पलाइन, मल्टी-करेंसी सपोर्ट।",
          rate: "Zero balance",
          badge: "New",
          badgeHi: "नया",
          color: "#FFB347",
        },
      ],
      escalate: false,
      loanAmount: 1500000,
    },
  },
  {
    id: "cust_002",
    name: "Priya Menon",
    nameHi: "प्रिया मेनन",
    age: 31,
    accountNumber: "XXXX-XXXX-7734",
    creditScore: 812,
    salaryCredits: [95000, 95000, 98000],
    balance: 842000,
    city: "Bengaluru",
    avatar: "PM",
    avatarColor: "#FF4E6A",

    // YONO in-app searches (loan calculator, branch/property links clicked within app)
    yonoSearchHistory: [
      "Home loan EMI calculator",
      "MaxGain home loan eligibility",
      "Home insurance for loan",
    ],
    yonoSearchHistoryHi: [
      "होम लोन EMI कैलकुलेटर",
      "मैक्सगेन होम लोन पात्रता",
      "ऋण के लिए होम बीमा",
    ],

    // SBI account transaction history — real-estate category debits (all channels)
    travelSpend: [4200, 3800, 3100],

    existingProducts: ["Savings Account", "Debit Card", "Mutual Funds"],

    prediction: {
      lifeEvent: "First Home Purchase",
      lifeEventHi: "पहला घर खरीदना",
      confidence: 87,
      reasoning:
        "YONO app shows repeated use of the home loan EMI calculator and MaxGain eligibility checker. SBI account transaction history shows real-estate service charges (all channels including UPI to property consultants) over 3 months. Stable salary of ₹95K+/month supports a ₹75L loan.",
      reasoningHi:
        "YONO ऐप में होम लोन EMI कैलकुलेटर और मैक्सगेन पात्रता जांच का बार-बार उपयोग। SBI खाते के लेनदेन इतिहास (UPI सहित सभी चैनल) में रियल-एस्टेट सेवा शुल्क। ₹95K+/माह की स्थिर आय ₹75L ऋण का समर्थन करती है।",
      products: [
        {
          id: "home_loan",
          name: "SBI MaxGain Home Loan",
          nameHi: "SBI मैक्सगेन होम लोन",
          icon: "Home",
          description: "₹75L at 8.5% p.a. Overdraft facility — park surplus and save interest.",
          descriptionHi: "₹75L 8.5% प्रति वर्ष पर। ओवरड्राफ्ट सुविधा — अधिशेष पार्क करें और ब्याज बचाएं।",
          rate: "8.50% p.a.",
          badge: "⚠️ RM Review",
          badgeHi: "⚠️ RM समीक्षा",
          color: "#FF4E6A",
        },
        {
          id: "home_insurance",
          name: "SBI Home Shield Insurance",
          nameHi: "SBI होम शील्ड बीमा",
          icon: "Shield",
          description: "Structure + contents cover. Mandatory for loan disbursement.",
          descriptionHi: "स्ट्रक्चर + कंटेंट कवर। ऋण वितरण के लिए अनिवार्य।",
          rate: "₹4,200/year",
          badge: "Required",
          badgeHi: "आवश्यक",
          color: "#1A73E8",
        },
        {
          id: "sip",
          name: "SBI Mutual Fund SIP",
          nameHi: "SBI म्यूचुअल फंड SIP",
          icon: "TrendingUp",
          description: "Park down-payment savings. Auto-debit from salary date.",
          descriptionHi: "डाउन-पेमेंट बचत पार्क करें। वेतन तिथि से ऑटो-डेबिट।",
          rate: "12–16% historical",
          badge: "Recommended",
          badgeHi: "अनुशंसित",
          color: "#00D68F",
        },
      ],
      escalate: true,
      loanAmount: 7500000,
      escalationReason:
        "Loan amount ₹75L exceeds ₹50L threshold. Requires Relationship Manager review per RBI guidelines.",
      escalationReasonHi:
        "ऋण राशि ₹75L, ₹50L की सीमा से अधिक है। RBI दिशानिर्देशों के अनुसार रिलेशनशिप मैनेजर की समीक्षा आवश्यक है।",
    },
  },
  {
    id: "cust_003",
    name: "Arjun & Kavya Singh",
    nameHi: "अर्जुन और काव्या सिंह",
    age: 28,
    accountNumber: "XXXX-XXXX-2219",
    creditScore: 724,
    salaryCredits: [72000, 72000, 75000],
    balance: 315000,
    city: "Pune",
    avatar: "AK",
    avatarColor: "#00D68F",

    // YONO in-app searches (child plan calculator, hospital loan queries)
    yonoSearchHistory: [
      "Child education plan SBI",
      "Smart Scholar premium calculator",
      "Maternity cover top-up",
    ],
    yonoSearchHistoryHi: [
      "SBI बाल शिक्षा योजना",
      "स्मार्ट स्कॉलर प्रीमियम कैलकुलेटर",
      "मातृत्व कवर टॉप-अप",
    ],

    // SBI account CBS data — baby/medical category debits across all channels
    travelSpend: [2100, 1800, 900],

    existingProducts: ["Joint Savings Account", "Home Loan"],

    prediction: {
      lifeEvent: "Starting a Family",
      lifeEventHi: "परिवार शुरू करना",
      confidence: 78,
      reasoning:
        "YONO app shows child education plan and maternity cover searches. SBI account transaction history shows rising baby/medical category debits (UPI, card, ATM — all channels tracked via CBS). Travel-category spend declining (nesting behaviour). Combined salary strong for family financial planning.",
      reasoningHi:
        "YONO ऐप में बाल शिक्षा योजना और मातृत्व कवर खोजें। SBI CBS में बेबी/मेडिकल श्रेणी खर्च बढ़ा (UPI, कार्ड, ATM — सभी चैनल)। यात्रा खर्च घट रहा है।",
      products: [
        {
          id: "child_plan",
          name: "SBI Life Smart Scholar",
          nameHi: "SBI लाइफ स्मार्ट स्कॉलर",
          icon: "Baby",
          description: "Child education + insurance combo. Waiver of premium on parent's death.",
          descriptionHi: "बाल शिक्षा + बीमा कॉम्बो। माता-पिता की मृत्यु पर प्रीमियम माफ।",
          rate: "₹5,000/month",
          badge: "Most Popular",
          badgeHi: "सर्वाधिक लोकप्रिय",
          color: "#00D68F",
        },
        {
          id: "term_insurance",
          name: "SBI Life eShield",
          nameHi: "SBI लाइफ ई-शील्ड",
          icon: "Shield",
          description: "₹1 Cr term cover. Protect the family's future.",
          descriptionHi: "₹1 करोड़ टर्म कवर। परिवार के भविष्य की रक्षा करें।",
          rate: "₹9,800/year",
          badge: "Recommended",
          badgeHi: "अनुशंसित",
          color: "#1A73E8",
        },
        {
          id: "recurring_deposit",
          name: "SBI Recurring Deposit",
          nameHi: "SBI आवर्ती जमा",
          icon: "PiggyBank",
          description: "Build a baby fund at 7.1% p.a. Flexible tenures 12–120 months.",
          descriptionHi: "7.1% प्रति वर्ष पर बेबी फंड बनाएं। 12–120 महीने का लचीला कार्यकाल।",
          rate: "7.10% p.a.",
          badge: "New",
          badgeHi: "नया",
          color: "#FFB347",
        },
      ],
      escalate: false,
      loanAmount: 0,
    },
  },
  {
    id: "cust_004",
    name: "Vikram Nair",
    nameHi: "विक्रम नायर",
    age: 38,
    accountNumber: "XXXX-XXXX-9901",
    creditScore: 789,
    salaryCredits: [185000, 185000, 190000],
    balance: 2140000,
    city: "Dubai → Kochi",
    avatar: "VN",
    avatarColor: "#FFB347",

    // YONO NRI app in-app searches (account conversion, FD maturity queries)
    yonoSearchHistory: [
      "NRE to RFC account conversion",
      "FCNR maturity repatriation",
      "DTAA India UAE SBI form",
    ],
    yonoSearchHistoryHi: [
      "NRE से RFC खाता रूपांतरण",
      "FCNR परिपक्वता प्रत्यावर्तन",
      "DTAA भारत UAE SBI फॉर्म",
    ],

    // SBI CBS: international airline + India hotel debits, all channels (card, UPI, ATM)
    travelSpend: [25000, 31000, 42000],

    existingProducts: ["NRE Account", "NRO FD", "FCNR Deposit"],

    prediction: {
      lifeEvent: "NRI Returning to India",
      lifeEventHi: "भारत लौट रहा NRI",
      confidence: 83,
      reasoning:
        "YONO NRI app shows NRE-to-RFC conversion and FCNR maturity queries. SBI account transaction history shows rising India-hotel and domestic airline debits across all channels (card swipe, UPI, NEFT) over 3 months. FCNR maturity planning needed.",
      reasoningHi:
        "YONO NRI ऐप में NRE-से-RFC रूपांतरण और FCNR परिपक्वता प्रश्न। SBI CBS में भारत-होटल और घरेलू एयरलाइन डेबिट बढ़ रहे हैं (सभी चैनल)।",
      products: [
        {
          id: "resident_account",
          name: "SBI Resident Foreign Currency",
          nameHi: "SBI रेजिडेंट फॉरेन करेंसी",
          icon: "Landmark",
          description: "Seamless NRE → RFC conversion. Protect forex gains.",
          descriptionHi: "सहज NRE → RFC रूपांतरण। विदेशी मुद्रा लाभ सुरक्षित करें।",
          rate: "Preferential rates",
          badge: "Priority",
          badgeHi: "प्राथमिकता",
          color: "#FFB347",
        },
        {
          id: "wealth_fd",
          name: "SBI Wealth FD",
          nameHi: "SBI वेल्थ FD",
          icon: "Banknote",
          description: "Park repatriated funds. 7.4% p.a. for 400-day tenure.",
          descriptionHi: "प्रत्यावर्तित निधि पार्क करें। 400-दिन कार्यकाल के लिए 7.4% प्रति वर्ष।",
          rate: "7.40% p.a.",
          badge: "Best Rate",
          badgeHi: "सर्वोत्तम दर",
          color: "#1A73E8",
        },
        {
          id: "tax_advisory",
          name: "SBI Tax Advisory Service",
          nameHi: "SBI कर सलाहकार सेवा",
          icon: "FileText",
          description: "DTAA benefit consultation. FEMA compliance support.",
          descriptionHi: "DTAA लाभ परामर्श। FEMA अनुपालन सहायता।",
          rate: "Free with Wealth A/C",
          badge: "Complimentary",
          badgeHi: "मानार्थ",
          color: "#00D68F",
        },
      ],
      escalate: false,
      loanAmount: 0,
    },
  },
  {
    id: "cust_005",
    name: "Sunita Devi",
    nameHi: "सुनीता देवी",
    age: 57,
    accountNumber: "XXXX-XXXX-3344",
    creditScore: 801,
    salaryCredits: [62000, 62000, 0],
    balance: 1890000,
    city: "Varanasi",
    avatar: "SD",
    avatarColor: "#9B59B6",

    // YONO app in-app searches (FD calculator, pension plan pages viewed)
    yonoSearchHistory: [
      "Wecare Senior FD rates",
      "SBI Annuity Deposit calculator",
      "Arogya Premier health cover",
    ],
    yonoSearchHistoryHi: [
      "वीकेयर सीनियर FD दरें",
      "SBI वार्षिकी जमा कैलकुलेटर",
      "आरोग्य प्रीमियर हेल्थ कवर",
    ],

    // SBI CBS — minimal transaction activity (retired); pharmacy category debits rising
    travelSpend: [800, 600, 400],

    existingProducts: ["Savings Account", "PPF", "LIC Policy"],

    prediction: {
      lifeEvent: "Retirement Planning",
      lifeEventHi: "सेवानिवृत्ति योजना",
      confidence: 91,
      reasoning:
        "Last salary credit to SBI account is zero (retirement signal from passbook/CBS). YONO app shows FD calculator and pension plan page visits. SBI account transaction history shows pharmacy-category debits rising (across UPI, card, ATM channels — all tracked via CBS). High corpus of ₹18.9L ready for deployment.",
      reasoningHi:
        "SBI खाते में अंतिम वेतन क्रेडिट शून्य है (CBS/पासबुक से सेवानिवृत्ति संकेत)। YONO ऐप में FD कैलकुलेटर और पेंशन योजना पेज विजिट। SBI CBS में फार्मेसी-श्रेणी डेबिट बढ़ रहे हैं। ₹18.9L का उच्च कोष तैयार।",
      products: [
        {
          id: "sr_citizen_fd",
          name: "SBI Wecare Senior FD",
          nameHi: "SBI वीकेयर सीनियर FD",
          icon: "Banknote",
          description: "Extra 0.50% p.a. for senior citizens. Quarterly interest payout.",
          descriptionHi: "वरिष्ठ नागरिकों के लिए अतिरिक्त 0.50% प्रति वर्ष। त्रैमासिक ब्याज भुगतान।",
          rate: "7.75% p.a.",
          badge: "Senior Benefit",
          badgeHi: "वरिष्ठ लाभ",
          color: "#9B59B6",
        },
        {
          id: "health_insurance",
          name: "SBI Arogya Premier",
          nameHi: "SBI आरोग्य प्रीमियर",
          icon: "Heart",
          description: "₹20L health cover. No room rent limit. Covers pre-existing conditions.",
          descriptionHi: "₹20L स्वास्थ्य कवर। कमरे के किराए की कोई सीमा नहीं। पूर्व-मौजूदा स्थितियां कवर।",
          rate: "₹22,400/year",
          badge: "Recommended",
          badgeHi: "अनुशंसित",
          color: "#FF4E6A",
        },
        {
          id: "pension_plan",
          name: "SBI Annuity Deposit",
          nameHi: "SBI वार्षिकी जमा",
          icon: "Calendar",
          description: "Monthly pension income from lump-sum. Guaranteed for 3–7 years.",
          descriptionHi: "एकमुश्त राशि से मासिक पेंशन आय। 3–7 साल के लिए गारंटीकृत।",
          rate: "₹14,200/month est.",
          badge: "New",
          badgeHi: "नया",
          color: "#00D68F",
        },
      ],
      escalate: false,
      loanAmount: 0,
    },
  },
];

export const getCustomerById = (id) => MOCK_CUSTOMERS.find((c) => c.id === id);
