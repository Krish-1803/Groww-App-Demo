// Stocks (base Groww surface): watchlist-style list + a simulated buy flow.
// The Gen Z overtrade guardrail blocks the 4th simulated trade/day.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { STOCKS, stockById, BROKERAGE_FLAT } from '../mock/data'
import { cx, inr, pct } from '../lib/utils'
import { Sheet } from '../components/Sheet'
import { OvertradeModal } from '../components/OvertradeModal'
import { Button, Card, ComplianceLine, Sparkline } from '../components/primitives'

export function Stocks() {
  const navigate = useNavigate()
  const genZ = useStore((s) => s.genZMode)
  const tradesToday = useStore((s) => s.tradesToday)
  const recordTrade = useStore((s) => s.recordTrade)
  const [buy, setBuy] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [overtrade, setOvertrade] = useState(false)
  const [done, setDone] = useState(false)

  const openBuy = (id: string) => {
    // Guardrail: block the 4th simulated trade/day.
    if (genZ && tradesToday >= 3) {
      setOvertrade(true)
      return
    }
    setBuy(id)
    setQty(1)
    setDone(false)
  }

  const confirmBuy = () => {
    recordTrade()
    setDone(true)
  }

  const stock = buy ? stockById(buy) : null

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 text-ink hover:bg-canvas" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-ink">Stocks</h1>
          <p className="text-xs text-muted">Flat {inr(BROKERAGE_FLAT)} per order · mock prices</p>
        </div>
      </div>

      {genZ && (
        <Card className="flex items-center justify-between p-3">
          <p className="text-xs text-muted">Simulated trades today</p>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cx('h-2.5 w-6 rounded-full', i < tradesToday ? 'bg-warn' : 'bg-line')} />
            ))}
          </div>
        </Card>
      )}

      <Card className="divide-y divide-line">
        {STOCKS.map((s) => {
          const up = s.changePct >= 0
          return (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{s.symbol}</p>
                <p className="text-[11px] text-muted">{s.name}</p>
              </div>
              <Sparkline data={s.spark} />
              <div className="w-16 text-right">
                <p className="tnum text-sm font-semibold text-ink">{inr(s.price, 1)}</p>
                <p className={cx('tnum text-[11px] font-semibold', up ? 'text-positive' : 'text-danger')}>{pct(s.changePct)}</p>
              </div>
              <button onClick={() => openBuy(s.id)} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-teal active:scale-95">
                Buy
              </button>
            </div>
          )
        })}
      </Card>

      <ComplianceLine />

      {/* Buy sheet */}
      <Sheet open={!!buy} onClose={() => setBuy(null)} title={stock ? `Buy ${stock.symbol}` : ''}>
        {stock && (
          done ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-3xl">✅</div>
              <p className="text-lg font-bold text-ink">Order placed (mock)</p>
              <p className="mt-1 text-sm text-muted">{qty} × {stock.symbol} at {inr(stock.price, 1)}. No real transaction.</p>
              <Button full className="mt-5" onClick={() => setBuy(null)}>Done</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-canvas p-4">
                <div>
                  <p className="font-bold text-ink">{stock.name}</p>
                  <p className="tnum text-sm text-muted">{inr(stock.price, 1)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-line" aria-label="Less"><Minus size={16} /></button>
                  <span className="tnum w-6 text-center text-lg font-bold text-ink">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line" aria-label="More"><Plus size={16} /></button>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted">Order value</span><span className="tnum font-semibold text-ink">{inr(stock.price * qty, 1)}</span></div>
                <div className="mt-1 flex justify-between"><span className="text-muted">Brokerage</span><span className="tnum font-semibold text-ink">{inr(BROKERAGE_FLAT)}</span></div>
              </div>
              <ComplianceLine />
              <Button full size="lg" onClick={confirmBuy}>Place mock order</Button>
            </div>
          )
        )}
      </Sheet>

      <OvertradeModal open={overtrade} onClose={() => setOvertrade(false)} />
    </div>
  )
}
