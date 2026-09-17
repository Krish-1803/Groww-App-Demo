// ---------------------------------------------------------------------------
// One Zustand store: mock user, portfolio, goals, streak, session counter,
// F&O unlock, Gen Z toggle, trades-per-day, round-ups, theme.
//
// Persisted to localStorage (see the persist() config below) so a returning
// visitor keeps their progress and is NOT sent back through onboarding on every
// reload. The "reset prototype" button clears that state deliberately.
// ---------------------------------------------------------------------------

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  GOALS,
  HOLDINGS,
  SIPS,
  USER,
  fundById,
  isGenZAge,
} from '../mock/data'
import type { Goal, Holding, RiskProfile, SipEntry } from '../mock/types'

export interface FnoState {
  unlocked: boolean
  quizPassed: boolean
  acknowledgedRisk: boolean
  cooloffUntil: number | null // timestamp; null = not started
}

export interface AppState {
  // ---- meta / app controls
  genZMode: boolean
  theme: 'light' | 'dark'
  onboarded: boolean
  onboardingOpen: boolean
  sessionCount: number
  showInfo: boolean
  notificationsRead: boolean

  // ---- user profile (from quiz)
  riskProfile: RiskProfile | null
  starterStarted: boolean

  // ---- money
  holdings: Holding[]
  sips: SipEntry[]
  goals: Goal[]
  roundUpEnabled: boolean

  // ---- streak / habit
  streakMonths: number
  xp: number
  learnedCardIds: string[]

  // ---- guardrails
  fno: FnoState
  tradesToday: number

  // ---- derived getters
  investedTotal: () => number
  currentTotal: () => number

  // ---- actions
  toggleGenZ: () => void
  toggleTheme: () => void
  setInfo: (v: boolean) => void
  markNotificationsRead: () => void
  openOnboarding: () => void
  closeOnboarding: () => void
  setRiskProfile: (p: RiskProfile) => void
  startStarterPortfolio: () => void
  completeOnboarding: () => void
  addSip: (fundId: string, amount: number) => void
  toggleRoundUp: () => void
  investRoundUp: (amount: number) => void
  addGoal: (g: Goal) => void
  contributeToGoal: (goalId: string, amount: number) => void
  markLearned: (cardId: string, xp: number) => void
  // F&O gating
  passFnoQuiz: () => void
  acknowledgeFnoRisk: () => void
  startCooloff: () => void
  skipCooloff: () => void // dev button
  finalizeFnoUnlock: () => void
  recordTrade: () => void
  resetTrades: () => void
  // demo
  bumpSession: () => void
  reset: () => void
}

const initialFno: FnoState = {
  unlocked: false,
  quizPassed: false,
  acknowledgedRisk: false,
  cooloffUntil: null,
}

/**
 * Pure helper: add `amount` into the holding for `fundId`, creating it if new.
 * Every path that puts money into a fund (SIP, round-up, goal contribution,
 * starter portfolio) routes through here, so the portfolio reflects it
 * everywhere the holdings are read.
 */
