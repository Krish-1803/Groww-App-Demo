// Home: the standard Groww dashboard (indices, portfolio snapshot, product
// grid, watchlist, Digest) with the Gen Z layer (streak, round-ups, goals,
// protection nudge, learn/community teasers, transparency) toggled in.

import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, Plus, Sparkles, TrendingUp, Users } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ProductGrid } from '../components/ProductGrid'
import { StreakCard } from '../components/StreakCard'
import { RoundUpCard } from '../components/RoundUpCard'
import { ProtectionNudge } from '../components/ProtectionNudge'
import { TransparencyCard } from '../components/TransparencyCard'
import { Button, Card, CountUp, ProgressRing, SectionTitle, Sparkline } from '../components/primitives'
import { STOCKS } from '../mock/data'
import { goalIcon } from '../lib/icons'
import { cx, inr, inrCompact, pct } from '../lib/utils'

export function Home() {
  const genZ = useStore((s) => s.genZMode)
  const invested = useStore((s) => s.investedTotal())
  const current = useStore((s) => s.currentTotal())
  const goals = useStore((s) => s.goals)
  const onboarded = useStore((s) => s.onboarded)
  const openOnboarding = useStore((s) => s.openOnboarding)
  const navigate = useNavigate()

  const pnl = current - invested
  const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0

  return (
    <div className="space-y-5 px-4 pb-4 pt-3">
      {/* Greeting (Gen Z only) */}
      {genZ && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-extrabold text-ink">Hey Aarav</p>
            <p className="text-xs text-muted">Small, steady, started young. Let’s keep it going.</p>
          </div>
          <Sparkles size={20} className="text-primary" />
        </div>
      )}

      {/* Take-the-quiz prompt (shown until the risk quiz is done) */}
      {!onboarded && (
        <button
          onClick={openOnboarding}
          className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-teal to-primary p-4 text-left text-white shadow-soft active:scale-[0.99] transition"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Set up your investing</p>
            <p className="text-xs text-white/85">Take a 30-second quiz to get your starter portfolio.</p>
          </div>
          <ArrowRight size={18} />
        </button>
      )}

      {/* Portfolio snapshot */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-teal to-primary p-4 text-white">
          <p className="text-xs font-medium opacity-90">Current value</p>
          <CountUp value={current} className="text-3xl font-extrabold" />
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold">
              {pnl >= 0 ? '▲' : '▼'} {inr(Math.abs(pnl))} ({pct(pnlPct)})
            </span>
            <span className="opacity-90">Invested {inr(invested)}</span>
          </div>
        </div>
        <div className="flex divide-x divide-line">
          <button onClick={() => navigate('/portfolio')} className="flex-1 py-3 text-center text-sm font-semibold text-teal active:bg-canvas">
            Portfolio
          </button>
          <button onClick={() => navigate('/mutual-funds')} className="flex-1 py-3 text-center text-sm font-semibold text-teal active:bg-canvas">
            <Plus size={14} className="mr-1 inline" /> Add money
          </button>
        </div>
      </Card>

      {/* Gen Z habit layer */}
      {genZ && (
        <>
          <StreakCard />
          <ProtectionNudge />
          <RoundUpCard />

          {/* Goals preview */}
          <div>
            <SectionTitle action={<button onClick={() => navigate('/goals')} className="text-xs font-semibold text-teal">See all</button>}>
              Your goals
            </SectionTitle>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {goals.slice(0, 4).map((g) => {
                const progress = g.saved / g.target
                const Icon = goalIcon(g.kind)
                return (
                  <button
                    key={g.id}
                    onClick={() => navigate('/goals')}
                    className="flex w-[128px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-line bg-card p-3 shadow-card active:scale-95 transition"
                  >
                    <ProgressRing progress={progress} size={58} stroke={6}>
                      <Icon size={20} className="text-teal" />
                    </ProgressRing>
                    <div className="text-center">
                      <p className="truncate text-xs font-semibold text-ink">{g.name}</p>
                      <p className="tnum text-[10px] text-muted">
                        {inrCompact(g.saved)}/{inrCompact(g.target)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Product grid: the standard Groww surface */}
      <div>
        <SectionTitle>Invest in</SectionTitle>
        <ProductGrid />
      </div>

      {/* Watchlist */}
      <div>
        <SectionTitle action={<button onClick={() => navigate('/stocks')} className="text-xs font-semibold text-teal">Markets</button>}>
          Watchlist
        </SectionTitle>
        <Card className="divide-y divide-line">
          {STOCKS.slice(0, 4).map((s) => {
            const up = s.changePct >= 0
            return (
              <button
                key={s.id}
                onClick={() => navigate('/stocks')}
                className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-canvas"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{s.symbol}</p>
                  <p className="text-[11px] text-muted">{s.sector}</p>
                </div>
                <Sparkline data={s.spark} />
                <div className="w-20 text-right">
                  <p className="tnum text-sm font-semibold text-ink">{inr(s.price, 1)}</p>
                  <p className={cx('tnum text-[11px] font-semibold', up ? 'text-positive' : 'text-danger')}>
                    {pct(s.changePct)}
                  </p>
                </div>
              </button>
            )
          })}
        </Card>
      </div>

      {/* Gen Z learn + community teasers */}
      {genZ && (
        <>
          <TransparencyCard />
          <Card className="p-4" onClick={() => navigate('/learn')}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-teal">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">2-min Learn feed</p>
                <p className="text-xs text-muted">Daily card + quiz · earn XP · unlock products</p>
              </div>
              <ArrowUpRight size={18} className="text-teal" />
            </div>
          </Card>
          <Card className="p-4" onClick={() => navigate('/community')}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-teal">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">People your age</p>
                <p className="text-xs text-muted">Anonymised stats & theme baskets · not advice</p>
              </div>
              <ArrowUpRight size={18} className="text-teal" />
            </div>
          </Card>
        </>
      )}

      {/* Groww Digest: base surface explore feed teaser */}
      <div>
        <SectionTitle action={<button onClick={() => navigate(genZ ? '/learn' : '/explore')} className="text-xs font-semibold text-teal">More</button>}>
          Groww Digest
        </SectionTitle>
        <Card className="p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-teal">
            <TrendingUp size={14} /> Markets today
          </p>
          <p className="mt-1 text-sm text-ink">
            Nifty 50 edged up 0.47% led by IT. A calm reminder: daily moves are noise for a 10-year SIP.
          </p>
        </Card>
      </div>

      <Button variant="outline" full onClick={() => navigate('/mutual-funds')}>
        <Plus size={16} /> Add money via UPI
      </Button>
    </div>
  )
}
