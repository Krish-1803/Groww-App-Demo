// SIP streak habit engine — framed on DISCIPLINE, not trade frequency.

import { Flame } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Card } from './primitives'
import { cx } from '../lib/utils'

const BADGES = [
  { at: 1, label: 'First SIP', emoji: '🌱' },
  { at: 3, label: 'Consistent', emoji: '💪' },
  { at: 6, label: 'Disciplined', emoji: '🎖️' },
  { at: 12, label: '1-year club', emoji: '👑' },
]

export function StreakCard() {
  const streak = useStore((s) => s.streakMonths)
  const xp = useStore((s) => s.xp)
  const nextBadge = BADGES.find((b) => b.at > streak) ?? BADGES[BADGES.length - 1]
  const prevAt = [...BADGES].reverse().find((b) => b.at <= streak)?.at ?? 0
  const span = nextBadge.at - prevAt || 1
  const progress = Math.min(1, (streak - prevAt) / span)

  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warn/15">
            <Flame size={26} className="animate-flame text-warn" />
          </div>
          <div>
            <p className="tnum text-xl font-extrabold text-ink">
              {streak}-month streak
            </p>
            <p className="text-xs text-muted">Showing up beats timing the market.</p>
          </div>
        </div>
        <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-teal">{xp} XP</div>
      </div>

      {/* badges */}
      <div className="mt-4 flex items-center justify-between">
        {BADGES.map((b) => {
          const earned = streak >= b.at
          return (
            <div key={b.label} className="flex flex-col items-center gap-1">
              <span className={cx('text-xl transition', earned ? '' : 'opacity-30 grayscale')}>{b.emoji}</span>
              <span className={cx('text-[9px] font-medium', earned ? 'text-ink' : 'text-muted')}>{b.label}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-warn transition-all duration-700" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-1.5 text-[11px] text-muted">
          {nextBadge.at - streak > 0
            ? `${nextBadge.at - streak} more month${nextBadge.at - streak === 1 ? '' : 's'} to “${nextBadge.label}” ${nextBadge.emoji}`
            : 'Top badge unlocked — legend. 👑'}
        </p>
      </div>
    </Card>
  )
}
