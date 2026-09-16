// ---------------------------------------------------------------------------
// ONE mock dataset: the single source of truth shared by the standard Groww
// surface and the Gen Z layer, so numbers match everywhere. Nothing here is
// real: no live prices, no KYC, no transactions.
// ---------------------------------------------------------------------------

import type {
  BuddyAnswer,
  CommunityStat,
  Fund,
  Goal,
  Holding,
  Index,
  Ipo,
  LearnCard,
  SipEntry,
  Stock,
  ThemeBasket,
} from './types'

export const COMPLIANCE_LINE =
  'Not investment advice. Past performance is no guarantee of future returns.'

// Assumption stated up-front (used in every projection).
export const RETURN_ASSUMPTION = 0.12 // 12% p.a. long-term equity assumption
export const BROKERAGE_FLAT = 20 // flat ₹20 per executed order (delivery-free framing)

export const INDICES: Index[] = [
  { name: 'NIFTY 50', value: 24218.6, change: 112.35, changePct: 0.47 },
  { name: 'SENSEX', value: 79476.19, change: 384.3, changePct: 0.49 },
  { name: 'BANK NIFTY', value: 51334.05, change: -96.4, changePct: -0.19 },
]

// --- Funds --------------------------------------------------------------
export const FUNDS: Fund[] = [
  {
    id: 'nifty50-index',
    name: 'Groww Nifty 50 Index Fund',
    amc: 'Groww MF',
    category: 'Index',
    nav: 28.41,
    return1y: 14.2,
    return3y: 15.1,
    return5y: 15.8,
    expenseRatioDirect: 0.08,
    expenseRatioRegular: 0.6,
    riskLabel: 'Moderate',
    minSip: 100,
    rating: 4,
    spark: [22, 22.6, 23.1, 22.8, 24, 25.2, 26.1, 27, 27.6, 28.41],
    themeTags: ['Made in India'],
  },
  {
    id: 'flexi-cap',
    name: 'Parag Parikh Flexi Cap',
    amc: 'PPFAS',
    category: 'Flexi Cap',
    nav: 78.9,
    return1y: 19.4,
    return3y: 18.2,
    return5y: 22.6,
    expenseRatioDirect: 0.63,
    expenseRatioRegular: 1.35,
    riskLabel: 'High',
    minSip: 100,
    rating: 5,
    spark: [55, 58, 61, 60, 64, 68, 71, 73, 76, 78.9],
    themeTags: ['Brands I use'],
  },
  {
    id: 'elss-tax',
    name: 'Mirae Asset ELSS Tax Saver',
    amc: 'Mirae',
    category: 'ELSS',
    nav: 44.2,
    return1y: 16.8,
    return3y: 17.4,
    return5y: 19.1,
    expenseRatioDirect: 0.6,
    expenseRatioRegular: 1.55,
    riskLabel: 'High',
    minSip: 500,
    rating: 4,
    spark: [32, 33, 35, 34, 37, 39, 41, 42, 43, 44.2],
  },
  {
    id: 'smallcap',
    name: 'Nippon India Small Cap',
    amc: 'Nippon',
    category: 'Small Cap',
    nav: 168.3,
    return1y: 24.9,
    return3y: 27.1,
    return5y: 31.2,
    expenseRatioDirect: 0.68,
    expenseRatioRegular: 1.6,
    riskLabel: 'Very High',
    minSip: 100,
    rating: 4,
    spark: [110, 118, 126, 120, 134, 145, 152, 158, 164, 168.3],
  },
  {
    id: 'liquid-debt',
    name: 'ICICI Pru Liquid Fund',
    amc: 'ICICI Pru',
    category: 'Debt',
    nav: 361.4,
    return1y: 7.1,
    return3y: 6.4,
    return5y: 5.9,
    expenseRatioDirect: 0.2,
    expenseRatioRegular: 0.32,
    riskLabel: 'Low',
    minSip: 100,
    rating: 4,
    spark: [340, 343, 346, 349, 351, 354, 356, 358, 360, 361.4],
  },
  {
    id: 'gold-etf-fof',
    name: 'HDFC Gold Fund',
    amc: 'HDFC',
    category: 'Gold',
    nav: 24.9,
    return1y: 18.3,
    return3y: 14.9,
    return5y: 12.7,
    expenseRatioDirect: 0.17,
    expenseRatioRegular: 0.5,
    riskLabel: 'Moderate',
    minSip: 100,
    rating: 3,
    spark: [18, 18.6, 19.4, 20.1, 21, 22, 22.8, 23.6, 24.4, 24.9],
    themeTags: ['Green/ESG'],
  },
  {
    id: 'us-equity',
    name: 'Motilal Oswal Nasdaq 100 FoF',
    amc: 'Motilal Oswal',
    category: 'US Equity',
    nav: 39.7,
    return1y: 27.4,
    return3y: 19.8,
    return5y: 23.1,
    expenseRatioDirect: 0.24,
    expenseRatioRegular: 0.58,
    riskLabel: 'Very High',
    minSip: 500,
    rating: 4,
    spark: [26, 28, 30, 29, 32, 34, 36, 37, 38, 39.7],
    themeTags: ['Brands I use'],
  },
]

