// ---------------------------------------------------------------------------
// Shared domain types for the Groww Gen Z prototype. All data is mocked; these
// types describe the single in-memory source of truth used by every screen.
// ---------------------------------------------------------------------------

export type RiskProfile = 'Cautious' | 'Balanced' | 'Growth'

export interface Index {
  name: string
  value: number
  change: number // absolute points
  changePct: number
}

export type FundCategory =
  | 'Index'
  | 'Flexi Cap'
  | 'ELSS'
  | 'Small Cap'
  | 'Debt'
  | 'Gold'
  | 'US Equity'

export interface Fund {
  id: string
  name: string
  amc: string
  category: FundCategory
  nav: number
  return1y: number
  return3y: number
  return5y: number
  expenseRatioDirect: number // %, direct plan
  expenseRatioRegular: number // %, regular plan (for the transparency screen)
  riskLabel: 'Low' | 'Moderate' | 'High' | 'Very High'
  minSip: number
  rating: number // 1-5
  spark: number[] // tiny NAV history for a sparkline
  themeTags?: string[] // e.g. 'Green/ESG', 'Made in India'
}

export interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  changePct: number
  sector: string
  spark: number[]
}

export interface Holding {
  fundId: string
  investedValue: number
  currentValue: number
  units: number
}

export interface SipEntry {
  fundId: string
  amount: number
  active: boolean
  nextDate: string
}

export type GoalKind = 'travel' | 'gadget' | 'safety' | 'freedom'

export interface Goal {
  id: string
  name: string
  emoji: string
  kind: GoalKind
  target: number
  saved: number
  monthlySip: number
  targetMonths: number
  suggestedFundId: string
  createdByUser?: boolean
}

export interface LearnCard {
  id: string
  emoji: string
  title: string
  category: string
  readSeconds: number
  body: string[]
  xp: number
  unlocks?: 'fno' // reading this contributes to unlocking a product
  quiz: {
    question: string
    options: string[]
    correctIndex: number
    explain: string
  }
}

export interface CommunityStat {
  label: string
  value: string
  sub: string
}

export interface ThemeBasket {
  id: string
  name: string
  emoji: string
  blurb: string
  fundIds: string[]
}

export interface Ipo {
  id: string
  name: string
  priceBand: string
  lotSize: number
  status: 'Open' | 'Upcoming' | 'Closed'
  closeDate: string
  gmpNote: string
  applied?: boolean
  allotment?: 'Pending' | 'Allotted' | 'Not allotted'
}

export interface RoundUp {
  spends: number
  total: number
}

export interface BuddyAnswer {
  id: string
  intents: string[] // keyword triggers
  answer: string
  chips?: string[] // suggested follow-up prompts
}
