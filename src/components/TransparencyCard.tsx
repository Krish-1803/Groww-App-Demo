// Radical transparency: "what you actually pay" (₹0 direct-MF commission vs a
// regular plan) + ELSS/80C tax-saved nudge, in plain language.

import { useState } from 'react'
import { Receipt, Sparkles } from 'lucide-react'
import { Sheet } from './Sheet'
import { Button, Card } from './primitives'
import { fundById } from '../mock/data'
import { sipFutureValue } from '../lib/finance'
import { inr } from '../lib/utils'

export function TransparencyCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="p-4" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Receipt size={22} className="text-teal" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">What you actually pay</p>
            <p className="text-xs text-muted">₹0 commission on direct funds · see the difference</p>
          </div>
          <span className="text-xs font-bold text-teal">View →</span>
        </div>
      </Card>
      <TransparencySheet open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export function TransparencySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const flexi = fundById('flexi-cap')
  const elss = fundById('elss-tax')

  // Illustrative 10-yr fee drag of the regular plan's extra expense ratio on a
  // ₹1,000/mo SIP: value at direct fee vs at regular fee.
  const years = 10
  const monthly = 1000
  const netDirect = 0.12 - flexi.expenseRatioDirect / 100
  const netRegular = 0.12 - flexi.expenseRatioRegular / 100
  const valDirect = sipFutureValue(monthly, years * 12, netDirect)
  const valRegular = sipFutureValue(monthly, years * 12, netRegular)
  const feeGap = Math.round(valDirect - valRegular)

  // 80C: investing ₹1.5L in ELSS saves up to 30% + cess in the old regime.
  const invested80c = 150000
  const taxSaved = Math.round(invested80c * 0.312)

  return (
    <Sheet open={open} onClose={onClose} title="What you actually pay">
      <div className="space-y-4">
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Direct vs regular plan · {flexi.name}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <p className="text-xs text-muted">Direct (on Groww)</p>
              <p className="tnum text-lg font-extrabold text-teal">{flexi.expenseRatioDirect}%</p>
              <p className="text-[10px] text-muted">₹0 distributor commission</p>
            </div>
            <div className="rounded-xl bg-canvas p-3">
              <p className="text-xs text-muted">Regular plan</p>
              <p className="tnum text-lg font-extrabold text-ink">{flexi.expenseRatioRegular}%</p>
              <p className="text-[10px] text-muted">commission baked in</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink">
            On a {inr(monthly)}/mo SIP for 10 years, the lower direct fee leaves roughly{' '}
            <span className="font-extrabold text-teal">{inr(feeGap)}</span> more in your pocket —
            same fund, just no commission.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Sparkles size={13} className="text-warn" /> ELSS / 80C tax nudge
          </p>
          <p className="mt-2 text-sm text-ink">
            Investing the full {inr(invested80c)} into {elss.name} (an ELSS fund) can cut up to{' '}
            <span className="font-extrabold text-teal">{inr(taxSaved)}</span> off your tax under
            Section 80C, old regime — while the money still compounds in equity. 3-year lock-in.
          </p>
        </div>

        <p className="text-[11px] text-muted">
          Figures are illustrative (assumes ~12% gross return, 31.2% tax slab). Not investment or tax
          advice.
        </p>
        <Button full onClick={onClose}>
          Makes sense
        </Button>
      </div>
    </Sheet>
  )
}