export const fundById = (id: string): Fund =>
  FUNDS.find((f) => f.id === id) ?? FUNDS[0]

// --- Stocks -------------------------------------------------------------
export const STOCKS: Stock[] = [
  { id: 'reliance', symbol: 'RELIANCE', name: 'Reliance Industries', price: 2941.5, changePct: 1.24, sector: 'Energy', spark: [2800, 2830, 2870, 2850, 2900, 2920, 2941.5] },
  { id: 'tcs', symbol: 'TCS', name: 'Tata Consultancy Svcs', price: 4180.2, changePct: -0.62, sector: 'IT', spark: [4220, 4200, 4230, 4190, 4205, 4195, 4180.2] },
  { id: 'hdfcbank', symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1685.0, changePct: 0.38, sector: 'Banking', spark: [1650, 1660, 1675, 1670, 1680, 1682, 1685] },
  { id: 'infy', symbol: 'INFY', name: 'Infosys', price: 1902.4, changePct: 2.11, sector: 'IT', spark: [1830, 1850, 1870, 1860, 1885, 1895, 1902.4] },
  { id: 'zomato', symbol: 'ZOMATO', name: 'Zomato', price: 268.9, changePct: 3.42, sector: 'Consumer Tech', spark: [240, 248, 255, 250, 260, 264, 268.9] },
  { id: 'tatamotors', symbol: 'TATAMOTORS', name: 'Tata Motors', price: 976.3, changePct: -1.08, sector: 'Auto', spark: [1000, 995, 990, 985, 982, 980, 976.3] },
]

export const stockById = (id: string): Stock =>
  STOCKS.find((s) => s.id === id) ?? STOCKS[0]

// --- Portfolio / holdings (mock) ---------------------------------------
// Deliberately concentrated so Buddy can flag "90% in one fund".
export const HOLDINGS: Holding[] = [
  { fundId: 'flexi-cap', investedValue: 18000, currentValue: 21240, units: 269.2 },
  { fundId: 'nifty50-index', investedValue: 6000, currentValue: 6710, units: 236.2 },
  { fundId: 'liquid-debt', investedValue: 3000, currentValue: 3080, units: 8.5 },
]

export const SIPS: SipEntry[] = [
  { fundId: 'flexi-cap', amount: 1000, active: true, nextDate: '5 Oct' },
  { fundId: 'nifty50-index', amount: 500, active: true, nextDate: '5 Oct' },
]

// --- Goals --------------------------------------------------------------
export const GOALS: Goal[] = [
  {
    id: 'goa',
    name: 'Goa trip',
    emoji: '🏖️',
    kind: 'travel',
    target: 40000,
    saved: 12500,
    monthlySip: 2200,
    targetMonths: 14,
    suggestedFundId: 'liquid-debt',
  },
  {
    id: 'iphone',
    name: 'iPhone',
    emoji: '📱',
    kind: 'gadget',
    target: 80000,
    saved: 18000,
    monthlySip: 3400,
    targetMonths: 20,
    suggestedFundId: 'nifty50-index',
  },
  {
    id: 'emergency',
    name: '6-mo emergency fund',
    emoji: '🛟',
    kind: 'safety',
    target: 90000,
    saved: 0,
    monthlySip: 5000,
    targetMonths: 18,
    suggestedFundId: 'liquid-debt',
  },
  {
    id: 'fire',
    name: 'FIRE (₹50L head-start)',
    emoji: '🔥',
    kind: 'freedom',
    target: 5000000,
    saved: 84000,
    monthlySip: 8000,
    targetMonths: 240,
    suggestedFundId: 'flexi-cap',
  },
]

