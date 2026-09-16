// The required "about this prototype" sheet: prototype, mock data, no real
// transactions / KYC / prices.

import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Sheet } from './Sheet'
import { Button } from './primitives'
import { useStore } from '../store/useStore'

export function InfoSheet() {
  const open = useStore((s) => s.showInfo)
  const setInfo = useStore((s) => s.setInfo)

  return (
    <Sheet open={open} onClose={() => setInfo(false)} title="About this prototype">
      <div className="space-y-4">
        <div className="rounded-2xl bg-warn/10 p-4">
          <p className="flex items-center gap-2 font-bold text-ink">
            <AlertTriangle size={18} className="text-warn" /> This is a front-end prototype
          </p>
          <p className="mt-1.5 text-sm text-muted">
            Everything here runs on mock data in your browser. There are no real prices, no KYC, no
            payments, and no orders are ever placed.
          </p>
        </div>

        <div className="space-y-2.5">
          {[
            'Mock data only — prices, NAVs, P&L and IPO status are illustrative.',
            'No real KYC / AML, no UPI or payment rails, no order routing.',
            'Projections assume a 12% p.a. long-term return — not a guarantee.',
            '“Gen Z mode” is a layer on the standard Groww surface, not a separate app.',
            'Groww Buddy never gives buy/sell tips — it’s a coach, not a tipster.',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-positive" />
              <p className="text-sm text-ink">{t}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] leading-relaxed text-muted">
          Built as a Product-Intern assignment concept: retention + responsible investing for
          first-time investors aged 20–26. Not affiliated with, or endorsed by, Groww.
        </p>

        <Button full onClick={() => setInfo(false)}>
          Got it
        </Button>
      </div>
    </Sheet>
  )
}
