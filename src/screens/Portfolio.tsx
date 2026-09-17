// Holdings / Portfolio: P&L + mock XIRR, allocation donut, holdings list, and
// active SIPs. Numbers come from the shared store, so they match everywhere.

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { AlertTriangle, PiggyBank } from 'lucide-react'
import { useStore } from '../store/useStore'
import { fundById } from '../mock/data'
import { mockXirr } from '../lib/finance'
import { cx, inr, pct } from '../lib/utils'
import { Card, ComplianceLine, CountUp, EmptyState, SectionTitle } from '../components/primitives'
import { BuddyChat } from '../components/Buddy'
import { useState } from 'react'

const DONUT = ['#00D09C', '#00B386', '#7DD3C0', '#F5A623', '#B7C0CE']

export function Portfolio() {
  const holdings = useStore((s) => s.holdings)
  const sips = useStore((s) => s.sips)
  const genZ = useStore((s) => s.genZMode)
  const invested = useStore((s) => s.investedTotal())
  const current = useStore((s) => s.currentTotal())
  const [buddyOpen, setBuddyOpen] = useState(false)

  const pnl = current - invested
  const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0
  const xirr = mockXirr(invested, current)

  const donutData = holdings.map((h) => ({ name: fundById(h.fundId).name, value: h.currentValue }))
  const topShare = holdings.length
    ? Math.max(...holdings.map((h) => h.currentValue)) / (current || 1)
    : 0
  const concentrated = topShare >= 0.6

  if (holdings.length === 0) {
    return (
      <div className="px-4 pt-2">
        <h1 className="mb-3 text-xl font-extrabold text-ink">Portfolio</h1>
        <EmptyState
          illustration={<PiggyBank size={54} strokeWidth={1.5} />}
          title="Nothing invested yet"
          body="Start a ₹500 SIP from Mutual Funds and your holdings, P&L and XIRR will show up here."
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <h1 className="text-xl font-extrabold text-ink">Portfolio</h1>

      {/* summary */}
      <Card className="p-4">
        <p className="text-xs text-muted">Current value</p>
        <CountUp value={current} className="text-3xl font-extrabold text-ink" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="Invested" value={inr(invested)} />
          <Stat label="Total P&L" value={`${pnl >= 0 ? '+' : ''}${inr(pnl)}`} tone={pnl >= 0 ? 'pos' : 'neg'} sub={pct(pnlPct)} />
          <Stat label="XIRR" value={pct(xirr)} tone={xirr >= 0 ? 'pos' : 'neg'} sub="p.a." />
        </div>
      </Card>

      {/* allocation donut */}
      <Card className="p-4">
        <SectionTitle>Allocation</SectionTitle>
        <div className="flex items-center gap-4">
          <div className="h-[120px] w-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={38} outerRadius={58} paddingAngle={2} stroke="none">
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={DONUT[i % DONUT.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {holdings.map((h, i) => {
              const f = fundById(h.fundId)
              const share = (h.currentValue / current) * 100
              return (
                <div key={h.fundId} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: DONUT[i % DONUT.length] }} />
                  <span className="flex-1 truncate text-ink">{f.name}</span>
                  <span className="tnum font-semibold text-muted">{share.toFixed(0)}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gen Z: concentration guardrail flag → Buddy */}
        {genZ && concentrated && (
          <button
            onClick={() => setBuddyOpen(true)}
            className="mt-3 flex w-full items-start gap-2 rounded-xl bg-warn/[0.08] p-3 text-left"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />
            <span className="text-xs text-muted">
              <span className="font-semibold text-ink">{(topShare * 100).toFixed(0)}% sits in one fund.</span>{' '}
              That’s concentration risk. Tap to ask Buddy how to spread it out.
            </span>
          </button>
        )}
      </Card>

      {/* holdings */}
      <div>
        <SectionTitle>Holdings</SectionTitle>
        <Card className="divide-y divide-line">
          {holdings.map((h) => {
            const f = fundById(h.fundId)
            const gain = h.currentValue - h.investedValue
            const gainPct = (gain / h.investedValue) * 100
            return (
              <div key={h.fundId} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{f.name}</p>
                  <p className="tnum text-[11px] text-muted">
                    {h.units.toFixed(2)} units · invested {inr(h.investedValue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tnum text-sm font-semibold text-ink">{inr(h.currentValue)}</p>
                  <p className={cx('tnum text-[11px] font-semibold', gain >= 0 ? 'text-positive' : 'text-danger')}>
                    {gain >= 0 ? '+' : ''}{inr(gain)} ({pct(gainPct)})
                  </p>
                </div>
              </div>
            )
          })}
        </Card>
      </div>

      {/* SIPs */}
      <div>
        <SectionTitle>Active SIPs</SectionTitle>
        <Card className="divide-y divide-line">
          {sips.map((s) => {
            const f = fundById(s.fundId)
            return (
              <div key={s.fundId} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-teal">
                  <PiggyBank size={17} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{f.name}</p>
                  <p className="text-[11px] text-muted">Next: {s.nextDate}</p>
                </div>
                <div className="text-right">
                  <p className="tnum text-sm font-bold text-ink">{inr(s.amount)}</p>
                  <p className="text-[10px] font-semibold text-positive">Active</p>
                </div>
              </div>
            )
          })}
        </Card>
      </div>

      <ComplianceLine />
      <BuddyChat open={buddyOpen} onClose={() => setBuddyOpen(false)} />
    </div>
  )
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'pos' | 'neg' }) {
  return (
    <div className="rounded-xl bg-canvas p-2.5">
      <p className="text-[10px] text-muted">{label}</p>
      <p className={cx('tnum text-sm font-bold', tone === 'pos' ? 'text-positive' : tone === 'neg' ? 'text-danger' : 'text-ink')}>
        {value}
      </p>
      {sub && <p className="tnum text-[10px] text-muted">{sub}</p>}
    </div>
  )
}