// --- Learn feed ---------------------------------------------------------
export const LEARN_CARDS: LearnCard[] = [
  {
    id: 'what-is-sip',
    emoji: '💧',
    title: 'What a SIP actually does',
    category: 'Basics',
    readSeconds: 55,
    xp: 20,
    body: [
      'A SIP just means you invest a fixed amount on a fixed date, say ₹500 every month, instead of trying to time the market.',
      'Because the amount is fixed, you buy more units when prices are low and fewer when high. That averaging is the whole trick.',
      'Why it matters at 22: your biggest edge is time, not a big ticket. ₹500/mo started now beats ₹5,000/mo started at 32.',
    ],
    quiz: {
      question: 'The main benefit of a SIP is…',
      options: ['Guaranteed profit', 'Rupee-cost averaging over time', 'Beating the market daily'],
      correctIndex: 1,
      explain: 'SIPs average your buy price over time. No investment guarantees profit.',
    },
  },
  {
    id: 'index-vs-active',
    emoji: '🗂️',
    title: 'Index vs active funds',
    category: 'Funds',
    readSeconds: 60,
    xp: 20,
    body: [
      'An index fund simply copies a basket like the Nifty 50. Low cost, no fund manager guessing.',
      'An active fund pays a manager to try to beat the index. Sometimes they do; the higher fee (expense ratio) is certain, the outperformance is not.',
      'Why it matters at 22: a 1% higher fee for 20 years can quietly eat a big slice of your corpus. Start cheap and boring.',
    ],
    quiz: {
      question: 'An index fund…',
      options: ['Tries to beat the market', 'Copies a market basket at low cost', 'Is risk-free'],
      correctIndex: 1,
      explain: 'Index funds track a basket cheaply. All equity carries risk.',
    },
  },
  {
    id: 'expense-ratio',
    emoji: '🧾',
    title: 'Expense ratio, explained',
    category: 'Fees',
    readSeconds: 45,
    xp: 15,
    body: [
      'The expense ratio is the yearly fee a fund charges, shown as a % of your money.',
      'A "direct" plan cuts out distributor commission, so its expense ratio is lower than the "regular" plan for the exact same fund.',
      'Why it matters at 22: on Groww, mutual funds are direct and commission-free. Same fund, lower fee, more of the return stays yours.',
    ],
    quiz: {
      question: 'A direct plan vs a regular plan of the same fund…',
      options: ['Is a different fund', 'Has a lower expense ratio', 'Has higher risk'],
      correctIndex: 1,
      explain: 'Direct plans skip distributor commission, so the fee is lower.',
    },
  },
  {
    id: 'what-is-fno',
    emoji: '⚠️',
    title: 'What F&O is, and why it is risky',
    category: 'Risk',
    readSeconds: 60,
    xp: 25,
    unlocks: 'fno',
    body: [
      'F&O (Futures & Options) are leveraged contracts. Leverage means small moves get multiplied, up and down.',
      'SEBI’s own study found roughly 9 in 10 individual F&O traders lose money, and the average loser lost over ₹1 lakh.',
      'Why it matters at 22: this is speculation, not investing. If you are still building an emergency fund, F&O can undo years of SIPs in weeks.',
    ],
    quiz: {
      question: 'Leverage in F&O means…',
      options: ['Lower risk', 'Gains and losses are magnified', 'Guaranteed returns'],
      correctIndex: 1,
      explain: 'Leverage magnifies both directions. Most retail F&O traders lose money.',
    },
  },
  {
    id: 'elss-80c',
    emoji: '🛡️',
    title: 'ELSS & the 80C tax break',
    category: 'Tax',
    readSeconds: 50,
    xp: 20,
    body: [
      'ELSS funds are equity funds that also cut your taxable income under Section 80C (old regime), up to ₹1.5L a year.',
      'They have the shortest lock-in of all 80C options, just 3 years, and you can invest from as little as ₹500 a SIP.',
      'Why it matters at 22: your first job’s tax can be trimmed while your money still compounds in equity. Two wins, one product.',
    ],
    quiz: {
      question: 'ELSS funds give you…',
      options: ['A guaranteed 80C refund', 'Equity growth + an 80C tax break', 'Zero lock-in'],
      correctIndex: 1,
      explain: 'ELSS combines equity exposure with an 80C deduction and a 3-year lock-in.',
    },
  },
  {
    id: 'diversification',
    emoji: '🧺',
    title: 'Don’t put it all in one fund',
    category: 'Risk',
    readSeconds: 45,
    xp: 15,
    body: [
      'Concentration is when most of your money sits in a single fund or stock. One bad year hits your whole corpus.',
      'Spreading across an index + a flexi-cap + some debt smooths the ride without needing you to predict anything.',
      'Why it matters at 22: you can’t out-pick the market yet, but you can refuse to bet everything on one square.',
    ],
    quiz: {
      question: 'Diversification mainly reduces…',
      options: ['Your fees', 'Single-holding risk', 'Your returns forever'],
      correctIndex: 1,
      explain: 'Spreading money lowers the damage any one holding can do.',
    },
  },
]

