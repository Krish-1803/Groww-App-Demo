// ---------------------------------------------------------------------------
// One Zustand store: mock user, portfolio, goals, streak, session counter,
// F&O unlock, Gen Z toggle, trades-per-day, round-ups, theme. No persistence
// (prototype resets on reload / via the "reset prototype" button).
// ---------------------------------------------------------------------------

import { create } from 'zustand'
import {
  GOALS,
  HOLDINGS,
  SIPS,
  fundById,
} from '../mock/data'
import type { Goal, Holding, RiskProfile, SipEntry } from '../mock/types'

export interface FnoState {
  unlocked: boolean
  quizPassed: boolean
  acknowledgedRisk: boolean
  cooloffUntil: number | null // timestamp; null = not started
}

export interface AppState {
  // ---- meta / demo controls
  genZMode: boolean
  theme: 'light' | 'dark'
  onboarded: boolean
  sessionCount: number
  showInfo: boolean

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

export const useStore = create<AppState>((set, get) => ({
  genZMode: true, // default ON for the demo
  theme: 'light',
  onboarded: false,
  // Seeded at 3 so the "protection first" nudge (returns after 3 sessions while
  // the emergency fund is ₹0) is visible in the demo without needing reloads.
  sessionCount: 3,
  showInfo: false,

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

  completeOnboarding: () => set({ onboarded: true }),

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
      // Reflect the SIP as a small immediate holding so portfolio numbers move.
      const fund = fundById(fundId)
      const holdings = s.holdings.some((h) => h.fundId === fundId)
        ? s.holdings.map((h) =>
            h.fundId === fundId
              ? {
                  ...h,
                  investedValue: h.investedValue + amount,
                  currentValue: h.currentValue + amount,
                  units: h.units + amount / fund.nav,
                }
              : h,
          )
        : [
            ...s.holdings,
            {
              fundId,
              investedValue: amount,
              currentValue: amount,
              units: amount / fund.nav,
            },
          ]
      return { sips, holdings }
    }),

  toggleRoundUp: () => set((s) => ({ roundUpEnabled: !s.roundUpEnabled })),

  investRoundUp: (amount) =>
    set((s) => {
      // Round-ups flow into the index fund by default.
      const fund = fundById('nifty50-index')
      const holdings = s.holdings.some((h) => h.fundId === fund.id)
        ? s.holdings.map((h) =>
            h.fundId === fund.id
              ? {
                  ...h,
                  investedValue: h.investedValue + amount,
                  currentValue: h.currentValue + amount,
                  units: h.units + amount / fund.nav,
                }
              : h,
          )
        : [
            ...s.holdings,
            {
              fundId: fund.id,
              investedValue: amount,
              currentValue: amount,
              units: amount / fund.nav,
            },
          ]
      return { holdings }
    }),

  addGoal: (g) => set((s) => ({ goals: [...s.goals, g] })),

  contributeToGoal: (goalId, amount) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === goalId
          ? { ...g, saved: Math.min(g.target, g.saved + amount) }
          : g,
      ),
    })),

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
      genZMode: true,
      onboarded: false,
      sessionCount: 3,
      showInfo: false,
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
}))
