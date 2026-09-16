// Compliance-safe Community: anonymised "people your age" aggregate stats +
// top fund CATEGORIES + theme baskets labelled "not advice". No tips, ever.

import { useState } from 'react'
import { Users } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { ThemeBasket } from '../mock/types'
import { COMMUNITY_STATS, THEME_BASKETS, fundById } from '../mock/data'
import { inr } from '../lib/utils'
import { basketIcon } from '../lib/icons'
import { Sheet } from '../components/Sheet'
import { InvestSheet } from '../components/InvestSheet'
import { Button, Card, ComplianceLine, SectionTitle } from '../components/primitives'

export function Community() {
  const genZ = useStore((s) => s.genZMode)
  const [basket, setBasket] = useState<ThemeBasket | null>(null)
  const [investFund, setInvestFund] = useState<string | null>(null)

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <div>
        <h1 className="text-xl font-extrabold text-ink">Community</h1>
        <p className="text-xs text-muted">Aggregated data from investors your age. Never a recommendation.</p>
      </div>

      {!genZ && (
        <Card className="p-4">
          <p className="text-sm text-ink">
            Community is part of Gen Z mode. Turn it on from your profile to see anonymised peer stats
            and theme baskets.
          </p>
        </Card>
      )}

      {genZ && (
        <>
          {/* Aggregate stats */}
          <div className="grid grid-cols-2 gap-3">
            {COMMUNITY_STATS.map((s) => (
              <Card key={s.label} className="p-3.5">
                <p className="tnum text-2xl font-extrabold text-teal">{s.value}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-ink">{s.label}</p>
                <p className="text-[10px] text-muted">{s.sub}</p>
              </Card>
            ))}
          </div>

          <Card className="flex items-start gap-3 border-primary/30 bg-primary/[0.05] p-4">
            <Users size={20} className="mt-0.5 shrink-0 text-teal" />
            <p className="text-xs text-muted">
              We only ever show <span className="font-semibold text-ink">aggregated categories</span>,
              never “buy this fund”. What thousands of peers do is data, not advice.
            </p>
          </Card>

          {/* Theme baskets */}
          <div>
            <SectionTitle>Theme baskets</SectionTitle>
            <div className="space-y-3">
              {THEME_BASKETS.map((b) => {
                const Icon = basketIcon(b.id)
                return (
                  <Card key={b.id} className="p-4" onClick={() => setBasket(b)}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-teal">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-ink">{b.name}</p>
                        <p className="text-xs text-muted">{b.blurb}</p>
                      </div>
                      <span className="text-xs font-bold text-teal">View →</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          <ComplianceLine />
        </>
      )}

      {/* Basket detail */}
      <Sheet open={!!basket} onClose={() => setBasket(null)} title={basket ? basket.name : ''}>
        {basket && (
          <div className="space-y-3">
            <div className="rounded-xl border border-line bg-canvas p-3">
              <p className="text-xs text-muted">
                A theme is a starting point for research, not a recommendation to buy. Do your own
                homework.
              </p>
            </div>
            {basket.fundIds.map((fid) => {
              const f = fundById(fid)
              return (
                <div key={fid} className="rounded-2xl border border-line bg-card p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{f.name}</p>
                      <p className="text-[11px] text-muted">{f.category} · {f.riskLabel} risk</p>
                    </div>
                    <div className="text-right">
                      <p className="tnum text-sm font-bold text-positive">{f.return3y}%</p>
                      <p className="text-[10px] text-muted">3Y CAGR</p>
                    </div>
                  </div>
                  <Button variant="soft" size="sm" full className="mt-2" onClick={() => { setBasket(null); setInvestFund(fid) }}>
                    Start SIP · min {inr(f.minSip)}
                  </Button>
                </div>
              )
            })}
            <ComplianceLine />
          </div>
        )}
      </Sheet>

      <InvestSheet fundId={investFund} open={!!investFund} onClose={() => setInvestFund(null)} />
    </div>
  )
}