// --- Community (compliance-safe, aggregated, NO tips) -------------------
export const COMMUNITY_STATS: CommunityStat[] = [
  { label: 'Investors aged 20-26 on Groww', value: '1 in 3', sub: 'of all new accounts this year' },
  { label: 'Most-started first SIP', value: '₹500', sub: 'median monthly ticket for your age' },
  { label: 'Have an active SIP streak', value: '61%', sub: 'of Gen Z investors, 3+ months' },
  { label: 'Top first-fund CATEGORY', value: 'Index funds', sub: 'a category, not a specific fund' },
]

export const THEME_BASKETS: ThemeBasket[] = [
  {
    id: 'green',
    name: 'Green / ESG',
    emoji: '🌱',
    blurb: 'Funds tilted toward cleaner, lower-carbon businesses.',
    fundIds: ['gold-etf-fof', 'nifty50-index'],
  },
  {
    id: 'india',
    name: 'Made in India',
    emoji: '🇮🇳',
    blurb: 'Domestic-growth themes and broad India indices.',
    fundIds: ['nifty50-index', 'flexi-cap'],
  },
  {
    id: 'brands',
    name: 'Brands I use',
    emoji: '🛍️',
    blurb: 'Everyday consumer & tech names you already know.',
    fundIds: ['flexi-cap', 'us-equity'],
  },
]

// --- IPOs ---------------------------------------------------------------
export const IPOS: Ipo[] = [
  { id: 'ipo-swiggy', name: 'Swiggy Ltd', priceBand: '₹371 - ₹390', lotSize: 38, status: 'Open', closeDate: '18 Sep', gmpNote: 'Grey-market chatter is not a signal. Ignore it.' },
  { id: 'ipo-nsdl', name: 'NSDL', priceBand: '₹760 - ₹800', lotSize: 18, status: 'Upcoming', closeDate: '24 Sep', gmpNote: 'Read the RHP risk factors before applying.' },
  { id: 'ipo-oyo', name: 'Oravel (OYO)', priceBand: '₹430 - ₹455', lotSize: 32, status: 'Closed', closeDate: '2 Sep', gmpNote: 'Allotment is out. Check your status.', applied: true, allotment: 'Pending' },
]

