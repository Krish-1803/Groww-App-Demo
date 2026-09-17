// The standard Groww product grid. Tiles with dedicated screens navigate;
// the rest open a generic product sheet with mock detail, so every tile does
// something.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Banknote,
  CandlestickChart,
  Coins,
  Globe,
  Landmark,
  Layers,
  LineChart,
  PiggyBank,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { Sheet } from './Sheet'
import { Button, ComplianceLine } from './primitives'
import { useStore } from '../store/useStore'
import { cx } from '../lib/utils'

interface Product {
  key: string
  label: string
  icon: LucideIcon
  route?: string
  locked?: boolean
  tone: string
  blurb: string
}

// Accent shade per product tile (full class names so Tailwind keeps them).
const TONE: Record<string, string> = {
  primary: 'bg-primary/10 text-teal',
  blue: 'bg-blue/10 text-blue',
  sky: 'bg-sky/10 text-sky',
  purple: 'bg-purple/10 text-purple',
  yellow: 'bg-yellow/15 text-yellow',
  danger: 'bg-danger/10 text-danger',
  warn: 'bg-warn/15 text-warn',
}

export function ProductGrid() {
  const navigate = useNavigate()
  const fnoUnlocked = useStore((s) => s.fno.unlocked)
  const [sheet, setSheet] = useState<Product | null>(null)

  const products: Product[] = [
    { key: 'stocks', label: 'Stocks', icon: TrendingUp, route: '/stocks', tone: 'primary', blurb: 'Buy & sell listed shares. Flat ₹20 per order.' },
    { key: 'fno', label: 'F&O', icon: CandlestickChart, route: '/fno', locked: !fnoUnlocked, tone: 'danger', blurb: 'Futures & Options. High risk, locked until you pass a reality check.' },
    { key: 'mf', label: 'Mutual Funds', icon: Layers, route: '/mutual-funds', tone: 'blue', blurb: 'Direct, zero-commission funds. SIP from ₹100.' },
    { key: 'us', label: 'US Stocks', icon: Globe, tone: 'sky', blurb: 'Invest in Apple, Google and more from a USD wallet.' },
    { key: 'ipo', label: 'IPO', icon: Rocket, route: '/ipo', tone: 'purple', blurb: 'Apply to new listings and track allotment.' },
    { key: 'gold', label: 'Gold / SGB', icon: Coins, tone: 'yellow', blurb: 'Digital gold & Sovereign Gold Bonds from ₹10.' },
    { key: 'fd', label: 'FDs', icon: PiggyBank, tone: 'primary', blurb: 'Fixed deposits up to 8.6% p.a. from partner banks.' },
    { key: 'bonds', label: 'Bonds', icon: Landmark, tone: 'blue', blurb: 'Govt & corporate bonds for steady income.' },
    { key: 'etf', label: 'ETFs', icon: LineChart, tone: 'sky', blurb: 'Exchange-traded funds: index exposure, live-traded.' },
    { key: 'mtf', label: 'MTF', icon: Banknote, tone: 'yellow', blurb: 'Margin Trading Facility. Borrowing to trade adds risk.' },
  ]

  return (
    <>
      <div className="grid grid-cols-5 gap-1.5">
        {products.map((p) => {
          const Icon = p.icon
          const tone = p.locked ? 'warn' : p.tone
          return (
            <button
              key={p.key}
              onClick={() => (p.route ? navigate(p.route) : setSheet(p))}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card px-1 py-3 text-center shadow-card border border-line/50 active:scale-95 transition"
            >
              <span className={cx('flex h-9 w-9 items-center justify-center rounded-xl', TONE[tone])}>
                <Icon size={18} />
              </span>
              <span className="text-[10px] font-semibold leading-tight text-ink">{p.label}</span>
            </button>
          )
        })}
      </div>

      <Sheet open={!!sheet} onClose={() => setSheet(null)} title={sheet?.label}>
        {sheet && (
          <div className="space-y-4">
            <p className="text-sm text-muted">{sheet.blurb}</p>
            <div className="rounded-2xl bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Highlights</p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink">
                {productHighlights(sheet.key).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ComplianceLine />
            <Button full onClick={() => setSheet(null)}>
              Got it
            </Button>
          </div>
        )}
      </Sheet>
    </>
  )
}

function productHighlights(key: string): string[] {
  switch (key) {
    case 'us':
      return ['0 commission on US stocks', 'Fractional investing from $1', 'USD wallet with live FX']
    case 'gold':
      return ['24K digital gold, buy from ₹10', 'SGBs with 2.5% annual interest', '100% insured vault storage']
    case 'fd':
      return ['Rates up to 8.6% p.a.', 'Booking in 2 minutes, no branch visit', 'DICGC insured up to ₹5L']
    case 'bonds':
      return ['Govt & AAA corporate bonds', 'Fixed coupon, predictable income', 'Government-backed options']
    case 'etf':
      return ['Nifty, gold & sector ETFs', 'Trade like a stock, flat ₹20', 'Lower cost than most active funds']
    case 'mtf':
      return ['Trade with borrowed margin', 'Leverage magnifies losses too', 'Interest charged on borrowed amount']
    default:
      return ['Live tracking', 'Transparent charges', 'Simple onboarding']
  }
}
