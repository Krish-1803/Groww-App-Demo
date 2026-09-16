// Micro-investing / round-ups: "₹247 rounded up from 18 UPI spends, invest it?"

import { useState } from 'react'
import { Coins } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Card } from './primitives'
import { inr } from '../lib/utils'

const ROUNDUP_TOTAL = 247
const ROUNDUP_SPENDS = 18

export function RoundUpCard() {
  const enabled = useStore((s) => s.roundUpEnabled)
  const toggle = useStore((s) => s.toggleRoundUp)
  const invest = useStore((s) => s.investRoundUp)
  const [invested, setInvested] = useState(false)

  const onToggle = () => {
    toggle()
    if (!enabled && !invested) {
      invest(ROUNDUP_TOTAL)
      setInvested(true)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Coins size={22} className="text-teal" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">
            {inr(ROUNDUP_TOTAL)} rounded up from {ROUNDUP_SPENDS} UPI spends
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {invested
              ? 'Spare change is auto-investing into your index fund. Nice.'
              : 'Auto-invest the spare change from your everyday payments.'}
          </p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={
          'mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition active:scale-[0.98] ' +
          (enabled ? 'bg-primary/10 text-teal' : 'bg-primary text-white')
        }
      >
        {enabled ? '✓ Round-ups on, investing spare change' : `Invest ${inr(ROUNDUP_TOTAL)} & turn on round-ups`}
      </button>
    </Card>
  )
}