function addToHoldings(holdings: Holding[], fundId: string, amount: number): Holding[] {
  const fund = fundById(fundId)
  if (holdings.some((h) => h.fundId === fundId)) {
    return holdings.map((h) =>
      h.fundId === fundId
        ? {
            ...h,
            investedValue: h.investedValue + amount,
            currentValue: h.currentValue + amount,
            units: h.units + amount / fund.nav,
          }
        : h,
    )
  }
  return [
    ...holdings,
    { fundId, investedValue: amount, currentValue: amount, units: amount / fund.nav },
  ]
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
  genZMode: isGenZAge(USER.age), // Gen Z layer on by default for ages 20-26
  theme: 'light',
  onboarded: false,
  onboardingOpen: false,
  // Seeded at 2; the first real visit bumps it to 3 (see bumpSession, called
  // once per app load), which is when the "protection first" nudge kicks in
  // while the emergency fund is still ₹0.
  sessionCount: 2,
  showInfo: false,
  notificationsRead: false,

  riskProfile: null,
  starterStarted: false,

  holdings: HOLDINGS.map((h) => ({ ...h })),
  sips: SIPS.map((s) => ({ ...s })),
  goals: GOALS.map((g) => ({ ...g })),
  roundUpEnabled: false,

  streakMonths: 4,
  xp: 120,
  learnedCardIds: [],

  fno: { ...initialFno },
  tradesToday: 0,

  investedTotal: () =>
    get().holdings.reduce((sum, h) => sum + h.investedValue, 0),
  currentTotal: () =>
    get().holdings.reduce((sum, h) => sum + h.currentValue, 0),

  toggleGenZ: () => set((s) => ({ genZMode: !s.genZMode })),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setInfo: (v) => set({ showInfo: v }),
  markNotificationsRead: () => set({ notificationsRead: true }),
  openOnboarding: () => set({ onboardingOpen: true }),
  closeOnboarding: () => set({ onboardingOpen: false }),

  setRiskProfile: (p) => set({ riskProfile: p }),

  startStarterPortfolio: () =>
    set((s) => {
      if (s.starterStarted) return {}
      // Starter portfolio: index + flexi-cap (± satellite handled in UI copy).
      const already = new Set(s.sips.map((x) => x.fundId))
      const additions: SipEntry[] = []
      const seed = [
        { fundId: 'nifty50-index', amount: 300 },
        { fundId: 'flexi-cap', amount: 200 },
      ]
      for (const seedSip of seed) {
        if (!already.has(seedSip.fundId)) {
          additions.push({
            fundId: seedSip.fundId,
            amount: seedSip.amount,
            active: true,
            nextDate: '5 Oct',
          })
        }
      }
      return { starterStarted: true, sips: [...s.sips, ...additions] }
    }),

  completeOnboarding: () => set({ onboarded: true, onboardingOpen: false }),

  addSip: (fundId, amount) =>
    set((s) => {
      const existing = s.sips.find((x) => x.fundId === fundId)
      let sips: SipEntry[]
      if (existing) {
        sips = s.sips.map((x) =>
          x.fundId === fundId
            ? { ...x, amount: x.amount + amount, active: true }
            : x,
        )
      } else {
        sips = [
          ...s.sips,
          { fundId, amount, active: true, nextDate: '5 Oct' },
        ]
      }
      // Reflect the SIP as an immediate holding so portfolio numbers move.
      return { sips, holdings: addToHoldings(s.holdings, fundId, amount) }
    }),

  toggleRoundUp: () => set((s) => ({ roundUpEnabled: !s.roundUpEnabled })),

  investRoundUp: (amount) =>
    // Round-ups flow into the index fund by default.
    set((s) => ({ holdings: addToHoldings(s.holdings, 'nifty50-index', amount) })),

  addGoal: (g) => set((s) => ({ goals: [...s.goals, g] })),

  contributeToGoal: (goalId, amount) =>
    set((s) => {
      const goal = s.goals.find((g) => g.id === goalId)
      return {
        goals: s.goals.map((g) =>
          g.id === goalId ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g,
        ),
        // A goal contribution also buys into the goal's suggested fund, so it
        // shows up in Holdings / Portfolio like any other investment.
        holdings: goal ? addToHoldings(s.holdings, goal.suggestedFundId, amount) : s.holdings,
      }
    }),

  markLearned: (cardId, xp) =>
    set((s) => {
      if (s.learnedCardIds.includes(cardId)) return {}
      return { learnedCardIds: [...s.learnedCardIds, cardId], xp: s.xp + xp }
    }),

  passFnoQuiz: () =>
    set((s) => ({ fno: { ...s.fno, quizPassed: true } })),
  acknowledgeFnoRisk: () =>
    set((s) => ({ fno: { ...s.fno, acknowledgedRisk: true } })),
  startCooloff: () =>
    set((s) => ({
      fno: { ...s.fno, cooloffUntil: Date.now() + 24 * 60 * 60 * 1000 },
    })),
  skipCooloff: () =>
    set((s) => ({ fno: { ...s.fno, cooloffUntil: Date.now() - 1000 } })),
  finalizeFnoUnlock: () =>
    set((s) => {
      const { quizPassed, acknowledgedRisk, cooloffUntil } = s.fno
      const cooled = cooloffUntil !== null && Date.now() >= cooloffUntil
      if (quizPassed && acknowledgedRisk && cooled) {
        return { fno: { ...s.fno, unlocked: true } }
      }
      return {}
    }),

  recordTrade: () => set((s) => ({ tradesToday: s.tradesToday + 1 })),
  resetTrades: () => set({ tradesToday: 0 }),

  bumpSession: () => set((s) => ({ sessionCount: s.sessionCount + 1 })),

  reset: () =>
    set({
      genZMode: isGenZAge(USER.age),
      onboarded: false,
      onboardingOpen: false,
      sessionCount: 2,
      showInfo: false,
      notificationsRead: false,
      riskProfile: null,
      starterStarted: false,
      holdings: HOLDINGS.map((h) => ({ ...h })),
      sips: SIPS.map((s) => ({ ...s })),
      goals: GOALS.map((g) => ({ ...g })),
      roundUpEnabled: false,
      streakMonths: 4,
      xp: 120,
      learnedCardIds: [],
      fno: { ...initialFno },
      tradesToday: 0,
    }),
    }),
    {
      name: 'groww-genz-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist data only; actions and the transient info-sheet flag are skipped.
      partialize: (s) => ({
        genZMode: s.genZMode,
        theme: s.theme,
        onboarded: s.onboarded,
        sessionCount: s.sessionCount,
        notificationsRead: s.notificationsRead,
        riskProfile: s.riskProfile,
        starterStarted: s.starterStarted,
        holdings: s.holdings,
        sips: s.sips,
        goals: s.goals,
        roundUpEnabled: s.roundUpEnabled,
        streakMonths: s.streakMonths,
        xp: s.xp,
        learnedCardIds: s.learnedCardIds,
        fno: s.fno,
        tradesToday: s.tradesToday,
      }),
    },
  ),
)
