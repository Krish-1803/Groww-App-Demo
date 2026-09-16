// Reusable "Start SIP / invest" sheet for any fund. Confirming updates the one
// shared store, so the portfolio and streak reflect it everywhere.

import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { Sheet } from './Sheet'
import { Button, ComplianceLine } from './primitives'
import { ProjectionChart } from './ProjectionChart'
import { useStore } from '../store/useStore'
import { fundById } from '../mock/data'
import { inr, inrCompact } from '../lib/utils'
import { sipFutureValue } from '../lib/finance'

export function InvestSheet({
  fundId,
  open,
  onClose,
}: {
  fundId: string | null
  open: boolean
  onClose: () => void
}) {
  const addSip = useStore((s) => s.addSip)
  const [amount, setAmount] = useState(500)
  const [mode, setMode] = useState<'sip' | 'once'>('sip')
  const [done, setDone] = useState(false)

  if (!fundId) return null
  const fund = fundById(fundId)
  const min = fund.minSip
  const step = min >= 500 ? 500 : 100

  const confirm = () => {
    addSip(fundId, amount)
    setDone(true)
  }

  const close = () => {
    onClose()
    // reset after the sheet animates out
    setTimeout(() => {
      setDone(false)
      setAmount(500)
      setMode('sip')
    }, 250)
  }

  return (
    <Sheet open={open} onClose={close} title={done ? 'Done!' : `Invest · ${fund.name}`}>
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <Check size={32} className="text-teal" />
          </div>
          <p className="text-lg font-bold text-ink">
            {mode === 'sip' ? `${inr(amount)}/mo SIP started` : `${inr(amount)} invested`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {mode === 'sip'
              ? `Next instalment: 5 Oct into ${fund.name}.`
              : `Added to your holdings in ${fund.name}.`}{' '}
            (Mock, no real payment.)
          </p>
          <Button full className="mt-5" onClick={close}>
            Great
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* mode switch */}
          <div className="flex rounded-xl bg-canvas p-1">
            {(['sip', 'once'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  'flex-1 rounded-lg py-2 text-sm font-semibold transition ' +
                  (mode === m ? 'bg-card text-teal shadow-card' : 'text-muted')
                }
              >
                {m === 'sip' ? 'Monthly SIP' : 'One-time'}
              </button>
            ))}
          </div>

          {/* amount stepper */}
          <div className="rounded-2xl border border-line bg-card p-4">
            <p className="text-center text-xs font-medium text-muted">Amount</p>
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={() => setAmount((a) => Math.max(min, a - step))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink active:scale-95"
                aria-label="Decrease"
              >
                <Minus size={18} />
              </button>
              <span className="tnum text-3xl font-extrabold text-ink">{inr(amount)}</span>
              <button
                onClick={() => setAmount((a) => a + step)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink active:scale-95"
                aria-label="Increase"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {[100, 500, 1000, 2000].filter((v) => v >= min).map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={
                    'rounded-full px-3 py-1 text-xs font-semibold transition ' +
                    (amount === v ? 'bg-primary text-white' : 'bg-canvas text-muted')
                  }
                >
                  {inr(v)}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-muted">
              Min SIP {inr(min)} · Direct plan · 0% commission
            </p>
          </div>

          {mode === 'sip' && (
            <div className="rounded-2xl border border-line bg-card p-4">
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">In 10 years</p>
                <p className="tnum text-lg font-extrabold text-teal">
                  {inrCompact(sipFutureValue(amount, 120))}
                </p>
              </div>
              <ProjectionChart monthly={amount} years={10} height={130} />
            </div>
          )}

          <ComplianceLine />
          <Button full size="lg" onClick={confirm}>
            {mode === 'sip' ? `Start SIP · ${inr(amount)}/mo` : `Invest ${inr(amount)}`}
          </Button>
        </div>
      )}
    </Sheet>
  )
}
