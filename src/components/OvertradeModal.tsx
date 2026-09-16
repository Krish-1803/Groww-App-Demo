// "Cooling off for today" guardrail, shown when a 4th simulated trade/day is
// attempted. Supportive tone + a one-tap route to Buddy. Dev skip resets count.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Sheet } from './Sheet'
import { Button } from './primitives'
import { BuddyChat } from './Buddy'

export function OvertradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const resetTrades = useStore((s) => s.resetTrades)
  const navigate = useNavigate()
  const [buddy, setBuddy] = useState(false)

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Cooling off for today">
        <div className="space-y-4">
          <div className="flex flex-col items-center py-2 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-warn/15">
              <Coffee size={30} className="text-warn" />
            </div>
            <p className="text-lg font-bold text-ink">That’s 3 trades today. Let’s pause.</p>
            <p className="mt-1 text-sm text-muted">
              Rapid trading is how first-timers turn investing into gambling. Nothing’s wrong right now,
              this is just a breather. Your SIPs keep running regardless.
            </p>
          </div>

          <Button variant="outline" full onClick={() => { onClose(); setBuddy(true) }}>
            Pause & talk to Buddy
          </Button>
          <Button full onClick={() => { onClose(); navigate('/') }}>
            Okay, I’m done for today
          </Button>

          {/* dev-only convenience */}
          <button
            onClick={() => { resetTrades(); onClose() }}
            className="w-full text-center text-[11px] font-medium text-muted underline"
          >
            (dev) skip cooling-off · reset today’s counter
          </button>
        </div>
      </Sheet>
      <BuddyChat open={buddy} onClose={() => setBuddy(false)} />
    </>
  )
}
