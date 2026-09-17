// Gen Z onboarding: a 4-question personality risk quiz (not a form) → risk
// profile → starter portfolio (index + flexi-cap ± satellite) → 10-yr
// projection of ₹500/mo → one-tap "Start first SIP ₹500". Works end-to-end.

import { useMemo, useState } from 'react'
import { ArrowRight, Check, PartyPopper, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { RiskProfile } from '../mock/types'
import { fundById, RETURN_ASSUMPTION } from '../mock/data'
import { sipFutureValue } from '../lib/finance'
import { cx, inr, inrCompact } from '../lib/utils'
import { Button, ComplianceLine } from '../components/primitives'
import { ProjectionChart } from '../components/ProjectionChart'

interface Q {
  q: string
  options: { label: string; score: number }[]
}

const QUESTIONS: Q[] = [
  {
    q: 'Your ₹10,000 SIP drops to ₹8,000 in a month. You…',
    options: [
      { label: 'Panic-sell everything', score: 0 },
      { label: 'Feel uneasy, but hold', score: 1 },
      { label: 'Shrug, it’s long-term', score: 2 },
      { label: 'Invest more, it’s on sale', score: 3 },
    ],
  },
  {
    q: 'What are you really investing for?',
    options: [
      { label: 'Safety, don’t lose my money', score: 0 },
      { label: 'A goal in 2 to 4 years', score: 1 },
      { label: 'Long-term wealth (10y+)', score: 2 },
      { label: 'Max growth, I’m young', score: 3 },
    ],
  },
  {
    q: 'How much of investing do you actually get?',
    options: [
      { label: 'Total beginner', score: 1 },
      { label: 'I know SIPs & funds', score: 2 },
      { label: 'Pretty comfortable', score: 3 },
    ],
  },
  {
    q: 'How much day-to-day swing can you sit through?',
    options: [
      { label: 'Very little, keep it steady', score: 0 },
      { label: 'Some ups and downs are fine', score: 2 },
      { label: 'Big swings don’t faze me', score: 3 },
    ],
  },
]

function profileFromScore(score: number): RiskProfile {
  if (score <= 3) return 'Cautious'
  if (score <= 7) return 'Balanced'
  return 'Growth'
}

const SATELLITE: Record<RiskProfile, { fundId: string; label: string; pct: number } | null> = {
  Cautious: { fundId: 'liquid-debt', label: 'debt cushion', pct: 10 },
  Balanced: { fundId: 'us-equity', label: 'global satellite', pct: 10 },
  Growth: { fundId: 'smallcap', label: 'small-cap satellite', pct: 10 },
}

// Renders the quiz as a full-frame overlay when the store asks for it.
export function OnboardingOverlay() {
  const open = useStore((s) => s.onboardingOpen)
  if (!open) return null
  return (
    <div className="no-scrollbar absolute inset-0 z-50 overflow-y-auto animate-fade-in">
      <Onboarding />
    </div>
  )
}

function Onboarding() {
  const setRiskProfile = useStore((s) => s.setRiskProfile)
  const startStarter = useStore((s) => s.startStarterPortfolio)
  const addSip = useStore((s) => s.addSip)
  const complete = useStore((s) => s.completeOnboarding)
  const dismiss = useStore((s) => s.closeOnboarding)

  const [step, setStep] = useState(0) // 0..3 questions, 4 = result
  const [answers, setAnswers] = useState<number[]>([])
  const [started, setStarted] = useState(false)

  const score = answers.reduce((a, b) => a + b, 0)
  const profile = useMemo(() => profileFromScore(score), [score])

  const pick = (s: number) => {
    const next = [...answers, s]
    setAnswers(next)
    if (step < QUESTIONS.length - 1) setStep(step + 1)
    else {
      setRiskProfile(profileFromScore(next.reduce((a, b) => a + b, 0)))
      setStep(QUESTIONS.length)
    }
  }

  const finishFirstSip = () => {
    startStarter()
    addSip('nifty50-index', 500)
    setStarted(true)
  }

  const done = () => complete()

  const progress = Math.min(step, QUESTIONS.length) / QUESTIONS.length

  const projected10y = sipFutureValue(500, 120)
  const satellite = SATELLITE[profile]

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-primary/10 via-canvas to-canvas px-5 pb-8 pt-6">
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal text-white font-extrabold shadow-soft">
            G
          </div>
          <span className="text-lg font-extrabold text-ink">Groww</span>
        </div>
        <button
          onClick={dismiss}
          className="rounded-full bg-card p-1.5 text-muted shadow-card hover:text-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* progress bar */}
      {step < QUESTIONS.length && (
        <div className="mb-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-muted">
            Question {step + 1} of {QUESTIONS.length} · takes 30 seconds
          </p>
        </div>
      )}

      {step < QUESTIONS.length ? (
        <div key={step} className="flex flex-1 flex-col animate-scale-in">
          <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-teal">
            Question {step + 1}
          </span>
          <h1 className="mb-6 text-2xl font-extrabold leading-tight text-ink">{QUESTIONS[step].q}</h1>
          <div className="space-y-3">
            {QUESTIONS[step].options.map((o) => (
              <button
                key={o.label}
                onClick={() => pick(o.score)}
                className="flex w-full items-center justify-between rounded-2xl border border-line bg-card px-4 py-4 text-left font-semibold text-ink shadow-card active:scale-[0.98] transition hover:border-primary/50"
              >
                <span>{o.label}</span>
                <ArrowRight size={18} className="text-muted" />
              </button>
            ))}
          </div>
          <p className="mt-auto pt-6 text-center text-[11px] text-muted">
            No right answers. This just tunes your starter mix.
          </p>
        </div>
      ) : !started ? (
        // ---- Result: profile + starter portfolio + projection ----
        <div className="flex flex-1 flex-col animate-scale-in">
          <div className="mb-1 flex items-center gap-2 text-teal">
            <Sparkles size={18} /> <span className="text-sm font-bold">Your investor type</span>
          </div>
          <h1 className="mb-1 text-3xl font-extrabold text-ink">{profile}</h1>
          <p className="mb-4 text-sm text-muted">
            {profile === 'Cautious'
              ? 'You value stability. We’ll start you slow and steady.'
              : profile === 'Balanced'
                ? 'A mix of growth and calm suits you best.'
                : 'You’ve got time and appetite, so we’ll tilt toward growth.'}
          </p>

          <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your starter portfolio</p>
            <div className="mt-3 space-y-2.5">
              <AllocationRow name={fundById('nifty50-index').name} tag="Core index" pct={profile === 'Growth' ? 45 : 55} />
              <AllocationRow name={fundById('flexi-cap').name} tag="Flexi-cap growth" pct={profile === 'Growth' ? 45 : 35} />
              {satellite && (
                <AllocationRow name={fundById(satellite.fundId).name} tag={satellite.label} pct={satellite.pct} />
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-line bg-card p-4 shadow-card">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">₹500/mo over 10 years</p>
              <p className="tnum text-lg font-extrabold text-teal">{inrCompact(projected10y)}</p>
            </div>
            <ProjectionChart monthly={500} years={10} height={150} />
            <p className="mt-1 text-[11px] text-muted">
              You invest {inr(60000)}; the rest is compounding at an assumed {(RETURN_ASSUMPTION * 100).toFixed(0)}% p.a.
            </p>
          </div>

          <div className="mt-4">
            <ComplianceLine />
          </div>

          <Button variant="primary" size="lg" full className="mt-4" onClick={finishFirstSip}>
            Start first SIP · {inr(500)}/mo <ArrowRight size={18} />
          </Button>
          <button onClick={done} className="mt-3 text-center text-sm font-medium text-muted">
            Skip for now
          </button>
        </div>
      ) : (
        // ---- Success ----
        <div className="flex flex-1 flex-col items-center justify-center text-center animate-scale-in">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
            <PartyPopper size={40} className="text-teal" />
          </div>
          <h1 className="text-2xl font-extrabold text-ink">You’re investing</h1>
          <p className="mt-2 max-w-[280px] text-sm text-muted">
            Your first ₹500 SIP into {fundById('nifty50-index').name} is set for the 5th. That’s the
            whole game: showing up monthly.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-card">
            <ShieldCheck size={16} className="text-positive" />
            <span className="text-xs font-medium text-ink">Guardrails are on. F&O stays locked until you learn it.</span>
          </div>
          <Button variant="primary" size="lg" full className="mt-8" onClick={done}>
            Go to my Groww <Check size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}

function AllocationRow({ name, tag, pct }: { name: string; tag: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink">{name}</span>
        <span className="tnum font-bold text-teal">{pct}%</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className={cx('h-full rounded-full bg-primary')} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-muted">{tag}</span>
      </div>
    </div>
  )
}
