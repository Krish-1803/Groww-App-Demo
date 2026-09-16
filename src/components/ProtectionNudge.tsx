// "Protection first" nudge that returns after 3 sessions while the emergency
// fund is still ₹0. Supportive, never nannying; dismissible; one tap to start.

import { useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Card } from './primitives'

export function ProtectionNudge() {
  const goals = useStore((s) => s.goals)
  const sessionCount = useStore((s) => s.sessionCount)
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  const emergency = goals.find((g) => g.kind === 'safety')
  const needsNudge = !!emergency && emergency.saved === 0 && sessionCount >= 3

  if (!needsNudge || dismissed) return null

  return (
    <Card className="border-warn/40 bg-warn/[0.06] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-warn/15">
          <ShieldCheck size={20} className="text-warn" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">Protection first</p>
          <p className="mt-0.5 text-xs text-muted">
            Your emergency fund is still ₹0. Before chasing returns, a small safety cushion means a
            surprise bill never forces you to sell. No pressure, just a nudge.
          </p>
          <button
            onClick={() => navigate('/goals')}
            className="mt-2.5 rounded-lg bg-warn px-3 py-1.5 text-xs font-semibold text-white active:scale-95 transition"
          >
            Start emergency fund
          </button>
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted" aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
    </Card>
  )
}
