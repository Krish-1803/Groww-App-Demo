// IPO: apply to open issues + track allotment status (all mock).

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { IPOS } from '../mock/data'
import type { Ipo } from '../mock/types'
import { cx, inr } from '../lib/utils'
import { Sheet } from '../components/Sheet'
import { Button, Card, ComplianceLine } from '../components/primitives'

export function IPO() {
  const navigate = useNavigate()
  const [ipos, setIpos] = useState<Ipo[]>(IPOS.map((i) => ({ ...i })))
  const [apply, setApply] = useState<Ipo | null>(null)

  const doApply = (id: string) => {
    setIpos((list) => list.map((i) => (i.id === id ? { ...i, applied: true, allotment: 'Pending' } : i)))
    setApply(null)
  }
  const checkAllotment = (id: string) => {
    // Deterministic mock result.
    setIpos((list) =>
      list.map((i) => (i.id === id ? { ...i, allotment: i.id.length % 2 ? 'Allotted' : 'Not allotted' } : i)),
    )
  }

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 text-ink hover:bg-canvas" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-ink">IPO</h1>
          <p className="text-xs text-muted">Apply & track allotment · mock, no UPI mandate</p>
        </div>
      </div>

      <div className="space-y-3">
        {ipos.map((ipo) => (
          <Card key={ipo.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-ink">{ipo.name}</p>
                <p className="tnum text-xs text-muted">{ipo.priceBand} · lot {ipo.lotSize}</p>
              </div>
              <span
                className={cx(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  ipo.status === 'Open' ? 'bg-positive/10 text-positive' : ipo.status === 'Upcoming' ? 'bg-primary/10 text-teal' : 'bg-canvas text-muted',
                )}
              >
                {ipo.status}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-muted">{ipo.gmpNote}</p>

            <div className="mt-3">
              {ipo.status === 'Open' && !ipo.applied && (
                <Button size="sm" full onClick={() => setApply(ipo)}>Apply · closes {ipo.closeDate}</Button>
              )}
              {ipo.status === 'Upcoming' && (
                <Button size="sm" variant="outline" full disabled>Opens {ipo.closeDate}</Button>
              )}
              {ipo.applied && ipo.allotment === 'Pending' && (
                <Button size="sm" variant="soft" full onClick={() => checkAllotment(ipo.id)}>Check allotment status</Button>
              )}
              {ipo.applied && ipo.allotment && ipo.allotment !== 'Pending' && (
                <div className={cx('rounded-xl p-3 text-center text-sm font-semibold', ipo.allotment === 'Allotted' ? 'bg-positive/10 text-positive' : 'bg-danger/10 text-danger')}>
                  {ipo.allotment === 'Allotted' ? '🎉 Allotted! Shares credited (mock)' : 'Not allotted. Refund initiated (mock)'}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <ComplianceLine />

      <Sheet open={!!apply} onClose={() => setApply(null)} title={apply ? `Apply · ${apply.name}` : ''}>
        {apply && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-card p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Price band</span><span className="tnum font-semibold text-ink">{apply.priceBand}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-muted">Lot size</span><span className="tnum font-semibold text-ink">{apply.lotSize} shares</span></div>
              <div className="mt-1 flex justify-between"><span className="text-muted">Approx. amount</span><span className="tnum font-semibold text-ink">{inr(apply.lotSize * 390)}</span></div>
            </div>
            <div className="rounded-xl bg-warn/10 p-3 text-xs text-muted">
              Grey-market premium is noise, not a signal. Read the RHP risk factors; don’t apply on FOMO.
            </div>
            <ComplianceLine />
            <Button full size="lg" onClick={() => doApply(apply.id)}>
              <Check size={16} /> Apply at cut-off (mock)
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
