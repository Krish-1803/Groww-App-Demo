// Mutual Funds: direct, zero-commission fund list + SIP calculator + compare,
// with the transparency (what-you-pay / 80C) card. SIP from ₹100.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calculator, GitCompare, Star } from 'lucide-react'
import { useStore } from '../store/useStore'
import { FUNDS, fundById } from '../mock/data'
import { sipFutureValue } from '../lib/finance'
import { cx, inr, inrCompact } from '../lib/utils'
import { useInvestGuard } from '../lib/useInvestGuard'
import { Sheet } from '../components/Sheet'
import { InvestSheet } from '../components/InvestSheet'
import { TransparencyCard } from '../components/TransparencyCard'
import { ProjectionChart } from '../components/ProjectionChart'
import { Button, Card, ComplianceLine, SectionTitle, Sparkline } from '../components/primitives'

export function MutualFunds() {
  const genZ = useStore((s) => s.genZMode)
  const navigate = useNavigate()
  const guard = useInvestGuard()
  const [investFund, setInvestFund] = useState<string | null>(null)
  const [detail, setDetail] = useState<string | null>(null)
  const [calcOpen, setCalcOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 text-ink hover:bg-canvas" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-ink">Mutual Funds</h1>
          <p className="text-xs text-muted">Direct plans · 0% commission · SIP from ₹100</p>
        </div>
      </div>

      {/* tools */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex items-center gap-2 p-3" onClick={() => setCalcOpen(true)}>
          <Calculator size={18} className="text-teal" />
          <span className="text-sm font-semibold text-ink">SIP calculator</span>
        </Card>
        <Card className="flex items-center gap-2 p-3" onClick={() => setCompareOpen(true)}>
          <GitCompare size={18} className="text-teal" />
          <span className="text-sm font-semibold text-ink">Compare funds</span>
        </Card>
      </div>

      {genZ && <TransparencyCard />}

      <div>
        <SectionTitle>All funds</SectionTitle>
        <div className="space-y-2.5">
          {FUNDS.map((f) => (
            <Card key={f.id} className="p-3.5" onClick={() => setDetail(f.id)}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-teal">
                  {f.amc.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight text-ink">{f.name}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                    <span className="rounded bg-canvas px-1.5 py-0.5 font-medium">{f.category}</span>
                    <span className="flex items-center gap-0.5"><Star size={10} className="fill-warn text-warn" />{f.rating}</span>
                    <span>{f.riskLabel}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="tnum text-sm font-bold text-positive">{f.return3y}%</p>
                  <p className="text-[10px] text-muted">3Y</p>
                </div>
                <Sparkline data={f.spark} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ComplianceLine />

      {/* Fund detail sheet */}
      <Sheet open={!!detail} onClose={() => setDetail(null)} title={detail ? fundById(detail).name : ''}>
        {detail && <FundDetail fundId={detail} onInvest={() => { const id = detail; guard(() => { setDetail(null); setInvestFund(id) }) }} />}
      </Sheet>

      {/* SIP calculator */}
      <SipCalculator open={calcOpen} onClose={() => setCalcOpen(false)} />

      {/* Compare */}
      <CompareSheet open={compareOpen} onClose={() => setCompareOpen(false)} />

      <InvestSheet fundId={investFund} open={!!investFund} onClose={() => setInvestFund(null)} />
    </div>
  )
}

function FundDetail({ fundId, onInvest }: { fundId: string; onInvest: () => void }) {
  const f = fundById(fundId)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: '1Y', v: `${f.return1y}%` },
          { l: '3Y', v: `${f.return3y}%` },
          { l: '5Y', v: `${f.return5y}%` },
        ].map((r) => (
          <div key={r.l} className="rounded-xl bg-canvas p-2.5 text-center">
            <p className="tnum text-base font-bold text-positive">{r.v}</p>
            <p className="text-[10px] text-muted">{r.l} CAGR</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-card p-4">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <Row l="NAV" v={inr(f.nav, 2)} />
          <Row l="Min SIP" v={inr(f.minSip)} />
          <Row l="Expense (direct)" v={`${f.expenseRatioDirect}%`} />
          <Row l="Risk" v={f.riskLabel} />
        </div>
      </div>
      <div className="rounded-xl bg-primary/[0.06] p-3">
        <p className="text-xs text-muted">
          <span className="font-semibold text-teal">Direct plan on Groww:</span> the regular plan of the
          same fund charges {f.expenseRatioRegular}%, and you skip that commission here.
        </p>
      </div>
      <ComplianceLine />
      <Button full size="lg" onClick={onInvest}>
        Invest · min {inr(f.minSip)}
      </Button>
    </div>
  )
}

function Row({ l, v }: { l: string; v: string }) {
  return (
    <>
      <span className="text-muted">{l}</span>
      <span className="tnum text-right font-semibold text-ink">{v}</span>
    </>
  )
}

function SipCalculator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [amount, setAmount] = useState(2000)
  const [years, setYears] = useState(15)
  const fv = sipFutureValue(amount, years * 12)
  const invested = amount * years * 12
  const gain = fv - invested

  return (
    <Sheet open={open} onClose={onClose} title="SIP calculator">
      <div className="space-y-4">
        <div className="rounded-2xl border border-line bg-card p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Monthly SIP</span>
              <span className="tnum font-bold text-ink">{inr(amount)}</span>
            </div>
            <input type="range" min={100} max={25000} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-[color:rgb(var(--c-primary))]" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Duration</span>
              <span className="tnum font-bold text-ink">{years} years</span>
            </div>
            <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-2 w-full accent-[color:rgb(var(--c-primary))]" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-canvas p-3">
            <p className="tnum text-sm font-bold text-ink">{inrCompact(invested)}</p>
            <p className="text-[10px] text-muted">Invested</p>
          </div>
          <div className="rounded-xl bg-canvas p-3">
            <p className="tnum text-sm font-bold text-positive">{inrCompact(gain)}</p>
            <p className="text-[10px] text-muted">Est. returns</p>
          </div>
          <div className="rounded-xl bg-primary/10 p-3">
            <p className="tnum text-sm font-bold text-teal">{inrCompact(fv)}</p>
            <p className="text-[10px] text-muted">Total value</p>
          </div>
        </div>

        <ProjectionChart monthly={amount} years={years} />
        <p className="text-[11px] text-muted">Assumes a 12% p.a. return. Returns are not guaranteed.</p>
      </div>
    </Sheet>
  )
}

function CompareSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [a, setA] = useState(FUNDS[0].id)
  const [b, setB] = useState(FUNDS[1].id)
  const fa = fundById(a)
  const fb = fundById(b)

  const metrics: { label: string; a: string; b: string; better?: 'a' | 'b' }[] = [
    { label: '3Y CAGR', a: `${fa.return3y}%`, b: `${fb.return3y}%`, better: fa.return3y >= fb.return3y ? 'a' : 'b' },
    { label: '5Y CAGR', a: `${fa.return5y}%`, b: `${fb.return5y}%`, better: fa.return5y >= fb.return5y ? 'a' : 'b' },
    { label: 'Expense', a: `${fa.expenseRatioDirect}%`, b: `${fb.expenseRatioDirect}%`, better: fa.expenseRatioDirect <= fb.expenseRatioDirect ? 'a' : 'b' },
    { label: 'Risk', a: fa.riskLabel, b: fb.riskLabel },
    { label: 'Min SIP', a: inr(fa.minSip), b: inr(fb.minSip) },
  ]

  return (
    <Sheet open={open} onClose={onClose} title="Compare funds">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <FundPicker value={a} onChange={setA} />
          <FundPicker value={b} onChange={setB} />
        </div>
        <div className="overflow-hidden rounded-2xl border border-line">
          {metrics.map((m, i) => (
            <div key={m.label} className={cx('grid grid-cols-[1fr,auto,1fr] items-center gap-2 px-3 py-2.5 text-sm', i % 2 === 1 && 'bg-canvas')}>
              <span className={cx('tnum text-right font-semibold', m.better === 'a' ? 'text-positive' : 'text-ink')}>{m.a}</span>
              <span className="text-center text-[10px] font-medium uppercase text-muted">{m.label}</span>
              <span className={cx('tnum font-semibold', m.better === 'b' ? 'text-positive' : 'text-ink')}>{m.b}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-muted">Green = the more favourable number. Not a recommendation.</p>
        <ComplianceLine />
      </div>
    </Sheet>
  )
}

function FundPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
    >
      {FUNDS.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))}
    </select>
  )
}
