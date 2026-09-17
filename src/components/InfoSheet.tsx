// "About Groww" sheet: the product thesis and what the app does, presented
// professionally (opened from the profile menu).

import { BookOpen, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { Sheet } from './Sheet'
import { Button } from './primitives'
import { useStore } from '../store/useStore'

const POINTS = [
  {
    icon: TrendingUp,
    title: 'The full Groww surface',
    body: 'Stocks, Mutual Funds, F&O, IPOs, Gold, FDs, Bonds and ETFs, with SIPs from ₹100 and zero-commission direct funds.',
  },
  {
    icon: Sparkles,
    title: 'A Gen Z layer',
    body: 'A risk quiz that builds a starter portfolio, goal-based investing, SIP streaks and round-ups to turn investing into a habit.',
  },
  {
    icon: BookOpen,
    title: 'Learn as you go',
    body: 'Bite-sized lessons with quizzes, plus Groww Buddy, a coach that explains jargon and keeps you calm, without stock tips.',
  },
  {
    icon: ShieldCheck,
    title: 'Responsible by design',
    body: 'F&O stays locked behind a reality check and cooling-off, an emergency-fund nudge comes first, and every screen shows a clear disclaimer.',
  },
]

export function InfoSheet() {
  const open = useStore((s) => s.showInfo)
  const setInfo = useStore((s) => s.setInfo)

  return (
    <Sheet open={open} onClose={() => setInfo(false)} title="About Groww">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-teal/10 p-4">
          <p className="text-base font-bold text-ink">Investing that grows with you</p>
          <p className="mt-1 text-sm text-muted">
            Groww for Gen Z helps first-time investors build good habits and invest responsibly, from
            their very first ₹500.
          </p>
        </div>

        <div className="space-y-2.5">
          {POINTS.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.title} className="flex items-start gap-3 rounded-2xl border border-line p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-teal">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.body}</p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-[11px] leading-relaxed text-muted">
          A concept build for a product assignment. Not affiliated with, or endorsed by, Groww.
          Nothing here is investment advice.
        </p>

        <Button full onClick={() => setInfo(false)}>
          Got it
        </Button>
      </div>
    </Sheet>
  )
}