// --- Groww Buddy scripted answers (offline engine seed) -----------------
// A calm plain-language coach. Never a tipster: no buy/sell calls, ever.
export const BUDDY_ANSWERS: BuddyAnswer[] = [
  {
    id: 'greeting',
    intents: ['hi', 'hello', 'hey', 'start', 'help'],
    answer:
      "Hey! I'm Groww Buddy, your calm money coach (not a tipster). I won't tell you what to buy or sell, but I'll happily explain any term, talk you off a panic-ledge, or sanity-check your plan. What's on your mind?",
    chips: ['What is a SIP?', 'Should I buy Zomato?', 'Market is crashing', 'Explain expense ratio'],
  },
  {
    id: 'buy-call',
    intents: ['should i buy', 'buy this', 'good stock', 'which stock', 'buy zomato', 'buy reliance', 'tip', 'multibagger', 'hot stock', 'sell'],
    answer:
      "I can't give buy or sell calls. That's a promise, not a dodge. Chasing a single trending stock is speculation, not investing. The better questions: what's your time horizon, and is your money spread out? If you're investing for years, a diversified SIP beats betting on one name you saw in a reel. Want me to show your long-term projection instead?",
    chips: ['Show my projection', 'Why is diversification safer?', 'What should a beginner do?'],
  },
  {
    id: 'panic',
    intents: ['crash', 'crashing', 'falling', 'red', 'panic', 'should i sell', 'market down', 'losing money', 'scared', 'stop sip'],
    answer:
      "Deep breath. This is normal. Markets fall about 1 year in 4, then recover. Selling now locks in the loss; staying invested and keeping your SIP means you're actually buying cheaper units this month. The people who do well are boringly consistent, not reactive. Want to see how your ₹500/mo looks over 10 years instead of today?",
    chips: ['Show 10-year projection', 'Should I pause my SIP?', 'Why not just sell?'],
  },
  {
    id: 'concentration',
    intents: ['diversif', 'one fund', 'concentrated', 'too much', 'risky portfolio', 'spread', 'all in one'],
    answer:
      "Good instinct to ask. Right now a big chunk of your portfolio sits in a single flexi-cap fund, and that's concentration. It's not 'wrong', but one bad year for that fund hits almost everything you own. Adding an index fund and a bit of debt spreads the risk without you needing to predict anything. Want the plain version of how to rebalance a small portfolio?",
    chips: ['How do I rebalance?', 'What is an index fund?', 'Show my portfolio'],
  },
  {
    id: 'sip',
    intents: ['what is sip', 'sip mean', 'systematic', 'define sip'],
    answer:
      "A SIP is just investing a fixed amount on a fixed date, like ₹500 every month, instead of timing the market. You automatically buy more units when prices dip and fewer when they're high. Why it matters at 22: consistency plus time is your superpower, and you don't need a big ticket to start.",
    chips: ['Start a ₹500 SIP', 'SIP vs lump sum?', 'What is rupee-cost averaging?'],
  },
  {
    id: 'index',
    intents: ['index fund', 'what is index', 'nifty fund', 'passive'],
    answer:
      "An index fund copies a basket like the Nifty 50: no manager guessing, very low fee. It won't beat the market, it just is the market, cheaply. Why it matters at 22: low costs compound in your favour over decades, and you skip the stress of picking winners.",
    chips: ['Index vs active?', 'What is expense ratio?', 'Is it safe?'],
  },
  {
    id: 'expense-ratio',
    intents: ['expense ratio', 'fee', 'cost of fund', 'direct vs regular', 'commission'],
    answer:
      "The expense ratio is a fund's yearly fee, shown as a % of your money. A 'direct' plan skips distributor commission, so it's cheaper than the 'regular' plan for the exact same fund. On Groww, mutual funds are direct: same fund, lower fee, more return stays yours. Over 20 years even a 1% gap is a lot.",
    chips: ['Show what I actually pay', 'What is a direct plan?', 'How much does 1% matter?'],
  },
  {
    id: 'fno',
    intents: ['f&o', 'fno', 'futures', 'options', 'leverage', 'derivatives', 'intraday'],
    answer:
      "F&O stands for Futures & Options: leveraged contracts where small moves get multiplied both ways. SEBI found roughly 9 in 10 individual F&O traders lose money. It's speculation, not investing. If you're still building an emergency fund, this can undo years of SIPs fast. That's why it's locked here until you pass a short reality-check quiz.",
    chips: ['Why is it locked?', 'What is leverage?', 'What should I do instead?'],
  },
  {
    id: 'elss',
    intents: ['elss', '80c', 'tax saving', 'tax save', 'save tax'],
    answer:
      "ELSS funds are equity funds that also cut your taxable income under Section 80C (old regime), up to ₹1.5L a year, with just a 3-year lock-in (the shortest of the 80C options). Why it matters at 22: your first salary's tax gets trimmed while the money still compounds in equity.",
    chips: ['See the 80C nudge', 'What is a lock-in?', 'How much can I save?'],
  },
  {
    id: 'emergency',
    intents: ['emergency fund', 'protection', 'safety net', 'how much emergency'],
    answer:
      "An emergency fund is 3 to 6 months of expenses kept somewhere safe and boring (like a liquid fund), so a job gap or a hospital bill doesn't force you to sell your investments at the worst time. Build this before F&O or aggressive bets. It's the least exciting and most important money you'll ever park.",
    chips: ['Start emergency goal', 'Where do I keep it?', 'Why before investing?'],
  },
  {
    id: 'beginner',
    intents: ['beginner', 'where do i start', 'new to this', 'first time', 'how to start', 'what should i do'],
    answer:
      "Simple, boring, and started-today beats clever-and-later. A common first setup: a small SIP into an index fund, a bit into a flexi-cap, and slowly build an emergency cushion in a liquid fund. Take the 4-question quiz and I'll help set a starter portfolio. No jargon, no pressure.",
    chips: ['Take the quiz', 'Start a ₹500 SIP', 'What is an index fund?'],
  },
  {
    id: 'projection',
    intents: ['projection', 'how much will i have', 'future value', '10 year', 'compound'],
    answer:
      "Here's the honest math (assuming a 12% long-term return, which isn't guaranteed): ₹500/mo for 10 years is ₹60,000 invested that could grow to around ₹1.15 lakh, and the extra is compounding doing the heavy lifting. Stretch it to 20 years and it's roughly ₹5 lakh. Time in the market is the whole game.",
    chips: ['Start a ₹500 SIP', 'What if I invest more?', 'Is 12% guaranteed?'],
  },
]

export const BUDDY_FALLBACK =
  "I want to give you a straight answer, but I'd rather not guess. I'm best at explaining terms (SIP, index fund, expense ratio, F&O, ELSS), calming market-panic nerves, and sanity-checking your plan. I never give buy/sell tips. Try one of these, or rephrase?"
