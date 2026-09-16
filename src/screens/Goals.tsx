// Goal-based investing: cards with progress rings + on-track/behind status.
// Create-goal back-solves the monthly SIP and suggests a fund type in ≤3 taps.

import { useMemo, useState } from 'react'
import { Check, Plus, Target } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Goal, GoalKind } from '../mock/types'
import { fundById } from '../mock/data'
import { monthsForTarget, sipForTarget } from '../lib/finance'
import { cx, inr, inrCompact } from '../lib/utils'
import { Sheet } from '../components/Sheet'
import { Button, Card, ComplianceLine, EmptyState, ProgressRing } from '../components/primitives'

const PRESETS: { name: string; emoji: string; kind: GoalKind; target: number; months: number }[] = [
  { name: 'Goa trip', emoji: '🏖️', kind: 'travel', target: 40000, months: 12 },
  { name: 'iPhone', emoji: '📱', kind: 'gadget', target: 80000, months: 18 },
  { name: 'Emergency fund', emoji: '🛟', kind: 'safety', target: 90000, months: 18 },
  { name: 'FIRE head-start', emoji: '🔥', kind: 'freedom', target: 500000, months: 60 },
  { name: 'Custom goal', emoji: '🎯', kind: 'travel', target: 50000, months: 24 },
]

// Suggested fund type by horizon: short → debt, medium → index, long → flexi-cap.
function suggestFund(months: number): string {
  if (months <= 12) return 'liquid-debt'
  if (months <= 36) return 'nifty50-index'
  return 'flexi-cap'
}

function statusOf(g: Goal): { label: string; ok: boolean } {
  const remaining = Math.max(0, g.target - g.saved)
  const monthsNeeded = monthsForTarget(remaining, g.monthlySip)
  const ok = monthsNeeded <= g.targetMonths
  return { label: ok ? 'On track' : 'Behind, bump SIP', ok }
}

export function Goals() {
  const goals = useStore((s) => s.goals)
  const contribute = useStore((s) => s.contributeToGoal)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-ink">Goals</h1>
          <p className="text-xs text-muted">Reels-brain meets 10-year plans. Both are fine here.</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> New
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          illustration={<Target size={54} strokeWidth={1.5} />}
          title="No goals yet"
          body="Name something you want (a trip, a phone, freedom) and we’ll back-solve the monthly SIP."
          action={<Button onClick={() => setCreateOpen(true)}><Plus size={16} /> Create a goal</Button>}
        />
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const progress = g.saved / g.target
            const st = statusOf(g)
            const fund = fundById(g.suggestedFundId)
            return (
              <Card key={g.id} className="p-4">
                <div className="flex items-center gap-4">
                  <ProgressRing progress={progress} size={64} stroke={7}>
                    <span className="text-2xl">{g.emoji}</span>
                  </ProgressRing>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-ink">{g.name}</p>
                      <span
                        className={cx(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          st.ok ? 'bg-positive/10 text-positive' : 'bg-warn/15 text-warn',
                        )}
                      >
                        {st.label}
                      </span>
                    </div>
                    <p className="tnum mt-0.5 text-sm text-muted">
                      <span className="font-bold text-ink">{inrCompact(g.saved)}</span> of {inrCompact(g.target)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      {inr(g.monthlySip)}/mo · via {fund.category} · {Math.round(progress * 100)}% done
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="soft" size="sm" full onClick={() => contribute(g.id, g.monthlySip)}>
                    Add {inr(g.monthlySip)} now
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <ComplianceLine />

      <CreateGoalSheet open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}

function CreateGoalSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addGoal = useStore((s) => s.addGoal)
  const [preset, setPreset] = useState(PRESETS[0])
  const [target, setTarget] = useState(PRESETS[0].target)
  const [months, setMonths] = useState(PRESETS[0].months)
  const [created, setCreated] = useState(false)

  const monthlySip = useMemo(() => Math.round(sipForTarget(target, months) / 50) * 50, [target, months])
  const suggestedFundId = suggestFund(months)
  const fund = fundById(suggestedFundId)

  const choosePreset = (p: (typeof PRESETS)[number]) => {
    setPreset(p)
    setTarget(p.target)
    setMonths(p.months)
  }

  const confirm = () => {
    const g: Goal = {
      id: `goal-${Date.now()}`,
      name: preset.name,
      emoji: preset.emoji,
      kind: preset.kind,
      target,
      saved: 0,
      monthlySip,
      targetMonths: months,
      suggestedFundId,
      createdByUser: true,
    }
    addGoal(g)
    setCreated(true)
  }

  const close = () => {
    onClose()
    setTimeout(() => {
      setCreated(false)
      choosePreset(PRESETS[0])
    }, 250)
  }

  return (
    <Sheet open={open} onClose={close} title={created ? 'Goal created' : 'New goal'}>
      {created ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-3xl">
            {preset.emoji}
          </div>
          <p className="text-lg font-bold text-ink">{preset.name} is on</p>
          <p className="mt-1 text-sm text-muted">
            {inr(monthlySip)}/mo into {fund.category} gets you to {inrCompact(target)} in ~{months} months.
          </p>
          <Button full className="mt-5" onClick={close}>
            <Check size={16} /> Done
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tap 1: pick a goal */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">1 · Pick a goal</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => choosePreset(p)}
                  className={cx(
                    'rounded-full px-3 py-1.5 text-sm font-semibold transition',
                    preset.name === p.name ? 'bg-primary text-white' : 'bg-canvas text-muted',
                  )}
                >
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tap 2: target + timeline */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">2 · Target & timeline</p>
            <div className="rounded-2xl border border-line bg-card p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Target amount</span>
                  <span className="tnum font-bold text-ink">{inr(target)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={1000000}
                  step={5000}
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="mt-2 w-full accent-[color:rgb(var(--c-primary))]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Timeline</span>
                  <span className="tnum font-bold text-ink">{months} months</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={120}
                  step={1}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="mt-2 w-full accent-[color:rgb(var(--c-primary))]"
                />
              </div>
            </div>
          </div>

          {/* Back-solved SIP + suggested fund */}
          <div className="rounded-2xl bg-primary/[0.07] p-4">
            <p className="text-xs text-muted">You’d need to invest</p>
            <p className="tnum text-3xl font-extrabold text-teal">{inr(monthlySip)}<span className="text-base font-semibold text-muted">/mo</span></p>
            <p className="mt-1 text-sm text-ink">
              Suggested: a <span className="font-semibold">{fund.category}</span> fund like {fund.name} for this horizon.
            </p>
            <p className="mt-1 text-[11px] text-muted">Assumes ~12% p.a.; fund type is a category, not a tip.</p>
          </div>

          {/* Tap 3: confirm */}
          <Button full size="lg" onClick={confirm}>
            3 · Create goal & set SIP
          </Button>
          <ComplianceLine />
        </div>
      )}
    </Sheet>
  )
}
